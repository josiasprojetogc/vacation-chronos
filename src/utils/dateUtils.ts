import { parseISO, format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, differenceInDays, startOfQuarter, endOfQuarter, eachMonthOfInterval, eachQuarterOfInterval, eachYearOfInterval, startOfYear, endOfYear } from "date-fns";
import { ViewMode } from "@/types/viewMode";

export interface Period {
  date: Date;
  type: 'day' | 'month' | 'quarter' | 'year';
  label: string;
}

export const parseBrazilianDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split("/");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

export const formatDate = (date: Date, formatStr: string = "dd/MM/yyyy"): string => {
  return format(date, formatStr);
};

export const getMonthDays = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const getDateRange = (startDate: Date, endDate: Date) => {
  return eachDayOfInterval({ start: startDate, end: endDate });
};

export const calculateDayPosition = (
  date: Date,
  rangeStart: Date,
  dayWidth: number
): number => {
  const days = differenceInDays(date, rangeStart);
  return days * dayWidth;
};

export const navigateMonth = (currentDate: Date, direction: "prev" | "next"): Date => {
  return direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
};

export const getPeriods = (startDate: Date, endDate: Date, viewMode: ViewMode): Period[] => {
  switch (viewMode) {
    case 'year':
      return eachYearOfInterval({ start: startDate, end: endDate }).map(date => ({
        date,
        type: 'year' as const,
        label: format(date, 'yyyy')
      }));
    case 'quarter':
      return eachQuarterOfInterval({ start: startDate, end: endDate }).map(date => ({
        date,
        type: 'quarter' as const,
        label: `Q${Math.floor(date.getMonth() / 3) + 1}`
      }));
    case 'month':
      return eachMonthOfInterval({ start: startDate, end: endDate }).map(date => ({
        date,
        type: 'month' as const,
        label: format(date, 'MMM')
      }));
    case 'day':
    default:
      return eachDayOfInterval({ start: startDate, end: endDate }).map(date => ({
        date,
        type: 'day' as const,
        label: format(date, 'd')
      }));
  }
};

export const calculatePeriodPosition = (
  date: Date,
  periods: Period[],
  periodWidth: number,
  viewMode: ViewMode
): number => {
  if (periods.length === 0) return 0;
  
  const firstPeriod = periods[0];
  const lastPeriod = periods[periods.length - 1];
  
  // Se a data é anterior ao primeiro período, retornar posição negativa ou 0
  const firstPeriodStart = getPeriodStart(firstPeriod.date, viewMode);
  if (date < firstPeriodStart) {
    // Calcular posição negativa proporcional
    const daysBeforeStart = differenceInDays(firstPeriodStart, date);
    const avgDaysPerPeriod = getAvgDaysPerPeriod(viewMode);
    return -(daysBeforeStart / avgDaysPerPeriod) * periodWidth;
  }
  
  let position = 0;
  
  for (let i = 0; i < periods.length; i++) {
    const period = periods[i];
    
    switch (viewMode) {
      case 'year':
        if (date >= startOfYear(period.date) && date <= endOfYear(period.date)) {
          const daysInYear = differenceInDays(endOfYear(period.date), startOfYear(period.date)) + 1;
          const daysFromStart = differenceInDays(date, startOfYear(period.date));
          return position + (daysFromStart / daysInYear) * periodWidth;
        }
        break;
      case 'quarter':
        if (date >= startOfQuarter(period.date) && date <= endOfQuarter(period.date)) {
          const daysInQuarter = differenceInDays(endOfQuarter(period.date), startOfQuarter(period.date)) + 1;
          const daysFromStart = differenceInDays(date, startOfQuarter(period.date));
          return position + (daysFromStart / daysInQuarter) * periodWidth;
        }
        break;
      case 'month':
        if (date >= startOfMonth(period.date) && date <= endOfMonth(period.date)) {
          const daysInMonth = differenceInDays(endOfMonth(period.date), startOfMonth(period.date)) + 1;
          const daysFromStart = differenceInDays(date, startOfMonth(period.date));
          return position + (daysFromStart / daysInMonth) * periodWidth;
        }
        break;
      case 'day':
      default:
        if (format(date, 'yyyy-MM-dd') === format(period.date, 'yyyy-MM-dd')) {
          return position;
        }
        break;
    }
    
    position += periodWidth;
  }
  
  return position;
};

const getPeriodStart = (date: Date, viewMode: ViewMode): Date => {
  switch (viewMode) {
    case 'year': return startOfYear(date);
    case 'quarter': return startOfQuarter(date);
    case 'month': return startOfMonth(date);
    default: return date;
  }
};

const getAvgDaysPerPeriod = (viewMode: ViewMode): number => {
  switch (viewMode) {
    case 'year': return 365;
    case 'quarter': return 91;
    case 'month': return 30;
    default: return 1;
  }
};

export const calculatePeriodWidth = (
  startDate: Date,
  endDate: Date,
  periods: Period[],
  periodWidth: number,
  viewMode: ViewMode
): number => {
  const startPos = calculatePeriodPosition(startDate, periods, periodWidth, viewMode);
  const endPos = calculatePeriodPosition(endDate, periods, periodWidth, viewMode);
  
  // Para modo dia, adicionar 1 período de largura para incluir o último dia
  if (viewMode === 'day') {
    return endPos - startPos + periodWidth;
  }
  
  return endPos - startPos;
};
