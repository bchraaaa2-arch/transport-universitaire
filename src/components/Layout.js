import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { href: '/', icon: '◈', label: 'Tableau de bord' },
  { href: '/etudiants', icon: '◉', label: 'Étudiants' },
  { href: '/lignes', icon: '⬡', label: 'Lignes & Stations' },
  { href: '/bus', icon: '▣', label: 'Bus & Affectations' },
  { href: '/trajets', icon: '⬢', label: 'Trajets' },
  { href: '/reservations', icon: '◈', label: 'Réservations' },
  { href: '/incidents', icon: '⚠', label: 'Incidents' },
  { href: '/requetes', icon: '≡', label: 'Requêtes SQL' },
];

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        padding: '24px 0',
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: '0 24px 28px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48,
              borderRadius: 14,
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(30,58,138,0.25)',
            }}>
              <Image
                src="/logo.png"
                alt="Naviguer logo"
                width={48}
                height={48}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.01em' }}>Naviguer</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', marginTop: 1 }}>USTHB · BDD 2025</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {navItems.map(({ href, icon, label }) => {
            const active = router.pathname === href;
            return (
              <Link key={href} href={href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 8,
                marginBottom: 2,
                background: active ? 'rgba(59,130,246,.12)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                fontFamily: 'Syne, sans-serif',
                fontWeight: active ? 600 : 400,
                fontSize: 13,
                transition: 'all 0.15s',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
              }}>
                <span style={{ fontSize: 16, opacity: active ? 1 : 0.5 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: 'var(--text-dim)' }}>Dr. LAHRECHE A.</div>
            <div>Faculté d'Informatique</div>
            <div>2ème Année Ingéniorat</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 240, flex: 1, padding: '32px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
