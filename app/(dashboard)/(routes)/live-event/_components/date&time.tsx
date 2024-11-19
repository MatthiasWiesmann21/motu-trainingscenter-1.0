"use client";

import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { useLanguage } from "@/lib/check-language";
import axios from "axios";
import moment from "moment";
import { useRef, useState } from "react";

export const DateandTime = ({
  setLiveEvent,
  getEvent,
  liveEvent,
}: {
  setLiveEvent: any;
  getEvent: any;
  liveEvent: any[];
}) => {
  const endDateInputRef = useRef(null);
  const startDateInputRef = useRef(null);
  const [startDateTime, setStartDateTime] = useState<Date | undefined>();
  const [endDateTime, setEndDateTime] = useState<Date | undefined>();
  const currentLanguage = useLanguage();

  return (
    <div className="mt-4 flex w-full flex-col space-y-4">
      <div className="flex flex-col items-start gap-2">
        <div className="relative mb-2 w-full overflow-hidden">
          <div className="text-sm">{currentLanguage.live_event_filter_start_date_text}</div>
          <input
            type="datetime-local"
            ref={startDateInputRef}
            className="absolute -z-[1] w-full"
            onChange={(e) => {
              setStartDateTime(new Date(e?.target?.value));
            }}
          />
          <input
            // @ts-ignore
            onClick={() => startDateInputRef?.current?.showPicker()}
            type="text"
            placeholder={currentLanguage.live_event_filter_start_date}
            value={
              startDateTime
                ? moment(startDateTime)?.format("YYYY-MM-DD HH:mm")
                : ""
            }
            className="border-1 z-[1] w-full cursor-pointer rounded border border-black dark:border-white px-2"
          />
        </div>
        <div className="relative mb-2 w-full overflow-hidden">
          <div className="text-sm">{currentLanguage.live_event_filter_end_date_text}</div>
          <input
            type="datetime-local"
            ref={endDateInputRef}
            className="absolute -z-[1] w-full"
            onChange={(e) => {
              setEndDateTime(new Date(e?.target?.value));
            }}
          />
          <input
            // @ts-ignore
            onClick={() => endDateInputRef?.current?.showPicker()}
            type="text"
            placeholder={currentLanguage.live_event_filter_end_date}
            value={
              endDateTime ? moment(endDateTime)?.format("YYYY-MM-DD HH:mm") : ""
            }
            className="border-1 z-[1] w-full cursor-pointer rounded border border-black dark:border-white px-2"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <SheetClose>
          <Button
            onClick={async () => {
              const response = await axios?.get(`/api/liveEvent`);
              setLiveEvent(response?.data);
            }}
            variant="default"
            className="border-1 cursor-pointer rounded-lg border p-1 px-2"
          >
            {currentLanguage.live_event_filter_clearFilter_button_text}
          </Button>
        </SheetClose>
         <SheetClose>
          <Button
            onClick={async () => {
              const response = await axios?.post(`/api/liveEvent/filter`, {
                ...getEvent,
                startDateTime,
                endDateTime,
              });
              setLiveEvent(response?.data);
            }}
            variant="success"
            className="border-1 cursor-pointer rounded-lg border p-1 px-2"
          >
            {currentLanguage.live_event_filter_applyFilter_button_text}
          </Button>
        </SheetClose>
      </div>
    </div>
  );
};
