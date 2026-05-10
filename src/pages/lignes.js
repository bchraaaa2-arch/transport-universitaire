import { useState } from 'react';
import Layout from '../components/Layout';
import { mockData } from '../data/mockData';

export default function Lignes() {
  const [tab, setTab] = useState('lignes');
  const [lignes, setLignes] = useState(mockData.lignes);
  const [stations, setStations] = useState(mockData.stations);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [selectedLigne, setSelectedLigne] = useState(null);

  const desservir = mockData.desservir || [];
  const horaires = mockData.horaires;

  const getLigneStations = (id) => {
    const entries = desservir.filter ? desservir.filter(d => d.id_ligne === id) : [];
    return entries.map(d => stations.find(s => s.id === d.id_station)).filter(Boolean);
  };

  const getLigneHoraires = (id) => horaires.filter(h => h.id_ligne === id);

  const openAdd = (type) => {
    const defaults = type === 'ligne'
      ? { code_ligne: '', nom_ligne: '', description: '' }
      : { nom_station: '', localisation: '', type: 'arret' };
    setForm({ _type: type, ...defaults });
    setModal('add');
  };

  const save = () => {
    if (form._type === 'ligne') {
      const newL = { id: Date.now(), code_ligne: form.code_ligne, nom_ligne: form.nom_ligne, description: form.description };
      setLignes([...lignes, newL]);
    } else {
      const newS = { id: Date.now(), nom_station: form.nom_station, localisation: form.localisation, type: form.type };
      setStations([...stations, newS]);
    }
    setModal(null);
  };

  const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Syne', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Réseau</div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Lignes & Stations</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => openAdd('station')}>+ Station</button>
          <button className="btn btn-primary" onClick={() => openAdd('ligne')}>+ Ligne</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, width: 'fit-content', marginBottom: 24 }}>
        {['lignes', 'stations', 'horaires'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 18px', borderRadius: 7, fontFamily: 'Syne', fontWeight: 600, fontSize: 12,
            background: tab === t ? 'var(--accent)' : 'transparent',
            color: tab === t ? '#fff' : 'var(--text-muted)',
            textTransform: 'capitalize', transition: 'all .15s',
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'lignes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {lignes.map(l => {
            const hs = getLigneHoraires(l.id);
            const aboCount = mockData.abonnements.filter(a => a.id_ligne === l.id && a.statut === 'actif').length;
            return (
              <div key={l.id} className="card" style={{ cursor: 'pointer', transition: 'border-color .15s' }}
                onClick={() => setSelectedLigne(selectedLigne?.id === l.id ? null : l)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                    color: '#fff', padding: '4px 10px', borderRadius: 6,
                    fontFamily: 'Syne', fontWeight: 700, fontSize: 12,
                  }}>{l.code_ligne}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hs.length} horaire(s)</span>
                </div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 6 }}>{l.nom_ligne}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>{l.description || 'Aucune description'}</div>
                <div style={{ display: 'flex', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--accent)', fontSize: 18 }}>{aboCount}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Abonnés</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--accent2)', fontSize: 18 }}>{hs.length}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Horaires</div>
                  </div>
                </div>
                {selectedLigne?.id === l.id && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, fontFamily: 'Syne', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Horaires</div>
                    {hs.length === 0 ? <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Aucun horaire</div> : hs.map(h => (
                      <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12, color: 'var(--text-dim)' }}>
                        <span style={{ textTransform: 'capitalize' }}>{h.jour_semaine}</span>
                        <span style={{ fontFamily: 'monospace' }}>{h.heure_depart} → {h.heure_arrivee || '?'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'stations' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nom de la station</th>
                <th>Localisation</th>
                <th>Type</th>
                <th>Lignes desservies</th>
              </tr>
            </thead>
            <tbody>
              {stations.map(s => {
                const lignesDes = mockData.desservir
                  ? mockData.desservir.filter(d => d.id_station === s.id).map(d => lignes.find(l => l.id === d.id_ligne)).filter(Boolean)
                  : [];
                return (
                  <tr key={s.id}>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{s.id}</td>
                    <td style={{ color: 'var(--text)', fontWeight: 500 }}>{s.nom_station}</td>
                    <td>{s.localisation}</td>
                    <td>
                      <span className={`badge ${s.type === 'terminus' ? 'badge-blue' : 'badge-gray'}`}>{s.type}</span>
                    </td>
                    <td>
                      {lignesDes.length === 0
                        ? <span style={{ color: 'var(--text-muted)' }}>—</span>
                        : lignesDes.map(l => <span key={l.id} className="badge badge-green" style={{ marginRight: 4 }}>{l.code_ligne}</span>)
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'horaires' && (
        <div style={{ display: 'grid', gap: 20 }}>
          {lignes.map(l => {
            const hs = getLigneHoraires(l.id);
            return (
              <div key={l.id} className="card">
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ background: 'var(--accent)', color: '#fff', padding: '2px 8px', borderRadius: 5, fontSize: 12 }}>{l.code_ligne}</span>
                  {l.nom_ligne}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                  {jours.map(j => {
                    const dayH = hs.filter(h => h.jour_semaine === j);
                    return (
                      <div key={j} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
                        <div style={{ fontSize: 10, fontFamily: 'Syne', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{j.slice(0, 3)}</div>
                        {dayH.length === 0
                          ? <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</div>
                          : dayH.map(h => (
                            <div key={h.id} style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'monospace', marginTop: 2 }}>{h.heure_depart}</div>
                          ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h2 style={{ fontFamily: 'Syne', fontSize: 18, marginBottom: 20 }}>
              {form._type === 'ligne' ? 'Nouvelle ligne' : 'Nouvelle station'}
            </h2>
            {form._type === 'ligne' ? (
              <>
                <div className="form-group"><label className="form-label">Code ligne *</label><input value={form.code_ligne} onChange={e => setForm({ ...form, code_ligne: e.target.value })} placeholder="ex: L04" /></div>
                <div className="form-group"><label className="form-label">Nom de la ligne *</label><input value={form.nom_ligne} onChange={e => setForm({ ...form, nom_ligne: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Description</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              </>
            ) : (
              <>
                <div className="form-group"><label className="form-label">Nom de la station *</label><input value={form.nom_station} onChange={e => setForm({ ...form, nom_station: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Localisation</label><input value={form.localisation} onChange={e => setForm({ ...form, localisation: e.target.value })} /></div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="arret">Arrêt</option>
                    <option value="terminus">Terminus</option>
                  </select>
                </div>
              </>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
