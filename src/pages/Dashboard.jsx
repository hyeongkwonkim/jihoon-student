import { useState } from 'react';
import { SCHOOL_DAYS, SUBJECTS } from '../data/students';

export default function Dashboard({ students, attendanceData, counselingData, setPage }) {
  const today = SCHOOL_DAYS[SCHOOL_DAYS.length - 1];

  const todayStats = students.reduce(
    (acc, s) => {
      const status = attendanceData[s.id]?.[today] || 'present';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  const totalPresent = todayStats.present || 0;
  const totalAbsent = todayStats.absent || 0;
  const totalLate = todayStats.late || 0;
  const totalEarly = todayStats.early || 0;

  const avgBySubject = SUBJECTS.map(subj => {
    const avg = students.reduce((sum, s) => sum + (s.grades[subj] || 0), 0) / students.length;
    return { subj, avg: Math.round(avg * 10) / 10 };
  });

  const overallAvg = Math.round(
    students.reduce((sum, s) => {
      const sAvg = SUBJECTS.reduce((a, subj) => a + (s.grades[subj] || 0), 0) / SUBJECTS.length;
      return sum + sAvg;
    }, 0) / students.length * 10
  ) / 10;

  return (
    <main>
      {/* Hero */}
      <section style={{
        padding: '80px 40px 60px',
        borderBottom: '1px solid var(--color-cocoa-ink)',
        overflow: 'hidden',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(72px, 12vw, 188px)',
          fontWeight: 400,
          lineHeight: 0.86,
          letterSpacing: 'clamp(-2px, -0.025em, -4.7px)',
          color: 'var(--color-cocoa-ink)',
          whiteSpace: 'nowrap',
        }}>
          1학년 8반
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 7vw, 135px)',
          fontWeight: 400,
          lineHeight: 0.86,
          letterSpacing: 'clamp(-1px, -0.025em, -3.375px)',
          color: 'var(--color-cocoa-ink)',
          marginTop: '20px',
          opacity: 0.35,
        }}>
          학생관리시스템
        </div>
        <div style={{
          marginTop: '40px',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          lineHeight: 1.33,
          color: 'var(--color-cocoa-ink)',
          display: 'flex',
          gap: '40px',
        }}>
          <span>전체 학생 30명</span>
          <span>2026학년도 1학기</span>
          <span>담임교사</span>
        </div>
      </section>

      {/* 오늘 출석 현황 */}
      <section style={{ padding: '56px 40px', borderBottom: '1px solid var(--color-cocoa-ink)' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '27px',
          fontWeight: 400,
          letterSpacing: '-0.54px',
          lineHeight: 1,
          marginBottom: '36px',
        }}>
          오늘의 출석 현황
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', marginBottom: '20px', opacity: 0.6 }}>
          기준일: {today}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--color-cocoa-ink)' }}>
          {[
            { label: '출석', value: totalPresent, color: 'var(--color-cocoa-ink)' },
            { label: '결석', value: totalAbsent, color: 'var(--color-alert-crimson)' },
            { label: '지각', value: totalLate, color: 'var(--color-cocoa-ink)' },
            { label: '조퇴', value: totalEarly, color: 'var(--color-cocoa-ink)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'var(--color-canvas-parchment)',
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.6 }}>{label}</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '56px',
                fontWeight: 400,
                lineHeight: 1,
                color,
              }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 성적 현황 */}
      <section style={{ padding: '56px 40px', borderBottom: '1px solid var(--color-cocoa-ink)' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '27px',
          fontWeight: 400,
          letterSpacing: '-0.54px',
          lineHeight: 1,
          marginBottom: '36px',
        }}>
          과목별 평균 성적
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: 'var(--color-cocoa-ink)' }}>
          {avgBySubject.map(({ subj, avg }) => (
            <div key={subj} style={{
              background: 'var(--color-canvas-parchment)',
              padding: '28px 20px',
            }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', marginBottom: '12px', opacity: 0.6 }}>{subj}</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '48px',
                fontWeight: 400,
                lineHeight: 1,
              }}>{avg}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '20px',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
        }}>
          <span style={{ opacity: 0.6 }}>전체 평균</span>
          <strong style={{ fontFamily: 'var(--font-display)' }}>{overallAvg}점</strong>
        </div>
      </section>

      {/* 빠른 이동 */}
      <section style={{ padding: '56px 40px' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '27px',
          fontWeight: 400,
          letterSpacing: '-0.54px',
          lineHeight: 1,
          marginBottom: '36px',
        }}>
          빠른 이동
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--color-cocoa-ink)' }}>
          {[
            { label: '학생 목록', desc: '30명 전체 학생 조회 및 개인 프로필', page: 'list' },
            { label: '출석 관리', desc: '일별 출석 현황 조회 및 수정', page: 'attendance' },
            { label: '성적 관리', desc: '과목별 성적 조회 및 수정', page: 'grades' },
            { label: '상담 관리', desc: '학생별 상담 기록 작성 및 조회', page: 'counseling' },
          ].map(item => (
            <QuickNavButton key={item.page} item={item} setPage={setPage} />
          ))}
        </div>
      </section>
    </main>
  );
}

function QuickNavButton({ item, setPage }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => setPage(item.page)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--color-cocoa-ink)' : 'var(--color-canvas-parchment)',
        padding: '32px 24px',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'background 0.15s',
        cursor: 'pointer',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '20px',
        fontWeight: 400,
        color: hovered ? 'var(--color-canvas-parchment)' : 'var(--color-cocoa-ink)',
      }}>
        {item.label}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        lineHeight: 1.4,
        color: hovered ? 'var(--color-canvas-parchment)' : 'var(--color-cocoa-ink)',
        opacity: 0.7,
      }}>
        {item.desc}
      </div>
    </button>
  );
}
