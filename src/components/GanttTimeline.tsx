import { format, isSameDay, startOfDay, isWeekend, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ViewMode } from "@/types/viewMode";
import { Period } from "@/utils/dateUtils";

interface GanttTimelineProps {
  periods: Period[];
  periodWidth: number;
  leftColumnWidth: number;
  viewMode: ViewMode;
}

const weekdayAbbr = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

export const GanttTimeline = ({ periods, periodWidth, leftColumnWidth, viewMode }: GanttTimelineProps) => {
  const today = startOfDay(new Date());
  let currentYear = "";
  let currentMonth = "";

  const getQuarter = (date: Date) => {
    const month = date.getMonth();
    return Math.floor(month / 3) + 1;
  };

  return (
    <div className="sticky top-0 z-30 bg-header-bg border-b border-border">
      {/* Ano - sempre mostra */}
      <div className="flex">
        <div
          className="flex-shrink-0 border-r border-b border-border flex items-center justify-center sticky left-0 bg-header-bg z-40"
          style={{ width: leftColumnWidth, height: "32px" }}
        />
        <div className="flex">
          {periods.map((period, index) => {
            const yearName = format(period.date, "yyyy");
            const showYearDivider = yearName !== currentYear;
            const isTodayColumn = isSameDay(period.date, today);
            
            if (showYearDivider) {
              currentYear = yearName;
            }

            return (
              <div
                key={`year-${index}`}
                className={`border-r border-grid-line flex items-center justify-center ${isTodayColumn ? 'bg-today-highlight/10' : ''}`}
                style={{ width: periodWidth, minWidth: periodWidth, height: "32px" }}
              >
                {showYearDivider && viewMode !== 'year' && (
                  <span className="text-xs font-semibold text-foreground">{yearName}</span>
                )}
                {viewMode === 'year' && (
                  <span className="text-xs font-semibold text-foreground">{yearName}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Trimestre - apenas para viewMode quarter */}
      {viewMode === 'quarter' && (
        <div className="flex">
          <div
            className="flex-shrink-0 border-r border-b border-border flex items-center justify-center sticky left-0 bg-header-bg z-40"
            style={{ width: leftColumnWidth, height: "32px" }}
          />
          <div className="flex">
            {periods.map((period, index) => {
              const quarterNum = getQuarter(period.date);
              const quarterName = `Q${quarterNum}`;
              const isTodayColumn = isSameDay(period.date, today);

              return (
                <div
                  key={`quarter-${index}`}
                  className={`border-l-2 border-l-primary border-r border-grid-line flex items-center justify-center ${isTodayColumn ? 'bg-today-highlight/10' : ''}`}
                  style={{ width: periodWidth, minWidth: periodWidth, height: "32px" }}
                >
                  <span className="text-xs font-semibold text-foreground">{quarterName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mês - apenas para viewMode month */}
      {viewMode === 'month' && (
        <div className="flex">
          <div
            className="flex-shrink-0 border-r border-b border-border flex items-center justify-center sticky left-0 bg-header-bg z-40"
            style={{ width: leftColumnWidth, height: "32px" }}
          />
          <div className="flex">
            {periods.map((period, index) => {
              const monthName = format(period.date, "MMMM", { locale: ptBR });
              const isTodayColumn = isSameDay(period.date, today);

              return (
                <div
                  key={`month-${index}`}
                  className={`border-l-2 border-l-primary border-r border-grid-line flex items-center justify-center ${isTodayColumn ? 'bg-today-highlight/10' : ''}`}
                  style={{ width: periodWidth, minWidth: periodWidth, height: "32px" }}
                >
                  <span className="text-xs font-semibold text-foreground capitalize">{monthName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dias e meses - apenas para viewMode day */}
      {viewMode === 'day' && (
        <>
          {/* Linha de mês */}
          <div className="flex">
            <div
              className="flex-shrink-0 border-r border-b border-border flex items-center justify-center sticky left-0 bg-header-bg z-20"
              style={{ width: leftColumnWidth, height: "32px" }}
            />
            <div className="flex">
              {periods.map((period, index) => {
                const monthName = format(period.date, "MMMM", { locale: ptBR });
                const showMonthDivider = monthName !== currentMonth;
                const isTodayColumn = isSameDay(period.date, today);
                
                if (showMonthDivider) {
                  currentMonth = monthName;
                }

                return (
                  <div
                    key={`month-${index}`}
                    className={`flex items-center justify-center ${showMonthDivider ? 'border-l-2 border-l-primary' : ''} border-r border-grid-line ${isTodayColumn ? 'bg-today-highlight/10' : ''}`}
                    style={{ width: periodWidth, minWidth: periodWidth, height: "32px" }}
                  >
                    {showMonthDivider && (
                      <span className="text-xs font-semibold text-foreground capitalize">{monthName}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Linha de dias */}
          <div className="flex">
            <div
              className="flex-shrink-0 border-r border-border p-2 flex items-center justify-center font-semibold text-muted-foreground text-sm sticky left-0 bg-header-bg z-40"
              style={{ width: leftColumnWidth }}
            >
              Colaborador
            </div>
            <div className="flex">
              {periods.map((period, index) => {
                const dayNumber = format(period.date, "d");
                const dayOfWeek = getDay(period.date);
                const weekday = weekdayAbbr[dayOfWeek];
                const isTodayColumn = isSameDay(period.date, today);
                const isWeekendDay = isWeekend(period.date);

                return (
                  <div
                    key={`day-${index}`}
                    className={`border-r border-grid-line ${isTodayColumn ? 'bg-today-highlight/10' : isWeekendDay ? 'bg-weekend' : ''}`}
                    style={{ width: periodWidth, minWidth: periodWidth }}
                  >
                    <div className={`text-xs text-center py-1 ${isWeekendDay ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                      <div>{dayNumber}</div>
                      <div className="text-[10px]">{weekday}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      
      {/* Label Colaborador para outros modos */}
      {viewMode !== 'day' && (
        <div className="flex">
          <div
            className="flex-shrink-0 border-r border-border p-2 flex items-center justify-center font-semibold text-muted-foreground text-sm sticky left-0 bg-header-bg z-40"
            style={{ width: leftColumnWidth, height: "32px" }}
          >
            Colaborador
          </div>
          <div className="flex">
            {periods.map((period, index) => {
              const isTodayColumn = isSameDay(period.date, today);
              return (
                <div
                  key={`empty-${index}`}
                  className={`border-r border-grid-line ${isTodayColumn ? 'bg-today-highlight/10' : ''}`}
                  style={{ width: periodWidth, minWidth: periodWidth, height: "32px" }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
