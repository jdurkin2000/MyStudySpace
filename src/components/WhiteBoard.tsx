"use client";

import React, { CSSProperties, ReactElement, useState } from "react";

import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  PointerActivationConstraint,
  Modifiers,
  useSensors,
} from "@dnd-kit/core";

import { Axis, OverflowWrapper, Wrapper } from "../lib/BaseWidgetStuff";

import WidgetBase from "./WidgetBase";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

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

  return (
    <div className="">
      <OverflowWrapper>
      <button
        className="bg-amber-700 h-8 w-8 left-7"
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
      <DndContext sensors={sensors} modifiers={[restrictToWindowEdges]}>
        <Wrapper>{widgets}</Wrapper>
      </DndContext>
      </OverflowWrapper>
    </div>
  );
}
