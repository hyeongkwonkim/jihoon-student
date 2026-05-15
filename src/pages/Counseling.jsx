import { useState } from 'react';
import { COUNSELING_TYPES } from '../data/counseling';
import { AI_KEYWORDS, generateCounselingRecord } from '../data/aiCounseling';

const EMPTY_FORM = { studentId: '', date: '', type: '학습', content: '', action: '', nextDate: '' };

export default function Counseling({ students, counselingData, addCounseling, deleteCounseling, setPage, setSelectedId }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterStudentId, setFilterStudentId] = useState('');
  const [filterType, setFilterType] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // AI 상태
  const [aiKeywords, setAiKeywords] = useState([]);
  const [aiMemo, setAiMemo] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const toggleKeyword = (kw) => {
    setAiKeywords(prev =>
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
    );
  };

  const handleAiGenerate = async () => {
    if (!form.studentId) { setAiError('먼저 학생을 선택해주세요.'); return; }
    if (aiKeywords.length === 0 && !aiMemo.trim()) { setAiError('키워드나 메모 중 하나는 입력해주세요.'); return; }
    const student = students.find(s => s.id === Number(form.studentId));
    setAiLoading(true);
    setAiError('');
    try {
      const result = await generateCounselingRecord({
        studentName: student.name,
        type: form.type,
        keywords: aiKeywords,
        memo: aiMemo,
      });
      setForm(f => ({ ...f, content: result.content, action: result.action }));
    } catch (e) {
      setAiError(e.message);
    } finally {
      setAiLoading(false);
    }
  };

  // 전체 기록 최신순 정렬
  const allRecords = [];
  Object.entries(counselingData).forEach(([sid, records]) => {
    const student = students.find(s => s.id === Number(sid));
    if (!student) return;
    records.forEach(r => allRecords.push({ ...r, student }));
  });
  allRecords.sort((a, b) => b.date.localeCompare(a.date));

  const filtered = allRecords.filter(r => {
    if (filterStudentId && r.student.id !== Number(filterStudentId)) return false;
    if (filterType && r.type !== filterType) return false;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.studentId || !form.date || !form.content) return;
    addCounseling(Number(form.studentId), {
      id: `c${form.studentId}-${Date.now()}`,
      date: form.date,
      type: form.type,
      content: form.content,
      action: form.action,
      nextDate: form.nextDate,
    });
    setForm(EMPTY_FORM);
  };

  const goToStudent = (student) => {
    setSelectedId(student.id);
    setPage('detail');
  };

  const exportCSV = () => {
    const header = '번호,이름,상담날짜,유형,상담내용,조치사항,다음상담예정일';
    const rows = [...allRecords]
      .sort((a, b) => a.student.number - b.student.number || a.date.localeCompare(b.date))
      .map(r => [
        r.student.number,
        r.student.name,
        r.date,
        r.type,
        `"${r.content.replace(/"/g, '""')}"`,
        `"${(r.action || '').replace(/"/g, '""')}"`,
        r.nextDate || '',
      ].join(','));

    const csv = '﻿' + [header, ...rows].join('\n'); // BOM: 엑셀 한글 깨짐 방지
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `상담기록_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main style={{ padding: '56px 40px' }}>
      {/* 헤더 */}
      <div style={{
        borderBottom: '1px solid var(--color-cocoa-ink)',
        paddingBottom: '20px',
        marginBottom: '48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '27px',
            fontWeight: 400,
            letterSpacing: '-0.54px',
            lineHeight: 1,
          }}>
            상담 관리
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.5, marginTop: '8px' }}>
            총 {allRecords.length}건
          </div>
        </div>
        <button
          onClick={exportCSV}
          disabled={allRecords.length === 0}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            padding: '8px 20px',
            border: '1px solid var(--color-cocoa-ink)',
            background: 'transparent',
            color: 'var(--color-cocoa-ink)',
            cursor: allRecords.length === 0 ? 'not-allowed' : 'pointer',
            opacity: allRecords.length === 0 ? 0.3 : 1,
          }}
        >
          CSV 내보내기
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1px', background: 'var(--color-cocoa-ink)', alignItems: 'start' }}>

        {/* 새 상담 기록 추가 */}
        <section style={{ background: 'var(--color-canvas-parchment)', padding: '32px 28px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.5, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '24px' }}>
            새 상담 기록
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 학생 선택 */}
            <Field label="학생">
              <select
                value={form.studentId}
                onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
                required
                style={inputStyle}
              >
                <option value="">학생 선택</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.number}번 {s.name}</option>
                ))}
              </select>
            </Field>

            {/* 날짜 */}
            <Field label="상담 날짜">
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required
                style={inputStyle}
              />
            </Field>

            {/* 유형 */}
            <Field label="상담 유형">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {COUNSELING_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: t }))}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      padding: '4px 10px',
                      border: '1px solid var(--color-cocoa-ink)',
                      background: form.type === t ? 'var(--color-cocoa-ink)' : 'transparent',
                      color: form.type === t ? 'var(--color-canvas-parchment)' : 'var(--color-cocoa-ink)',
                      cursor: 'pointer',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            {/* AI 보조 작성 */}
            <div style={{
              border: '1px solid var(--color-border-subtle)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.5, letterSpacing: '0.06em' }}>
                AI 보조 작성
              </div>

              {/* 키워드 칩 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {AI_KEYWORDS.map(kw => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => toggleKeyword(kw)}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      padding: '4px 10px',
                      border: `1px solid ${aiKeywords.includes(kw) ? 'var(--color-cocoa-ink)' : 'var(--color-border-subtle)'}`,
                      background: aiKeywords.includes(kw) ? 'var(--color-cocoa-ink)' : 'transparent',
                      color: aiKeywords.includes(kw) ? 'var(--color-canvas-parchment)' : 'var(--color-cocoa-ink)',
                      cursor: 'pointer',
                      opacity: aiKeywords.includes(kw) ? 1 : 0.6,
                    }}
                  >
                    {kw}
                  </button>
                ))}
              </div>

              {/* 간단 메모 */}
              <input
                type="text"
                value={aiMemo}
                onChange={e => setAiMemo(e.target.value)}
                placeholder="간단히 상황 메모 (예: 수학 받아쓰기 계속 틀림, 친구랑 싸웠음)"
                style={{ ...inputStyle, fontSize: '12px' }}
              />

              {aiError && (
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-alert-crimson)' }}>
                  {aiError}
                </div>
              )}

              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={aiLoading}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  padding: '10px',
                  border: '1px solid var(--color-cocoa-ink)',
                  background: aiLoading ? 'var(--color-border-subtle)' : 'var(--color-cocoa-ink)',
                  color: 'var(--color-canvas-parchment)',
                  cursor: aiLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {aiLoading ? '생성 중…' : '✦ AI로 상담기록 생성'}
              </button>
            </div>

            {/* 상담 내용 */}
            <Field label="상담 내용">
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                required
                rows={4}
                placeholder="상담 내용을 입력하거나 AI로 생성하세요"
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </Field>

            {/* 조치사항 */}
            <Field label="조치사항">
              <textarea
                value={form.action}
                onChange={e => setForm(f => ({ ...f, action: e.target.value }))}
                rows={2}
                placeholder="취한 조치 또는 향후 계획"
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </Field>

            {/* 다음 상담 예정일 */}
            <Field label="다음 상담 예정일 (선택)">
              <input
                type="date"
                value={form.nextDate}
                onChange={e => setForm(f => ({ ...f, nextDate: e.target.value }))}
                style={inputStyle}
              />
            </Field>

            <button
              type="submit"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                padding: '12px',
                background: 'var(--color-cocoa-ink)',
                color: 'var(--color-canvas-parchment)',
                border: 'none',
                cursor: 'pointer',
                marginTop: '4px',
              }}
            >
              저장
            </button>
          </form>
        </section>

        {/* 상담 기록 목록 */}
        <section style={{ background: 'var(--color-canvas-parchment)', padding: '32px 28px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.5, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '20px' }}>
            기록 목록
          </div>

          {/* 필터 */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <select
              value={filterStudentId}
              onChange={e => setFilterStudentId(e.target.value)}
              style={{ ...inputStyle, width: 'auto', minWidth: '120px' }}
            >
              <option value="">전체 학생</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.number}번 {s.name}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              style={{ ...inputStyle, width: 'auto' }}
            >
              <option value="">전체 유형</option>
              {COUNSELING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {(filterStudentId || filterType) && (
              <button
                onClick={() => { setFilterStudentId(''); setFilterType(''); }}
                style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.5, borderBottom: '1px dashed var(--color-cocoa-ink)' }}
              >
                초기화
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.4, padding: '32px 0' }}>
              상담 기록이 없습니다.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--color-cocoa-ink)' }}>
              {filtered.map(r => {
                const isExpanded = expandedId === r.id;
                return (
                  <div key={r.id} style={{ background: 'var(--color-canvas-parchment)' }}>
                    {/* 요약 행 */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : r.id)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'center',
                        textAlign: 'left',
                        cursor: 'pointer',
                        background: isExpanded ? 'var(--color-cocoa-ink)' : 'transparent',
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        opacity: isExpanded ? 0.7 : 0.5,
                        whiteSpace: 'nowrap',
                        color: isExpanded ? 'var(--color-canvas-parchment)' : 'var(--color-cocoa-ink)',
                      }}>
                        {r.date}
                      </span>
                      <TypeBadge type={r.type} inverted={isExpanded} />
                      <span
                        onClick={e => { e.stopPropagation(); goToStudent(r.student); }}
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '15px',
                          color: isExpanded ? 'var(--color-canvas-parchment)' : 'var(--color-cocoa-ink)',
                          borderBottom: '1px dashed currentColor',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {r.student.name}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        color: isExpanded ? 'var(--color-canvas-parchment)' : 'var(--color-cocoa-ink)',
                        opacity: isExpanded ? 0.8 : 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                      }}>
                        {r.content}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        color: isExpanded ? 'var(--color-canvas-parchment)' : 'var(--color-cocoa-ink)',
                        opacity: 0.4,
                        flexShrink: 0,
                      }}>
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </button>

                    {/* 펼침 상세 */}
                    {isExpanded && (
                      <div style={{ padding: '20px 16px 16px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--color-border-faint)' }}>
                        <DetailRow label="상담 내용" value={r.content} />
                        {r.action && <DetailRow label="조치사항" value={r.action} />}
                        {r.nextDate && (
                          <DetailRow label="다음 상담 예정일" value={r.nextDate}
                            valueStyle={{ color: 'var(--color-alert-crimson)' }}
                          />
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                          <button
                            onClick={() => deleteCounseling(r.student.id, r.id)}
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '12px',
                              color: 'var(--color-alert-crimson)',
                              opacity: 0.7,
                              borderBottom: '1px dashed var(--color-alert-crimson)',
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.5 }}>{label}</label>
      {children}
    </div>
  );
}

function DetailRow({ label, value, valueStyle = {} }) {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.5, whiteSpace: 'nowrap', minWidth: '120px' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.6, ...valueStyle }}>{value}</span>
    </div>
  );
}

function TypeBadge({ type, inverted }) {
  const colors = {
    학습: 'var(--color-cocoa-ink)',
    생활: 'var(--color-cocoa-ink)',
    친구관계: 'var(--color-cocoa-ink)',
    가정: 'var(--color-cocoa-ink)',
    건강: 'var(--color-alert-crimson)',
    기타: 'var(--color-cocoa-ink)',
  };
  const color = colors[type] || 'var(--color-cocoa-ink)';
  return (
    <span style={{
      fontFamily: 'var(--font-body)',
      fontSize: '11px',
      padding: '2px 8px',
      border: `1px solid ${inverted ? 'var(--color-canvas-parchment)' : color}`,
      color: inverted ? 'var(--color-canvas-parchment)' : color,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      {type}
    </span>
  );
}

const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--color-cocoa-ink)',
  padding: '6px 0',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  color: 'var(--color-cocoa-ink)',
};
