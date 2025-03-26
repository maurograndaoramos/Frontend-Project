"use client";

import * as React from "react";
import ReactDatePicker from "react-datepicker";
import { CalendarIcon } from "lucide-react";
import { format, isSaturday, isSunday, isToday } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

import { cn } from "@/lib/utils";

export interface DatePickerProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
  className?: string;
  disabled?: boolean;
  disablePastDates?: boolean;
  disableWeekends?: boolean;
  disabledDates?: Date[];
  placeholderText?: string;
  showTimeSelect?: boolean;
  minTime?: Date;
  maxTime?: Date;
  isSameDay?: boolean;
}

export function DatePicker({
  date,
  setDate,
  className,
  disabled = false,
  disablePastDates = true,
  disableWeekends = false,
  disabledDates = [],
  placeholderText = "Select date",
  showTimeSelect = false,
  minTime,
  maxTime,
  isSameDay = false,
}: DatePickerProps) {
  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const isHoliday = (date: Date) => {
    return disabledDates.some(disabledDate => 
      disabledDate.getFullYear() === date.getFullYear() &&
      disabledDate.getMonth() === date.getMonth() &&
      disabledDate.getDate() === date.getDate()
    );
  };

  const filterDate = (date: Date) => {
    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (disablePastDates && date < today) {
      return false;
    }
    
    // Check if date is a weekend
    if (disableWeekends && !isWeekday(date)) {
      return false;
    }
    
    // Check if date is in the disabled dates list (holidays)
    if (isHoliday(date)) {
      return false;
    }
    
    return true;
  };

  // For same-day delivery, check if current time is before cutoff (e.g., 2PM)
  const now = new Date();
  const currentHour = now.getHours();
  const todayCutoff = currentHour >= 14; // 2PM cutoff for same-day
  
  // Disable today for same-day delivery if after cutoff
  const filterTimeForSameDay = (date: Date) => {
    const today = new Date();
    const isCurrentDay = date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear();
                  
    if (isCurrentDay && todayCutoff) {
      return false;
    }
    
    return true;
  };

  // Custom rendering of day cells to highlight different delivery options
  const renderDayContents = (day: number, date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isWeekend = isSaturday(date) || isSunday(date);
    
    if (isToday(date) && !todayCutoff) {
      // Today (same day delivery available - 29.99€)
      return (
        <span className="relative">
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-green-500"></span>
          {day}
        </span>
      );
    } else if (date > today && !isWeekend) {
      // Standard delivery date (19.99€) - only for future dates that aren't weekends
      return (
        <span className="relative">
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500"></span>
          {day}
        </span>
      );
    } else {
      // Past dates, today with cutoff passed, or weekends
      return <span>{day}</span>;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <ReactDatePicker
        selected={date}
        onChange={setDate}
        dateFormat="dd/MM/yyyy"
        wrapperClassName="w-full"
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        )}
        placeholderText={placeholderText}
        disabled={disabled}
        filterDate={(date) => filterDate(date) && filterTimeForSameDay(date)}
        showTimeSelect={showTimeSelect}
        minTime={minTime}
        maxTime={maxTime}
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Time"
        renderDayContents={renderDayContents}
        dayClassName={(date) => {
          // Add custom classes for different types of days
          if (isToday(date) && !todayCutoff) {
            return "same-day-delivery";
          }
          return "";
        }}
        calendarClassName="bg-card text-card-foreground border border-border rounded-md shadow-md"
        popperClassName="z-50 datepicker-center"
        calendarStartDay={1}
        popperPlacement="bottom"
      />
      <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
      
      {/* Custom styles for React DatePicker */}
      <style jsx global>{`
        .react-datepicker {
          font-family: inherit;
          border-color: hsl(var(--border));
          background-color: hsl(var(--card));
        }
        .datepicker-center .react-datepicker__triangle {
          left: 50% !important;
          transform: translateX(-50%) !important;
        }
        .datepicker-center .react-datepicker {
          transform: translateX(-50%);
          left: 50% !important;
        }
        .react-datepicker__header {
          background-color: hsl(var(--muted));
          border-color: hsl(var(--border));
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: hsl(var(--card-foreground));
        }
        .react-datepicker__day {
          color: hsl(var(--foreground));
          position: relative;
          margin-top: 6px;
        }
        .react-datepicker__day:hover {
          background-color: hsl(35 85% 65%);
          color: hsl(35 85% 15%);
          border-radius: var(--radius);
        }
        .react-datepicker__day--selected {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          border-radius: var(--radius);
        }
        .react-datepicker__day--keyboard-selected {
          background-color: hsl(var(--secondary));
          color: hsl(var(--secondary-foreground));
          border-radius: var(--radius);
        }
        .react-datepicker__day--disabled {
          color: hsl(var(--muted-foreground));
          opacity: 0.5;
          text-decoration: line-through;
          pointer-events: none;
        }
        .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
          border-color: hsl(var(--primary));
        }
        .react-datepicker__time-container .react-datepicker__time {
          background-color: hsl(var(--card));
        }
        .react-datepicker__time-container .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {
          background-color: hsl(var(--accent) / 20%);
        }
        .react-datepicker__time-container .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        .same-day-delivery {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
} 