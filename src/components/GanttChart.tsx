import { useState, useMemo, useRef, useEffect } from "react";
import { GanttHeader } from "./GanttHeader";
import { GanttTimeline } from "./GanttTimeline";
import { GanttRow } from "./GanttRow";
import { useVacationData } from "@/hooks/useVacationData";
import { getDateRange, navigateMonth, getPeriods, Period } from "@/utils/dateUtils";
import { Loader2 } from "lucide-react";
import { addMonths, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfQuarter, endOfQuarter } from "date-fns";
import { ViewMode } from "@/types/viewMode";

const LEFT_COLUMN_WIDTH = 250;
const ROW_HEIGHT = 64;

export const GanttChart = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const { data: vacations, isLoading, error } = useVacationData(startOfMonth(currentMonth));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { dateRange, periods } = useMemo(() => {
    let start: Date;
    let end: Date;
    
    switch (viewMode) {
      case 'year':
        start = startOfYear(currentMonth);
        end = endOfYear(addMonths(currentMonth, 60)); // 6 anos
        break;
      case 'quarter':
        start = startOfQuarter(currentMonth);
        end = endOfQuarter(addMonths(currentMonth, 15)); // 6 trimestres
        break;
      case 'month':
        start = startOfMonth(currentMonth);
        end = endOfMonth(addMonths(currentMonth, 14)); // 15 meses
        break;
      case 'day':
      default:
        start = startOfMonth(currentMonth);
        end = endOfMonth(addMonths(currentMonth, 5)); // 6 meses
        break;
    }
    
    const range = getDateRange(start, end);
    const periodsData = getPeriods(start, end, viewMode);
    
    return {
      dateRange: range,
      periods: periodsData,
    };
  }, [currentMonth, viewMode]);

  const periodWidth = useMemo(() => {
    switch (viewMode) {
      case 'year':
        return 150;
      case 'quarter':
        return 200;
      case 'month':
        return 120;
      case 'day':
      default:
        return 50;
    }
  }, [viewMode]);

  const handleNavigate = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => navigateMonth(prev, direction));
  };

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setCurrentMonth(startDate);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando dados de férias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <p className="text-destructive font-semibold mb-2">Erro ao carregar dados</p>
          <p className="text-muted-foreground text-sm">
            Não foi possível conectar com a API
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <GanttHeader
        title="Férias - Setor T.I."
        currentDate={currentMonth}
        onNavigate={handleNavigate}
        onDateRangeChange={handleDateRangeChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto"
        style={{ scrollbarGutter: "stable" }}
      >
        <div className="inline-block min-w-full">
          <div className="relative">
            <GanttTimeline
              periods={periods}
              periodWidth={periodWidth}
              leftColumnWidth={LEFT_COLUMN_WIDTH}
              viewMode={viewMode}
            />
            {vacations?.map((vacation) => (
              <GanttRow
                key={vacation.codusu}
                vacation={vacation}
                periods={periods}
                periodWidth={periodWidth}
                leftColumnWidth={LEFT_COLUMN_WIDTH}
                rowHeight={ROW_HEIGHT}
                viewMode={viewMode}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
