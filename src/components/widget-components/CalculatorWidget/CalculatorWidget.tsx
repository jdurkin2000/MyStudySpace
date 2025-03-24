import WidgetBase, { WidgetBaseProps } from "components/WidgetBase";
import { calculate } from "lib/calculator";
import { useEffect, useRef, useState } from "react";
import styles from "./CalculatorWidget.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackspace,
  faPercent,
  faDivide,
  faXmark,
  faMinus,
  faPlus,
  faEquals,
  faPlusMinus,
} from "@fortawesome/free-solid-svg-icons";

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
        onClick={() => {
          if (!inputRef.current) return;

          const value = inputRef.current.value;
          inputRef.current.value = value.slice(0, -1);
          checkOverflow();
        }}
      >
        <FontAwesomeIcon icon={faBackspace} className={styles.icon} />
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
        <FontAwesomeIcon icon={faPlusMinus} className={styles.icon} />
      </button>
      <button onClick={() => assignValue("%", true)}>
        <FontAwesomeIcon icon={faPercent} className={styles.icon} />
      </button>
      <button onClick={() => assignValue("/", true)}>
        <FontAwesomeIcon icon={faDivide} className={styles.icon} />
      </button>
      <button onClick={() => assignValue("7", true)}>
        <p>{"7"}</p>
      </button>
      <button onClick={() => assignValue("8", true)}>
        <p>{"8"}</p>
      </button>
      <button onClick={() => assignValue("9", true)}>
        <p>{"9"}</p>
      </button>
      <button onClick={() => assignValue("*", true)}>
        <FontAwesomeIcon icon={faXmark} className={styles.icon} />
      </button>
      <button onClick={() => assignValue("4", true)}>
        <p>{"4"}</p>
      </button>
      <button onClick={() => assignValue("5", true)}>
        <p>{"5"}</p>
      </button>
      <button onClick={() => assignValue("6", true)}>
        <p>{"6"}</p>
      </button>
      <button className="text-xl" onClick={() => assignValue("-", true)}>
        <FontAwesomeIcon icon={faMinus} className={styles.icon} width={15} />
      </button>
      <button onClick={() => assignValue("1", true)}>
        <p>{"1"}</p>
      </button>
      <button onClick={() => assignValue("2", true)}>
        <p>{"2"}</p>
      </button>
      <button onClick={() => assignValue("3", true)}>
        <p>{"3"}</p>
      </button>
      <button className="text-xl" onClick={() => assignValue("+", true)}>
        <FontAwesomeIcon icon={faPlus} className={styles.icon} width={15} />
      </button>
      <button onClick={() => assignValue("", false)}>
        <p>{"C"}</p>
      </button>
      <button onClick={() => assignValue("0", true)}>
        <p>{"0"}</p>
      </button>
      <button onClick={() => assignValue(".", true)}>
        <p>{"."}</p>
      </button>
      <button
        onClick={() => {
          if (!inputRef.current) return;
          inputRef.current.value = evaluateExp(inputRef.current.value);
          checkOverflow();
        }}
      >
        <FontAwesomeIcon icon={faEquals} className={styles.icon} />
      </button>
    </WidgetBase>
  );
}
