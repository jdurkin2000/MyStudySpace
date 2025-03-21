import React, { forwardRef } from "react";
import classNames from "classnames";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Coordinates, Transform } from "@dnd-kit/utilities";

import { Handle } from "../Item/components/Handle";
import styles from "./Draggable.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  dragOverlay?: boolean;
  dragging?: boolean;
  handle?: boolean;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  className?: string;
  transform?: Transform | null;
  isPendingDelay?: boolean;
  deltaCoords?: Coordinates | null
  children?: React.ReactNode;
}

export const Draggable = forwardRef<HTMLDivElement, Props>(function Draggable(
  {
    dragOverlay,
    dragging,
    handle,
    listeners,
    transform,
    style,
    className,
    isPendingDelay = false,
    deltaCoords,
    children,
    ...props
  },
  ref
) {
  return (
    <div
      aria-label="Draggable"
      data-cypress="draggable-item"
      className={
        classNames(
          styles.Draggable,
          dragOverlay && styles.dragOverlay,
          dragging && styles.dragging,
          handle && styles.handle,
          isPendingDelay && styles.pendingDelay,
          deltaCoords && styles.returning
        ) +
        " " +
        className
      }
      style={
        {
          ...style,
          "--translate-x": `${transform?.x ?? 0}px`,
          "--translate-y": `${transform?.y ?? 0}px`,
        } as React.CSSProperties
      }
      {...(handle ? {} : listeners)}
      tabIndex={handle ? -1 : undefined}
      ref={ref}
      {...props}
    >
      {handle ? <Handle {...(handle ? listeners : {})} /> : null}
      {children}
    </div>
  );
});
