import { WidgetBaseProps } from "components/WidgetBase";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import {
  ClientRect,
  Coordinates,
  DragEndEvent,
} from "@dnd-kit/core/dist/types";
import { CSSProperties, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import styles from "./BouncyBallWidget.module.css";

// This entire component is probably the most ineffecient thing to ever exist but I could honestly not care less
export function BouncyBallWidget(props: WidgetBaseProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
  } = useDraggable({
    id: props.id,
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: props.id,
  });

  const defaultCoordinates =
    typeof props.top === "number" && typeof props.left === "number"
      ? { x: props.left, y: props.top }
      : { x: 10, y: 10 };
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...noIdProps } = props;

  //Physics shit idk
  const FPS = 60;
  const DELTA_T = 1 / FPS;
  const G = 1000;
  const BOUNCINESS = 0.9;
  const FRICTION = 0.994;
  const REST_THRESH = 40;

  const [vel, setVel] = useState({ x: 1000, y: 0 });
  const [finalTransform, setFinalTransform] = useState({ x: 0, y: 0 });

  const ballRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [whiteBoardRect, setWhiteBoardRect] = useState<ClientRect | null>(null);

  useEffect(() => {
    if (ballRef.current) {
      const ballRect = ballRef.current.getBoundingClientRect();
      const whiteBoardNode = ballRef.current.parentElement;

      setSize(({}) => ({ width: ballRect.width, height: ballRect.height }));
      if (whiteBoardNode)
        setWhiteBoardRect(whiteBoardNode.getBoundingClientRect());
      // console.log("Ball size is w: " + size.width + " h: " + size.height);
    }
  }, [size.height, size.width, whiteBoardRect?.width, whiteBoardRect?.height]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isDragging) return;

      // Update new positions and velocities
      setVel((vel) => ({
        x: vel.x * FRICTION,
        y: vel.y + G * DELTA_T,
      }));

      setFinalTransform((finalTransform) => ({
        x: finalTransform.x + vel.x * DELTA_T,
        y: finalTransform.y + vel.y * DELTA_T,
      }));

      if (!whiteBoardRect || !size) return;

      const xpos = x + finalTransform.x;
      const ypos = y + finalTransform.y;

      // Handle collisions
      if (xpos <= 0) {
        setVel((vel) => ({ x: Math.abs(vel.x * BOUNCINESS), y: vel.y }));
      } else if (xpos + size.width >= whiteBoardRect.width) {
        setVel((vel) => ({ x: -Math.abs(vel.x * BOUNCINESS), y: vel.y }));
      }

      if (ypos + size.height >= whiteBoardRect.height) {
        setVel((vel) => {
          const newY = -Math.abs(vel.y * BOUNCINESS); // Reverse and reduce vertical velocity
          return {
            x: Math.abs(vel.x) < 10 ? 0 : vel.x,
            y: Math.abs(newY) < REST_THRESH ? 0 : newY, // Stop bouncing if velocity is below threshold
          };
        });
      } else if (ypos <= 0) {
        setVel((vel) => ({ x: vel.x, y: Math.abs(vel.y * BOUNCINESS) }));
      }
    }, DELTA_T * 1000);

    return () => clearInterval(interval);
  });

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.active.id === props.id) {
      setCoordinates(({ x, y }) => {
        return {
          x: x + event.delta.x,
          y: y + event.delta.y,
        };
      });

      setFinalTransform(() => {
        return {
          x: 0,
          y: 0,
        };
      });
    }
  };

  useDndMonitor({
    onDragEnd: handleDragEnd,
  });

  const combinedRef = (node: HTMLDivElement | null) => {
    setDraggableRef(node);
    setDroppableRef(node);
    ballRef.current = node;
  };

  return (
      <div
      ref={combinedRef}
      className={
        classNames(styles.Draggable, isDragging && styles.dragging) +
        " " +
        props.className
      }
      style={
        {
          left: `${x}px`,
          top: `${y}px`,
          "--translate-x": `${transform?.x ?? finalTransform?.x}px`,
          "--translate-y": `${transform?.y ?? finalTransform?.y}px`,
          "--rotate": `${finalTransform.x / 5}deg`,
        } as CSSProperties
      }
      {...listeners}
      {...attributes}
      {...noIdProps}
    />
  );
}

BouncyBallWidget.displayName = "BouncyBallWidget";