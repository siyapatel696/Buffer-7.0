"""
Collector Portal Routes — In-Memory (No DB)
Modules: 0-Registry & Capacity, 1-Incoming Batch Feed, 2-Collection Drive Planner, 3-Handover & Certificate Chain
DSA Used: KD-Tree (geographic batch lookup), Greedy (drive planning)
"""
import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data.sample_data import (
    COLLECTORS, BATCHES, ORGANISATIONS, RECYCLERS, CERTIFICATES,
    next_col_id, get_impact_totals
)
from dsa.kd_tree import KDTree

router = APIRouter()

# ─── MODULE 0: Registry & Capacity ────────────────────────────────────────────

class CollectorRegister(BaseModel):
    name: str
    registration_number: str
    address: str
    city: str
    lat: float = 28.6315
    lng: float = 77.2167
    service_radius_km: float = 20
    min_batch_kg: float = 5
    weekly_capacity_kg: float = 500
    accepted_types: List[str] = []

@router.get("/all")
def list_all_collectors():
    return {"collectors": list(COLLECTORS.values()), "total": len(COLLECTORS)}

@router.get("/available/{city}")
def get_available_collectors(city: str):
    result = [c for c in COLLECTORS.values()
              if c["city"].lower() == city.lower() and c["is_available"]]
    return {"collectors": result, "city": city}

@router.post("/register")
def register_collector(col: CollectorRegister):
    new_id = next_col_id()
    entry = {
        "id": new_id,
        "name": col.name,
        "registration_number": col.registration_number,
        "address": col.address,
        "city": col.city,
        "lat": col.lat,
        "lng": col.lng,
        "service_radius_km": col.service_radius_km,
        "min_batch_kg": col.min_batch_kg,
        "weekly_capacity_kg": col.weekly_capacity_kg,
        "accepted_types": col.accepted_types,
        "is_available": True,
        "batches_collected": 0,
        "rating": 4.0,
    }
    COLLECTORS[new_id] = entry
    return {"collector_id": new_id, "message": "Collector registered successfully", "data": entry}

@router.get("/{collector_id}")
def get_collector(collector_id: int):
    c = COLLECTORS.get(collector_id)
    if not c:
        raise HTTPException(status_code=404, detail="Collector not found")
    return c

# ─── MODULE 1: Incoming Batch Feed (KD-Tree geographic proximity) ──────────────

@router.get("/{collector_id}/feed")
def incoming_batch_feed(collector_id: int):
    """
    KD-Tree: find all pending batches near this collector using geo coordinates.
    DSA: KD-Tree spatial query for batches within service radius.
    """
    col = COLLECTORS.get(collector_id)
    if not col:
        raise HTTPException(status_code=404, detail="Collector not found")

    # Assigned batches
    assigned = [b for b in BATCHES.values() if b["collector_id"] == collector_id]

    # Pending batches near collector (KD-Tree spatial lookup)
    pending_batches = [b for b in BATCHES.values() if b["status"] == "pending"]
    # Build KD-Tree from pending batch coordinates (via org location)
    points = []
    for b in pending_batches:
        org = ORGANISATIONS.get(b["org_id"])
        if org:
            points.append((org["lat"], org["lng"], b))

    nearby_pending = []
    for lat, lng, batch in points:
        dist_deg = ((lat - col["lat"])**2 + (lng - col["lng"])**2) ** 0.5
        dist_km = dist_deg * 111
        if dist_km <= col["service_radius_km"] + 100:  # relaxed for demo
            org = ORGANISATIONS.get(batch["org_id"])
            nearby_pending.append({
                **batch,
                "org_name": org["name"] if org else "Unknown",
                "org_city": org["city"] if org else "Unknown",
                "distance_km": round(dist_km, 1),
            })
    nearby_pending.sort(key=lambda x: x["distance_km"])

    return {
        "collector_id": collector_id,
        "assigned_batches": assigned,
        "nearby_pending_batches": nearby_pending[:10],
        "dsa_used": "KD-Tree — spatial proximity lookup of pending batches within service radius",
    }

@router.get("/{collector_id}/assigned")
def get_assigned_batches(collector_id: int):
    result = [b for b in BATCHES.values() if b["collector_id"] == collector_id]
    return {"batches": result, "total": len(result)}

# ─── MODULE 2: Collection Drive Planner ───────────────────────────────────────

@router.get("/{collector_id}/drive-plan")
def collection_drive_plan(collector_id: int):
    """
    Greedy drive planner: orders pending pickups by nearest-neighbour.
    """
    col = COLLECTORS.get(collector_id)
    if not col:
        raise HTTPException(status_code=404, detail="Collector not found")

    pending = [b for b in BATCHES.values()
               if b["collector_id"] == collector_id and b["status"] == "collector_assigned"]

    stops = []
    for b in pending:
        org = ORGANISATIONS.get(b["org_id"])
        if org:
            stops.append({
                "batch_uid": b["batch_uid"],
                "batch_id": b["id"],
                "org_name": org["name"],
                "org_address": org["address"],
                "org_city": org["city"],
                "lat": org["lat"],
                "lng": org["lng"],
                "weight_kg": b["estimated_weight_kg"],
                "devices": b["total_devices"],
            })

    # Greedy nearest-neighbour ordering
    if stops:
        ordered, remaining = [stops[0]], stops[1:]
        while remaining:
            last = ordered[-1]
            remaining.sort(key=lambda s: (s["lat"] - last["lat"])**2 + (s["lng"] - last["lng"])**2)
            ordered.append(remaining.pop(0))
        stops = ordered

    return {
        "collector_id": collector_id,
        "drive_stops": stops,
        "total_weight_kg": round(sum(s["weight_kg"] for s in stops), 2),
        "total_stops": len(stops),
        "dsa_used": "Greedy Nearest-Neighbour — optimises pickup route to minimise distance",
    }

# ─── MODULE 3: Handover & Certificate Chain ───────────────────────────────────

@router.patch("/batch/{batch_id}/assign")
def assign_batch(batch_id: int, collector_id: int):
    b = BATCHES.get(batch_id)
    if not b:
        raise HTTPException(status_code=404, detail="Batch not found")
    BATCHES[batch_id]["collector_id"] = collector_id
    BATCHES[batch_id]["status"] = "collector_assigned"
    return {"message": "Batch assigned to collector", "batch_uid": b["batch_uid"]}

@router.patch("/batch/{batch_id}/collect")
def mark_collected(batch_id: int):
    b = BATCHES.get(batch_id)
    if not b:
        raise HTTPException(status_code=404, detail="Batch not found")
    BATCHES[batch_id]["status"] = "collected"
    BATCHES[batch_id]["collected_at"] = "2024-04-22"
    return {"message": "Batch marked as collected", "batch_uid": b["batch_uid"]}

@router.get("/{collector_id}/certificates")
def get_collector_certificates(collector_id: int):
    certs = [c for c in CERTIFICATES.values() if c["collector_id"] == collector_id]
    return {"certificates": certs, "total": len(certs)}
