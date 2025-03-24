import { WidgetBaseProps } from "components/WidgetBase";
import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import {
  ClientRect,
  Coordinates,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
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

  const [mouseVel, setMouseVel] = useState({
    timeStamp: Date.now(),
    x: 0,
    y: 0,
  });
  const [vel, setVel] = useState({ x: 1000, y: 0 });
  const [finalTransform, setFinalTransform] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  const ballRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [whiteBoardRect, setWhiteBoardRect] = useState<ClientRect | null>(null);

  useEffect(() => {
    if (!isDragging) setRotation((prev) => prev + vel.x * DELTA_T);
  }, [DELTA_T, isDragging, vel.x]);

  useEffect(() => {
    if (ballRef.current) {
      const ballRect = ballRef.current.getBoundingClientRect();

      setSize(({}) => ({ width: ballRect.width, height: ballRect.height }));
    }
  }, [size.height, size.width]);

  useEffect(() => {
    if (!ballRef.current) return;

    const whiteBoardNode = ballRef.current.parentElement;

    if (whiteBoardNode)
      setWhiteBoardRect(whiteBoardNode.getBoundingClientRect());
  }, [whiteBoardRect?.width, whiteBoardRect?.height]);

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
      } else if (xpos + size.width * 0.75 >= whiteBoardRect.width) {
        setVel((vel) => ({ x: -Math.abs(vel.x * BOUNCINESS), y: vel.y }));
      }

      if (ypos + size.height * 0.75 >= whiteBoardRect.height) {
        setVel((vel) => {
          const newY = -Math.abs(vel.y * BOUNCINESS); // Reverse and reduce vertical velocity
          return {
            x: Math.abs(vel.x) < 10 ? 0 : vel.x,
            y: Math.abs(newY) < REST_THRESH ? 0 : newY, // Stop bouncing if velocity is below threshold
          };
        });
        //setFinalTransform(() => ({x: finalTransform.x, y: whiteBoardRect.bottom-size.height*1.2}))
        //console.log("Collision after checking " + (ypos + size.height) + " >= " + whiteBoardRect.height);
      } else if (ypos <= 0) {
        setVel((vel) => ({ x: vel.x, y: Math.abs(vel.y * BOUNCINESS) }));
      }
    }, DELTA_T * 1000);

    return () => clearInterval(interval);
  });

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.id === props.id) {
      setCoordinates(({ x, y }) => {
        return {
          x: x + finalTransform.x,
          y: y + finalTransform.y,
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

  const handleDragMove = (event: DragMoveEvent) => {
    if (event.active.id === props.id) {
      const time = Date.now();
      if (time - mouseVel.timeStamp < 16) return;

      const SENSITIVITY = 20;
      const newVelX = (event.delta.x - mouseVel.x) * SENSITIVITY;
      const newVelY = (event.delta.y - mouseVel.y) * SENSITIVITY;

      if (newVelX > 5000 || newVelY > 5000) return;

      setVel({ x: newVelX, y: newVelY });
      setMouseVel({ timeStamp: time, x: event.delta.x, y: event.delta.y });
      console.log("Mouse vel is: x:%d | y:%d", vel.x, vel.y);
    }
  };

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
    onDragStart: handleDragStart,
    onDragMove: handleDragMove,
  });

  const combinedRef = (node: HTMLDivElement | null) => {
    setDraggableRef(node);
    ballRef.current = node;
  };

  return (
    <div
      ref={combinedRef}
      data-display-name="BouncyBallWidget"
      className={
        classNames(styles.Draggable, isDragging && styles.dragging) +
        " " +
        props.className
      }
      style={
        {
          left: `${x}px`,
          top: `${y}px`,
          "--translate-x": `${transform?.x ?? finalTransform?.x ?? 0}px`,
          "--translate-y": `${transform?.y ?? finalTransform?.y ?? 0}px`,
          "--rotate": `${rotation}deg`,
        } as CSSProperties
      }
      {...listeners}
      {...attributes}
      {...noIdProps}
    />
  );
}
