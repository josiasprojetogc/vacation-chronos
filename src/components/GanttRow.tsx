import { VacationPeriod } from "@/types/vacation";
import { VacationBar } from "./VacationBar";
import { format, isSameDay, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ViewMode } from "@/types/viewMode";
import { Period } from "@/utils/dateUtils";

interface GanttRowProps {
  vacation: VacationPeriod;
  periods: Period[];
  periodWidth: number;
  leftColumnWidth: number;
  rowHeight: number;
  viewMode: ViewMode;
}

export const GanttRow = ({
  vacation,
  periods,
  periodWidth,
  leftColumnWidth,
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
        {periods.map((period, index) => {
          const monthName = format(period.date, "MMMM", { locale: ptBR });
          const showMonthDivider = monthName !== currentMonth && viewMode === 'day';
          const isTodayColumn = isSameDay(period.date, today);
          
          if (showMonthDivider) {
            currentMonth = monthName;
          }

          return (
            <div
              key={index}
              className={`${showMonthDivider ? 'border-l-2 border-l-primary' : ''} border-r border-grid-line ${isTodayColumn ? 'bg-today-highlight/10' : ''}`}
              style={{ width: periodWidth, minWidth: periodWidth }}
            />
          );
        })}
        <VacationBar
          vacation={vacation}
          periods={periods}
          periodWidth={periodWidth}
          rowHeight={rowHeight}
          type="requested"
          viewMode={viewMode}
        />
        <VacationBar
          vacation={vacation}
          periods={periods}
          periodWidth={periodWidth}
          rowHeight={rowHeight}
          type="official"
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};
