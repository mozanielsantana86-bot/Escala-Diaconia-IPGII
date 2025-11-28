export const getSundaysInMonth = (year: number, month: number): string[] => {
  const date = new Date(year, month, 1);
  const sundays: string[] = [];

  // Advance to the first Sunday
  while (date.getDay() !== 0) {
    date.setDate(date.getDate() + 1);
  }

  // Get all Sundays
  while (date.getMonth() === month) {
    sundays.push(date.toISOString().split('T')[0]);
    date.setDate(date.getDate() + 7);
  }

  return sundays;
};

export const formatDatePTBR = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const getMonthName = (monthIndex: number): string => {
  const names = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return names[monthIndex];
};
