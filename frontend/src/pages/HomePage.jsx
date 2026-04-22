import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'

const PORTALS = [
  {
    to:    '/bulk-consumer',
    icon:  '🏢',
    name:  'Bulk Consumer Portal',
    color: 'rgba(34,197,94,0.15)',
    glowColor: 'rgba(34,197,94,0.08)',
    accentColor: 'var(--green-400)',
    desc:  'For IT companies, hospitals, colleges, RWAs & co-working spaces with EPR obligation under E-Waste Rules 2022.',
    tags:  ['Module 0 · Registry', 'Module 1 · Device Triage', 'Module 2 · Collector Match', 'Module 3 · EPR Dashboard'],
    dsa:   'Decision Tree · Greedy · BST',
  },
  {
    to:    '/collector',
    icon:  '🚛',
    name:  'Collector Portal',
    color: 'rgba(59,130,246,0.15)',
    glowColor: 'rgba(59,130,246,0.06)',
    accentColor: 'var(--blue-400)',
    desc:  'For PROs, registered aggregators & formal scrap dealers with CPCB registration. Manage pickups & handover.',
    tags:  ['Module 0 · Registry', 'Module 1 · Batch Feed', 'Module 2 · Drive Planner', 'Module 3 · Certificate Chain'],
    dsa:   'KD-Tree · Greedy Nearest-Neighbour',
  },
  {
    to:    '/recycler',
    icon:  '♻️',
    name:  'Recycler Portal',
    color: 'rgba(192,132,252,0.15)',
    glowColor: 'rgba(192,132,252,0.06)',
    accentColor: 'var(--purple-400)',
    desc:  'For CPCB-certified recyclers — Attero, Ecoreco, Karo Sambhav & others. Issue EPR certificates & track impact.',
    tags:  ['Module 0 · Registry', 'Module 1 · Batch Incoming', 'Module 2 · Network View', 'Module 3 · Certificate Issuance'],
    dsa:   'Trie · Greedy Assignment',
  },
]

const DSA_CONCEPTS = [
  { name: 'Binary Search Tree',   use: 'EPR credit range queries on sorted certificate values' },
  { name: 'KD-Tree',              use: 'Geographic spatial lookup of nearest collectors / batches' },
  { name: 'Trie',                 use: 'O(m) prefix search on certificate UIDs'                },
  { name: 'Greedy Algorithm',     use: 'Batch-to-collector assignment & drive route planning'    },
  { name: 'Decision Tree',        use: 'Device triage classification (refurbishable / hazardous)' },
  { name: 'Graph (Network)',      use: 'Collector → Recycler edge mapping for network view'      },
]

function StatCard({ val, label, icon }) {
  return (
    <div className="card stat-card anim-fade-up">
      <div style={{ fontSize: '2rem', marginBottom: 8 }}>{icon}</div>
      <div className="stat-value">{val}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.getDashboard()
      .then(d => setStats(d.impact))
      .catch(() => {})
  }, [])

  const s = stats || {
    total_weight_kg: 1382, total_devices_recycled: 1358,
    co2_avoided_kg: 6075,  certificates_issued: 6,
    orgs_registered: 8,    collectors_active: 5, recyclers_active: 5,
  }

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-chip">🌿 India's E-Waste Rules 2022 Compliant</div>
        <h1 className="hero-title">EcoTrace</h1>
        <p className="hero-sub">
          End-to-end e-waste lifecycle management — from bulk collection &amp; EPR compliance
          to CPCB-certified recycling &amp; impact tracking. Three portals. One platform.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/bulk-consumer')}>
            Start as Bulk Consumer
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/collector')}>
            Collector Portal
          </button>
        </div>

        {/* Floating glow blobs */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      </section>

      {/* ── Global Stats ─────────────────────────────────── */}
      <section style={{ padding: '0 24px 60px' }}>
        <div className="container">
          <div className="grid-4">
            <StatCard val={`${s.total_weight_kg.toLocaleString()} kg`} label="E-waste processed"      icon="⚖️" />
            <StatCard val={`${s.co2_avoided_kg.toLocaleString()} kg`}  label="CO₂ avoided"            icon="🌿" />
            <StatCard val={s.certificates_issued}                        label="EPR certificates issued" icon="📜" />
            <StatCard val={s.orgs_registered}                            label="Orgs registered"        icon="🏢" />
          </div>
        </div>
      </section>

      {/* ── 4-module Pipeline Explainer ──────────────────── */}
      <section style={{ background: 'var(--bg-surface)', padding: '60px 24px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>The 4-Module Pipeline</h2>
            <p className="muted">Every batch travels through all 4 stages. Progress unlocks with each confirmation.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap', marginTop: 32 }}>
            {[
              { step: 0, icon: '📋', title: 'Registry & Visibility',    desc: 'Organisation registers, devices catalogued' },
              { step: 1, icon: '🔬', title: 'Device Triage Engine',     desc: 'Classify devices — refurb / recycle / hazardous' },
              { step: 2, icon: '🤝', title: 'Collector Matching',       desc: 'Greedy algorithm matches nearest PRO' },
              { step: 3, icon: '📜', title: 'EPR Compliance',           desc: 'Certificate issued, CO₂ & metals tracked' },
            ].map((p, i) => (
              <React.Fragment key={p.step}>
                <div style={{ textAlign: 'center', maxWidth: 180, padding: '16px 12px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{p.icon}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--green-400)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Module {p.step}</div>
                  <div style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.9rem' }}>{p.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.desc}</div>
                </div>
                {i < 3 && <div style={{ width: 48, height: 2, background: 'linear-gradient(90deg, var(--green-500), var(--teal-500))', flexShrink: 0, margin: '0 4px' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portal Selection ─────────────────────────────── */}
      <section style={{ padding: '64px 24px' }}>
        <div className="container">
          <div className="text-center mb-4" style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Choose Your Portal</h2>
            <p className="muted">Three role-based portals — each with a full 4-module workflow.</p>
          </div>
          <div className="portal-cards">
            {PORTALS.map(p => (
              <div
                key={p.to}
                className="portal-card anim-fade-up"
                style={{ '--glow-color': p.glowColor }}
                onClick={() => navigate(p.to)}
              >
                <div className="portal-card-icon">{p.icon}</div>
                <div className="portal-card-name" style={{ color: p.accentColor }}>{p.name}</div>
                <div className="portal-card-desc">{p.desc}</div>
                <div className="portal-card-tags">
                  {p.tags.map(t => <span key={t} className="portal-card-tag">{t}</span>)}
                </div>
                <div className="dsa-tag" style={{ marginBottom: 16 }}>⚙️ {p.dsa}</div>
                <button className="btn btn-primary w-full">
                  Enter Portal →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DSA Map ──────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-surface)', padding: '60px 24px', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>DSA Map — All Load-Bearing</h2>
            <p className="muted">Every algorithm directly powers a feature in the product.</p>
          </div>
          <div className="grid-2" style={{ maxWidth: 800, margin: '0 auto' }}>
            {DSA_CONCEPTS.map(d => (
              <div key={d.name} className="card card-sm flex gap-4 items-center">
                <div className="dsa-tag" style={{ flexShrink: 0 }}>⚙️</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{d.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{d.use}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--border)' }}>
        EcoTrace v2.0 · E-Waste Rules 2022 · Built for India's 598 CPCB-certified recyclers
      </footer>
    </div>
  )
}
