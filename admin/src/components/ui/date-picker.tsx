import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calender";

interface DatePickerProps {
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  placeholderText = "Select date",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateChange = (date: Date | undefined) => {
    onChange(date || null); // Convert `undefined` back to `null` for consistency
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left bg-gray-700 border-gray-600"
          disabled={disabled}
        >
          {selected ? (
            format(selected, "PPP")
          ) : (
            <span className="text-gray-400">{placeholderText}</span>
          )}
          <CalendarIcon className="w-4 h-4 ml-auto text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto">
        <Calendar
          mode="single"
          selected={selected || undefined} // Ensure `null` is converted to `undefined`
          onSelect={handleDateChange}
          disabled={(date) =>
            disabled || date < new Date() // Disable past dates
          }
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
