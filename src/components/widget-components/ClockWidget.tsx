import WidgetBase, { WidgetBaseProps } from "components/WidgetBase";
import { useState, useRef, useEffect } from "react";

export function ClockWidget(props: WidgetBaseProps) {
  const [time, setTime] = useState(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateClock = () => setTime(new Date());

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000;

    const timeout = setTimeout(() => {
      updateClock();
      intervalRef.current = setInterval(updateClock, 60000); //Update every minute
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <WidgetBase
      className="flex flex-col items-center bg-[url('/oceansky.jpg')] bg-cover px-4 py-2 rounded-md text-blue-50"
      {...props}
    >
      <h1 className="text-3xl">
        {time.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        })}
      </h1>
      <h2>
        {time.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </h2>
    </WidgetBase>
  );
}
