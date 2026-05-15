import { useState } from 'react';
import Layout from '../components/Layout';
import { mockData } from '../data/mockData';
import { useData } from '../context/DataContext';

export default function Bus() {
  const {bus, setBus} = useData();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ matricule_bus: '', capacite_max: '', modele: '', statut: 'actif' });

  const affecter = mockData.affecter;
  const lignes = mockData.lignes;

  const getAff = (id) => {
    const aff = affecter.find(a => a.id_bus === id && a.statut === 'actif');
    if (!aff) return null;
    return lignes.find(l => l.id === aff.id_ligne);
  };

  const save = () => {
    if (!form.matricule_bus || !form.capacite_max) return;
    if (modal === 'add') {
      setBus([...bus, { ...form, id: Date.now(), capacite_max: parseInt(form.capacite_max) }]);
    } else {
      setBus(bus.map(b => b.id === modal.id ? { ...b, ...form, capacite_max: parseInt(form.capacite_max) } : b));
    }
    setModal(null);
  };

  const toggle = (id) => {
    setBus(bus.map(b => b.id === id ? { ...b, statut: b.statut === 'actif' ? 'maintenance' : 'actif' } : b));
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Syne', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Flotte</div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Bus & Affectations</h1>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm({ matricule_bus: '', capacite_max: '', modele: '', statut: 'actif' }); setModal('add'); }}>+ Ajouter un bus</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total flotte', value: bus.length, color: '#3b82f6' },
          { label: 'En service', value: bus.filter(b => b.statut === 'actif').length, color: '#10b981' },
          { label: 'En maintenance', value: bus.filter(b => b.statut === 'maintenance').length, color: '#ef4444' },
          { label: 'Capacité totale', value: bus.filter(b => b.statut === 'actif').reduce((s, b) => s + b.capacite_max, 0), color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent-color': s.color, padding: '18px 20px' }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Syne' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {bus.map(b => {
          const ligne = getAff(b.id);
          const isActif = b.statut === 'actif';
          return (
            <div key={b.id} className="card" style={{ borderLeft: `3px solid ${isActif ? 'var(--green)' : 'var(--red)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{b.matricule_bus}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{b.modele}</div>
                </div>
                <span className={`badge ${isActif ? 'badge-green' : 'badge-red'}`}>{isActif ? 'Actif' : 'Maintenance'}</span>
              </div>

              <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'Syne', letterSpacing: '0.04em' }}>Capacité</div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>{b.capacite_max}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>places</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'Syne', letterSpacing: '0.04em' }}>Ligne affectée</div>
                  {ligne
                    ? <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--accent)', marginTop: 4 }}>{ligne.nom_ligne}</div>
                    : <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Non affecté</div>}
                </div>
              </div>

              {/* History */}
              <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontFamily: 'Syne', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Historique des affectations</div>
                {affecter.filter(a => a.id_bus === b.id).map((a, i) => {
                  const l = lignes.find(l => l.id === a.id_ligne);
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-dim)', padding: '2px 0' }}>
                      <span>{l?.nom_ligne || '—'}</span>
                      <span style={{ color: a.statut === 'actif' ? 'var(--green)' : 'var(--text-muted)', fontFamily: 'Syne', fontWeight: 600 }}>
                        {a.date_debut} → {a.date_fin || 'Aujourd\'hui'}
                      </span>
                    </div>
                  );
                })}
                {affecter.filter(a => a.id_bus === b.id).length === 0 && (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Aucune affectation</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12, justifyContent: 'center' }}
                  onClick={() => { setForm({ ...b, capacite_max: String(b.capacite_max) }); setModal(b); }}>
                  Éditer
                </button>
                <button
                  className="btn"
                  style={{ flex: 1, fontSize: 12, justifyContent: 'center', background: isActif ? 'rgba(239,68,68,.1)' : 'rgba(16,185,129,.1)', color: isActif ? 'var(--red)' : 'var(--green)', border: `1px solid ${isActif ? 'rgba(239,68,68,.2)' : 'rgba(16,185,129,.2)'}` }}
                  onClick={() => toggle(b.id)}>
                  {isActif ? '⚙ Maintenance' : '✓ Activer'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h2 style={{ fontFamily: 'Syne', fontSize: 18, marginBottom: 20 }}>{modal === 'add' ? 'Ajouter un bus' : 'Modifier le bus'}</h2>
            <div className="form-group"><label className="form-label">Matricule *</label><input value={form.matricule_bus} onChange={e => setForm({ ...form, matricule_bus: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Modèle</label><input value={form.modele} onChange={e => setForm({ ...form, modele: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Capacité max *</label><input type="number" value={form.capacite_max} onChange={e => setForm({ ...form, capacite_max: e.target.value })} /></div>
            <div className="form-group">
              <label className="form-label">Statut</label>
              <select value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
                <option value="actif">Actif</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
