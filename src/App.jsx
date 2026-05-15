import { useState, useEffect } from 'react';
import { generateAllAttendance } from './data/students';
import { parseStudentsCSV } from './data/parseCSV';
import { INITIAL_COUNSELING } from './data/counseling';
import Nav from './components/Nav';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import StudentDetail from './pages/StudentDetail';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';
import Counseling from './pages/Counseling';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [counselingData, setCounselingData] = useState(INITIAL_COUNSELING);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch('/students.csv')
      .then(r => {
        if (!r.ok) throw new Error('students.csv를 불러올 수 없습니다.');
        return r.text();
      })
      .then(text => {
        const parsed = parseStudentsCSV(text);
        setStudents(parsed);
        setAttendanceData(generateAllAttendance(parsed));
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const updateStudent = (id, patch) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const updateGrade = (id, subject, score) => {
    setStudents(prev => prev.map(s =>
      s.id === id ? { ...s, grades: { ...s.grades, [subject]: score } } : s
    ));
  };

  const updateAttendance = (studentId, date, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [date]: status },
    }));
  };

  const addCounseling = (studentId, record) => {
    setCounselingData(prev => ({
      ...prev,
      [studentId]: [...(prev[studentId] || []), record],
    }));
  };

  const deleteCounseling = (studentId, recordId) => {
    setCounselingData(prev => ({
      ...prev,
      [studentId]: (prev[studentId] || []).filter(r => r.id !== recordId),
    }));
  };

  const goToDetail = (id) => {
    setSelectedId(id);
    setPage('detail');
  };

  if (loading) {
    return (
      <div className={darkMode ? 'dark' : ''} style={{
        minHeight: '100vh',
        background: 'var(--color-canvas-parchment)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: '27px',
        color: 'var(--color-cocoa-ink)',
        letterSpacing: '-0.54px',
      }}>
        불러오는 중…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--color-canvas-parchment)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        color: 'var(--color-alert-crimson)',
      }}>
        오류: {error}
      </div>
    );
  }

  const commonProps = { students, counselingData, addCounseling, deleteCounseling };

  return (
    <div className={darkMode ? 'dark' : ''} style={{ minHeight: '100vh', background: 'var(--color-canvas-parchment)' }}>
      <Nav page={page} setPage={setPage} setSelectedId={setSelectedId} darkMode={darkMode} setDarkMode={setDarkMode} />

      {page === 'dashboard' && (
        <Dashboard students={students} attendanceData={attendanceData} counselingData={counselingData} setPage={setPage} />
      )}
      {page === 'list' && (
        <StudentList students={students} attendanceData={attendanceData} setPage={setPage} setSelectedId={goToDetail} />
      )}
      {page === 'detail' && (
        <StudentDetail
          {...commonProps}
          attendanceData={attendanceData}
          selectedId={selectedId}
          updateStudent={updateStudent}
          setPage={setPage}
        />
      )}
      {page === 'attendance' && (
        <Attendance students={students} attendanceData={attendanceData} updateAttendance={updateAttendance} />
      )}
      {page === 'grades' && (
        <Grades students={students} updateGrade={updateGrade} />
      )}
      {page === 'counseling' && (
        <Counseling
          {...commonProps}
          setPage={setPage}
          setSelectedId={goToDetail}
        />
      )}
    </div>
  );
}
