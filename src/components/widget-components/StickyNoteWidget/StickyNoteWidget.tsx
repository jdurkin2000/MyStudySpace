import WidgetBase, { WidgetBaseProps } from "components/WidgetBase";
import styles from "./StickyNoteWidget.module.css";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUnderline,
  faBold,
  faItalic,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";

export function StickyNoteWidget(props: WidgetBaseProps) {
  const [isUnderline, setIsUnderline] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const defaultColor = "#ffa723";
  const [bgColor, setBgColor] = useState<string>(defaultColor);

  const defaultTextSize = "16";
  const [textSize, setTextSize] = useState<string>(defaultTextSize)

  return (
    <WidgetBase
      className={`${styles.stickyNote}`}
      style={{ backgroundColor: bgColor }}
      {...props}
    >
      <textarea
        className={`focus-visible:outline-none ${styles.textarea} ${
          isUnderline ? "underline" : ""
        } ${isBold ? "font-bold" : ""} ${isItalic ? "italic" : ""}`}
        style= {{
          fontSize: `${textSize}px`
        }}
        maxLength={Number.MAX_SAFE_INTEGER}
      />

      <div className={`${styles.options}`}>
        <div className="flex space-x-2">
          <button
            className={`${
              isUnderline ? styles.activeButton : styles.inactiveButton
            }`}
            onClick={() => setIsUnderline((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faUnderline} className={styles.icon} />
          </button>

          <button
            className={`${
              isBold ? styles.activeButton : styles.inactiveButton
            }`}
            onClick={() => setIsBold((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faBold} className={styles.icon} />
          </button>

          <button
            className={`${
              isItalic ? styles.activeButton : styles.inactiveButton
            }`}
            onClick={() => setIsItalic((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faItalic} className={styles.icon} />
          </button>

          <div className="inline-flex">
          <input
          onInput={(e) => {
            setTextSize(e.currentTarget.value);
          }}
          type="number" name="text-size" id="text-size" defaultValue={defaultTextSize} min={6} max={72}/>
          <p className="absolute left-33 top-1.5">px</p>
          </div>
        </div>

        <label className={styles.colorContainer}>
          <input
            onInput={(e) => {
              setBgColor(e.currentTarget.value);
            }}
            type="color"
            id="bgColor picker"
            defaultValue={defaultColor}
          />
          <FontAwesomeIcon icon={faPalette} className={styles.icon}/>
        </label>
      </div>
    </WidgetBase>
  );
}
