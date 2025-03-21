import WidgetBase, { WidgetBaseProps } from "components/WidgetBase";
import { calculate } from "lib/calculator";
import { useEffect, useRef, useState } from "react";
import styles from "./CalculatorWidget.module.css";
import Image from "next/image";

export function CalculatorWidget(props: WidgetBaseProps) {
  function evaluateExp(expression: string): string {
    try {
      return parseFloat(calculate(expression).toFixed(5)).toString();
    } catch (expError: unknown) {
      return String(expError);
    }
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = () => {
    if (!inputRef.current) return;

    const input = inputRef.current;
    const isOverflow = input.scrollWidth > input.clientWidth;
    setIsOverflowing(isOverflow);
  };

  useEffect(() => {
    if (!inputRef.current) return;

    if (isOverflowing)
      inputRef.current.value = inputRef.current.value.slice(0, -1);
  }, [isOverflowing]);

  const assignValue = (newVal: string, append?: boolean) => {
    if (!inputRef.current) return;

    const value = inputRef.current.value;
    const newValue = append ? value + newVal : newVal;

    // Temporarily set the value to check for overflow
    inputRef.current.value = newValue;
    checkOverflow();

    // Only update the value if it doesn't overflow
    if (!isOverflowing) {
      inputRef.current.value = newValue;
    } else {
      // Revert to the previous value if it overflows
      inputRef.current.value = value;
    }
  };

  return (
    <WidgetBase
      className={`grid grid-cols-4 grid-rows-6 select-none max-w-42 bg-gray-800 text-white place-content-center gap-2 py-4 px-2 rounded-2xl ${styles.Base}`}
      {...props}
    >
      <input
        ref={inputRef}
        readOnly={true}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          const { key, currentTarget } = e;
          const currVal = currentTarget.value;

          switch (key) {
            case "Enter": {
              currentTarget.value = evaluateExp(currVal);
              break;
            }
            case "Backspace": {
              currentTarget.value = currVal.slice(0, -1);
              checkOverflow();
              break;
            }
            case "Delete": {
              currentTarget.value = "";
              checkOverflow();
              break;
            }
            default: {
              if (key.match(/[0-9+%/*.()\-]/)) {
                assignValue(key, true);
              }
              break;
            }
          }
        }}
        placeholder="Enter an Expression"
        className="col-span-4 text-right pr-1"
      />
      <button
        className="place-items-center"
        onClick={() => {
          if (!inputRef.current) return;

          const value = inputRef.current.value;
          inputRef.current.value = value.slice(0, -1);
          checkOverflow();
        }}
      >
        <Image
          className="dark:invert"
          src="/backspace.svg"
          alt="Backspace icon"
          width={22}
          height={22}
        />
      </button>
      <button
        onClick={() => {
          if (!inputRef.current) return;

          const exp = inputRef.current.value;

          const negExp = exp.replace(/(-?\d+)(?!.*\d)/, (match) => {
            const number = parseFloat(match);
            return (-number).toString();
          });

          inputRef.current.value = negExp;
          checkOverflow();
        }}
      >
        {"+/-"}
      </button>
      <button onClick={() => assignValue("%", true)}>{"%"}</button>
      <button
        className="place-items-center"
        onClick={() => assignValue("/", true)}
      >
        <Image
          className="dark:invert"
          src="/divide.svg"
          alt="Division icon"
          width={20}
          height={20}
        />
      </button>
      <button onClick={() => assignValue("7", true)}>{"7"}</button>
      <button onClick={() => assignValue("8", true)}>{"8"}</button>
      <button onClick={() => assignValue("9", true)}>{"9"}</button>
      <button
        className="place-items-center"
        onClick={() => assignValue("*", true)}
      >
        <Image
          className="dark:invert"
          src="/multiply.svg"
          alt="Multiplication icon"
          width={20}
          height={20}
        />
      </button>
      <button onClick={() => assignValue("4", true)}>{"4"}</button>
      <button onClick={() => assignValue("5", true)}>{"5"}</button>
      <button onClick={() => assignValue("6", true)}>{"6"}</button>
      <button className="text-xl" onClick={() => assignValue("-", true)}>
        {"-"}
      </button>
      <button onClick={() => assignValue("1", true)}>{"1"}</button>
      <button onClick={() => assignValue("2", true)}>{"2"}</button>
      <button onClick={() => assignValue("3", true)}>{"3"}</button>
      <button className="text-xl" onClick={() => assignValue("+", true)}>
        {"+"}
      </button>
      <button onClick={() => assignValue("", false)}>{"C"}</button>
      <button onClick={() => assignValue("0", true)}>{"0"}</button>
      <button onClick={() => assignValue(".", true)}>{"."}</button>
      <button
        onClick={() => {
          if (!inputRef.current) return;
          inputRef.current.value = evaluateExp(inputRef.current.value);
          checkOverflow();
        }}
      >
        {"="}
      </button>
    </WidgetBase>
  );
}
