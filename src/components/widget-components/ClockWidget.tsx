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
      intervalRef.current = setInterval(updateClock, 60000); // Update every minute
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const scrollBackgroundKeyframes = `
    @keyframes scrollBackground {
      0% {
        background-position: 0% 25%;
      }
      50% {
        background-position: 100% 25%;
      }
      100% {
        background-position: 0% 25%;
      }
    }
  `;

  return (
    <WidgetBase
      className="
        flex flex-col select-none items-center text-center justify-center rounded-md text-white"
      glassy={false}
      {...props}
    >
      <div className="bg-[url('/oceansky.jpg')] px-4 py-2 rounded-md glassy"
           style={{
            animation: "scrollBackground 100s linear infinite",
            backgroundSize: "200% 500%",
            backgroundPositionY: "25%",
          }}>
        <style>{scrollBackgroundKeyframes}</style>
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
      </div>
    </WidgetBase>
  );
}
