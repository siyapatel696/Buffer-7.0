# EcoTrace — E-Waste Management & EPR Tracking System

> End-to-end e-waste lifecycle management across 3 role-based portals, built under India's E-Waste Rules 2022.

![EcoTrace](https://img.shields.io/badge/EcoTrace-v2.0-22c55e?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![No DB](https://img.shields.io/badge/Database-None%20Required-orange?style=for-the-badge)

---

## 🌿 What is EcoTrace?

EcoTrace is a full-stack e-waste management platform that tracks the complete lifecycle of electronic waste — from bulk consumer registration and device triage, through collector matching and pickup, to CPCB-certified recycling and EPR certificate issuance.

**No database required** — all data runs in-memory with 25+ pre-loaded sample entries.

---
EcoTrace Demo Link

https://drive.google.com/drive/folders/1fcYSb3nimZnakNTbQMUefB7UMEaPji6r

## 🏗️ Architecture

```
EcoTrace/
├── backend/                  ← FastAPI Python backend (no DB)
│   ├── main.py               ← App entry point
│   ├── data/
│   │   └── sample_data.py    ← In-memory data store (25+ entries)
│   ├── routes/
│   │   ├── bulk_consumer.py  ← Portal 1 API routes
│   │   ├── collector.py      ← Portal 2A API routes
│   │   ├── recycler.py       ← Portal 2B API routes
│   │   └── data_routes.py    ← Dashboard / global data routes
│   └── dsa/                  ← All 6 DSA implementations
│       ├── bst.py            ← BST (EPR credit range queries)
│       ├── kd_tree.py        ← KD-Tree (geographic proximity)
│       ├── trie.py           ← Trie (certificate UID search)
│       ├── greedy.py         ← Greedy (collector assignment)
│       ├── decision_tree.py  ← Decision Tree (device triage)
│       └── kd_tree.py        ← KD-Tree (spatial batch lookup)
│
└── frontend/                 ← React + Vite frontend
    └── src/
        ├── pages/
        │   ├── HomePage.jsx            ← Landing page
        │   ├── BulkConsumerPortal.jsx  ← Portal 1 (4 modules)
        │   ├── CollectorPortal.jsx     ← Portal 2A (4 modules)
        │   └── RecyclerPortal.jsx      ← Portal 2B (4 modules)
        ├── components/
        │   ├── Navbar.jsx              ← Sticky glassmorphism nav
        │   ├── PipelineBar.jsx         ← 4-module progress bar
        │   └── EnvImpactCounter.jsx    ← Live animated impact strip
        └── utils/api.js                ← All API calls
```

---

## 🚀 Quick Start (2 terminals)

### Terminal 1 — Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
API runs at → **http://localhost:8000**  
Interactive docs → **http://localhost:8000/docs**

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at → **http://localhost:5173**

---

## 🎯 The 4-Module Pipeline (All Portals)

Every batch travels through 4 stages visible at the top of each portal:

| Module | Name | DSA Used |
|--------|------|----------|
| 0 | Registry & Visibility | — |
| 1 | Device Triage / Batch Feed | Decision Tree, KD-Tree |
| 2 | Collector Matching / Drive Planner / Network View | Greedy, KD-Tree |
| 3 | EPR Dashboard / Certificate Chain / Issuance | BST, Trie |

---

## 🏢 Portal 1 — Bulk Consumer

**Who:** IT companies, hospitals, colleges, RWAs, co-working spaces

| Module | Feature |
|--------|---------|
| 0 · Registry | Register organisation, view all registered entities |
| 1 · Device Triage | Add devices by type & quantity → Decision Tree classifies each |
| 2 · Collector Matching | Greedy algorithm scores collectors by capacity × proximity × rating |
| 3 · EPR Dashboard | Compliance ring, BST-sorted certificate list, CO₂ impact |

---

## 🚛 Portal 2A — Collector (PRO / Aggregator)

**Who:** PROs, registered aggregators, formal scrap dealers with CPCB registration

| Module | Feature |
|--------|---------|
| 0 · Registry | Register with CPCB number, capacity gauge |
| 1 · Incoming Batch Feed | KD-Tree spatial proximity lookup of pending batches |
| 2 · Drive Planner | Greedy Nearest-Neighbour route optimisation |
| 3 · Certificate Chain | View handover history & all issued EPR certificates |

---

## ♻️ Portal 2B — Recycler

**Who:** CPCB-certified recyclers — Attero, Ecoreco, Karo Sambhav, E-Parisaraa, TES-AMM

| Module | Feature |
|--------|---------|
| 0 · Registry | Register facility, view recovery rates & capacity |
| 1 · Incoming Batches | Confirm receipt of collected batches |
| 2 · Network View | Full collector → recycler graph (nodes + edges) |
| 3 · Certificate Issuance | Issue EPR certificates + Trie prefix UID search |

---

## 🧠 DSA Map — All Load-Bearing

| DSA Concept | Where Used | Complexity |
|-------------|-----------|------------|
| **Binary Search Tree** | EPR credit range queries on sorted certificate values | O(log n) |
| **KD-Tree** | Geographic spatial lookup of nearest collectors/batches | O(log n) avg |
| **Trie** | O(m) prefix search across certificate UIDs | O(m) |
| **Greedy Algorithm** | Batch-to-collector assignment & drive route planning | O(n) / O(n²) |
| **Decision Tree** | Device triage classification (refurbishable/recyclable/hazardous) | O(depth) |
| **Graph (Network View)** | Collector → Recycler edge mapping | O(V+E) |

---

## 📦 Sample Data (No DB Required)

Pre-loaded in `backend/data/sample_data.py`:

| Entity | Count |
|--------|-------|
| Device types | 12 |
| Organisations | 8 |
| Collectors | 6 |
| Recyclers | 5 |
| Batches (all statuses) | 10 |
| EPR Certificates | 6 |

---

## 🌍 Environmental Impact Tracked

Every portal shows a live animated counter:
- ⚖️ Total e-waste weight processed
- 🌿 CO₂ avoided (kg)
- 🔩 Copper recovered (kg)
- 🥇 Gold recovered (g)
- 📜 EPR certificates issued

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 4, React Router (HashRouter) |
| Styling | Pure CSS (no Tailwind), Google Fonts Inter |
| Charts | Chart.js + react-chartjs-2 |
| Backend | FastAPI 0.104, Python 3.13, Uvicorn |
| Data | In-memory Python dicts (no MySQL) |
| DSA | Pure Python implementations |

---

## 📋 API Endpoints

| Portal | Endpoint | Description |
|--------|---------|-------------|
| Data | `GET /api/data/dashboard` | Global impact stats |
| Bulk Consumer | `POST /api/bulk-consumer/register` | Register organisation |
| Bulk Consumer | `POST /api/bulk-consumer/batch/create` | Create + triage batch |
| Bulk Consumer | `GET /api/bulk-consumer/match-collectors/{org_id}` | Greedy collector match |
| Bulk Consumer | `GET /api/bulk-consumer/epr-dashboard/{org_id}` | BST EPR stats |
| Collector | `GET /api/collector/{id}/feed` | KD-Tree batch feed |
| Collector | `GET /api/collector/{id}/drive-plan` | Greedy route plan |
| Recycler | `GET /api/recycler/network/overview` | Network graph |
| Recycler | `POST /api/recycler/certificate/issue` | Issue certificate |
| Recycler | `GET /api/recycler/certificate/search/{prefix}` | Trie UID search |

Full interactive docs: **http://localhost:8000/docs**

---

*EcoTrace v2.0 — Built for India's 598 CPCB-certified recyclers and EPR-obligated producers*
