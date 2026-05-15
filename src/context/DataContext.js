import { createContext, useContext, useState } from 'react';
import { mockData } from '../data/mockData';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [etudiants,    setEtudiants]    = useState(mockData.etudiants);
  const [lignes,       setLignes]       = useState(mockData.lignes);
  const [stations,     setStations]     = useState(mockData.stations);
  const [bus,          setBus]          = useState(mockData.bus);
  const [horaires,     setHoraires]     = useState(mockData.horaires);
  const [trajets,      setTrajets]      = useState(mockData.trajets);
  const [reservations, setReservations] = useState(mockData.reservations);
  const [abonnements,  setAbonnements]  = useState(mockData.abonnements);
  const [incidents,    setIncidents]    = useState(mockData.incidents);
  const [affecter,     setAffecter]     = useState(mockData.affecter);
  const [desservir,    setDesservir]    = useState(mockData.desservir);

  return (
    <DataContext.Provider value={{
      etudiants,    setEtudiants,
      lignes,       setLignes,
      stations,     setStations,
      bus,          setBus,
      horaires,     setHoraires,
      trajets,      setTrajets,
      reservations, setReservations,
      abonnements,  setAbonnements,
      incidents,    setIncidents,
      affecter,     setAffecter,
      desservir,    setDesservir,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
