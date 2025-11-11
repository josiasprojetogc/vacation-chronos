import { Calendar, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface GanttHeaderProps {
  title: string;
  currentDate: Date;
  onNavigate: (direction: "prev" | "next") => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
}

export const GanttHeader = ({
  title,
  currentDate,
  onNavigate,
  onZoomIn,
  onZoomOut,
  canZoomIn,
  canZoomOut,
  onDateRangeChange,
}: GanttHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-header-bg border-b border-border">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-vacation/20 border-vacation text-vacation-foreground">
            Férias Solicitação
          </Badge>
          <Badge variant="outline" className="bg-conflict/20 border-conflict text-conflict-foreground">
            Conflito Solicitação
          </Badge>
          <Badge variant="outline" className="bg-official/20 border-official text-official-foreground">
            Oficial
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={currentDate}
              onSelect={(date) => date && onDateRangeChange?.(date, date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-1 border-l border-border pl-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onZoomOut}
            disabled={!canZoomOut}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onZoomIn}
            disabled={!canZoomIn}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-l border-border pl-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate("prev")}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate("next")}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
