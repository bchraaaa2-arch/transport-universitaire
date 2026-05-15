import { useState } from 'react';
import Layout from '../components/Layout';
import { mockData } from '../data/mockData';
import { useData } from '../context/DataContext';

export default function Reservations() {
  const {reservations, setReservations} = useData();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ id_etudiant: '', id_trajet: '', nombre_places: 1, commentaire: '' });
  const [filter, setFilter] = useState('all');

  const { etudiants, trajets, horaires, lignes, bus } = mockData;

  const getTrajetInfo = (id) => {
    const t = trajets.find(t => t.id === id);
    if (!t) return {};
    const h = horaires.find(h => h.id === t.id_horaire);
    const l = h ? lignes.find(l => l.id === h.id_ligne) : null;
    const b = bus.find(b => b.id === t.id_bus);
    return { t, h, l, b };
  };

  const filtered = filter === 'all' ? reservations : reservations.filter(r => r.statut === filter);

  const updateStatut = (id, statut) => setReservations(reservations.map(r => r.id === id ? { ...r, statut } : r));

  const add = () => {
    if (!form.id_etudiant || !form.id_trajet) return;
    const newR = {
      id: Date.now(),
      date_reservation: new Date().toISOString().split('T')[0],
      statut: 'en_attente',
      nombre_places: parseInt(form.nombre_places),
      commentaire: form.commentaire,
      id_etudiant: parseInt(form.id_etudiant),
      id_trajet: parseInt(form.id_trajet),
    };
    setReservations([...reservations, newR]);
    setModal(false);
  };

  const statutStyles = {
    en_attente: { cls: 'badge-orange', label: 'En attente' },
    confirmee: { cls: 'badge-green', label: 'Confirmée' },
    annulee: { cls: 'badge-red', label: 'Annulée' },
    expiree: { cls: 'badge-gray', label: 'Expirée' },
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Syne', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Gestion</div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Réservations</h1>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm({ id_etudiant: '', id_trajet: '', nombre_places: 1, commentaire: '' }); setModal(true); }}>
          + Nouvelle réservation
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total', value: reservations.length, color: '#3b82f6' },
          { label: 'En attente', value: reservations.filter(r => r.statut === 'en_attente').length, color: '#f97316' },
          { label: 'Confirmées', value: reservations.filter(r => r.statut === 'confirmee').length, color: '#10b981' },
          { label: 'Annulées', value: reservations.filter(r => r.statut === 'annulee').length, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent-color': s.color, padding: '18px 20px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['all', 'Toutes'], ['en_attente', 'En attente'], ['confirmee', 'Confirmées'], ['annulee', 'Annulées']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className="btn" style={{
            padding: '7px 14px', fontSize: 12,
            background: filter === v ? 'var(--accent)' : 'var(--surface2)',
            color: filter === v ? '#fff' : 'var(--text-muted)',
            border: `1px solid ${filter === v ? 'var(--accent)' : 'var(--border)'}`,
          }}>{l}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Ligne · Trajet</th>
              <th>Date réservation</th>
              <th>Places</th>
              <th>Commentaire</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const etudiant = etudiants.find(e => e.id === r.id_etudiant);
              const { l, h, t } = getTrajetInfo(r.id_trajet);
              const { cls, label } = statutStyles[r.statut] || { cls: 'badge-gray', label: r.statut };
              return (
                <tr key={r.id}>
                  <td style={{ color: 'var(--text)', fontWeight: 500 }}>{etudiant ? `${etudiant.prenom} ${etudiant.nom}` : '—'}</td>
                  <td>
                    <div style={{ color: 'var(--text)', fontSize: 13 }}>{l?.nom_ligne || '—'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{t?.date_trajet} {h ? `· ${h.heure_depart}` : ''}</div>
                  </td>
                  <td>{r.date_reservation}</td>
                  <td style={{ textAlign: 'center' }}>{r.nombre_places}</td>
                  <td style={{ maxWidth: 160 }}>{r.commentaire || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                  <td><span className={`badge ${cls}`}>{label}</span></td>
                  <td>
                    <select value={r.statut} onChange={e => updateStatut(r.id, e.target.value)} style={{ fontSize: 11, padding: '4px 8px', width: 'auto' }}>
                      <option value="en_attente">En attente</option>
                      <option value="confirmee">Confirmer</option>
                      <option value="annulee">Annuler</option>
                      <option value="expiree">Expirer</option>
                    </select>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Aucune réservation</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <h2 style={{ fontFamily: 'Syne', fontSize: 18, marginBottom: 20 }}>Nouvelle réservation</h2>
            <div className="form-group">
              <label className="form-label">Étudiant *</label>
              <select value={form.id_etudiant} onChange={e => setForm({ ...form, id_etudiant: e.target.value })}>
                <option value="">Sélectionner...</option>
                {etudiants.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom} — {e.matricule}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trajet *</label>
              <select value={form.id_trajet} onChange={e => setForm({ ...form, id_trajet: e.target.value })}>
                <option value="">Sélectionner...</option>
                {trajets.filter(t => t.etat !== 'annule').map(t => {
                  const { l, h } = getTrajetInfo(t.id);
                  return <option key={t.id} value={t.id}>{t.date_trajet} · {l?.nom_ligne || '?'} · {h?.heure_depart || '?'}</option>;
                })}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nombre de places</label>
              <input type="number" min="1" value={form.nombre_places} onChange={e => setForm({ ...form, nombre_places: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Commentaire</label>
              <input value={form.commentaire} onChange={e => setForm({ ...form, commentaire: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={add}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
