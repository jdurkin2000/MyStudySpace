"use client";

import React, { CSSProperties, ReactElement, useRef, useState } from "react";

import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  PointerActivationConstraint,
  Modifiers,
  useSensors,
  Modifier,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  UniqueIdentifier,
} from "@dnd-kit/core";

import { Axis, OverflowWrapper } from "../lib/BaseWidgetStuff";

import WidgetBase from "./WidgetBase";
import { restrictToBoundingRect } from "@dnd-kit/modifiers";
import ExampleWidget from "./widget-components/ExampleWidget";

interface Props {
  activationConstraint?: PointerActivationConstraint;
  axis?: Axis;
  handle?: boolean;
  modifiers?: Modifiers;
  buttonStyle?: CSSProperties;
  style?: CSSProperties;
  showConstraintCue?: boolean;
}

let nextId = 0;

export default function WhiteBoard({
  activationConstraint,
  axis,
  handle,
  style,
  buttonStyle,
}: //showConstraintCue,
Props) {
  const [widgets, addWidget] = useState<ReactElement<typeof WidgetBase>[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [doDropAnim, setDropAnim] = useState<boolean>(false)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const restrictToWhiteBoard: Modifier = ({ draggingNodeRect, transform }) => {
    if (!draggingNodeRect || !wrapperRef.current) return transform;

    return restrictToBoundingRect(
      transform,
      draggingNodeRect,
      wrapperRef.current.getBoundingClientRect()
    );
  };

  const clickHandler = () => {
    addWidget([
      ...widgets,
      <WidgetBase
        key={nextId++}
        id={nextId}
        label="Test Widget"
        axis={axis}
        handle={handle}
        style={style}
        buttonStyle={buttonStyle}
      ><ExampleWidget/></WidgetBase>,
    ]);
  };

  const defaultDropAnim: DropAnimation = {
    duration: 250,
    easing: 'ease',
  }

  return (
    <OverflowWrapper>
      <div className="flex bg-gray-300 border-2 justify-center min-h-screen">
        <button className="bg-amber-700" onClick={clickHandler}>
          Add
        </button>
        <DndContext
          sensors={sensors}
          modifiers={[restrictToWhiteBoard]}
          onDragStart={(event: DragStartEvent) =>
            setActiveId(event.active.id)
          }
          onDragEnd={(event) => {
            setDropAnim((event.over && event.over.id != activeId)? true : false)
            setActiveId(null)
          }}
        >
          <div ref={wrapperRef} className="bg-lime-400 min-w-2xl">
            {widgets}
          </div>

          <DragOverlay dropAnimation={doDropAnim? defaultDropAnim: null}>
            {activeId !== null ?
                widgets.find(
                  (item: ReactElement) => item.key == activeId
                )
              : null}
          </DragOverlay>
        </DndContext>
      </div>
    </OverflowWrapper>
  );
}
