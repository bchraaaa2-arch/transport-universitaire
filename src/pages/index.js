import Layout from '../components/Layout';
import { mockData } from '../data/mockData';

export default function Dashboard() {
  const { etudiants, lignes, bus, trajets, reservations, incidents, abonnements } = mockData;

  const activeAbos = abonnements.filter(a => a.statut === 'actif');
  const activeBus  = bus.filter(b => b.statut === 'actif');
  const pendingRes = reservations.filter(r => r.statut === 'en_attente');
  const retardTrajets = trajets.filter(t => t.etat === 'en_retard');
  const sansAbo = etudiants.filter(e => !activeAbos.find(a => a.id_etudiant === e.id));

  const tauxMoyen = (() => {
    const vals = trajets.map(t => {
      const b = bus.find(b => b.id === t.id_bus);
      if (!b) return 0;
      return t.nb_places_reservees / b.capacite_max;
    });
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100);
  })();

  const stats = [
    { label: 'Étudiants inscrits',  value: etudiants.length,   sub: `${sansAbo.length} sans abonnement`,               color: '#2563eb' },
    { label: 'Lignes actives',      value: lignes.length,       sub: 'Transport universitaire',                         color: '#0ea5e9' },
    { label: 'Bus opérationnels',   value: activeBus.length,    sub: `${bus.length - activeBus.length} en maintenance`, color: '#16a34a' },
    { label: 'Taux de remplissage', value: tauxMoyen + '%',     sub: 'Moyenne sur tous les trajets',                    color: '#f59e0b' },
  ];

  return (
    <Layout>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a6b 0%, #1e4a8a 60%, #1565c0 100%)',
        borderRadius: 16,
        padding: '32px 40px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(26,58,107,0.25)',
        minHeight: 160,
      }}>
        {/* Cercles décoratifs */}
        <div style={{
          position: 'absolute', top: -60, right: 200,
          width: 220, height: 220, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, right: 80,
          width: 280, height: 280, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />

        {/* Texte */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 8,
          }}>
            Vue d'ensemble · 2025-2026
          </div>
          <h1 style={{
            fontSize: 26, fontWeight: 800, color: '#ffffff',
            fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 8,
            lineHeight: 1.2,
          }}>
            Système de Transport<br />Universitaire
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
            USTHB · Faculté d'Informatique · Section B
          </p>

          {(pendingRes.length > 0 || retardTrajets.length > 0) && (
            <div style={{
              marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(251,191,36,0.18)',
              border: '1px solid rgba(251,191,36,0.35)',
              borderRadius: 8, padding: '6px 14px',
            }}>
              <span style={{ fontSize: 14 }}>⚠️</span>
              <span style={{ color: '#fcd34d', fontSize: 12, fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {pendingRes.length} réservation(s) en attente · {retardTrajets.length} trajet(s) en retard
              </span>
            </div>
          )}
        </div>

        {/* Bus SVG illustration */}
        <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <svg width="280" height="130" viewBox="0 0 280 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Route */}
            <rect x="10" y="108" width="260" height="6" rx="3" fill="rgba(255,255,255,0.12)"/>
            <rect x="60" y="110" width="30" height="2" rx="1" fill="rgba(255,255,255,0.25)"/>
            <rect x="130" y="110" width="30" height="2" rx="1" fill="rgba(255,255,255,0.25)"/>
            <rect x="200" y="110" width="30" height="2" rx="1" fill="rgba(255,255,255,0.25)"/>

            {/* Corps du bus */}
            <rect x="20" y="28" width="230" height="78" rx="10" fill="rgba(255,255,255,0.18)"/>
            <rect x="20" y="28" width="230" height="78" rx="10" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>

            {/* Toit arrondi */}
            <rect x="30" y="16" width="210" height="24" rx="8" fill="rgba(255,255,255,0.22)"/>
            <rect x="30" y="16" width="210" height="24" rx="8" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>

            {/* Bande colorée côté */}
            <rect x="20" y="56" width="230" height="8" fill="rgba(96,165,250,0.45)"/>

            {/* Fenêtres */}
            <rect x="38" y="35" width="34" height="22" rx="4" fill="rgba(255,255,255,0.55)"/>
            <rect x="82" y="35" width="34" height="22" rx="4" fill="rgba(255,255,255,0.55)"/>
            <rect x="126" y="35" width="34" height="22" rx="4" fill="rgba(255,255,255,0.55)"/>
            <rect x="170" y="35" width="34" height="22" rx="4" fill="rgba(255,255,255,0.55)"/>

            {/* Porte */}
            <rect x="214" y="68" width="26" height="34" rx="3" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
            <line x1="227" y1="68" x2="227" y2="102" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>

            {/* Phares avant */}
            <rect x="235" y="42" width="14" height="8" rx="2" fill="rgba(255,220,100,0.8)"/>
            <rect x="235" y="82" width="14" height="6" rx="2" fill="rgba(255,100,100,0.6)"/>

            {/* Phares arrière */}
            <rect x="21" y="42" width="10" height="8" rx="2" fill="rgba(255,100,100,0.6)"/>

            {/* Roues */}
            <circle cx="68" cy="112" r="14" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
            <circle cx="68" cy="112" r="7" fill="rgba(255,255,255,0.3)"/>
            <circle cx="68" cy="112" r="3" fill="rgba(255,255,255,0.7)"/>

            <circle cx="192" cy="112" r="14" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
            <circle cx="192" cy="112" r="7" fill="rgba(255,255,255,0.3)"/>
            <circle cx="192" cy="112" r="3" fill="rgba(255,255,255,0.7)"/>

            {/* Destination board */}
            <rect x="50" y="18" width="90" height="14" rx="3" fill="rgba(255,255,255,0.6)"/>
            <text x="95" y="28" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1a3a6b" fontFamily="Plus Jakarta Sans, sans-serif">USTHB → BOUZARÉAH</text>

            {/* Antenne */}
            <line x1="220" y1="16" x2="220" y2="6" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
            <circle cx="220" cy="5" r="2.5" fill="rgba(255,255,255,0.7)"/>
          </svg>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent-color': s.color }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Plus Jakarta Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif', color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Two columns ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Taux de remplissage */}
        <div className="card">
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, marginBottom: 18, fontSize: 15, color: 'var(--text)' }}>
            Taux de remplissage par ligne
          </div>
          {lignes.map(ligne => {
            const lineTrajets = trajets.filter(t => {
              const h = mockData.horaires.find(h => h.id === t.id_horaire);
              return h?.id_ligne === ligne.id;
            });
            const lineBus = bus.find(b => {
              const aff = mockData.affecter.find(a => a.id_ligne === ligne.id && a.statut === 'actif');
              return aff && b.id === aff.id_bus;
            });
            const total = lineTrajets.reduce((s, t) => s + t.nb_places_reservees, 0);
            const cap = lineBus ? lineBus.capacite_max * Math.max(lineTrajets.length, 1) : 1;
            const pct = Math.min(100, Math.round((total / Math.max(cap, 1)) * 100));
            const color = pct > 80 ? 'var(--red)' : pct > 60 ? 'var(--orange)' : 'var(--green)';
            return (
              <div key={ligne.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: 13, fontWeight: 500 }}>{ligne.nom_ligne}</span>
                  <span style={{ color, fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 13 }}>{pct}%</span>
                </div>
                <div className="progress-bar" style={{ height: 7 }}>
                  <div className="progress-fill" style={{ width: pct + '%', background: color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Incidents récents */}
        <div className="card">
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, marginBottom: 18, fontSize: 15, color: 'var(--text)' }}>
            Incidents récents
          </div>
          {incidents.length === 0
            ? <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>✅ Aucun incident signalé</div>
            : incidents.map(inc => {
              const badgeMap = { leger: 'badge-blue', moyen: 'badge-orange', important: 'badge-red' };
              const typeMap  = { retard: '🕐', panne: '🔧', annulation: '❌', autre: '📋' };
              return (
                <div key={inc.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 18, marginTop: 2 }}>{typeMap[inc.type_incident]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {inc.type_incident.charAt(0).toUpperCase() + inc.type_incident.slice(1)}
                      </span>
                      <span className={`badge ${badgeMap[inc.impact]}`}>{inc.impact}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{inc.description}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>{inc.date_incident}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ── Trajets récents ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1.5px solid var(--border)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
          Trajets récents
        </div>
        <table>
          <thead>
            <tr><th>Date</th><th>Ligne</th><th>Bus</th><th>Horaire</th><th>Places réservées</th><th>État</th></tr>
          </thead>
          <tbody>
            {trajets.map(t => {
              const h = mockData.horaires.find(h => h.id === t.id_horaire);
              const l = h ? mockData.lignes.find(l => l.id === h.id_ligne) : null;
              const b = bus.find(b => b.id === t.id_bus);
              const etatMap = { prevu: ['badge-blue', 'Prévu'], en_retard: ['badge-orange', 'En retard'], annule: ['badge-red', 'Annulé'] };
              const [cls, label] = etatMap[t.etat] || ['badge-gray', t.etat];
              const pct = b ? Math.round(t.nb_places_reservees / b.capacite_max * 100) : 0;
              return (
                <tr key={t.id}>
                  <td>{t.date_trajet}</td>
                  <td style={{ color: 'var(--text)', fontWeight: 500 }}>{l?.nom_ligne || '—'}</td>
                  <td>{b?.matricule_bus || '—'}</td>
                  <td>{h ? `${h.jour_semaine} ${h.heure_depart}` : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{t.nb_places_reservees}/{b?.capacite_max}</span>
                      <div style={{ width: 60, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: pct + '%', background: pct > 85 ? 'var(--red)' : 'var(--green)', borderRadius: 2 }} />
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${cls}`}>{label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
