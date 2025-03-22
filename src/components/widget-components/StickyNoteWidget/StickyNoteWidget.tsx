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
  const [bgColor, setBgColor] = useState("#ffa723");

  return (
    <WidgetBase className={`${styles.stickyNote}`} {...props}>
      <textarea
        className={`focus-visible:outline-none ${styles.textarea} ${
          isUnderline ? "underline" : ""
        } ${isBold ? "font-bold" : ""} ${isItalic ? "italic" : ""}`}
        maxLength={Number.MAX_SAFE_INTEGER}
      />

      <div className={`${styles.options}`}>
        <div className="flex space-x-2">
          <button
            className={`${isUnderline ? styles.activeButton : styles.inactiveButton}`}
            onClick={() => setIsUnderline((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faUnderline} className={styles.icon} />
          </button>

          <button
            className={`${isBold ? styles.activeButton : styles.inactiveButton}`}
            onClick={() => setIsBold((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faBold} className={styles.icon} />
          </button>

          <button
            className={`${isItalic ? styles.activeButton : styles.inactiveButton}`}
            onClick={() => setIsItalic((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faItalic} className={styles.icon} />
          </button>
        </div>

        <button>
          <FontAwesomeIcon icon={faPalette} className={styles.icon} />
        </button>
      </div>
    </WidgetBase>
  );
}
