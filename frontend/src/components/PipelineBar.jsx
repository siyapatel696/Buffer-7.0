import React from 'react'

const STEPS = [
  { id: 0, icon: '📋', label: 'Registry'    },
  { id: 1, icon: '🔬', label: 'Triage'      },
  { id: 2, icon: '🤝', label: 'Matching'    },
  { id: 3, icon: '📜', label: 'Compliance'  },
]

/**
 * PipelineBar — shows 4-module lifecycle progress.
 * @param {number} activeStep  — 0..3 currently active module
 */
export default function PipelineBar({ activeStep = 0 }) {
  return (
    <div className="pipeline-bar">
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: 12, whiteSpace: 'nowrap', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Pipeline
      </span>
      {STEPS.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className={`pipeline-step ${i < activeStep ? 'done' : i === activeStep ? 'active' : 'pending'}`}>
            <span className="pipeline-step-icon">{s.icon}</span>
            <span>Module {s.id} · {s.label}</span>
            {i < activeStep && <span style={{ fontSize: '0.75rem' }}>✓</span>}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`pipeline-connector ${i < activeStep ? 'done' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
