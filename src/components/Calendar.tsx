import type { Day } from "@prisma/client";
import { format, formatISO, isBefore, parse } from "date-fns";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import ReactCalendar from "react-calendar";
import { OPENING_HOURS_INTERVAL, now } from "~/constants/config";
import { getOpeningTimes, roundToNearestMinutes } from "~/utils/helpers";
import { DateTime } from "~/utils/types";

interface CalendarProps {
  days: Day[];
  closedDays: string[]; // as ISO strings
}

const Calendar: FC<CalendarProps> = ({ days, closedDays }) => {
  const router = useRouter();

  //Determine if todays is closed
  const today = days.find((d) => d.dayOfWeek === now.getDay());
  const rounded = roundToNearestMinutes(now, OPENING_HOURS_INTERVAL);
  const closing = parse(today!.closeTime, "kk:mm", now);
  const tooLate = !isBefore(rounded, closing);
  if (tooLate) closedDays.push(formatISO(new Date().setHours(0, 0, 0, 0)));

  const [date, setDate] = useState<DateTime>({
    justDate: null,
    dateTime: null,
  });

  useEffect(() => {
    if (date.dateTime) {
      localStorage.setItem("selectedTime", date.dateTime.toISOString());
      router.push("/menu");
    }
  }, [date.dateTime]);

  const times = date.justDate && getOpeningTimes(date.justDate, days);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {date.justDate ? (
        <div className="flex gap-4">
          {times?.map((time, i) => (
            <div key={`time-${i}`} className="rounded-sm bg-gray-100 p-2">
              <button
                type="button"
                onClick={() => setDate((prev) => ({ ...prev, dateTime: time }))}
              >
                {format(time, "kk:mm")}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <ReactCalendar
          minDate={new Date()}
          className="REACT-CALENDAR p-2"
          view="month"
          tileDisabled={({ date }) => closedDays.includes(formatISO(date))}
          onClickDay={(date) =>
            setDate((prev) => ({ ...prev, justDate: date }))
          }
          locale="en"
        />
      )}
    </div>
  );
};

export default Calendar;
