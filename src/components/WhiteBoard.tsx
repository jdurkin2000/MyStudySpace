"use client";

import React, { ReactElement, useRef, useState } from "react";

import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
  Modifier,
} from "@dnd-kit/core";

import WidgetBase from "components/WidgetBase";
import {
  createSnapModifier,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import * as Widgets from "components/widget-components";

let nextId = 0;

export default function WhiteBoard() {
  const gridSize = 30;

  const [widgets, addWidget] = useState<ReactElement<typeof WidgetBase>[]>([]);
  const [doSnapGrid, setSnapGrid] = useState<boolean>(false);

  const delayConstraint = {
    delay: 400,
    tolerance: 10,
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: delayConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: delayConstraint,
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const snapToGrid: Modifier = createSnapModifier(gridSize);

  const clickHandler = (widgetName: string) => {
    const widget = Object.entries(Widgets).find(([key]) => key == widgetName);

    if (widget) {
      const [, WidgetComponent] = widget;

      if (typeof WidgetComponent === "function") {
        const currId = nextId++;

        addWidget([...widgets, <WidgetComponent key={currId} id={currId} />]);
      }
    }
  };

  const keyHandlerDown = ({ shiftKey }: { shiftKey: boolean }) => {
    if (shiftKey) {
      setSnapGrid(true);
    }
  };

  const keyHandlerUp = ({ shiftKey }: { shiftKey: boolean }) => {
    if (!shiftKey) {
      setSnapGrid(false);
    }
  };

  return (
      <div
        className="flex flex-grow bg-gray-300 min-w-screen place-self-center shadow-[inset_0_4px_4px_rgba(0,0,0,0.8)]"
        tabIndex={-1}
        onKeyDown={keyHandlerDown}
        onKeyUp={keyHandlerUp}
      >
        <div className="flex flex-col">
          {Object.keys(Widgets).map((widgetName: string) => {
            return (
              <button
                key={widgetName}
                className="bg-amber-700 max-h-8 border-b-1"
                onClick={() => clickHandler(widgetName)}
              >
                <p>Add {widgetName}</p>
              </button>
            );
          })}
        </div>
        <DndContext
          sensors={sensors}
          modifiers={
            doSnapGrid
              ? [restrictToParentElement, snapToGrid]
              : [restrictToParentElement]
          }
        >
          <div
            ref={wrapperRef}
            className="bg-lime-400 flex-grow border-2 contain-paint"
          >
            {widgets}
          </div>
        </DndContext>
      </div>
  );
}
