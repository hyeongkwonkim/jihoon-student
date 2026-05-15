import { useState } from 'react';
import { SUBJECTS } from '../data/students';

export default function Grades({ students, updateGrade }) {
  const [editing, setEditing] = useState(null); // { id, subj }
  const [editVal, setEditVal] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (subj) => {
    if (sortBy === subj) setSortAsc(a => !a);
    else { setSortBy(subj); setSortAsc(false); }
  };

  const sorted = [...students].sort((a, b) => {
    if (!sortBy) return a.number - b.number;
    const diff = (a.grades[sortBy] || 0) - (b.grades[sortBy] || 0);
    return sortAsc ? diff : -diff;
  });

  const startEdit = (id, subj, val) => {
    setEditing({ id, subj });
    setEditVal(String(val));
  };

  const commitEdit = () => {
    if (!editing) return;
    const num = parseInt(editVal, 10);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      updateGrade(editing.id, editing.subj, num);
    }
    setEditing(null);
  };

  const getAvg = (s) => {
    const sum = SUBJECTS.reduce((a, subj) => a + (s.grades[subj] || 0), 0);
    return Math.round(sum / SUBJECTS.length * 10) / 10;
  };

  const subjectAvg = (subj) => {
    const sum = students.reduce((a, s) => a + (s.grades[subj] || 0), 0);
    return Math.round(sum / students.length * 10) / 10;
  };

  return (
    <main style={{ padding: '56px 40px' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '27px',
        fontWeight: 400,
        letterSpacing: '-0.54px',
        lineHeight: 1,
        marginBottom: '12px',
        borderBottom: '1px solid var(--color-cocoa-ink)',
        paddingBottom: '20px',
      }}>
        성적 관리
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.5, marginBottom: '24px' }}>
        점수 셀 클릭 → 직접 수정 가능 · 과목명 클릭 → 정렬
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={thStyle({ width: '48px', textAlign: 'left' })}>번호</th>
              <th style={thStyle({ width: '80px', textAlign: 'left' })}>이름</th>
              {SUBJECTS.map(subj => (
                <th key={subj} style={thStyle({ cursor: 'pointer' })} onClick={() => handleSort(subj)}>
                  {subj}
                  {sortBy === subj && (
                    <span style={{ marginLeft: '4px', opacity: 0.6 }}>{sortAsc ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
              <th style={thStyle({ width: '60px' })}>평균</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(s => {
              const avg = getAvg(s);
              return (
                <tr key={s.id}>
                  <td style={tdStyle({ opacity: 0.5, fontSize: '13px' })}>{s.number}</td>
                  <td style={tdStyle({ fontFamily: 'var(--font-display)', fontSize: '14px' })}>{s.name}</td>
                  {SUBJECTS.map(subj => {
                    const isEditing = editing?.id === s.id && editing?.subj === subj;
                    const score = s.grades[subj] || 0;

                    return (
                      <td key={subj} style={tdStyle({ textAlign: 'center', cursor: 'pointer' })}>
                        {isEditing ? (
                          <input
                            autoFocus
                            type="number"
                            min={0}
                            max={100}
                            value={editVal}
                            onChange={e => setEditVal(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={e => {
                              if (e.key === 'Enter') commitEdit();
                              if (e.key === 'Escape') setEditing(null);
                            }}
                            style={{
                              width: '52px',
                              background: 'transparent',
                              border: 'none',
                              borderBottom: '1px solid var(--color-cocoa-ink)',
                              textAlign: 'center',
                              fontFamily: 'var(--font-display)',
                              fontSize: '16px',
                              color: 'var(--color-cocoa-ink)',
                            }}
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(s.id, subj, score)}
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '16px',
                              color: score < 80 ? 'var(--color-alert-crimson)' : 'var(--color-cocoa-ink)',
                              width: '52px',
                              textAlign: 'center',
                            }}
                          >
                            {score}
                          </button>
                        )}
                      </td>
                    );
                  })}
                  <td style={tdStyle({ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 400 })}>
                    {avg}
                  </td>
                </tr>
              );
            })}

            {/* 과목 평균 행 */}
            <tr style={{ background: 'var(--color-row-highlight)' }}>
              <td colSpan={2} style={tdStyle({ opacity: 0.5, fontSize: '13px', fontStyle: 'italic' })}>
                과목 평균
              </td>
              {SUBJECTS.map(subj => (
                <td key={subj} style={tdStyle({ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '16px', opacity: 0.6 })}>
                  {subjectAvg(subj)}
                </td>
              ))}
              <td style={tdStyle({})} />
            </tr>
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
    padding: '10px 8px',
    borderBottom: '1px solid var(--color-cocoa-ink)',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    ...extra,
  };
}

function tdStyle(extra = {}) {
  return {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    padding: '10px 8px',
    borderBottom: '1px solid var(--color-border-faint)',
    whiteSpace: 'nowrap',
    ...extra,
  };
}
