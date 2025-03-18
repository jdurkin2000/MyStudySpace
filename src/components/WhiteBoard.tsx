"use client";

import React, { ReactElement, useRef, useState } from "react";

import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensors,
  Modifier,
  DragOverlay,
  DropAnimation,
  UniqueIdentifier,
} from "@dnd-kit/core";

import { OverflowWrapper } from "lib/BaseWidgetStuff";

import WidgetBase from "components/WidgetBase";
import { restrictToBoundingRect, createSnapModifier } from "@dnd-kit/modifiers";
import * as Widgets from "components/widget-components";

let nextId = 0;
const gridSize = 30;

export default function WhiteBoard() {
  const [widgets, addWidget] = useState<ReactElement<typeof WidgetBase>[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [doDropAnim, setDropAnim] = useState<boolean>(false);
  const [doSnapGrid, setSnapGrid] = useState<boolean>(false);

  const delayConstraint = {
    delay: 250,
    tolerance: 5,
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: delayConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: delayConstraint,
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

  const defaultDropAnim: DropAnimation = {
    duration: 250,
    easing: "ease",
  };

  return (
    <OverflowWrapper>
      <div
        className="flex bg-gray-300 min-h-screen min-w-3/4 place-self-center shadow-[inset_0_4px_4px_rgba(0,0,0,0.8)]"
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
              ? [restrictToWhiteBoard, snapToGrid]
              : [restrictToWhiteBoard]
          }
          onDragStart={({ active }) => setActiveId(active.id)}
          onDragEnd={({ over }) => {
            setDropAnim(over && over.id != activeId ? true : false);
            setActiveId(null);
          }}
        >
          <div ref={wrapperRef} className="bg-lime-400 flex-grow border-2">
            {widgets}
          </div>

          <DragOverlay dropAnimation={doDropAnim ? defaultDropAnim : null}>
            {activeId !== null
              ? widgets.find((item: ReactElement) => item.key == activeId)
              : null}
          </DragOverlay>
        </DndContext>
      </div>
    </OverflowWrapper>
  );
}
