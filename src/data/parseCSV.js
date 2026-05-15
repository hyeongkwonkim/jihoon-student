export function parseStudentsCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  // 첫 줄은 헤더 — 건너뜀
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const cols = line.split(',');
    const number = parseInt(cols[0], 10);
    return {
      id: number,
      number,
      name: cols[1]?.trim() ?? '',
      gender: cols[2]?.trim() === '남' ? 'M' : 'F',
      birthdate: cols[3]?.trim() ?? '',
      parent: {
        name: cols[4]?.trim() ?? '',
        relation: cols[5]?.trim() ?? '',
        phone: cols[6]?.trim() ?? '',
      },
      address: cols[7]?.trim() ?? '',
      grades: {
        '국어': parseInt(cols[8], 10) || 0,
        '수학': parseInt(cols[9], 10) || 0,
        '바른생활': parseInt(cols[10], 10) || 0,
        '슬기로운생활': parseInt(cols[11], 10) || 0,
        '즐거운생활': parseInt(cols[12], 10) || 0,
      },
      notes: cols[13]?.trim() ?? '',
      specialNotes: cols[14]?.trim() ?? '',
    };
  });
}
