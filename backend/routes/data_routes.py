"""
Global Data / Dashboard Routes — aggregate stats, all entities
"""
from fastapi import APIRouter
from data.sample_data import (
    DEVICES, ORGANISATIONS, COLLECTORS, RECYCLERS, BATCHES, CERTIFICATES,
    get_impact_totals
)

router = APIRouter()

@router.get("/devices")
def all_devices():
    return {"devices": list(DEVICES.values())}

@router.get("/orgs")
def all_orgs():
    return {"organisations": list(ORGANISATIONS.values())}

@router.get("/collectors")
def all_collectors():
    return {"collectors": list(COLLECTORS.values())}

@router.get("/recyclers")
def all_recyclers():
    return {"recyclers": list(RECYCLERS.values())}

@router.get("/batches")
def all_batches():
    return {"batches": list(BATCHES.values())}

@router.get("/certificates")
def all_certificates():
    return {"certificates": list(CERTIFICATES.values())}

@router.get("/dashboard")
def dashboard_stats():
    impact = get_impact_totals()

    status_breakdown = {}
    for b in BATCHES.values():
        status_breakdown[b["status"]] = status_breakdown.get(b["status"], 0) + 1

    city_breakdown = {}
    for o in ORGANISATIONS.values():
        city_breakdown[o["city"]] = city_breakdown.get(o["city"], 0) + 1

    return {
        "impact": impact,
        "status_breakdown": status_breakdown,
        "city_breakdown": city_breakdown,
        "recent_batches": sorted(BATCHES.values(), key=lambda x: x["created_at"], reverse=True)[:5],
        "recent_certificates": sorted(CERTIFICATES.values(), key=lambda x: x["issued_at"], reverse=True)[:4],
        "top_collectors": sorted(COLLECTORS.values(), key=lambda x: x["rating"], reverse=True)[:3],
        "top_recyclers": sorted(RECYCLERS.values(), key=lambda x: x["recovery_rate_pct"], reverse=True)[:3],
    }
