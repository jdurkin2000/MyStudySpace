"use client";

import {
  DragPendingEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import { Draggable } from "lib/BaseWidgetStuff";
import { Coordinates, DragEndEvent } from "@dnd-kit/core/dist/types";
import {
  useState,
  useCallback,
  HTMLAttributes,
  CSSProperties,
  MouseEventHandler,
} from "react";

interface WidgetBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "id"> {
  id: string | number;
  removeHandler: (id: number | string) => void;
  handle?: boolean;
  style?: React.CSSProperties;
  className?: string;
  top?: number;
  left?: number;
  children?: React.ReactNode;
}

export type { WidgetBaseProps };

export default function WidgetBaseVisualCue({
  id,
  removeHandler,
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
      ? "outline outline-2 outline-red-500"
      : "";

  const combinedRef = (node: HTMLElement | null) => {
    setDraggableRef(node);
    setDroppableRef(node);
  };

  const defaultCoordinates =
    typeof top === "number" && typeof left === "number"
      ? { x: left, y: top }
      : { x: 0, y: 0 };
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);

  const [isPending, setIsPending] = useState(false);
  const [pendingDelayMs, setPendingDelay] = useState(0);

  const [deltaCoords, setDeltaCoords] = useState<Coordinates | null>(null);

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
    if (event.active.id === id && (!event.over || event.over.id === id)) {
      setCoordinates(({ x, y }) => {
        const newX = x + event.delta.x;
        const newY = y + event.delta.y;
        const newCoords = {x: newX, y: newY};
        updateWidgetDb(id.toString(), newCoords)
        return newCoords;
      });
    } else if (event.active.id === id && event.over && event.over.id !== id) {
      setDeltaCoords({ x: event.delta.x, y: event.delta.y });
      setTimeout(() => setDeltaCoords(null), 250);
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

  const [hideContext, setHideContext] = useState(true);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });

  const contextHandler: MouseEventHandler<HTMLDivElement> = (event) => {
    const boundingRect = event.currentTarget.getBoundingClientRect(); // Get the parent container's position
    setContextPos({
      x: event.clientX - boundingRect.left + x, // Adjust X position relative to the parent
      y: event.clientY - boundingRect.top + y, // Adjust Y position relative to the parent
    });
    console.log(event.clientX + " - " + boundingRect.left + " + " + x);

    setHideContext((prev) => !prev);
  };

  const pendingStyle: CSSProperties = isPending
    ? { animationDuration: `${pendingDelayMs}ms` }
    : {};

  return (
    <>
      <Draggable
        ref={combinedRef}
        dragging={isDragging}
        handle={handle}
        listeners={listeners}
        style={
          {
            ...style,
            ...pendingStyle,
            left: `${x}px`,
            top: `${y}px`,
            "--delta-x": `${deltaCoords?.x ?? 0}px`,
            "--delta-y": `${deltaCoords?.y ?? 0}px`,
          } as CSSProperties
        }
        className={`${className} ${borderStyle}`}
        isPendingDelay={isPending && pendingDelayMs > 0}
        deltaCoords={deltaCoords}
        transform={transform}
        onContextMenu={contextHandler}
        {...attributes}
      >
        {children}
      </Draggable>
      <div
        id="editmenu"
        className={`absolute bg-white shadow-lg border rounded`}
        style={{
          all: "unset", // Reset all inherited and non-inherited styles
          position: "absolute", // Reapply necessary styles
          top: contextPos.y,
          left: contextPos.x,
          zIndex: 1000,
          backgroundColor: "white", // Reapply specific styles
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
        hidden={hideContext}
      >
        <button
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={() => removeHandler(id)}
        >
          Delete
        </button>
        <button
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={() => setHideContext(true)}
        >
          Cancel
        </button>
      </div>
    </>
  );
}

async function updateWidgetDb(id: string, position: Coordinates) {
  const response = await fetch(`/api/widgets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      position: {x: position.x, y: position.y}
    })
  });

  return response;
}