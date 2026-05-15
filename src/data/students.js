// 학교일 목록 생성 (2026-03-02 ~ 2026-05-15, 주말 및 공휴일 제외)
function generateSchoolDays() {
  const days = [];
  const start = new Date('2026-03-02');
  const end = new Date('2026-05-15');
  const holidays = new Set(['2026-05-05']); // 어린이날

  const cur = new Date(start);
  while (cur <= end) {
    const dow = cur.getDay();
    const key = cur.toISOString().slice(0, 10);
    if (dow !== 0 && dow !== 6 && !holidays.has(key)) {
      days.push(key);
    }
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

export const SCHOOL_DAYS = generateSchoolDays();

function randomStatus(seed) {
  const r = ((seed * 1103515245 + 12345) & 0x7fffffff) % 100;
  if (r < 2) return 'absent';
  if (r < 5) return 'late';
  if (r < 6) return 'early';
  return 'present';
}

function generateAttendance(studentId) {
  const result = {};
  SCHOOL_DAYS.forEach((day, i) => {
    result[day] = randomStatus(studentId * 100 + i);
  });
  return result;
}

export const STUDENTS_INIT = [
  {
    id: 1, number: 1, name: '김민준', gender: 'M', birthdate: '2018-09-15',
    parent: { name: '김철수', phone: '010-1234-5678', relation: '부' },
    address: '서울시 강남구 역삼동 테헤란로 123',
    grades: { '국어': 95, '수학': 88, '바른생활': 92, '슬기로운생활': 90, '즐거운생활': 96 },
    notes: '활발하고 수업 참여도가 높음. 친구들과 잘 어울림.',
    specialNotes: '',
  },
  {
    id: 2, number: 2, name: '이서연', gender: 'F', birthdate: '2018-04-22',
    parent: { name: '이정희', phone: '010-2345-6789', relation: '모' },
    address: '서울시 강남구 삼성동 봉은사로 45',
    grades: { '국어': 98, '수학': 94, '바른생활': 97, '슬기로운생활': 95, '즐거운생활': 99 },
    notes: '성실하고 집중력이 뛰어남. 독서를 매우 좋아함.',
    specialNotes: '땅콩 알레르기 있음',
  },
  {
    id: 3, number: 3, name: '박준혁', gender: 'M', birthdate: '2018-11-08',
    parent: { name: '박영수', phone: '010-3456-7890', relation: '부' },
    address: '서울시 서초구 서초동 효령로 210',
    grades: { '국어': 82, '수학': 91, '바른생활': 80, '슬기로운생활': 85, '즐거운생활': 78 },
    notes: '수학에 흥미가 많고 논리적 사고력이 우수함.',
    specialNotes: '',
  },
  {
    id: 4, number: 4, name: '최예린', gender: 'F', birthdate: '2018-07-30',
    parent: { name: '최미란', phone: '010-4567-8901', relation: '모' },
    address: '서울시 강남구 압구정동 논현로 88',
    grades: { '국어': 90, '수학': 85, '바른생활': 94, '슬기로운생활': 88, '즐거운생활': 97 },
    notes: '미술과 음악에 재능이 있음. 창의적인 활동을 좋아함.',
    specialNotes: '',
  },
  {
    id: 5, number: 5, name: '강서준', gender: 'M', birthdate: '2018-02-14',
    parent: { name: '강동원', phone: '010-5678-9012', relation: '부' },
    address: '서울시 송파구 잠실동 올림픽로 300',
    grades: { '국어': 78, '수학': 82, '바른생활': 75, '슬기로운생활': 80, '즐거운생활': 85 },
    notes: '체육 활동을 매우 좋아하고 리더십이 있음.',
    specialNotes: '',
  },
  {
    id: 6, number: 6, name: '정나은', gender: 'F', birthdate: '2018-06-19',
    parent: { name: '정수현', phone: '010-6789-0123', relation: '부' },
    address: '서울시 마포구 합정동 양화로 72',
    grades: { '국어': 93, '수학': 79, '바른생활': 91, '슬기로운생활': 87, '즐거운생활': 95 },
    notes: '국어 능력이 뛰어나고 발표를 잘함.',
    specialNotes: '천식 지병 있음, 격렬한 운동 시 주의',
  },
  {
    id: 7, number: 7, name: '조태양', gender: 'M', birthdate: '2018-12-25',
    parent: { name: '조현우', phone: '010-7890-1234', relation: '부' },
    address: '서울시 용산구 한남동 독서당로 50',
    grades: { '국어': 85, '수학': 93, '바른생활': 82, '슬기로운생활': 90, '즐거운생활': 80 },
    notes: '과학에 관심이 많고 탐구력이 우수함.',
    specialNotes: '',
  },
  {
    id: 8, number: 8, name: '윤아린', gender: 'F', birthdate: '2018-03-05',
    parent: { name: '윤지영', phone: '010-8901-2345', relation: '모' },
    address: '서울시 강동구 천호동 천호대로 123',
    grades: { '국어': 88, '수학': 86, '바른생활': 90, '슬기로운생활': 84, '즐거운생활': 92 },
    notes: '매사에 긍정적이고 친구들에게 친절함.',
    specialNotes: '',
  },
  {
    id: 9, number: 9, name: '장민혁', gender: 'M', birthdate: '2018-08-17',
    parent: { name: '장태준', phone: '010-9012-3456', relation: '부' },
    address: '서울시 영등포구 여의도동 여의대로 20',
    grades: { '국어': 72, '수학': 75, '바른생활': 70, '슬기로운생활': 73, '즐거운생활': 80 },
    notes: '집중력 향상 필요. 미술 활동에 흥미 있음.',
    specialNotes: '',
  },
  {
    id: 10, number: 10, name: '임다은', gender: 'F', birthdate: '2018-05-11',
    parent: { name: '임소영', phone: '010-0123-4567', relation: '모' },
    address: '서울시 노원구 상계동 동일로 200',
    grades: { '국어': 96, '수학': 92, '바른생활': 95, '슬기로운생활': 94, '즐거운생활': 98 },
    notes: '전 과목 우수. 책임감이 강하고 모범적임.',
    specialNotes: '',
  },
  {
    id: 11, number: 11, name: '한주원', gender: 'M', birthdate: '2018-10-03',
    parent: { name: '한기범', phone: '010-1122-3344', relation: '부' },
    address: '서울시 성북구 길음동 삼양로 77',
    grades: { '국어': 84, '수학': 88, '바른생활': 83, '슬기로운생활': 86, '즐거운생활': 82 },
    notes: '조용하지만 성실히 학습함. 음악에 재능 있음.',
    specialNotes: '',
  },
  {
    id: 12, number: 12, name: '한소율', gender: 'F', birthdate: '2018-01-28',
    parent: { name: '한민정', phone: '010-2233-4455', relation: '모' },
    address: '서울시 강북구 미아동 도봉로 100',
    grades: { '국어': 91, '수학': 83, '바른생활': 93, '슬기로운생활': 89, '즐거운생활': 94 },
    notes: '글쓰기 능력이 뛰어남. 상상력이 풍부함.',
    specialNotes: '',
  },
  {
    id: 13, number: 13, name: '신유준', gender: 'M', birthdate: '2018-07-14',
    parent: { name: '신동수', phone: '010-3344-5566', relation: '부' },
    address: '서울시 도봉구 쌍문동 방학로 55',
    grades: { '국어': 79, '수학': 95, '바른생활': 77, '슬기로운생활': 82, '즐거운생활': 75 },
    notes: '수학적 사고력이 매우 뛰어남.',
    specialNotes: '',
  },
  {
    id: 14, number: 14, name: '오하은', gender: 'F', birthdate: '2018-09-22',
    parent: { name: '오미영', phone: '010-4455-6677', relation: '모' },
    address: '서울시 은평구 불광동 통일로 344',
    grades: { '국어': 87, '수학': 81, '바른생활': 89, '슬기로운생활': 85, '즐거운생활': 91 },
    notes: '예체능 활동을 좋아하고 표현력이 풍부함.',
    specialNotes: '',
  },
  {
    id: 15, number: 15, name: '황도윤', gender: 'M', birthdate: '2018-04-06',
    parent: { name: '황재현', phone: '010-5566-7788', relation: '부' },
    address: '서울시 서대문구 홍제동 통일로 135',
    grades: { '국어': 86, '수학': 84, '바른생활': 88, '슬기로운생활': 87, '즐거운생활': 83 },
    notes: '균형 있게 발전하고 있음. 친구 관계 원만함.',
    specialNotes: '',
  },
  {
    id: 16, number: 16, name: '안준서', gender: 'M', birthdate: '2018-11-30',
    parent: { name: '안병철', phone: '010-6677-8899', relation: '부' },
    address: '서울시 마포구 공덕동 마포대로 130',
    grades: { '국어': 77, '수학': 80, '바른생활': 79, '슬기로운생활': 76, '즐거운생활': 82 },
    notes: '또래보다 내성적이나 수업 이해도는 양호함.',
    specialNotes: '',
  },
  {
    id: 17, number: 17, name: '신가은', gender: 'F', birthdate: '2018-03-18',
    parent: { name: '신혜진', phone: '010-7788-9900', relation: '모' },
    address: '서울시 양천구 목동 오목로 160',
    grades: { '국어': 94, '수학': 90, '바른생활': 96, '슬기로운생활': 92, '즐거운생활': 97 },
    notes: '모범생. 발표력과 이해력이 우수함.',
    specialNotes: '',
  },
  {
    id: 18, number: 18, name: '남시후', gender: 'M', birthdate: '2018-06-07',
    parent: { name: '남궁민', phone: '010-8899-0011', relation: '부' },
    address: '서울시 강서구 화곡동 강서로 288',
    grades: { '국어': 81, '수학': 87, '바른생활': 80, '슬기로운생활': 83, '즐거운생활': 86 },
    notes: '스포츠를 좋아하고 에너지가 넘침.',
    specialNotes: '',
  },
  {
    id: 19, number: 19, name: '황서윤', gender: 'F', birthdate: '2018-12-14',
    parent: { name: '황명숙', phone: '010-9900-1122', relation: '모' },
    address: '서울시 구로구 구로동 디지털로 300',
    grades: { '국어': 89, '수학': 84, '바른생활': 91, '슬기로운생활': 88, '즐거운생활': 93 },
    notes: '친구들에게 인기가 많고 사교성이 좋음.',
    specialNotes: '',
  },
  {
    id: 20, number: 20, name: '이도현', gender: 'M', birthdate: '2018-02-28',
    parent: { name: '이상훈', phone: '010-0011-2233', relation: '부' },
    address: '서울시 관악구 봉천동 관악로 145',
    grades: { '국어': 83, '수학': 76, '바른생활': 85, '슬기로운생활': 81, '즐거운생활': 88 },
    notes: '꾸준히 발전 중. 그림 그리기를 좋아함.',
    specialNotes: '',
  },
  {
    id: 21, number: 21, name: '박수아', gender: 'F', birthdate: '2018-08-09',
    parent: { name: '박현우', phone: '010-1122-2233', relation: '부' },
    address: '서울시 동작구 사당동 동작대로 100',
    grades: { '국어': 92, '수학': 88, '바른생활': 90, '슬기로운생활': 91, '즐거운생활': 95 },
    notes: '학습 의욕이 높고 호기심이 왕성함.',
    specialNotes: '',
  },
  {
    id: 22, number: 22, name: '최지호', gender: 'M', birthdate: '2018-05-23',
    parent: { name: '최준혁', phone: '010-2233-3344', relation: '부' },
    address: '서울시 동대문구 회기동 경희대로 26',
    grades: { '국어': 75, '수학': 78, '바른생활': 72, '슬기로운생활': 74, '즐거운생활': 77 },
    notes: '기초 학습 보강 필요. 체육 활동 참여도 높음.',
    specialNotes: '부모님 면담 권장',
  },
  {
    id: 23, number: 23, name: '강민서', gender: 'F', birthdate: '2018-10-31',
    parent: { name: '강혜원', phone: '010-3344-4455', relation: '모' },
    address: '서울시 중랑구 면목동 용마산로 179',
    grades: { '국어': 97, '수학': 93, '바른생활': 98, '슬기로운생활': 96, '즐거운생활': 99 },
    notes: '학급에서 가장 우수한 학생. 리더십과 배려심이 탁월.',
    specialNotes: '',
  },
  {
    id: 24, number: 24, name: '정하준', gender: 'M', birthdate: '2018-01-15',
    parent: { name: '정길동', phone: '010-4455-5566', relation: '부' },
    address: '서울시 성동구 행당동 왕십리로 215',
    grades: { '국어': 80, '수학': 85, '바른생활': 78, '슬기로운생활': 82, '즐거운생활': 84 },
    notes: '꼼꼼하고 성실한 편. 수학을 좋아함.',
    specialNotes: '',
  },
  {
    id: 25, number: 25, name: '조채원', gender: 'F', birthdate: '2018-07-04',
    parent: { name: '조영란', phone: '010-5566-6677', relation: '모' },
    address: '서울시 광진구 자양동 아차산로 225',
    grades: { '국어': 86, '수학': 82, '바른생활': 88, '슬기로운생활': 84, '즐거운생활': 90 },
    notes: '유머 감각이 있고 학급 분위기를 밝게 함.',
    specialNotes: '',
  },
  {
    id: 26, number: 26, name: '윤재현', gender: 'M', birthdate: '2018-03-27',
    parent: { name: '윤석호', phone: '010-6677-7788', relation: '부' },
    address: '서울시 강동구 암사동 고덕로 130',
    grades: { '국어': 88, '수학': 91, '바른생활': 86, '슬기로운생활': 89, '즐거운생활': 85 },
    notes: '이과 계통에 소질이 있음. 논리적 사고 우수.',
    specialNotes: '',
  },
  {
    id: 27, number: 27, name: '장유진', gender: 'F', birthdate: '2018-11-19',
    parent: { name: '장미선', phone: '010-7788-8899', relation: '모' },
    address: '서울시 송파구 방이동 올림픽로 424',
    grades: { '국어': 91, '수학': 87, '바른생활': 93, '슬기로운생활': 90, '즐거운생활': 96 },
    notes: '발표력이 뛰어나고 언어 표현이 풍부함.',
    specialNotes: '',
  },
  {
    id: 28, number: 28, name: '임건우', gender: 'M', birthdate: '2018-09-01',
    parent: { name: '임재환', phone: '010-8899-9900', relation: '부' },
    address: '서울시 강남구 개포동 개포로 416',
    grades: { '국어': 76, '수학': 79, '바른생활': 74, '슬기로운생활': 77, '즐거운생활': 81 },
    notes: '산만한 편이나 개선 중. 만들기 활동을 좋아함.',
    specialNotes: '',
  },
  {
    id: 29, number: 29, name: '안하린', gender: 'F', birthdate: '2018-04-13',
    parent: { name: '안현주', phone: '010-9900-0011', relation: '모' },
    address: '서울시 서초구 반포동 반포대로 201',
    grades: { '국어': 93, '수학': 89, '바른생활': 95, '슬기로운생활': 92, '즐거운생활': 97 },
    notes: '학습 속도가 빠르고 이해력이 뛰어남.',
    specialNotes: '',
  },
  {
    id: 30, number: 30, name: '배지수', gender: 'F', birthdate: '2018-08-25',
    parent: { name: '배성우', phone: '010-0011-1122', relation: '부' },
    address: '서울시 강남구 청담동 도산대로 156',
    grades: { '국어': 85, '수학': 83, '바른생활': 87, '슬기로운생활': 86, '즐거운생활': 89 },
    notes: '안정적으로 학습하며 꾸준히 성장 중.',
    specialNotes: '',
  },
];

export function generateAllAttendance(students) {
  const result = {};
  students.forEach(s => {
    result[s.id] = generateAttendance(s.id);
  });
  return result;
}

export const SUBJECTS = ['국어', '수학', '바른생활', '슬기로운생활', '즐거운생활'];

export const STATUS_LABEL = {
  present: '출석',
  absent: '결석',
  late: '지각',
  early: '조퇴',
};

export const STATUS_SYMBOL = {
  present: '○',
  absent: '✕',
  late: '△',
  early: '◁',
};
