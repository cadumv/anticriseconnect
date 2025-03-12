
import { Calendar, CalendarClock, CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TimeFilter = "all" | "day" | "week" | "month";

interface TimeFilterSelectorProps {
  timeFilter: TimeFilter;
  onTimeFilterChange: (value: TimeFilter) => void;
}

export const TimeFilterSelector = ({ timeFilter, onTimeFilterChange }: TimeFilterSelectorProps) => (
  <Select 
    value={timeFilter} 
    onValueChange={(value) => onTimeFilterChange(value as TimeFilter)}
  >
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Filtrar por período" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Todos</span>
        </div>
      </SelectItem>
      <SelectItem value="day">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />
          <span>Último dia</span>
        </div>
      </SelectItem>
      <SelectItem value="week">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>Última semana</span>
        </div>
      </SelectItem>
      <SelectItem value="month">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Último mês</span>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
);
