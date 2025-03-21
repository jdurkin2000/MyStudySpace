import WidgetBase, { WidgetBaseProps } from "components/WidgetBase";
import styles from "./StickyNoteWidget.module.css";
import { useState } from "react";

export function StickyNoteWidget(props: WidgetBaseProps) {
  const [isUnderline, setIsUnderline] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [bgColor, setBgColor] = useState("#ffa723");

  return (
    <WidgetBase className={`${styles.stickyNote}`} {...props}>
      <textarea
        className={`focus-visible:outline-none h-40 ${styles.textarea}`}
        maxLength={Number.MAX_SAFE_INTEGER}
      />

      <div className={`${styles.options}`}>
        <label className={`${styles.container}`}>
      
          <input type="checkbox" />
          <span className={`${styles.checkmark}`}></span>
        </label>

        <label className={`${styles.container}`}>
        
          <input type="checkbox" />
          <span className={`${styles.checkmark}`}></span>
        </label>

        <label className={`${styles.container}`}>
      
          <input type="checkbox" />
          <span className={`${styles.checkmark}`}></span>
        </label>

        <label className={`${styles.container}`}>
       
          <input type="checkbox" />
          <span className={`${styles.checkmark}`}></span>
        </label>
      </div>
    </WidgetBase>
  );
}
