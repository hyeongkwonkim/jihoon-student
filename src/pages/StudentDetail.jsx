import { useState } from 'react';
import { SUBJECTS, STATUS_LABEL, STATUS_SYMBOL, SCHOOL_DAYS } from '../data/students';
import { COUNSELING_TYPES } from '../data/counseling';

export default function StudentDetail({ students, attendanceData, counselingData, selectedId, updateStudent, addCounseling, deleteCounseling, setPage }) {
  const student = students.find(s => s.id === selectedId);
  const [editingNotes, setEditingNotes] = useState(false);
  const [editingSpecial, setEditingSpecial] = useState(false);
  const [notesVal, setNotesVal] = useState(student?.notes || '');
  const [specialVal, setSpecialVal] = useState(student?.specialNotes || '');

  if (!student) return null;

  const attendance = attendanceData[student.id] || {};
  const counts = { present: 0, absent: 0, late: 0, early: 0 };
  Object.values(attendance).forEach(v => { if (counts[v] !== undefined) counts[v]++; });

  const avgGrade = Math.round(
    SUBJECTS.reduce((sum, subj) => sum + (student.grades[subj] || 0), 0) / SUBJECTS.length * 10
  ) / 10;

  const saveNotes = () => {
    updateStudent(student.id, { notes: notesVal });
    setEditingNotes(false);
  };

  const saveSpecial = () => {
    updateStudent(student.id, { specialNotes: specialVal });
    setEditingSpecial(false);
  };

  // 최근 출석 5일
  const recentDays = SCHOOL_DAYS.slice(-5);

  return (
    <main style={{ padding: '56px 40px' }}>
      {/* 뒤로 */}
      <button
        onClick={() => setPage('list')}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: 'var(--color-cocoa-ink)',
          opacity: 0.6,
          marginBottom: '32px',
          display: 'block',
          paddingBottom: '2px',
          borderBottom: '1px dashed var(--color-cocoa-ink)',
        }}
      >
        ← 학생 목록으로
      </button>

      {/* 이름 헤더 */}
      <div style={{
        borderBottom: '1px solid var(--color-cocoa-ink)',
        paddingBottom: '32px',
        marginBottom: '48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.5, marginBottom: '8px' }}>
            {student.number}번 · {student.gender === 'M' ? '남학생' : '여학생'}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 135px)',
            fontWeight: 400,
            lineHeight: 0.86,
            letterSpacing: '-3.375px',
          }}>
            {student.name}
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '56px',
          fontWeight: 400,
          lineHeight: 1,
          opacity: 0.3,
        }}>
          {avgGrade}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--color-cocoa-ink)' }}>

        {/* 개인정보 */}
        <section style={{ background: 'var(--color-canvas-parchment)', padding: '32px 28px' }}>
          <SectionTitle>개인 정보</SectionTitle>
          <InfoRow label="생년월일" value={student.birthdate} />
          <InfoRow label="성별" value={student.gender === 'M' ? '남' : '여'} />
          <InfoRow label="주소" value={student.address} />
          <InfoRow label={`보호자 (${student.parent.relation})`} value={student.parent.name} />
          <InfoRow label="연락처" value={student.parent.phone} />
        </section>

        {/* 출석 요약 */}
        <section style={{ background: 'var(--color-canvas-parchment)', padding: '32px 28px' }}>
          <SectionTitle>출석 현황</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--color-cocoa-ink)', marginTop: '20px' }}>
            {Object.entries(counts).map(([status, count]) => (
              <div key={status} style={{ background: 'var(--color-canvas-parchment)', padding: '16px 12px' }}>
                <div style={{ fontSize: '14px', opacity: 0.5, fontFamily: 'var(--font-body)', marginBottom: '6px' }}>
                  {STATUS_LABEL[status]}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '36px',
                  lineHeight: 1,
                  color: status === 'absent' && count > 0 ? 'var(--color-alert-crimson)' : 'var(--color-cocoa-ink)',
                }}>
                  {count}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '14px', opacity: 0.5, marginBottom: '8px', fontFamily: 'var(--font-body)' }}>최근 5일</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {recentDays.map(day => {
                const st = attendance[day] || 'present';
                return (
                  <div key={day} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <div style={{ fontSize: '14px', opacity: 0.5 }}>{day.slice(5)}</div>
                    <div style={{
                      fontSize: '18px',
                      color: st === 'absent' ? 'var(--color-alert-crimson)' : 'var(--color-cocoa-ink)',
                    }}>
                      {STATUS_SYMBOL[st]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 성적 */}
        <section style={{ background: 'var(--color-canvas-parchment)', padding: '32px 28px' }}>
          <SectionTitle>성적</SectionTitle>
          <div style={{ marginTop: '20px' }}>
            {SUBJECTS.map(subj => {
              const score = student.grades[subj] || 0;
              return (
                <div key={subj} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--color-border-subtle)',
                }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>{subj}</span>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    fontWeight: 400,
                    color: score < 80 ? 'var(--color-alert-crimson)' : 'var(--color-cocoa-ink)',
                  }}>
                    {score}
                  </span>
                </div>
              );
            })}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '12px',
            }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.6 }}>평균</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '27px' }}>{avgGrade}</span>
            </div>
          </div>
        </section>

        {/* 메모 & 특이사항 */}
        <section style={{ background: 'var(--color-canvas-parchment)', padding: '32px 28px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <SectionTitle style={{ marginBottom: 0 }}>선생님 메모</SectionTitle>
              {!editingNotes ? (
                <button
                  onClick={() => { setNotesVal(student.notes); setEditingNotes(true); }}
                  style={{ fontSize: '13px', opacity: 0.5, borderBottom: '1px dashed var(--color-cocoa-ink)', paddingBottom: '1px' }}
                >
                  수정
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={saveNotes} style={{ fontSize: '13px', borderBottom: '1px dashed var(--color-cocoa-ink)', paddingBottom: '1px' }}>저장</button>
                  <button onClick={() => setEditingNotes(false)} style={{ fontSize: '13px', opacity: 0.4 }}>취소</button>
                </div>
              )}
            </div>
            {editingNotes ? (
              <textarea
                value={notesVal}
                onChange={e => setNotesVal(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid var(--color-cocoa-ink)',
                  padding: '8px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  color: 'var(--color-cocoa-ink)',
                }}
              />
            ) : (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6, opacity: student.notes ? 1 : 0.4 }}>
                {student.notes || '메모 없음'}
              </p>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <SectionTitle style={{ marginBottom: 0 }}>특이사항</SectionTitle>
              {!editingSpecial ? (
                <button
                  onClick={() => { setSpecialVal(student.specialNotes); setEditingSpecial(true); }}
                  style={{ fontSize: '13px', opacity: 0.5, borderBottom: '1px dashed var(--color-cocoa-ink)', paddingBottom: '1px' }}
                >
                  수정
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={saveSpecial} style={{ fontSize: '13px', borderBottom: '1px dashed var(--color-cocoa-ink)', paddingBottom: '1px' }}>저장</button>
                  <button onClick={() => setEditingSpecial(false)} style={{ fontSize: '13px', opacity: 0.4 }}>취소</button>
                </div>
              )}
            </div>
            {editingSpecial ? (
              <textarea
                value={specialVal}
                onChange={e => setSpecialVal(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid var(--color-alert-crimson)',
                  padding: '8px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  color: 'var(--color-cocoa-ink)',
                }}
              />
            ) : (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                lineHeight: 1.6,
                color: student.specialNotes ? 'var(--color-alert-crimson)' : 'var(--color-cocoa-ink)',
                opacity: student.specialNotes ? 1 : 0.4,
              }}>
                {student.specialNotes || '특이사항 없음'}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* 상담 기록 */}
      <CounselingSection
        student={student}
        records={counselingData[student.id] || []}
        addCounseling={addCounseling}
        deleteCounseling={deleteCounseling}
      />
    </main>
  );
}

