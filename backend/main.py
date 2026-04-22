from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import bulk_consumer, collector, recycler, data_routes

app = FastAPI(
    title="EcoTrace API",
    version="2.0.0",
    description="E-Waste Management & EPR Tracking System — In-Memory Mode (No DB Required)",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bulk_consumer.router, prefix="/api/bulk-consumer", tags=["Bulk Consumer"])
app.include_router(collector.router,     prefix="/api/collector",     tags=["Collector"])
app.include_router(recycler.router,      prefix="/api/recycler",      tags=["Recycler"])
app.include_router(data_routes.router,   prefix="/api/data",          tags=["Data / Dashboard"])

@app.get("/")
def root():
    return {
        "status": "EcoTrace API running — No-DB mode",
        "version": "2.0.0",
        "portals": ["bulk-consumer", "collector", "recycler"],
        "docs": "/docs",
    }