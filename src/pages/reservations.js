import { useState } from 'react';
import Layout from '../components/Layout';
import { mockData } from '../data/mockData';

const { etudiants, lignes, bus, trajets, reservations, abonnements, horaires, incidents, affecter } = mockData;

// Compute all the required queries from the project
const queries = [
  {
    id: 1,
    title: 'Nombre d\'étudiants par ligne',
    sql: `SELECT l.nom_ligne, COUNT(a.id_etudiant) AS nb_etudiants
FROM LIGNE l
LEFT JOIN ABONNEMENT a ON l.id_ligne = a.id_ligne
  AND a.statut = 'actif'
GROUP BY l.id_ligne, l.nom_ligne
ORDER BY nb_etudiants DESC;`,
    compute: () => {
      return lignes.map(l => ({
        ligne: l.nom_ligne,
        code: l.code_ligne,
        nb_etudiants: abonnements.filter(a => a.id_ligne === l.id && a.statut === 'actif').length,
      })).sort((a, b) => b.nb_etudiants - a.nb_etudiants);
    },
    columns: ['Code', 'Ligne', 'Nb. Étudiants'],
    renderRow: (r) => [r.code, r.ligne, r.nb_etudiants],
  },
  {
    id: 2,
    title: 'Taux de remplissage des bus',
    sql: `SELECT b.matricule_bus, t.date_trajet,
  t.nb_places_reservees, b.capacite_max,
  ROUND(t.nb_places_reservees / b.capacite_max * 100, 1) AS taux_remplissage
FROM TRAJET t
JOIN BUS b ON t.id_bus = b.id_bus
ORDER BY taux_remplissage DESC;`,
    compute: () => {
      return trajets.map(t => {
        const b = bus.find(b => b.id === t.id_bus);
        const pct = b ? Math.round(t.nb_places_reservees / b.capacite_max * 1000) / 10 : 0;
        return {
          matricule: b?.matricule_bus || '—',
          date: t.date_trajet,
          reservees: t.nb_places_reservees,
          max: b?.capacite_max || 0,
          taux: pct + '%',
          raw: pct,
        };
      }).sort((a, b) => b.raw - a.raw);
    },
    columns: ['Bus', 'Date', 'Réservées', 'Capacité', 'Taux'],
    renderRow: (r) => [r.matricule, r.date, r.reservees, r.max, r.taux],
  },
  {
    id: 3,
    title: 'Horaires d\'une ligne donnée (L01)',
    sql: `SELECT h.jour_semaine, h.heure_depart, h.heure_arrivee
FROM HORAIRE h
JOIN LIGNE l ON h.id_ligne = l.id_ligne
WHERE l.code_ligne = 'L01'
ORDER BY FIELD(h.jour_semaine, 'lundi','mardi','mercredi',
  'jeudi','vendredi','samedi','dimanche'), h.heure_depart;`,
    compute: () => {
      const l01 = lignes.find(l => l.code_ligne === 'L01');
      if (!l01) return [];
      const order = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
      return horaires
        .filter(h => h.id_ligne === l01.id)
        .sort((a, b) => order.indexOf(a.jour_semaine) - order.indexOf(b.jour_semaine));
    },
    columns: ['Jour', 'Départ', 'Arrivée'],
    renderRow: (r) => [r.jour_semaine, r.heure_depart, r.heure_arrivee || '—'],
  },
  {
    id: 4,
    title: 'Étudiants sans abonnement actif',
    sql: `SELECT e.nom, e.prenom, e.matricule, e.email
FROM ETUDIANT e
WHERE NOT EXISTS (
  SELECT 1 FROM ABONNEMENT a
  WHERE a.id_etudiant = e.id_etudiant
    AND a.statut = 'actif'
);`,
    compute: () => {
      const activeIds = abonnements.filter(a => a.statut === 'actif').map(a => a.id_etudiant);
      return etudiants.filter(e => !activeIds.includes(e.id));
    },
    columns: ['Nom', 'Prénom', 'Matricule', 'Email'],
    renderRow: (r) => [r.nom, r.prenom, r.matricule, r.email],
  },
  {
    id: 5,
    title: 'Historique des abonnements d\'un étudiant (Ahmed Benali)',
    sql: `SELECT l.nom_ligne, a.date_debut, a.date_fin, a.statut
FROM ABONNEMENT a
JOIN LIGNE l ON a.id_ligne = l.id_ligne
WHERE a.id_etudiant = 1
ORDER BY a.date_debut DESC;`,
    compute: () => {
      return abonnements
        .filter(a => a.id_etudiant === 1)
        .map(a => ({
          ...a,
          ligne: lignes.find(l => l.id === a.id_ligne)?.nom_ligne || '—',
        }))
        .sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut));
    },
    columns: ['Ligne', 'Début', 'Fin', 'Statut'],
    renderRow: (r) => [r.ligne, r.date_debut, r.date_fin || 'En cours', r.statut],
  },
  {
    id: 6,
    title: 'Bus affectés à une ligne à une date donnée (2025-05-10)',
    sql: `SELECT b.matricule_bus, b.modele, b.capacite_max, af.statut
FROM AFFECTER af
JOIN BUS b ON af.id_bus = b.id_bus
JOIN LIGNE l ON af.id_ligne = l.id_ligne
WHERE l.code_ligne = 'L01'
  AND af.date_debut <= '2025-05-10'
  AND (af.date_fin IS NULL OR af.date_fin >= '2025-05-10');`,
    compute: () => {
      const date = '2025-05-10';
      const l01 = lignes.find(l => l.code_ligne === 'L01');
      if (!l01) return [];
      return affecter
        .filter(a => a.id_ligne === l01.id && a.date_debut <= date && (!a.date_fin || a.date_fin >= date))
        .map(a => {
          const b = bus.find(b => b.id === a.id_bus);
          return { ...b, statut_aff: a.statut };
        });
    },
    columns: ['Matricule', 'Modèle', 'Capacité', 'Statut'],
    renderRow: (r) => [r.matricule_bus, r.modele, r.capacite_max, r.statut],
  },
  {
    id: 7,
    title: 'Lignes les plus chargées',
    sql: `SELECT l.nom_ligne, SUM(r.nombre_places) AS total_reservations
FROM RESERVATION r
JOIN TRAJET t ON r.id_trajet = t.id_trajet
JOIN HORAIRE h ON t.id_horaire = h.id_horaire
JOIN LIGNE l ON h.id_ligne = l.id_ligne
WHERE r.statut = 'confirmee'
GROUP BY l.id_ligne, l.nom_ligne
ORDER BY total_reservations DESC;`,
    compute: () => {
      const result = {};
      reservations.filter(r => r.statut === 'confirmee').forEach(r => {
        const t = trajets.find(t => t.id === r.id_trajet);
        const h = t ? horaires.find(h => h.id === t.id_horaire) : null;
        const l = h ? lignes.find(l => l.id === h.id_ligne) : null;
        if (l) {
          result[l.id] = result[l.id] || { ligne: l.nom_ligne, total: 0 };
          result[l.id].total += r.nombre_places;
        }
      });
      return Object.values(result).sort((a, b) => b.total - a.total);
    },
    columns: ['Ligne', 'Total réservations confirmées'],
    renderRow: (r) => [r.ligne, r.total],
  },
  {
    id: 8,
    title: 'Liste des trajets avec retard',
    sql: `SELECT t.date_trajet, l.nom_ligne, b.matricule_bus,
  h.heure_depart, i.description, i.impact
FROM TRAJET t
JOIN HORAIRE h ON t.id_horaire = h.id_horaire
JOIN LIGNE l ON h.id_ligne = l.id_ligne
JOIN BUS b ON t.id_bus = b.id_bus
LEFT JOIN INCIDENT i ON i.id_trajet = t.id_trajet
WHERE t.etat = 'en_retard'
ORDER BY t.date_trajet DESC;`,
    compute: () => {
      return trajets.filter(t => t.etat === 'en_retard').map(t => {
        const h = horaires.find(h => h.id === t.id_horaire);
        const l = h ? lignes.find(l => l.id === h.id_ligne) : null;
        const b = bus.find(b => b.id === t.id_bus);
        const inc = incidents.find(i => i.id_trajet === t.id);
        return {
          date: t.date_trajet,
          ligne: l?.nom_ligne || '—',
          bus: b?.matricule_bus || '—',
          heure: h?.heure_depart || '—',
          cause: inc?.description || 'Non précisée',
          impact: inc?.impact || '—',
        };
      });
    },
    columns: ['Date', 'Ligne', 'Bus', 'Heure', 'Cause', 'Impact'],
    renderRow: (r) => [r.date, r.ligne, r.bus, r.heure, r.cause, r.impact],
  },
];

