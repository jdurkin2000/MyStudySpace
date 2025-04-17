import WidgetBase, { WidgetBaseProps } from "components/WidgetBase";
import styles from "./StickyNoteWidget.module.css";
import { useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUnderline,
  faBold,
  faItalic,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { updateWidgetDb } from "@/lib/widgetDb";
import { useUser } from "@/components/UserContext";

type States = {
  isUnderline: boolean;
  isBold: boolean;
  isItalic: boolean;
  bgColor: string;
  textSize: string;
  text: string;
  size: {width: string, height: string}
};

export function StickyNoteWidget(props: WidgetBaseProps) {
  const stateVals = props.stateValues as States;

  const [isUnderline, setIsUnderline] = useState(
    stateVals?.isUnderline ?? false
  );
  const [isBold, setIsBold] = useState(stateVals?.isBold ?? false);
  const [isItalic, setIsItalic] = useState(stateVals?.isItalic ?? false);

  const defaultColor = "#ffa723";
  const [bgColor, setBgColor] = useState<string>(
    stateVals?.bgColor ?? defaultColor
  );

  const defaultTextSize = "16";
  const [textSize, setTextSize] = useState<string>(
    stateVals?.textSize ?? defaultTextSize
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getCurrentStates = (): States => {
    const style = textareaRef.current? getComputedStyle(textareaRef.current): null;
    const currSize = style? {width: style.width, height: style.height} : {width: "100%", height: "100%"};

    return {
      isUnderline: isUnderline,
      isBold: isBold,
      isItalic: isItalic,
      bgColor: bgColor,
      textSize: textSize,
      text: textareaRef.current?.value || "",
      size: currSize
    };
  };

  const {user} = useUser();
  if (!user) throw new Error("There is no user signed in");
  const owner = user.username;

  return (
    <WidgetBase
      className={`${styles.stickyNote}`}
      style={{ backgroundColor: bgColor }}
      {...props}
    >
      <textarea
        ref={textareaRef}
        className={`focus-visible:outline-none ${styles.textarea} ${
          isUnderline ? "underline" : ""
        } ${isBold ? "font-bold" : ""} ${isItalic ? "italic" : ""}`}
        style={{
          fontSize: `${textSize}px`,
          width: stateVals.size.width,
          height: stateVals.size.height
        }}
        maxLength={Number.MAX_SAFE_INTEGER}
        onBlur={(e) => {
          const states = getCurrentStates();
          states.text = e.currentTarget.value;
          const style = e.currentTarget.style;
          states.size = {width: style.width, height: style.height};
          updateWidgetDb({id: props.id, stateValues: states}, owner);
        }}
        defaultValue={stateVals?.text ?? ""}
      />

      <div className={`${styles.options}`}>
        <div className="flex space-x-2">
          <button
            className={`${
              isUnderline ? styles.activeButton : styles.inactiveButton
            }`}
            onClick={() =>
              setIsUnderline((prev) => {
                const update = !prev;
                const states = getCurrentStates();
                states.isUnderline = update;
                updateWidgetDb({id: props.id, stateValues: states}, owner);
                return update;
              })
            }
          >
            <FontAwesomeIcon icon={faUnderline} className={styles.icon} />
          </button>

          <button
            className={`${
              isBold ? styles.activeButton : styles.inactiveButton
            }`}
            onClick={() => setIsBold((prev) => {
              const update = !prev;
              const states = getCurrentStates();
              states.isBold = update;
              updateWidgetDb({id: props.id, stateValues: states}, owner);
              return update;
            })
          }
          >
            <FontAwesomeIcon icon={faBold} className={styles.icon} />
          </button>

          <button
            className={`${
              isItalic ? styles.activeButton : styles.inactiveButton
            }`}
            onClick={() => setIsItalic((prev) => {
              const update = !prev;
              const states = getCurrentStates();
              states.isItalic = update;
              updateWidgetDb({id: props.id, stateValues: states}, owner);
              return update;
            })}
          >
            <FontAwesomeIcon icon={faItalic} className={styles.icon} />
          </button>

          <div className="inline-flex">
            <input
              onInput={(e) => {
                const val = e.currentTarget.value;
                setTextSize(val);
                const states = getCurrentStates();
                states.textSize = val;
                updateWidgetDb({ id: props.id, stateValues: states }, owner);
              }}
              type="number"
              name="text-size"
              id="text-size"
              defaultValue={defaultTextSize}
              min={6}
              max={72}
            />
            <p className="absolute left-33 top-1.5">px</p>
          </div>
        </div>

        <label className={styles.colorContainer}>
          <input
            onInput={(e) => {
              setBgColor(e.currentTarget.value);
            }}
            onBlur={e => { //Only send put request when losing focus so requests arent constantly sent
              const states = getCurrentStates();
              states.bgColor = e.currentTarget.value;
              updateWidgetDb({ id: props.id, stateValues: states}, owner)
            }}
            type="color"
            id="bgColor picker"
            defaultValue={defaultColor}
          />
          <FontAwesomeIcon icon={faPalette} className={styles.icon} />
        </label>
      </div>
    </WidgetBase>
  );
}
