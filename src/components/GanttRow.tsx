import { VacationPeriod } from "@/types/vacation";
import { VacationBar } from "./VacationBar";
import { format, isSameDay, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ViewMode } from "@/types/viewMode";

interface GanttRowProps {
  vacation: VacationPeriod;
  days: Date[];
  dayWidth: number;
  leftColumnWidth: number;
  rangeStart: Date;
  rowHeight: number;
  viewMode: ViewMode;
}

export const GanttRow = ({
  vacation,
  days,
  dayWidth,
  leftColumnWidth,
  rangeStart,
  rowHeight,
  viewMode,
}: GanttRowProps) => {
  let currentMonth = "";
  const today = startOfDay(new Date());

  return (
    <div className="flex border-b border-border hover:bg-muted/30 transition-colors">
      <div
        className="flex-shrink-0 border-r border-border p-2 flex flex-col justify-center sticky left-0 bg-background z-10"
        style={{ width: leftColumnWidth, height: rowHeight }}
      >
        <div className="font-semibold text-sm text-foreground truncate">
          {vacation.nome}
        </div>
        <div className="text-xs text-muted-foreground">{vacation.codusu}</div>
      </div>
      <div className="flex relative overflow-hidden" style={{ height: rowHeight }}>
        {days.map((day, index) => {
          const monthName = format(day, "MMMM", { locale: ptBR });
          const showMonthDivider = monthName !== currentMonth;
          const isTodayColumn = isSameDay(day, today);
          
          if (showMonthDivider) {
            currentMonth = monthName;
          }

          return (
            <div
              key={index}
              className={`${showMonthDivider ? 'border-l-2 border-l-primary' : ''} border-r border-grid-line ${isTodayColumn ? 'bg-today-highlight/10' : ''}`}
              style={{ width: dayWidth, minWidth: dayWidth }}
            />
          );
        })}
        <VacationBar
          vacation={vacation}
          rangeStart={rangeStart}
          dayWidth={dayWidth}
          rowHeight={rowHeight}
          type="requested"
        />
        <VacationBar
          vacation={vacation}
          rangeStart={rangeStart}
          dayWidth={dayWidth}
          rowHeight={rowHeight}
          type="official"
        />
      </div>
    </div>
  );
};
