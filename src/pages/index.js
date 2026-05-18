import Layout from '../components/Layout';
import { useData } from '../context/DataContext';

export default function Dashboard() {
  const {
    etudiants,
    lignes,
    bus,
    trajets,
    reservations,
    incidents,
    abonnements,
    horaires,
    affecter,
  } = useData();

  const activeAbos    = abonnements.filter(a => a.statut === 'actif');
  const activeBus     = bus.filter(b => b.statut === 'actif');
  const pendingRes    = reservations.filter(r => r.statut === 'en_attente');
  const retardTrajets = trajets.filter(t => t.etat === 'en_retard');

  // Taux de remplissage moyen
  const tauxMoyen = (() => {
    if (trajets.length === 0) return 0;
    const vals = trajets.map(t => {
      const b = bus.find(b => b.id === t.id_bus);
      if (!b) return 0;
      return t.nb_places_reservees / b.capacite_max;
    });
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100);
  })();

  // Étudiants sans abonnement actif
  const sansAbo = etudiants.filter(e => !activeAbos.find(a => a.id_etudiant === e.id));

  const stats = [
    { label: 'Étudiants inscrits',  value: etudiants.length,  sub: `${sansAbo.length} sans abonnement`,          color: '#7c6ff7', icon: '◉' },
    { label: 'Lignes actives',      value: lignes.length,      sub: 'Transport universitaire',                    color: '#06b6d4', icon: '⬡' },
    { label: 'Bus opérationnels',   value: activeBus.length,   sub: `${bus.length - activeBus.length} en maintenance`, color: '#10b981', icon: '▣' },
    { label: 'Taux de remplissage', value: tauxMoyen + '%',    sub: 'Moyenne sur tous les trajets',               color: '#f59e0b', icon: '⬢' },
  ];

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif', textTransform: 'uppercase' }}>
          Vue d'ensemble
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
          Système de Transport Universitaire
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          USTHB · Faculté d'Informatique · Section B · 2025-2026
        </p>
      </div>

      {/* Alerte */}
      {(pendingRes.length > 0 || retardTrajets.length > 0) && (
        <div style={{
          background: 'rgba(249,115,22,.08)',
          border: '1.5px solid rgba(249,115,22,.25)',
          borderRadius: 12,
          padding: '14px 18px',
          marginBottom: 24,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <span style={{ color: 'var(--orange)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 13 }}>
              Alertes en cours :
            </span>
            <span style={{ color: 'var(--text-dim)', fontSize: 13, marginLeft: 8 }}>
              {pendingRes.length} réservation(s) en attente · {retardTrajets.length} trajet(s) en retard
            </span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent-color': s.color }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Plus Jakarta Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.label}
              </div>
              <span style={{ fontSize: 20, color: s.color, opacity: 0.7 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--text)', lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Deux colonnes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Taux de remplissage par ligne */}
        <div className="card">
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
            Taux de remplissage par ligne
          </div>
          {lignes.map(ligne => {
            const lineTrajets = trajets.filter(t => {
              const h = horaires.find(h => h.id === t.id_horaire);
              return h?.id_ligne === ligne.id;
            });
            const aff = affecter.find(a => a.id_ligne === ligne.id && a.statut === 'actif');
            const lineBus = aff ? bus.find(b => b.id === aff.id_bus) : null;
            const total = lineTrajets.reduce((s, t) => s + t.nb_places_reservees, 0);
            const cap = lineBus ? lineBus.capacite_max * Math.max(lineTrajets.length, 1) : 1;
            const pct = Math.min(100, Math.round((total / Math.max(cap, 1)) * 100));
            const color = pct > 80 ? 'var(--red)' : pct > 60 ? 'var(--orange)' : 'var(--green)';

            return (
              <div key={ligne.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>{ligne.nom_ligne}</span>
                  <span style={{ color, fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 13 }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: pct + '%', background: color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Incidents récents */}
        <div className="card">
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
            Incidents récents
          </div>
          {incidents.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              ✅ Aucun incident signalé
            </div>
          ) : incidents.map(inc => {
            const badgeMap = { leger: 'badge-blue', moyen: 'badge-orange', important: 'badge-red' };
            const typeMap  = { retard: '🕐', panne: '🔧', annulation: '❌', autre: '📋' };
            return (
              <div key={inc.id} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '10px 0', borderBottom: '1px solid var(--border)',
              }}>
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

      {/* Trajets récents */}
      <div className="card">
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
          Trajets récents
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Ligne</th>
              <th>Bus</th>
              <th>Horaire</th>
              <th>Places réservées</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            {trajets.map(t => {
              const h = horaires.find(h => h.id === t.id_horaire);
              const l = h ? lignes.find(l => l.id === h.id_ligne) : null;
              const b = bus.find(b => b.id === t.id_bus);
              const etatMap = {
                prevu:     ['badge-blue',   'Prévu'],
                en_retard: ['badge-orange', 'En retard'],
                annule:    ['badge-red',    'Annulé'],
              };
              const [cls, label] = etatMap[t.etat] || ['badge-gray', t.etat];
              const pct = b ? Math.round(t.nb_places_reservees / b.capacite_max * 100) : 0;
              return (
                <tr key={t.id}>
                  <td>{t.date_trajet}</td>
                  <td style={{ color: 'var(--text)' }}>{l?.nom_ligne || '—'}</td>
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
            {trajets.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  Aucun trajet enregistré
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
