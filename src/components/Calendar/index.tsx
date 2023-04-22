import { FC, useState } from "react";
import ReactCalendar from "react-calendar";

interface indexProps {}
interface DateType {
  justDate: Date | null;
  dateTime: Date | null;
}

const index: FC<indexProps> = ({}) => {
  const [date, setDate] = useState<DateType>({
    justDate: null,
    dateTime: null,
  });

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {date.justDate ? (
        <div className="flex gap-4">

        </div>
      ) : (
        <ReactCalendar
          minDate={new Date()}
          className="REACT-CALENDAR p-2"
          view="month"
          onClickDay={(date) => setDate((prev) => ({ ...prev, justDate: date }))}
          locale="en"
        />
      )}
    </div>
  );
};

export default index;
