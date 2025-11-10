import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GanttTimelineProps {
  days: Date[];
  dayWidth: number;
  leftColumnWidth: number;
}

export const GanttTimeline = ({ days, dayWidth, leftColumnWidth }: GanttTimelineProps) => {
  let currentMonth = "";

  return (
    <div className="flex sticky top-0 z-10 bg-header-bg border-b border-border">
      <div
        className="flex-shrink-0 border-r border-border p-2 flex items-center justify-center font-semibold text-muted-foreground text-sm sticky left-0 bg-header-bg z-20"
        style={{ width: leftColumnWidth }}
      >
        Colaborador
      </div>
      <div className="flex overflow-hidden">
        {days.map((day, index) => {
          const monthName = format(day, "MMMM 'de' yyyy", { locale: ptBR });
          const dayNumber = format(day, "d");
          const showMonthDivider = monthName !== currentMonth;
          
          if (showMonthDivider) {
            currentMonth = monthName;
          }

          return (
            <div
              key={index}
              className="flex flex-col border-r border-grid-line relative"
              style={{ width: dayWidth, minWidth: dayWidth }}
            >
              {showMonthDivider && (
                <div className="absolute -top-8 left-0 text-xs font-semibold text-foreground px-1 whitespace-nowrap">
                  {format(day, "MMM/yy", { locale: ptBR })}
                </div>
              )}
              <div className="text-xs text-center py-2 text-muted-foreground">
                {dayNumber}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
