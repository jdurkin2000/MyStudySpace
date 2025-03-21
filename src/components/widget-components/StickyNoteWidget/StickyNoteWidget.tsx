import WidgetBase, { WidgetBaseProps } from "components/WidgetBase";
import styles from "./StickyNoteWidget.module.css"

export function StickyNoteWidget(props: WidgetBaseProps) {
  return (
    <WidgetBase className={`${styles.stickyNote}`} {...props}>
      <textarea  className={`focus-visible:outline-none h-40 ${styles.textarea}`} maxLength={Number.MAX_SAFE_INTEGER}/>
    </WidgetBase>
  );
}
