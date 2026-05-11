import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/',              icon: '◈', label: 'Tableau de bord'  },
  { href: '/etudiants',    icon: '◉', label: 'Étudiants'         },
  { href: '/lignes',       icon: '⬡', label: 'Lignes & Stations' },
  { href: '/bus',          icon: '▣', label: 'Bus & Affectations' },
  { href: '/trajets',      icon: '⬢', label: 'Trajets'            },
  { href: '/reservations', icon: '◈', label: 'Réservations'       },
  { href: '/incidents',    icon: '⚠', label: 'Incidents'          },
  { href: '/requetes',     icon: '≡', label: 'Requêtes SQL'        },
];

export default function Layout({ children }) {
  const router = useRouter();
  const [theme, setTheme] = useState('light');

  // Lire le thème sauvegardé au chargement
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const dark = theme === 'dark';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ─────────────────────────────
              SIDEBAR
      ───────────────────────────── */}
      <aside style={{
        width: 260,
        background: dark ? 'var(--surface)' : '#ffffff',
        borderRight: '1.5px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        padding: '28px 0',
        zIndex: 50,
        boxShadow: dark
          ? '4px 0 24px rgba(0,0,0,0.3)'
          : '4px 0 24px rgba(124,111,247,0.06)',
      }}>

        {/* Logo */}
        <div style={{
          padding: '0 24px 28px',
          borderBottom: '1.5px solid var(--border)',
          marginBottom: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              background: 'linear-gradient(135deg, #7c6ff7, #a78bfa)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 800,
              color: '#fff',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              boxShadow: '0 4px 14px rgba(124,111,247,0.35)',
              flexShrink: 0,
            }}>U</div>
            <div>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 800,
                fontSize: 15,
                color: 'var(--text)',
                letterSpacing: '-0.02em',
              }}>TransportUST</div>
              <div style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                fontWeight: 600,
                letterSpacing: '0.03em',
                marginTop: 1,
              }}>USTHB · BDD 2025</div>
            </div>
          </div>
        </div>

        {/* Label section */}
        <div style={{
          padding: '8px 24px 6px',
          fontSize: 10,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 700,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>Navigation</div>

        {/* Liens nav */}
        <nav style={{ flex: 1, padding: '4px 12px', overflowY: 'auto' }}>
          {navItems.map(({ href, icon, label }) => {
            const active = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '10px 14px',
                  borderRadius: 12,
                  marginBottom: 3,
                  background: active
                    ? dark
                      ? 'rgba(124,111,247,0.18)'
                      : 'linear-gradient(135deg, rgba(124,111,247,0.12), rgba(167,139,250,0.08))'
                    : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: active ? 700 : 500,
                  fontSize: 13.5,
                  transition: 'all 0.15s',
                  borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = dark
                      ? 'rgba(124,111,247,0.1)'
                      : 'rgba(124,111,247,0.05)';
                    e.currentTarget.style.color = 'var(--accent)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <span style={{
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  background: active ? 'rgba(124,111,247,0.15)' : 'transparent',
                  fontSize: 15,
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}>{icon}</span>

                {label}

                {active && (
                  <span style={{
                    marginLeft: 'auto',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    flexShrink: 0,
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ─────────────────────────────
            BOUTON DARK / LIGHT  ← ICI
            (entre nav et footer)
        ───────────────────────────── */}
        <div style={{ padding: '0 12px', marginBottom: 10 }}>
          <button
            onClick={toggleTheme}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 16px',
              borderRadius: 12,
              background: dark ? '#1a2332' : '#f5f3ff',
              border: '1.5px solid',
              borderColor: dark ? '#2d3748' : '#ddd6fe',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ fontSize: 17 }}>{dark ? '☀️' : '🌙'}</span>
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 700,
                fontSize: 13,
                color: dark ? '#a78bfa' : '#5b21b6',
              }}>
                {dark ? 'Mode clair' : 'Mode sombre'}
              </span>
            </div>

            {/* Switch animé */}
            <div style={{
              width: 38,
              height: 22,
              borderRadius: 100,
              background: dark
                ? 'linear-gradient(135deg, #7c6ff7, #a78bfa)'
                : '#ddd6fe',
              position: 'relative',
              transition: 'background 0.25s',
              flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute',
                top: 3,
                left: dark ? 19 : 3,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                transition: 'left 0.25s',
              }} />
            </div>
          </button>
        </div>

        {/* ─────────────────────────────
                FOOTER SIDEBAR
        ───────────────────────────── */}
        <div style={{
          margin: '0 12px',
          padding: '16px',
          borderRadius: 14,
          background: dark
            ? 'rgba(124,111,247,0.1)'
            : 'linear-gradient(135deg, #ede9fe, #fce7f3)',
          border: '1.5px solid',
          borderColor: dark ? 'rgba(124,111,247,0.2)' : '#ddd6fe',
        }}>
          <div style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 700,
            fontSize: 13,
            color: dark ? '#a78bfa' : '#5b21b6',
            marginBottom: 4,
          }}>Dr. LAHRECHE A.</div>
          <div style={{
            fontSize: 12,
            color: dark ? '#7c6ff7' : '#7c3aed',
            lineHeight: 1.6,
            fontWeight: 500,
          }}>
            Faculté d'Informatique<br />
            2ème Année Ingéniorat<br />
            Deadline : 31/05/2026
          </div>
        </div>

      </aside>

      {/* ─────────────────────────────
            CONTENU PRINCIPAL
      ───────────────────────────── */}
      <main style={{
        marginLeft: 260,
        flex: 1,
        padding: '36px 40px',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
      }}>
        {children}
      </main>

    </div>
  );
}
