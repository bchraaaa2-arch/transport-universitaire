import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/',              icon: '◈', label: 'Tableau de bord'   },
  { href: '/etudiants',    icon: '◉', label: 'Étudiants'          },
  { href: '/lignes',       icon: '⬡', label: 'Lignes & Stations'  },
  { href: '/bus',          icon: '▣', label: 'Bus & Affectations'  },
  { href: '/trajets',      icon: '⬢', label: 'Trajets'             },
  { href: '/reservations', icon: '◈', label: 'Réservations'        },
  { href: '/incidents',    icon: '⚠', label: 'Incidents'           },
  { href: '/requetes',     icon: '≡', label: 'Requêtes SQL'         },
];

export default function Layout({ children }) {
  const router = useRouter();
  const [theme, setTheme] = useState('light');

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

      {/* ══ Sidebar bleu marine ══ */}
      <aside style={{
        width: 260,
        background: dark
          ? 'linear-gradient(180deg, #0d1f3c 0%, #070b14 100%)'
          : 'linear-gradient(180deg, #1a3a6b 0%, #122850 100%)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        padding: '0', zIndex: 50,
        boxShadow: '4px 0 24px rgba(10,24,55,0.22)',
      }}>

        {/* Logo */}
        <div style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.10)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 13,
              overflow: 'hidden', flexShrink: 0,
              boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
              border: '2px solid rgba(255,255,255,0.2)',
            }}>
              <Image
                src="/logo.png"
                alt="Naviguer"
                width={46} height={46}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 800, fontSize: 16, color: '#ffffff',
                letterSpacing: '-0.01em',
              }}>Naviguer</div>
              <div style={{
                fontSize: 10, color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.05em', marginTop: 1,
              }}>USTHB · BDD 2025</div>
            </div>
          </div>
        </div>

        {/* Label nav */}
        <div style={{
          padding: '18px 20px 8px',
          fontSize: 10, fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}>Navigation</div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '4px 12px', overflowY: 'auto' }}>
          {navItems.map(({ href, icon, label }) => {
            const active = router.pathname === href;
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 11,
                padding: '10px 13px', borderRadius: 11, marginBottom: 3,
                background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.55)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: active ? 700 : 500,
                fontSize: 13.5,
                transition: 'all 0.15s',
                borderLeft: active ? '3px solid #60a5fa' : '3px solid transparent',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                }
              }}>
                <span style={{
                  width: 30, height: 30,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 8,
                  background: active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
                  fontSize: 14, flexShrink: 0, transition: 'all 0.15s',
                }}>{icon}</span>
                {label}
                {active && (
                  <span style={{
                    marginLeft: 'auto', width: 6, height: 6,
                    borderRadius: '50%', background: '#60a5fa', flexShrink: 0,
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toggle dark/light */}
        <div style={{ padding: '12px 12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={toggleTheme} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '11px 14px', borderRadius: 12,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ fontSize: 16 }}>{dark ? '☀️' : '🌙'}</span>
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700,
                fontSize: 12.5, color: 'rgba(255,255,255,0.75)',
              }}>
                {dark ? 'Mode clair' : 'Mode sombre'}
              </span>
            </div>
            <div style={{
              width: 36, height: 20, borderRadius: 100,
              background: dark ? '#2563eb' : 'rgba(255,255,255,0.2)',
              position: 'relative', transition: 'background 0.25s', flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', top: 2, left: dark ? 18 : 2,
                width: 16, height: 16, borderRadius: '50%',
                background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                transition: 'left 0.25s',
              }} />
            </div>
          </button>
        </div>

      </aside>

      {/* ══ Main content ══ */}
      <main style={{
        marginLeft: 260, flex: 1,
        padding: '36px 40px', minHeight: '100vh',
        position: 'relative', zIndex: 1,
      }}>
        {children}
      </main>
    </div>
  );
}
