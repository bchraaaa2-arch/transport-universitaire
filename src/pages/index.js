import Layout from '../components/Layout';
import { useData } from '../context/DataContext';

export default function Dashboard() {
  const { etudiants, lignes, bus, trajets, reservations, incidents, abonnements, horaires, affecter } = useData();

  const activeAbos    = abonnements.filter(a => a.statut === 'actif');
  const activeBus     = bus.filter(b => b.statut === 'actif');
  const pendingRes    = reservations.filter(r => r.statut === 'en_attente');
  const retardTrajets = trajets.filter(t => t.etat === 'en_retard');
  const sansAbo       = etudiants.filter(e => !activeAbos.find(a => a.id_etudiant === e.id));

  const tauxMoyen = (() => {
    if (trajets.length === 0) return 0;
    const vals = trajets.map(t => {
      const b = bus.find(b => b.id === t.id_bus);
      if (!b) return 0;
      return t.nb_places_reservees / b.capacite_max;
    });
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100);
  })();

  const stats = [
    { label: 'Étudiants inscrits',  value: etudiants.length,  sub: `${sansAbo.length} sans abonnement`,               color: '#2563eb', icon: '◉' },
    { label: 'Lignes actives',      value: lignes.length,      sub: 'Transport universitaire',                         color: '#0ea5e9', icon: '⬡' },
    { label: 'Bus opérationnels',   value: activeBus.length,   sub: `${bus.length - activeBus.length} en maintenance`, color: '#16a34a', icon: '▣' },
    { label: 'Taux de remplissage', value: tauxMoyen + '%',    sub: 'Moyenne sur tous les trajets',                    color: '#f59e0b', icon: '⬢' },
  ];

  return (
    <Layout>

      {/* ══ Hero Banner ══ */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a6b 0%, #1e4a8a 55%, #1565c0 100%)',
        borderRadius: 18,
        padding: '32px 40px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(26,58,107,0.28)',
        minHeight: 168,
      }}>
        {/* Cercles déco */}
        <div style={{ position:'absolute', top:-70, right:220, width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-90, right:60, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.035)', pointerEvents:'none' }} />

        {/* Texte hero */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 10,
          }}>Vue d'ensemble</div>

          <h1 style={{
            fontSize: 27, fontWeight: 800, color: '#ffffff',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            marginBottom: 8, lineHeight: 1.2,
          }}>
            Système de Transport<br />Universitaire
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
            USTHB · Faculté d'Informatique · Section B
          </p>

          {(pendingRes.length > 0 || retardTrajets.length > 0) && (
            <div style={{
              marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(251,191,36,0.16)', border: '1px solid rgba(251,191,36,0.35)',
              borderRadius: 8, padding: '6px 14px',
            }}>
              <span style={{ fontSize: 14 }}>⚠️</span>
              <span style={{ color: '#fcd34d', fontSize: 12, fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {pendingRes.length} réservation(s) en attente · {retardTrajets.length} trajet(s) en retard
              </span>
            </div>
          )}
        </div>

        {/* Bus SVG illustration */}
        <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <svg width="290" height="134" viewBox="0 0 290 134" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Route */}
            <rect x="10" y="112" width="270" height="6" rx="3" fill="rgba(255,255,255,0.10)"/>
            <rect x="55"  y="114" width="32" height="2" rx="1" fill="rgba(255,255,255,0.22)"/>
            <rect x="130" y="114" width="32" height="2" rx="1" fill="rgba(255,255,255,0.22)"/>
            <rect x="205" y="114" width="32" height="2" rx="1" fill="rgba(255,255,255,0.22)"/>

            {/* Corps du bus */}
            <rect x="18" y="30" width="244" height="80" rx="10" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5"/>

            {/* Toit */}
            <rect x="28" y="17" width="220" height="26" rx="8" fill="rgba(255,255,255,0.20)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5"/>

            {/* Bande déco */}
            <rect x="18" y="58" width="244" height="7" fill="rgba(96,165,250,0.40)"/>

            {/* Fenêtres */}
            <rect x="36"  y="37" width="36" height="22" rx="5" fill="rgba(255,255,255,0.52)"/>
            <rect x="82"  y="37" width="36" height="22" rx="5" fill="rgba(255,255,255,0.52)"/>
            <rect x="128" y="37" width="36" height="22" rx="5" fill="rgba(255,255,255,0.52)"/>
            <rect x="174" y="37" width="36" height="22" rx="5" fill="rgba(255,255,255,0.52)"/>

            {/* Porte */}
            <rect x="220" y="70" width="28" height="36" rx="3" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5"/>
            <line x1="234" y1="70" x2="234" y2="106" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>

            {/* Phares */}
            <rect x="248" y="44" width="13" height="8" rx="2" fill="rgba(255,220,100,0.85)"/>
            <rect x="248" y="85" width="13" height="6" rx="2" fill="rgba(255,100,100,0.65)"/>
            <rect x="19"  y="44" width="10" height="8" rx="2" fill="rgba(255,100,100,0.55)"/>

            {/* Roues */}
            <circle cx="70"  cy="116" r="14" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.38)" strokeWidth="2"/>
            <circle cx="70"  cy="116" r="7"  fill="rgba(255,255,255,0.28)"/>
            <circle cx="70"  cy="116" r="3"  fill="rgba(255,255,255,0.70)"/>
            <circle cx="200" cy="116" r="14" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.38)" strokeWidth="2"/>
            <circle cx="200" cy="116" r="7"  fill="rgba(255,255,255,0.28)"/>
            <circle cx="200" cy="116" r="3"  fill="rgba(255,255,255,0.70)"/>

            {/* Panneau destination */}
            <rect x="48" y="19" width="96" height="13" rx="3" fill="rgba(255,255,255,0.62)"/>
            <text x="96" y="29" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#1a3a6b" fontFamily="Plus Jakarta Sans, sans-serif">USTHB → BAB EZZOUAR</text>

            {/* Antenne */}
            <line x1="228" y1="17" x2="228" y2="6" stroke="rgba(255,255,255,0.45)" strokeWidth="2"/>
            <circle cx="228" cy="5" r="2.5" fill="rgba(255,255,255,0.65)"/>
          </svg>
        </div>
      </div>

      {/* ══ Stats ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent-color': s.color }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Plus Jakarta Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              <span style={{ fontSize: 20, color: s.color, opacity: 0.75 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif', color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ══ Two columns ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Taux de remplissage */}
        <div className="card">
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, marginBottom: 18, fontSize: 15 }}>
            Taux de remplissage par ligne
          </div>
          {lignes.map(ligne => {
            const lineTrajets = trajets.filter(t => { const h = horaires.find(h => h.id === t.id_horaire); return h?.id_ligne === ligne.id; });
            const aff = affecter.find(a => a.id_ligne === ligne.id && a.statut === 'actif');
            const lineBus = aff ? bus.find(b => b.id === aff.id_bus) : null;
            const total = lineTrajets.reduce((s, t) => s + t.nb_places_reservees, 0);
            const cap = lineBus ? lineBus.capacite_max * Math.max(lineTrajets.length, 1) : 1;
            const pct = Math.min(100, Math.round((total / Math.max(cap, 1)) * 100));
            const color = pct > 80 ? 'var(--red)' : pct > 60 ? 'var(--orange)' : 'var(--green)';
            return (
              <div key={ligne.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: 13, fontWeight: 500 }}>{ligne.nom_ligne}</span>
                  <span style={{ color, fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 13 }}>{pct}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: pct + '%', background: color }} /></div>
              </div>
            );
          })}
        </div>

        {/* Incidents récents */}
        <div className="card">
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, marginBottom: 18, fontSize: 15 }}>
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

      {/* ══ Trajets récents ══ */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1.5px solid var(--border)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 15 }}>
          Trajets récents
        </div>
        <table>
          <thead>
            <tr><th>Date</th><th>Ligne</th><th>Bus</th><th>Horaire</th><th>Places réservées</th><th>État</th></tr>
          </thead>
          <tbody>
            {trajets.map(t => {
              const h = horaires.find(h => h.id === t.id_horaire);
              const l = h ? lignes.find(l => l.id === h.id_ligne) : null;
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
            {trajets.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Aucun trajet</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
