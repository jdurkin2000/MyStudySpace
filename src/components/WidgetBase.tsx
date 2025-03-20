"use client";

import {
  DragPendingEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import { Draggable } from "lib/BaseWidgetStuff";
import { Coordinates, DragEndEvent } from "@dnd-kit/core/dist/types";
import { useState, useCallback, HTMLAttributes } from "react";

interface WidgetBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "id">{
  id: string | number;
  handle?: boolean;
  style?: React.CSSProperties;
  className?: string;
  top?: number;
  left?: number;
  children?: React.ReactNode;
}

export type { WidgetBaseProps };

export function WidgetBase({
  id,
  style,
  className,
  top,
  left,
  handle,
  children,
}: WidgetBaseProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
  } = useDraggable({
    id: id,
  });

  const { over, setNodeRef: setDroppableRef } = useDroppable({
    id: id
  });

  const borderStyle =
    isDragging && over !== null && over.id != id
      ? " outline outline-2 outline-red-500"
      : "";

  const combinedRef = (node: HTMLElement | null) => {
    setDraggableRef(node);
    setDroppableRef(node);
  };

  const defaultCoordinates = top && left ? { x: left, y: top } : { x: 0, y: 0 };

  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);

  useDndMonitor({
    onDragEnd({ delta, over, active }) {
      if (active.id === id && (!over || over.id == id)) {
        setCoordinates(({ x, y }) => {
          return {
            x: x + delta.x,
            y: y + delta.y
          };
        });
      }
    }
  });

  return (
    <Draggable
      ref={combinedRef}
      dragging={isDragging}
      handle={handle}
      listeners={listeners}
      style={{ ...style, left: `${x}px`, top: `${y}px` }}
      className={className + borderStyle}
      transform={transform}
      {...attributes}
    >
      {children}
    </Draggable>
  );
}

export default function WidgetBaseVisualCue({
  id,
  style,
  className,
  top,
  left,
  handle,
  children,
}: WidgetBaseProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
  } = useDraggable({ id: id });

  const { over, setNodeRef: setDroppableRef } = useDroppable({
    id: id,
  });

  const borderStyle =
    isDragging && over !== null && over.id != id
      ? " outline outline-2 outline-red-500"
      : "";

  const combinedRef = (node: HTMLElement | null) => {
    setDraggableRef(node);
    setDroppableRef(node);
  };

  const defaultCoordinates = top && left ? { x: left, y: top } : { x: 0, y: 0 };
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);

  const [isPending, setIsPending] = useState(false);
  const [pendingDelayMs, setPendingDelay] = useState(0);

  const handlePending = useCallback(
    (event: DragPendingEvent) => {
      if (event.id != id) return;
      setIsPending(true);
      const { constraint } = event;
      if ("delay" in constraint) {
        setPendingDelay(constraint.delay);
      }
    },
    [id]
  );

  const handlePendingEnd = useCallback(() => setIsPending(false), []);
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.active.id === id && (!event.over || event.over.id == id)) {
      setCoordinates(({ x, y }) => {
        return {
          x: x + event.delta.x,
          y: y + event.delta.y
        };
      });
    }
  };

  const combinedEndCallback = (event: DragEndEvent) => {
    handlePendingEnd();
    handleDragEnd(event);
  };

  useDndMonitor({
    onDragPending: handlePending,
    onDragAbort: handlePendingEnd,
    onDragCancel: handlePendingEnd,
    onDragEnd: combinedEndCallback,
  });

  const pendingStyle: React.CSSProperties = isPending
    ? { animationDuration: `${pendingDelayMs}ms` }
    : {};

  return (
    <>
      <Draggable
        ref={combinedRef}
        dragging={isDragging}
        handle={handle}
        listeners={listeners}
        style={{ ...style, ...pendingStyle, left: `${x}px`, top: `${y}px` }}
        className={className + borderStyle}
        isPendingDelay={isPending && pendingDelayMs > 0}
        transform={transform}
        {...attributes}
      >
        {children}
      </Draggable>
    </>
  );
}
