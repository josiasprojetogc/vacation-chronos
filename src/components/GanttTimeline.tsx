import { format, isSameDay, isToday, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ViewMode } from "@/types/viewMode";

interface GanttTimelineProps {
  days: Date[];
  dayWidth: number;
  leftColumnWidth: number;
  viewMode: ViewMode;
}

export const GanttTimeline = ({ days, dayWidth, leftColumnWidth, viewMode }: GanttTimelineProps) => {
  let currentYear = "";
  let currentMonth = "";
  let currentQuarter = "";
  const today = startOfDay(new Date());

  const getQuarter = (date: Date) => {
    const month = date.getMonth();
    return Math.floor(month / 3) + 1;
  };

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
            const isTodayColumn = isSameDay(day, today);
            
            if (showYearDivider) {
              currentYear = yearName;
            }

            return (
              <div
                key={`year-${index}`}
                className={`border-r border-grid-line flex items-center justify-center ${isTodayColumn ? 'bg-today-highlight/10' : ''}`}
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

      {/* Trimestre (apenas para viewMode quarter e year) */}
      {(viewMode === 'quarter' || viewMode === 'year') && (
        <div className="flex">
          <div
            className="flex-shrink-0 border-r border-b border-border flex items-center justify-center sticky left-0 bg-header-bg z-20"
            style={{ width: leftColumnWidth, height: "32px" }}
          />
          <div className="flex">
            {days.map((day, index) => {
              const quarterNum = getQuarter(day);
              const quarterName = `Q${quarterNum}`;
              const showQuarterDivider = quarterName !== currentQuarter;
              const isTodayColumn = isSameDay(day, today);
              
              if (showQuarterDivider) {
                currentQuarter = quarterName;
              }

              return (
                <div
                  key={`quarter-${index}`}
                  className={`flex items-center justify-center ${showQuarterDivider ? 'border-l-2 border-l-primary' : ''} border-r border-grid-line ${isTodayColumn ? 'bg-today-highlight/10' : ''}`}
                  style={{ width: dayWidth, minWidth: dayWidth, height: "32px" }}
                >
                  {showQuarterDivider && (
                    <span className="text-xs font-semibold text-foreground">{quarterName}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mês (para viewMode day e month) */}
      {(viewMode === 'day' || viewMode === 'month') && (
        <div className="flex">
          <div
            className="flex-shrink-0 border-r border-b border-border flex items-center justify-center sticky left-0 bg-header-bg z-20"
            style={{ width: leftColumnWidth, height: "32px" }}
          />
          <div className="flex">
            {days.map((day, index) => {
              const monthName = format(day, "MMMM", { locale: ptBR });
              const showMonthDivider = monthName !== currentMonth;
              const isTodayColumn = isSameDay(day, today);
              
              if (showMonthDivider) {
                currentMonth = monthName;
              }

              return (
                <div
                  key={`month-${index}`}
                  className={`flex items-center justify-center ${showMonthDivider ? 'border-l-2 border-l-primary' : ''} border-r border-grid-line ${isTodayColumn ? 'bg-today-highlight/10' : ''}`}
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
      )}

      {/* Dias (apenas para viewMode day) */}
      {viewMode === 'day' && (
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
              const isTodayColumn = isSameDay(day, today);

              return (
                <div
                  key={`day-${index}`}
                  className={`border-r border-grid-line ${isTodayColumn ? 'bg-today-highlight/10' : ''}`}
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
      )}
      
      {/* Label Colaborador para outros modos */}
      {viewMode !== 'day' && (
        <div className="flex">
          <div
            className="flex-shrink-0 border-r border-border p-2 flex items-center justify-center font-semibold text-muted-foreground text-sm sticky left-0 bg-header-bg z-20"
            style={{ width: leftColumnWidth, height: "32px" }}
          >
            Colaborador
          </div>
          <div className="flex">
            {days.map((day, index) => {
              const isTodayColumn = isSameDay(day, today);
              return (
                <div
                  key={`empty-${index}`}
                  className={`border-r border-grid-line ${isTodayColumn ? 'bg-today-highlight/10' : ''}`}
                  style={{ width: dayWidth, minWidth: dayWidth, height: "32px" }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
