import { parseISO, format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, differenceInDays } from "date-fns";

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