function CounselingSection({ student, records, addCounseling, deleteCounseling }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: '', type: '학습', content: '', action: '', nextDate: '' });

  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.content) return;
    addCounseling(student.id, {
      id: `c${student.id}-${Date.now()}`,
      ...form,
    });
    setForm({ date: '', type: '학습', content: '', action: '', nextDate: '' });
    setShowForm(false);
  };

  return (
    <section style={{
      marginTop: '1px',
      background: 'var(--color-canvas-parchment)',
      border: '1px solid var(--color-cocoa-ink)',
      padding: '32px 28px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <SectionTitle>상담 기록 ({records.length}건)</SectionTitle>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            paddingBottom: '1px',
            borderBottom: '1px dashed var(--color-cocoa-ink)',
            opacity: 0.7,
          }}
        >
          {showForm ? '취소' : '+ 새 기록'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px 24px',
          marginBottom: '28px',
          padding: '20px',
          border: '1px solid var(--color-border-subtle)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.5 }}>날짜</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              required style={miniInputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.5 }}>유형</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {COUNSELING_TYPES.map(t => (
                <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                  style={{
                    fontFamily: 'var(--font-body)', fontSize: '11px', padding: '3px 8px',
                    border: '1px solid var(--color-cocoa-ink)',
                    background: form.type === t ? 'var(--color-cocoa-ink)' : 'transparent',
                    color: form.type === t ? 'var(--color-canvas-parchment)' : 'var(--color-cocoa-ink)',
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.5 }}>상담 내용</label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              required rows={3} placeholder="상담 내용" style={{ ...miniInputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.5 }}>조치사항</label>
            <textarea value={form.action} onChange={e => setForm(f => ({ ...f, action: e.target.value }))}
              rows={2} placeholder="조치사항 (선택)" style={{ ...miniInputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.5 }}>다음 상담 예정일</label>
            <input type="date" value={form.nextDate} onChange={e => setForm(f => ({ ...f, nextDate: e.target.value }))}
              style={miniInputStyle} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" style={{
              fontFamily: 'var(--font-body)', fontSize: '13px',
              padding: '8px 20px',
              background: 'var(--color-cocoa-ink)',
              color: 'var(--color-canvas-parchment)',
              border: 'none', cursor: 'pointer', width: '100%',
            }}>
              저장
            </button>
          </div>
        </form>
      )}

      {sorted.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.4 }}>상담 기록이 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--color-cocoa-ink)' }}>
          {sorted.map(r => (
            <div key={r.id} style={{
              background: 'var(--color-canvas-parchment)',
              padding: '16px',
              display: 'grid',
              gridTemplateColumns: '100px 60px 1fr auto',
              gap: '12px',
              alignItems: 'start',
            }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.5 }}>{r.date}</span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '11px', padding: '2px 6px',
                border: `1px solid ${r.type === '건강' ? 'var(--color-alert-crimson)' : 'var(--color-cocoa-ink)'}`,
                color: r.type === '건강' ? 'var(--color-alert-crimson)' : 'var(--color-cocoa-ink)',
                textAlign: 'center',
              }}>{r.type}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.6 }}>{r.content}</p>
                {r.action && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.6, lineHeight: 1.5 }}>
                    조치: {r.action}
                  </p>
                )}
                {r.nextDate && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-alert-crimson)' }}>
                    다음 상담: {r.nextDate}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteCounseling(student.id, r.id)}
                style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.35, alignSelf: 'start' }}
                title="삭제"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const miniInputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--color-cocoa-ink)',
  padding: '4px 0',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  color: 'var(--color-cocoa-ink)',
};

function SectionTitle({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-body)',
      fontSize: '14px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      opacity: 0.5,
      marginBottom: '16px',
    }}>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid var(--color-border-faint)',
      gap: '16px',
    }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.5, whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', textAlign: 'right' }}>{value}</span>
    </div>
  );
}
