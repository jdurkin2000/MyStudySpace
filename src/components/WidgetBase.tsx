"use client";

import {
  DragPendingEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import { Axis, Draggable } from "../lib/BaseWidgetStuff";
import { Coordinates, DragEndEvent } from "@dnd-kit/core/dist/types";
import { useState, useRef, useCallback } from "react";

interface WidgetBaseProps {
  id: string | number;
  label: string;
  handle?: boolean;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  axis?: Axis;
  top?: number;
  left?: number;
  children?: React.ReactNode;
}

export type { WidgetBaseProps };

export default function WidgetBase({
  id,
  axis,
  label,
  style,
  top,
  left,
  handle,
  buttonStyle,
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
    id: id,
  });

  const combinedButtonStyle = {
    ...buttonStyle,
    border:
      isDragging && over !== null && over.id != id
        ? "2px solid red"
        : buttonStyle?.border,
  };

  const combinedRef = (node: HTMLElement | null) => {
    setDraggableRef(node);
    setDroppableRef(node);
  };

  const defaultCoordinates = top && left ? { x: left, y: top } : { x: 0, y: 0 };

  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);

  useDndMonitor({
    onDragEnd({ delta, over, active }) {
      if ((!over || over.id == id) && active.id === id) {
        setCoordinates(({ x, y }) => {
          return {
            x: x + delta.x,
            y: y + delta.y,
          };
        });
      } else {
      }
    },
  });

  return (
    <Draggable
      ref={combinedRef}
      dragging={isDragging}
      handle={handle}
      label={label}
      listeners={listeners}
      style={{ ...style, left: `${x}px`, top: `${y}px` }}
      buttonStyle={combinedButtonStyle}
      transform={transform}
      axis={axis}
      {...attributes}
    >
      {children}
    </Draggable>
  );
}

export function WidgetBaseVisualCue(props: WidgetBaseProps) {
  const { attributes, isDragging, listeners, node, setNodeRef, transform } =
    useDraggable({ id: "draggable" });

  const [isPending, setIsPending] = useState(false);
  const [pendingDelayMs, setPendingDelay] = useState(0);
  const [distanceCue, setDistanceCue] = useState<
    (Coordinates & { size: number }) | null
  >(null);
  const distanceCueRef = useRef<HTMLDivElement>(null);

  const handlePending = useCallback(
    (event: DragPendingEvent) => {
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
    [node]
  );

  const handlePendingEnd = useCallback(() => setIsPending(false), []);

  const defaultCoordinates =
    props.top && props.left ? { x: props.left, y: props.top } : { x: 0, y: 0 };
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);

  const handleTransformEnd = (event: DragEndEvent) => {
    if (event.active.id === props.id) {
      setCoordinates(({ x, y }) => {
        return {
          x: x + event.delta.x,
          y: y + event.delta.y,
        };
      });
    }
  };

  useDndMonitor({
    onDragPending: handlePending,
    onDragAbort: handlePendingEnd,
    onDragCancel: handlePendingEnd,
    onDragEnd: handlePendingEnd,
  });

  const pendingStyle: React.CSSProperties = isPending
    ? { animationDuration: `${pendingDelayMs}ms` }
    : {};

  return (
    <>
      <Draggable
        ref={setNodeRef}
        dragging={isDragging}
        handle={props.handle}
        label={props.label}
        listeners={listeners}
        style={{ ...props.style, top: props.top, left: props.left }}
        buttonStyle={{ ...props.buttonStyle, ...pendingStyle }}
        isPendingDelay={isPending && pendingDelayMs > 0}
        transform={transform}
        axis={props.axis}
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
      </Draggable>
    </>
  );
}
