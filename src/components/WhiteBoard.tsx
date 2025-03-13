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
  Modifier
} from "@dnd-kit/core";

import { Axis, OverflowWrapper } from "../lib/BaseWidgetStuff";

import WidgetBase from "./WidgetBase";
import { restrictToBoundingRect } from "@dnd-kit/modifiers";

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

    return restrictToBoundingRect(transform, draggingNodeRect, wrapperRef.current.getBoundingClientRect());
  };

  return (
    <OverflowWrapper>
      <div className="flex bg-gray-300 border-2 justify-center min-h-screen">
        <button
          className="bg-amber-700"
          onClick={() => {
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
              />,
            ]);
          }}
        >
          Add
        </button>
        <DndContext
          sensors={sensors}
          modifiers={[restrictToWhiteBoard]}
        >
          <div ref={wrapperRef} className="bg-lime-400 min-w-2xl">
            {widgets}
          </div>
        </DndContext>
      </div>
    </OverflowWrapper>
  );
}
