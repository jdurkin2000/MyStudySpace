import { WidgetBaseProps } from "components/WidgetBase"
import { DndContext, MouseSensor, TouchSensor, useDndMonitor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { Coordinates, DragEndEvent } from "@dnd-kit/core/dist/types";
import { CSSProperties, useState } from "react";
import classNames from "classnames";

import styles from "./BouncyBallWidget.module.css"
import { restrictToParentElement } from "@dnd-kit/modifiers";

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
    
      const combinedRef = (node: HTMLElement | null) => {
        setDraggableRef(node);
        setDroppableRef(node);
      };
    
      const defaultCoordinates =
        typeof props.top === "number" && typeof props.left === "number"
          ? { x: props.left, y: props.top }
          : { x: 0, y: 0 };
      const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);
    
    
      const handleDragEnd = (event: DragEndEvent) => {
        if (event.active.id === props.id) {
          setCoordinates(({ x, y }) => {
            return {
              x: x + event.delta.x, // Change this to physics stuff
              y: y + event.delta.y,
            };
          });
        }
      };
    
      useDndMonitor({
        onDragEnd: handleDragEnd,
      });

      const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
      )

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...noIdProps} = props;
    
      return (
          <div
            ref={combinedRef}
            className={
              classNames(
                styles.Draggable,
                isDragging && styles.dragging
              ) +
              " " +
              props.className
            }
            style={
              {
                left: `${x}px`,
                top: `${y}px`,
                "--translate-x": `${transform?.x ?? 0}px`,
                "--translate-y": `${transform?.y ?? 0}px`,
              } as CSSProperties
            }
            {...listeners}
            {...attributes}
            {...noIdProps}
            
          />
      );
}