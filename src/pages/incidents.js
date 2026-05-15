import { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../context/DataContext';

export default function Incidents() {
  const {incidents, setIncidents} = useData();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ type_incident: 'retard', description: '', date_incident: '', impact: 'moyen', id_trajet: '' });
  const { trajets, horaires, lignes, bus } = mockData;

  const getTrajetLabel = (id) => {
    const t = trajets.find(t => t.id === id);
    if (!t) return '—';
    const h = horaires.find(h => h.id === t.id_horaire);
    const l = h ? lignes.find(l => l.id === h.id_ligne) : null;
    return `${t.date_trajet} · ${l?.nom_ligne || '?'}`;
  };

  const add = () => {
    if (!form.description || !form.date_incident || !form.id_trajet) return;
    setIncidents([...incidents, { ...form, id: Date.now(), id_trajet: parseInt(form.id_trajet) }]);
    setModal(false);
  };

  const impactStyles = { leger: 'badge-blue', moyen: 'badge-orange', important: 'badge-red' };
  const typeIcons = { retard: '🕐', panne: '🔧', annulation: '❌', autre: '📋' };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Syne', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Suivi</div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Incidents & Retards</h1>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm({ type_incident: 'retard', description: '', date_incident: new Date().toISOString().split('T')[0], impact: 'moyen', id_trajet: '' }); setModal(true); }}>
          + Signaler un incident
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total incidents', value: incidents.length, color: '#3b82f6' },
          { label: 'Retards', value: incidents.filter(i => i.type_incident === 'retard').length, color: '#f59e0b' },
          { label: 'Pannes', value: incidents.filter(i => i.type_incident === 'panne').length, color: '#f97316' },
          { label: 'Impact important', value: incidents.filter(i => i.impact === 'important').length, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent-color': s.color, padding: '18px 20px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {incidents.map(inc => (
          <div key={inc.id} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: inc.impact === 'important' ? 'rgba(239,68,68,.12)' : inc.impact === 'moyen' ? 'rgba(249,115,22,.12)' : 'rgba(59,130,246,.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
            }}>
              {typeIcons[inc.type_incident]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--text)', textTransform: 'capitalize' }}>
                  {inc.type_incident}
                </span>
                <span className={`badge ${impactStyles[inc.impact]}`}>{inc.impact}</span>
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 6 }}>{inc.description}</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>📅 {inc.date_incident}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>🚌 {getTrajetLabel(inc.id_trajet)}</span>
              </div>
            </div>
            <button className="btn btn-danger" style={{ fontSize: 12, padding: '6px 12px', flexShrink: 0 }}
              onClick={() => setIncidents(incidents.filter(i => i.id !== inc.id))}>
              Supprimer
            </button>
          </div>
        ))}
        {incidents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            ✓ Aucun incident signalé
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <h2 style={{ fontFamily: 'Syne', fontSize: 18, marginBottom: 20 }}>Signaler un incident</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Type</label>
                <select value={form.type_incident} onChange={e => setForm({ ...form, type_incident: e.target.value })}>
                  <option value="retard">Retard</option>
                  <option value="panne">Panne</option>
                  <option value="annulation">Annulation</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Impact</label>
                <select value={form.impact} onChange={e => setForm({ ...form, impact: e.target.value })}>
                  <option value="leger">Léger</option>
                  <option value="moyen">Moyen</option>
                  <option value="important">Important</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label">Trajet concerné *</label>
              <select value={form.id_trajet} onChange={e => setForm({ ...form, id_trajet: e.target.value })}>
                <option value="">Sélectionner...</option>
                {trajets.map(t => <option key={t.id} value={t.id}>{getTrajetLabel(t.id)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input type="date" value={form.date_incident} onChange={e => setForm({ ...form, date_incident: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ minHeight: 80, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={add}>Signaler</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
