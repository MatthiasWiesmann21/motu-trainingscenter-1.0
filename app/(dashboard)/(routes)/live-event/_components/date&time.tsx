"use client";

import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { useLanguage } from "@/lib/check-language";
import axios from "axios";
import { format } from "date-fns";
import { useState } from "react";
import { CalendarIcon, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

export const DateandTime = ({
  setLiveEvent,
  getEvent,
  liveEvent,
}: {
  setLiveEvent: any;
  getEvent: any;
  liveEvent: any[];
}) => {
  const [startDateTime, setStartDateTime] = useState<Date | undefined>();
  const [endDateTime, setEndDateTime] = useState<Date | undefined>();
  const currentLanguage = useLanguage();

  const handleApplyFilter = async (closeSheet: () => void) => {
    try {
      const response = await axios?.post(`/api/liveEvent/filter`, {
        ...getEvent,
        startDateTime,
        endDateTime,
      });
      setLiveEvent(response?.data);
      closeSheet();
    } catch (error) {
      console.error("Error applying filter:", error);
    }
  };

  const handleClearFilter = async (closeSheet: () => void) => {
    try {
      const response = await axios?.get(`/api/liveEvent`);
      setLiveEvent(response?.data);
      setStartDateTime(undefined);
      setEndDateTime(undefined);
      closeSheet();
    } catch (error) {
      console.error("Error clearing filter:", error);
    }
  };

  return (
    <Card className="my-4 w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            {currentLanguage.live_event_filter_title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDateTime && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDateTime ? (
                  format(startDateTime, "PPP p")
                ) : (
                  <span>Start Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverPrimitive.Portal>
              <PopoverPrimitive.Content
                className="z-[999] w-auto rounded-md border-2 bg-white p-0 dark:bg-black"
                align="start"
                side="bottom"
                sideOffset={10}
                onCloseAutoFocus={(e) => e.preventDefault()}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Calendar
                  mode="single"
                  selected={startDateTime}
                  onSelect={(date) => {
                    if (date) {
                      const currentTime = startDateTime || new Date();
                      date.setHours(
                        currentTime.getHours(),
                        currentTime.getMinutes()
                      );
                      setStartDateTime(date);
                    }
                  }}
                  initialFocus
                />
                <div className="border-t p-3">
                  <Input
                    type="time"
                    value={startDateTime ? format(startDateTime, "HH:mm") : ""}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":");
                      const newDate = startDateTime
                        ? new Date(startDateTime)
                        : new Date();
                      newDate.setHours(parseInt(hours), parseInt(minutes));
                      setStartDateTime(newDate);
                    }}
                  />
                </div>
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          </Popover>

          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDateTime && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDateTime ? (
                  format(endDateTime, "PPP p")
                ) : (
                  <span>End Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverPrimitive.Portal>
              <PopoverPrimitive.Content
                className="z-[999] w-auto rounded-md border-2 bg-white p-0 dark:bg-black"
                align="start"
                side="bottom"
                sideOffset={10}
                onCloseAutoFocus={(e) => e.preventDefault()}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Calendar
                  mode="single"
                  selected={endDateTime}
                  onSelect={(date) => {
                    if (date) {
                      const currentTime = endDateTime || new Date();
                      date.setHours(
                        currentTime.getHours(),
                        currentTime.getMinutes()
                      );
                      setEndDateTime(date);
                    }
                  }}
                  initialFocus
                />
                <div className="border-t p-3">
                  <Input
                    type="time"
                    value={endDateTime ? format(endDateTime, "HH:mm") : ""}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":");
                      const newDate = endDateTime
                        ? new Date(endDateTime)
                        : new Date();
                      newDate.setHours(parseInt(hours), parseInt(minutes));
                      setEndDateTime(newDate);
                    }}
                  />
                </div>
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          </Popover>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <SheetClose asChild>
          <Button 
            variant="ghost" 
            onClick={() => handleClearFilter(() => {})}
          >
            {currentLanguage.live_event_filter_clearFilter_button_text}
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button
            onClick={() => handleApplyFilter(() => {})}
            disabled={!startDateTime && !endDateTime}
          >
            {currentLanguage.live_event_filter_applyFilter_button_text}
          </Button>
        </SheetClose>
      </CardFooter>
    </Card>
  );
};