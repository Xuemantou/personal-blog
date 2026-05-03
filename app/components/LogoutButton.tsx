'use client';

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleLogout}
      className="md-icon-btn no-underline"
      title="退出登录"
      style={{ color: 'var(--md-on-surface-variant)' }}
    >
      🔓
    </button>
  );
}
