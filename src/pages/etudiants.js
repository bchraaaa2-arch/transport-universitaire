import { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../context/DataContext';

export default function Etudiants() {
  const { etudiants, setEtudiants, abonnements, lignes } = useData();

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ nom: '', prenom: '', matricule: '', email: '', telephone: '' });
  const [error, setError] = useState('');

  const activeAbos = abonnements.filter(a => a.statut === 'actif');

  const filtered = etudiants.filter(e =>
    [e.nom, e.prenom, e.matricule, e.email].some(v =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  );

  const openAdd = () => {
    setForm({ nom: '', prenom: '', matricule: '', email: '', telephone: '' });
    setError('');
    setModal('add');
  };

  const openEdit = (e) => {
    setForm({ ...e });
    setError('');
    setModal(e);
  };

  const save = () => {
    if (!form.nom || !form.prenom || !form.matricule || !form.email) {
      setError('Les champs nom, prénom, matricule et email sont obligatoires.');
      return;
    }
    if (modal === 'add') {
      setEtudiants([...etudiants, { ...form, id: Date.now() }]);
    } else {
      setEtudiants(etudiants.map(e => e.id === modal.id ? { ...e, ...form } : e));
    }
    setModal(null);
  };

  const del = (id) => {
    if (confirm('Supprimer cet étudiant ?'))
      setEtudiants(etudiants.filter(e => e.id !== id));
  };

  const getAbo = (id) => {
    const abo = activeAbos.find(a => a.id_etudiant === id);
    if (!abo) return null;
    return lignes.find(l => l.id === abo.id_ligne);
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Plus Jakarta Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Gestion</div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Étudiants</h1>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Ajouter un étudiant</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total inscrits',        value: etudiants.length,                                                                                          color: '#7c6ff7' },
          { label: 'Avec abonnement actif', value: etudiants.filter(e => activeAbos.find(a => a.id_etudiant === e.id)).length,                                color: '#10b981' },
          { label: 'Sans abonnement',       value: etudiants.filter(e => !activeAbos.find(a => a.id_etudiant === e.id)).length,                               color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent-color': s.color, padding: '18px 20px' }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--text)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <input
            placeholder="Rechercher par nom, matricule, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 360 }}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Matricule</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Ligne abonnée</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => {
              const ligne = getAbo(e.id);
              return (
                <tr key={e.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: `hsl(${(e.id * 47) % 360}, 55%, 85%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontWeight: 700, fontSize: 12,
                        color: `hsl(${(e.id * 47) % 360}, 55%, 35%)`,
                        flexShrink: 0,
                      }}>
                        {e.prenom[0]}{e.nom[0]}
                      </div>
                      <div style={{ color: 'var(--text)', fontWeight: 600 }}>
                        {e.prenom} {e.nom}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{e.matricule}</td>
                  <td>{e.email}</td>
                  <td>{e.telephone || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                  <td>
                    {ligne
                      ? <span className="badge badge-blue">{ligne.code_ligne}</span>
                      : <span className="badge badge-gray">Aucun</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => openEdit(e)}>Éditer</button>
                      <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => del(e.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  Aucun résultat
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, marginBottom: 20 }}>
              {modal === 'add' ? 'Ajouter un étudiant' : `Modifier ${modal.prenom} ${modal.nom}`}
            </h2>
            {error && (
              <div style={{ background: '#fff0f3', border: '1px solid #fecdd3', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: 'var(--red)', fontSize: 13 }}>
                {error}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { field: 'nom',       label: 'Nom *'       },
                { field: 'prenom',    label: 'Prénom *'    },
                { field: 'matricule', label: 'Matricule *' },
                { field: 'email',     label: 'Email *'     },
              ].map(({ field, label }) => (
                <div key={field} className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">{label}</label>
                  <input
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label">Téléphone</label>
              <input
                value={form.telephone}
                onChange={e => setForm({ ...form, telephone: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
