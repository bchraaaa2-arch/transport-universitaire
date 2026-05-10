import { useState } from 'react';
import Layout from '../components/Layout';
import { mockData } from '../data/mockData';

export default function Trajets() {
  const [trajets, setTrajets] = useState(mockData.trajets);
  const [filter, setFilter] = useState('all');
  const { bus, horaires, lignes } = mockData;

  const getInfo = (t) => {
    const h = horaires.find(h => h.id === t.id_horaire);
    const l = h ? lignes.find(l => l.id === h.id_ligne) : null;
    const b = bus.find(b => b.id === t.id_bus);
    return { h, l, b };
  };

  const filtered = filter === 'all' ? trajets : trajets.filter(t => t.etat === filter);

  const etatStyles = {
    prevu: { cls: 'badge-blue', label: 'Prévu' },
    en_retard: { cls: 'badge-orange', label: 'En retard' },
    annule: { cls: 'badge-red', label: 'Annulé' },
  };

  const updateEtat = (id, etat) => setTrajets(trajets.map(t => t.id === id ? { ...t, etat } : t));

  return (
    <Layout>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Syne', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Planning</div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Trajets</h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Prévus', value: trajets.filter(t => t.etat === 'prevu').length, color: '#3b82f6' },
          { label: 'En retard', value: trajets.filter(t => t.etat === 'en_retard').length, color: '#f97316' },
          { label: 'Annulés', value: trajets.filter(t => t.etat === 'annule').length, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent-color': s.color, padding: '18px 20px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['all', 'Tous'], ['prevu', 'Prévus'], ['en_retard', 'En retard'], ['annule', 'Annulés']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className="btn" style={{
            padding: '7px 14px', fontSize: 12,
            background: filter === v ? 'var(--accent)' : 'var(--surface2)',
            color: filter === v ? '#fff' : 'var(--text-muted)',
            border: `1px solid ${filter === v ? 'var(--accent)' : 'var(--border)'}`,
          }}>{l}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {filtered.map(t => {
          const { h, l, b } = getInfo(t);
          const pct = b ? Math.round(t.nb_places_reservees / b.capacite_max * 100) : 0;
          const { cls, label } = etatStyles[t.etat] || { cls: 'badge-gray', label: t.etat };
          const fillColor = pct > 85 ? 'var(--red)' : pct > 60 ? 'var(--orange)' : 'var(--green)';
          const incident = mockData.incidents.find(i => i.id_trajet === t.id);

          return (
            <div key={t.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 0 }}>
                {/* Info */}
                <div style={{ padding: '20px 24px', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Syne', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Ligne</div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{l?.nom_ligne || '—'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{t.date_trajet}</div>
                </div>
                {/* Bus & horaire */}
                <div style={{ padding: '20px 24px', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Syne', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Bus · Horaire</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text)' }}>{b?.matricule_bus || '—'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {h ? `${h.jour_semaine} · ${h.heure_depart}` : '—'}
                  </div>
                </div>
                {/* Capacité */}
                <div style={{ padding: '20px 24px', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Syne', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Remplissage</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700, color: fillColor, fontSize: 20 }}>{pct}%</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.nb_places_reservees}/{b?.capacite_max}</span>
                  </div>
                  <div className="progress-bar" style={{ marginTop: 6, width: 120 }}>
                    <div className="progress-fill" style={{ width: pct + '%', background: fillColor }} />
                  </div>
                </div>
                {/* State + actions */}
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', justifyContent: 'center' }}>
                  <span className={`badge ${cls}`}>{label}</span>
                  {incident && (
                    <span className="badge badge-orange" style={{ fontSize: 10 }}>⚠ Incident</span>
                  )}
                  <select
                    value={t.etat}
                    onChange={e => updateEtat(t.id, e.target.value)}
                    style={{ fontSize: 11, padding: '4px 8px', width: 'auto', marginTop: 4 }}
                  >
                    <option value="prevu">Prévu</option>
                    <option value="en_retard">En retard</option>
                    <option value="annule">Annulé</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Aucun trajet dans cette catégorie</div>
        )}
      </div>
    </Layout>
  );
}
