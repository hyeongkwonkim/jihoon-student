import { useState } from 'react';
import { SCHOOL_DAYS } from '../data/students';

export default function StudentList({ students, attendanceData, setPage, setSelectedId }) {
  const [query, setQuery] = useState('');

  const filtered = students.filter(s =>
    s.name.includes(query) || String(s.number).includes(query)
  );

  const getAbsentCount = (id) => {
    return Object.values(attendanceData[id] || {}).filter(v => v === 'absent').length;
  };

  return (
    <main style={{ padding: '56px 40px' }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '40px',
        borderBottom: '1px solid var(--color-cocoa-ink)',
        paddingBottom: '20px',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '27px',
          fontWeight: 400,
          letterSpacing: '-0.54px',
          lineHeight: 1,
        }}>
          학생 목록 — {filtered.length}명
        </div>

        {/* 검색 */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="이름 또는 번호 검색"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--color-cocoa-ink)',
              padding: '3px 60px 5px 0',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-cocoa-ink)',
              width: '220px',
            }}
          />
          <span style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '13px',
            opacity: 0.5,
          }}>검색</span>
        </div>
      </div>

      {/* 학생 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1px',
        background: 'var(--color-cocoa-ink)',
      }}>
        {filtered.map(s => {
          const absentCount = getAbsentCount(s.id);
          const hasIssue = absentCount >= 3;

          return (
            <button
              key={s.id}
              onClick={() => {
                setSelectedId(s.id);
                setPage('detail');
              }}
              style={{
                background: 'var(--color-canvas-parchment)',
                padding: '20px 16px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-cocoa-ink)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--color-canvas-parchment)'}
            >
              <StudentCardInner s={s} absentCount={absentCount} hasIssue={hasIssue} />
            </button>
          );
        })}
      </div>
    </main>
  );
}

function StudentCardInner({ s, absentCount, hasIssue }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: '100%' }}
    >
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        opacity: hovered ? 0.7 : 0.5,
        marginBottom: '4px',
        color: hovered ? 'var(--color-canvas-parchment)' : 'var(--color-cocoa-ink)',
      }}>
        {s.number}번 · {s.gender === 'M' ? '남' : '여'}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '18px',
        fontWeight: 400,
        lineHeight: 1.1,
        color: hovered ? 'var(--color-canvas-parchment)' : 'var(--color-cocoa-ink)',
      }}>
        {s.name}
      </div>
      {absentCount > 0 && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: hasIssue
            ? 'var(--color-alert-crimson)'
            : (hovered ? 'rgba(253,250,243,0.7)' : 'var(--color-cocoa-ink)'),
          marginTop: '4px',
          opacity: hasIssue ? 1 : 0.6,
        }}>
          결석 {absentCount}회
        </div>
      )}
    </div>
  );
}
