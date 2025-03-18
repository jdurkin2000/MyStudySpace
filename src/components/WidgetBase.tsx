"use client";

import {
  DragPendingEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import { Draggable } from "lib/BaseWidgetStuff";
import { Coordinates, DragEndEvent } from "@dnd-kit/core/dist/types";
import { useState, useRef, useCallback } from "react";

interface WidgetBaseProps {
  id: string | number;
  handle?: boolean;
  style?: React.CSSProperties;
  glassy?: boolean
  className?: string;
  top?: number;
  left?: number;
  children?: React.ReactNode;
}

export type { WidgetBaseProps };

export default function WidgetBase({
  id,
  style,
  glassy,
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
      glassy = {glassy}
      className={className + borderStyle}
      transform={transform}
      {...attributes}
    >
      {children}
    </Draggable>
  );
}

export function WidgetBaseVisualCue({
  id,
  style,
  glassy,
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
    node,
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
  const [distanceCue, setDistanceCue] = useState<
    (Coordinates & { size: number }) | null
  >(null);
  const distanceCueRef = useRef<HTMLDivElement>(null);

  const handlePending = useCallback(
    (event: DragPendingEvent) => {
      if (event.id != id) return;
      setIsPending(true);
      const { constraint } = event;
      if ("delay" in constraint) {
        setPendingDelay(constraint.delay);
      }
      if ("distance" in constraint && typeof constraint.distance === "number") {
        const { distance } = constraint;
        if (event.offset === undefined && node.current !== null) {
          // Infer the position of the pointer relative to the element.
          // Only do this once at the start, as the offset is defined
          // when the pointer moves.
          const { x: rx, y: ry } = node.current.getBoundingClientRect();
          setDistanceCue({
            x: event.initialCoordinates.x - rx - distance,
            y: event.initialCoordinates.y - ry - distance,
            size: distance * 2,
          });
        }
        if (distanceCueRef.current === null) {
          return;
        }
        const { x, y } = event.offset ?? { x: 0, y: 0 };
        const length = Math.sqrt(x * x + y * y);
        const ratio = length / Math.max(distance, 1);
        const fanAngle = 360 * (1 - ratio);
        const rotation = Math.atan2(y, x) * (180 / Math.PI) - 90 - fanAngle / 2;
        const { style } = distanceCueRef.current;
        style.setProperty(
          "background-image",
          `conic-gradient(red ${fanAngle}deg, transparent 0deg)`
        );
        style.setProperty("rotate", `${rotation}deg`);
        style.setProperty("opacity", `${0.25 + ratio * 0.75}`);
      }
    },
    [node, id]
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
        glassy={glassy}
        className={className + borderStyle}
        isPendingDelay={isPending && pendingDelayMs > 0}
        transform={transform}
        {...attributes}
      >
        {isPending && !isDragging && distanceCue && (
          <div
            ref={distanceCueRef}
            style={{
              borderRadius: "50%",
              position: "absolute",
              backgroundImage: "conic-gradient(red 360deg, transparent 0deg)",
              opacity: 0.25,
              width: distanceCue.size,
              height: distanceCue.size,
              left: distanceCue.x,
              top: distanceCue.y,
            }}
          ></div>
        )}
        {children}
      </Draggable>
    </>
  );
}
