import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { href: '/',              icon: '⊞', label: 'Tableau de bord'   },
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Sidebar bleu marine ── */}
      <aside style={{
        width: 240,
        background: 'linear-gradient(180deg, #1a3a6b 0%, #122850 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        padding: '0',
        zIndex: 50,
        boxShadow: '4px 0 20px rgba(10,24,55,0.18)',
      }}>

        {/* Logo */}
        <div style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 46, height: 46,
              borderRadius: 12,
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              border: '2px solid rgba(255,255,255,0.2)',
            }}>
              <Image
                src="/logo.png"
                alt="Naviguer"
                width={46}
                height={46}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 800, fontSize: 16,
                color: '#ffffff',
                letterSpacing: '-0.01em',
              }}>Naviguer</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', marginTop: 1 }}>
                USTHB · BDD 2025
              </div>
            </div>
          </div>
        </div>

        {/* Label nav */}
        <div style={{
          padding: '20px 20px 8px',
          fontSize: 10, fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
        }}>
          Navigation
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '4px 12px', overflowY: 'auto' }}>
          {navItems.map(({ href, icon, label }) => {
            const active = router.pathname === href;
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, marginBottom: 2,
                background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.6)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: active ? 700 : 500,
                fontSize: 13.5,
                transition: 'all 0.15s',
                textDecoration: 'none',
                borderLeft: active ? '3px solid #60a5fa' : '3px solid transparent',
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
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                }
              }}>
                <span style={{
                  width: 30, height: 30,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 8,
                  background: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)',
                  fontSize: 14, flexShrink: 0,
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

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.15)',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 2 }}>
              Dr. LAHRECHE A.
            </div>
            <div>Faculté d'Informatique</div>
            <div>2ème Année Ingéniorat</div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ marginLeft: 240, flex: 1, padding: '32px', minHeight: '100vh', background: '#f0f4f8' }}>
        {children}
      </main>
    </div>
  );
}
