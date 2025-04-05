import React, { useRef, useState } from "react";
import styles from "./PomodoroWidget.module.css";
import WidgetBase, { WidgetBaseProps } from "@/components/WidgetBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForwardStep } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

enum State {
  Pomodoro,
  ShortBreak,
  LongBreak,
}

export function PomodoroWidget(props: WidgetBaseProps) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>(null);
  const alarm = new Audio("/alarm.wav");

  function getCurrentState(step?: number) {
    const value = step != null? step : currentStep;
    switch (value) {
      case 1:
      case 3:
      case 5:
        return State.ShortBreak;
      case 7:
        return State.LongBreak;
      default:
        return State.Pomodoro;
    }
  }

  const currentState = getCurrentState();

  const pomodoroBg = "#e35654";
  const shortBg = "#4cb0ad";
  const longBg = "#4f87b2";

  const currentBg: string = (() => {
    switch (currentState) {
      case State.Pomodoro:
        return pomodoroBg;
      case State.ShortBreak:
        return shortBg;
      case State.LongBreak:
        return longBg;
    }
  })();

  function handleStart() {
    const current = Date.now();
    setStartTime(current);
    setNow(current);

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);
  }

  function handleStop() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (startTime != null && now != null) {
      const secondsPassed = Math.floor((now - startTime) / 1000);
      setCurrentTime((prevTime) => prevTime - secondsPassed);
    }
  }

  function handleTimer() {
    if (timerActive) {
      handleStop();
    } else {
      handleStart();
    }
    setTimerActive((prev) => !prev);
  }

  function transitionState() {
    handleStop();
    setTimerActive(false);
    setCurrentStep((prev) => {
      const newStep = (prev + 1) % 8;
      const newTime = (() => {
        switch (getCurrentState(newStep)) {
          case State.Pomodoro:
            return 25 * 60;
          case State.ShortBreak:
            return 5 * 60;
          case State.LongBreak:
            return 15 * 60;
        }
      })();
      setCurrentTime(newTime);
      return newStep;
    });
  }

  let currentTimeString = "25:00";
  if (startTime != null && now != null) {
    const secondsPassed = timerActive
      ? Math.floor((now - startTime) / 1000)
      : 0;
    const timerState = currentTime - secondsPassed;
    if (timerState < 0) {
      alarm.play();
      transitionState();
    }
    currentTimeString = formatSeconds(timerState);
  }

  return (
    <WidgetBase
      {...props}
      className={styles.tom}
      style={{ "--primary-background": currentBg } as React.CSSProperties}
    >
      <div className={styles.sections}>
        <p
          className={classNames(
            currentState == State.Pomodoro && styles.selected
          )}
        >
          Pomodoro
        </p>
        <p
          className={classNames(
            currentState == State.ShortBreak && styles.selected
          )}
        >
          Short
        </p>
        <p
          className={classNames(
            currentState == State.LongBreak && styles.selected
          )}
        >
          Long
        </p>
      </div>
      <p className="text-6xl font-bold">{currentTimeString}</p>
      <button onClick={handleTimer} className={styles.button}>
        {timerActive ? "Pause" : "Start"}
      </button>
      {timerActive && (
        <button
          onClick={transitionState}
          className="absolute px-2 py-1 bottom-1 right-2 cursor-pointer"
        >
          <FontAwesomeIcon icon={faForwardStep} className={styles.icon} />
        </button>
      )}
    </WidgetBase>
  );
}

function formatSeconds(ms: number) {
  const minutes = Math.floor(ms / 60);
  const seconds = Math.floor(ms % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}