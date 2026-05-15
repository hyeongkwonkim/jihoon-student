import { useState } from 'react';
import { SCHOOL_DAYS, STATUS_SYMBOL, STATUS_LABEL } from '../data/students';

const STATUS_CYCLE = ['present', 'absent', 'late', 'early'];

function getMonths() {
  const months = new Set();
  SCHOOL_DAYS.forEach(d => months.add(d.slice(0, 7)));
  return [...months];
}

export default function Attendance({ students, attendanceData, updateAttendance }) {
  const months = getMonths();
  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

  const daysInMonth = SCHOOL_DAYS.filter(d => d.startsWith(selectedMonth));

  const toggle = (studentId, date) => {
    const cur = attendanceData[studentId]?.[date] || 'present';
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(cur) + 1) % STATUS_CYCLE.length];
    updateAttendance(studentId, date, next);
  };

  const getMonthlySummary = (studentId) => {
    const counts = { present: 0, absent: 0, late: 0, early: 0 };
    daysInMonth.forEach(d => {
      const s = attendanceData[studentId]?.[d] || 'present';
      counts[s]++;
    });
    return counts;
  };

  return (
    <main style={{ padding: '56px 40px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '32px',
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
          출석 관리
        </div>

        {/* 월 선택 */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {months.map(m => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                padding: '4px 12px',
                border: '1px solid var(--color-cocoa-ink)',
                background: selectedMonth === m ? 'var(--color-cocoa-ink)' : 'transparent',
                color: selectedMonth === m ? 'var(--color-canvas-parchment)' : 'var(--color-cocoa-ink)',
              }}
            >
              {m.slice(5)}월
            </button>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {STATUS_CYCLE.map(s => (
          <span key={s} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.7 }}>
            {STATUS_SYMBOL[s]} {STATUS_LABEL[s]}
          </span>
        ))}
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.5 }}>
          (셀 클릭으로 변경)
        </span>
      </div>

      {/* 테이블 */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: `${120 + daysInMonth.length * 40}px` }}>
          <thead>
            <tr>
              <th style={thStyle({ width: '80px', textAlign: 'left' })}>번호</th>
              <th style={thStyle({ width: '80px', textAlign: 'left' })}>이름</th>
              {daysInMonth.map(d => (
                <th key={d} style={thStyle({ width: '40px', fontSize: '14px', opacity: 0.6 })}>
                  {d.slice(8)}
                </th>
              ))}
              <th style={thStyle({ width: '60px' })}>출석</th>
              <th style={thStyle({ width: '60px' })}>결석</th>
              <th style={thStyle({ width: '60px' })}>지각</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => {
              const summary = getMonthlySummary(s.id);
              return (
                <tr key={s.id}>
                  <td style={tdStyle({ fontSize: '13px', opacity: 0.6 })}>{s.number}</td>
                  <td style={tdStyle({ fontFamily: 'var(--font-display)', fontSize: '14px' })}>{s.name}</td>
                  {daysInMonth.map(d => {
                    const status = attendanceData[s.id]?.[d] || 'present';
                    return (
                      <td key={d} style={{ ...tdStyle({}), textAlign: 'center', padding: '6px 2px', cursor: 'pointer' }}>
                        <button
                          onClick={() => toggle(s.id, d)}
                          title={`${s.name} ${d} — 클릭하여 변경`}
                          style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            margin: '0 auto',
                            color: status === 'absent'
                              ? 'var(--color-alert-crimson)'
                              : status === 'late'
                              ? 'var(--color-cocoa-ink)'
                              : 'var(--color-cocoa-ink)',
                            opacity: status === 'present' ? 0.4 : 1,
                            border: status !== 'present' ? '1px solid currentColor' : '1px solid transparent',
                          }}
                        >
                          {STATUS_SYMBOL[status]}
                        </button>
                      </td>
                    );
                  })}
                  <td style={tdStyle({ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '14px' })}>{summary.present}</td>
                  <td style={tdStyle({
                    textAlign: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: '14px',
                    color: summary.absent > 0 ? 'var(--color-alert-crimson)' : undefined,
                  })}>
                    {summary.absent || '—'}
                  </td>
                  <td style={tdStyle({ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '14px' })}>
                    {summary.late || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function thStyle(extra = {}) {
  return {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    fontWeight: 400,
    opacity: 0.7,
    padding: '8px 6px',
    borderBottom: '1px solid var(--color-cocoa-ink)',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    ...extra,
  };
}

function tdStyle(extra = {}) {
  return {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    padding: '8px 6px',
    borderBottom: '1px solid var(--color-border-faint)',
    whiteSpace: 'nowrap',
    ...extra,
  };
}