export default function Requetes() {
  const [active, setActive] = useState(1);
  const [showSQL, setShowSQL] = useState(false);
  const q = queries.find(q => q.id === active);
  const results = q.compute();

  return (
    <Layout>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Syne', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Analyse</div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Requêtes SQL</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Les 8 requêtes demandées dans le projet — exécutées sur les données</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* Query list */}
        <div className="card" style={{ padding: 8, height: 'fit-content' }}>
          {queries.map(q => (
            <button key={q.id} onClick={() => { setActive(q.id); setShowSQL(false); }} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%',
              padding: '12px 14px', borderRadius: 8, textAlign: 'left', marginBottom: 2,
              background: active === q.id ? 'rgba(59,130,246,.12)' : 'transparent',
              border: active === q.id ? '1px solid rgba(59,130,246,.2)' : '1px solid transparent',
              cursor: 'pointer', transition: 'all .15s',
            }}>
              <span style={{
                fontFamily: 'Syne', fontWeight: 700, fontSize: 11,
                color: active === q.id ? 'var(--accent)' : 'var(--text-muted)',
                flexShrink: 0, marginTop: 1,
              }}>Q{q.id}</span>
              <span style={{ fontSize: 12, color: active === q.id ? 'var(--text)' : 'var(--text-dim)', lineHeight: 1.4 }}>{q.title}</span>
            </button>
          ))}
        </div>

        {/* Result panel */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ background: 'var(--accent)', color: '#fff', fontFamily: 'Syne', fontWeight: 700, fontSize: 11, padding: '2px 8px', borderRadius: 4 }}>Q{q.id}</span>
                  <h2 style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700 }}>{q.title}</h2>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{results.length} résultat(s)</div>
              </div>
              <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setShowSQL(!showSQL)}>
                {showSQL ? '≡ Masquer SQL' : '≡ Voir SQL'}
              </button>
            </div>

            {showSQL && (
              <pre style={{
                background: '#0d1117',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '16px',
                fontSize: 12,
                color: '#e2e8f0',
                overflow: 'auto',
                fontFamily: 'monospace',
                lineHeight: 1.6,
                marginBottom: 0,
              }}>
                <code dangerouslySetInnerHTML={{ __html: q.sql
                  .replace(/\b(SELECT|FROM|JOIN|WHERE|GROUP BY|ORDER BY|LEFT|INNER|ON|AND|OR|NOT|EXISTS|AS|BY|IS|NULL|ROUND|COUNT|SUM|FIELD)\b/g, '<span style="color:#79c0ff">$1</span>')
                  .replace(/'([^']*)'/g, '<span style="color:#a5d6ff">\'$1\'</span>')
                }} />
              </pre>
            )}
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Aucun résultat</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    {q.columns.map(c => <th key={c}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      {q.renderRow(r).map((cell, j) => (
                        <td key={j} style={{ color: j === 0 ? 'var(--text)' : 'var(--text-dim)' }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
