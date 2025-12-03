import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MonthYearPickerProps {
  selected: Date;
  onSelect: (date: Date) => void;
}

const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export const MonthYearPicker = ({ selected, onSelect }: MonthYearPickerProps) => {
  const [viewYear, setViewYear] = useState(selected.getFullYear());

  const handleMonthSelect = (monthIndex: number) => {
    onSelect(new Date(viewYear, monthIndex, 1));
  };

  const handlePrevYear = () => setViewYear((y) => y - 1);
  const handleNextYear = () => setViewYear((y) => y + 1);

  const currentMonth = selected.getMonth();
  const currentYear = selected.getFullYear();

  return (
    <div className="p-3 w-[280px]">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePrevYear}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold text-foreground">{viewYear}</span>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextYear}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {MONTHS.map((month, index) => {
          const isSelected = viewYear === currentYear && index === currentMonth;
          return (
            <Button
              key={month}
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-9",
                isSelected && "bg-primary text-primary-foreground"
              )}
              onClick={() => handleMonthSelect(index)}
            >
              {month}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
