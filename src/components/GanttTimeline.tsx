import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GanttTimelineProps {
  days: Date[];
  dayWidth: number;
  leftColumnWidth: number;
}

export const GanttTimeline = ({ days, dayWidth, leftColumnWidth }: GanttTimelineProps) => {
  let currentYear = "";
  let currentMonth = "";

  return (
    <div className="sticky top-0 z-10 bg-header-bg border-b border-border">
      {/* Ano */}
      <div className="flex">
        <div
          className="flex-shrink-0 border-r border-b border-border flex items-center justify-center sticky left-0 bg-header-bg z-20"
          style={{ width: leftColumnWidth, height: "32px" }}
        />
        <div className="flex">
          {days.map((day, index) => {
            const yearName = format(day, "yyyy");
            const showYearDivider = yearName !== currentYear;
            
            if (showYearDivider) {
              currentYear = yearName;
            }

            return (
              <div
                key={`year-${index}`}
                className="border-r border-grid-line flex items-center justify-center"
                style={{ width: dayWidth, minWidth: dayWidth, height: "32px" }}
              >
                {showYearDivider && (
                  <span className="text-xs font-semibold text-foreground">{yearName}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mês */}
      <div className="flex">
        <div
          className="flex-shrink-0 border-r border-b border-border flex items-center justify-center sticky left-0 bg-header-bg z-20"
          style={{ width: leftColumnWidth, height: "32px" }}
        />
        <div className="flex">
          {days.map((day, index) => {
            const monthName = format(day, "MMMM", { locale: ptBR });
            const showMonthDivider = monthName !== currentMonth;
            
            if (showMonthDivider) {
              currentMonth = monthName;
            }

            return (
              <div
                key={`month-${index}`}
                className={`flex items-center justify-center ${showMonthDivider ? 'border-l-2 border-l-primary' : ''} border-r border-grid-line`}
                style={{ width: dayWidth, minWidth: dayWidth, height: "32px" }}
              >
                {showMonthDivider && (
                  <span className="text-xs font-semibold text-foreground capitalize">{monthName}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dias */}
      <div className="flex">
        <div
          className="flex-shrink-0 border-r border-border p-2 flex items-center justify-center font-semibold text-muted-foreground text-sm sticky left-0 bg-header-bg z-20"
          style={{ width: leftColumnWidth }}
        >
          Colaborador
        </div>
        <div className="flex">
          {days.map((day, index) => {
            const dayNumber = format(day, "d");

            return (
              <div
                key={`day-${index}`}
                className="border-r border-grid-line"
                style={{ width: dayWidth, minWidth: dayWidth }}
              >
                <div className="text-xs text-center py-2 text-muted-foreground">
                  {dayNumber}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
