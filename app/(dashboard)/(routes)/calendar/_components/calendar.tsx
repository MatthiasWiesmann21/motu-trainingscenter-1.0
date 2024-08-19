"use client";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";

const CalendarWidget = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold">Calendar</h2>
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
    </div>
  );
};

export default CalendarWidget;
