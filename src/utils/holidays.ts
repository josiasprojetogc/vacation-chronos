// Feriados nacionais brasileiros (fixos)
const fixedHolidays: Record<string, string> = {
  "01-01": "Confraternização Universal",
  "04-21": "Tiradentes",
  "05-01": "Dia do Trabalho",
  "09-07": "Independência do Brasil",
  "10-12": "Nossa Senhora Aparecida",
  "11-02": "Finados",
  "11-15": "Proclamação da República",
  "12-25": "Natal",
};

// Calcula a Páscoa usando o algoritmo de Meeus/Jones/Butcher
const calculateEaster = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

// Feriados móveis baseados na Páscoa
const getMobileHolidays = (year: number): Record<string, string> => {
  const easter = calculateEaster(year);
  const holidays: Record<string, string> = {};

  // Carnaval (47 dias antes da Páscoa)
  const carnival = new Date(easter);
  carnival.setDate(easter.getDate() - 47);
  holidays[formatDateKey(carnival)] = "Carnaval";

  // Sexta-feira Santa (2 dias antes da Páscoa)
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  holidays[formatDateKey(goodFriday)] = "Sexta-feira Santa";

  // Páscoa
  holidays[formatDateKey(easter)] = "Páscoa";

  // Corpus Christi (60 dias após a Páscoa)
  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);
  holidays[formatDateKey(corpusChristi)] = "Corpus Christi";

  return holidays;
};

const formatDateKey = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
};

// Cache de feriados por ano
const holidaysCache: Record<number, Record<string, string>> = {};

export const getHolidaysForYear = (year: number): Record<string, string> => {
  if (!holidaysCache[year]) {
    holidaysCache[year] = {
      ...fixedHolidays,
      ...getMobileHolidays(year),
    };
  }
  return holidaysCache[year];
};

export const getHolidayName = (date: Date): string | null => {
  const year = date.getFullYear();
  const holidays = getHolidaysForYear(year);
  const key = formatDateKey(date);
  return holidays[key] || null;
};

export const isHoliday = (date: Date): boolean => {
  return getHolidayName(date) !== null;
};
