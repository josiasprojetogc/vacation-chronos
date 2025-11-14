import { VacationPeriod, VacationType } from "@/types/vacation";
import { calculatePeriodPosition, calculatePeriodWidth, Period } from "@/utils/dateUtils";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ViewMode } from "@/types/viewMode";

interface VacationBarProps {
  vacation: VacationPeriod;
  periods: Period[];
  periodWidth: number;
  rowHeight: number;
  type: VacationType;
  viewMode: ViewMode;
}

export const VacationBar = ({
  vacation,
  periods,
  periodWidth,
  rowHeight,
  type,
  viewMode,
}: VacationBarProps) => {
  const isOfficial = type === 'official';
  const startDate = isOfficial ? vacation.startDate : vacation.startDateReq;
  const endDate = isOfficial ? vacation.endDate : vacation.endDateReq;
  
  const startPos = calculatePeriodPosition(startDate, periods, periodWidth, viewMode);
  const width = calculatePeriodWidth(startDate, endDate, periods, periodWidth, viewMode);
  
  const barHeight = (rowHeight - 12) / 2;
  const topPosition = isOfficial ? rowHeight / 2 + 2 : 4;

  return (
    <div
      className={cn(
        "absolute rounded-md flex items-center px-2 text-xs font-medium transition-all hover:opacity-80 cursor-pointer",
        isOfficial
          ? "bg-official/80 border-2 border-official text-official-foreground"
          : vacation.hasConflict
          ? "bg-conflict/80 border-2 border-conflict text-conflict-foreground"
          : "bg-vacation/80 border-2 border-vacation text-vacation-foreground"
      )}
      style={{
        left: startPos,
        width: width,
        height: barHeight,
        top: topPosition,
      }}
      title={`${vacation.nome}\n${isOfficial ? `${vacation.dataini} → ${vacation.datafim}` : `${vacation.datainireq} → ${vacation.datafimreq}`}${
        !isOfficial && vacation.hasConflict ? "\n⚠️ Conflito detectado" : ""
      }`}
    >
      {isOfficial ? (
        <div className="flex justify-center items-center truncate w-full">
          <span className="text-[10px] font-semibold">
            {format(startDate, "dd/MM/yyyy")} → {format(endDate, "dd/MM/yyyy")}
          </span>
        </div>
      ) : (
        <div className="flex flex-col justify-center truncate w-full">
          <span className="font-semibold truncate">{vacation.nome}</span>
          <span className="text-[10px] opacity-90">
            {format(startDate, "dd/MM/yyyy")} → {format(endDate, "dd/MM/yyyy")}
          </span>
        </div>
      )}
    </div>
  );
};
