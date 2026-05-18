import '../styles/globals.css';
import { DataProvider } from '../context/DataContext';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  return (
    <DataProvider>
      <Component {...pageProps} />
    </DataProvider>
  );
}
