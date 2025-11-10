import { VacationPeriod } from "@/types/vacation";
import { calculateDayPosition } from "@/utils/dateUtils";
import { differenceInDays, format } from "date-fns";
import { cn } from "@/lib/utils";

interface VacationBarProps {
  vacation: VacationPeriod;
  rangeStart: Date;
  dayWidth: number;
  rowHeight: number;
}

export const VacationBar = ({
  vacation,
  rangeStart,
  dayWidth,
  rowHeight,
}: VacationBarProps) => {
  const startPos = calculateDayPosition(vacation.startDate, rangeStart, dayWidth);
  const duration = differenceInDays(vacation.endDate, vacation.startDate) + 1;
  const width = duration * dayWidth;

  return (
    <div
      className={cn(
        "absolute rounded-md flex items-center px-2 text-xs font-medium transition-all hover:opacity-80 cursor-pointer",
        vacation.hasConflict
          ? "bg-conflict/80 border-2 border-conflict text-conflict-foreground"
          : "bg-vacation/80 border-2 border-vacation text-vacation-foreground"
      )}
      style={{
        left: startPos,
        width: width,
        height: rowHeight - 8,
        top: 4,
      }}
      title={`${vacation.nome}\n${vacation.dataini} → ${vacation.datafim}${
        vacation.hasConflict ? "\n⚠️ Conflito detectado" : ""
      }`}
    >
      <div className="flex flex-col justify-center truncate w-full">
        <span className="font-semibold truncate">{vacation.nome}</span>
        <span className="text-[10px] opacity-90">
          {format(vacation.startDate, "dd/MM/yyyy")} → {format(vacation.endDate, "dd/MM/yyyy")}
        </span>
      </div>
    </div>
  );
};
