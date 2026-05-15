export default function Nav({ page, setPage, setSelectedId, darkMode, setDarkMode }) {
  const items = [
    { id: 'dashboard', label: '홈' },
    { id: 'list', label: '학생 목록' },
    { id: 'attendance', label: '출석 관리' },
    { id: 'grades', label: '성적 관리' },
    { id: 'counseling', label: '상담 관리' },
  ];

  const go = (id) => {
    setSelectedId(null);
    setPage(id);
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      borderBottom: '1px solid var(--color-cocoa-ink)',
      position: 'sticky',
      top: 0,
      background: 'var(--color-canvas-parchment)',
      zIndex: 100,
    }}>
      <button
        onClick={() => go('dashboard')}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '16px',
          fontWeight: 400,
          letterSpacing: '-0.3px',
          color: 'var(--color-cocoa-ink)',
        }}
      >
        1학년 8반
      </button>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => go(item.id)}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 400,
              color: 'var(--color-cocoa-ink)',
              paddingBottom: '2px',
              borderBottom: page === item.id
                ? '1px dashed var(--color-cocoa-ink)'
                : '1px dashed transparent',
            }}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={() => setDarkMode(d => !d)}
          title={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          style={{
            width: '28px',
            height: '28px',
            border: '1px solid var(--color-cocoa-ink)',
            background: darkMode ? 'var(--color-cocoa-ink)' : 'transparent',
            color: darkMode ? 'var(--color-canvas-parchment)' : 'var(--color-cocoa-ink)',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {darkMode ? '○' : '●'}
        </button>
      </div>
    </nav>
  );
}
