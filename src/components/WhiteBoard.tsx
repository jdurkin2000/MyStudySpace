"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  DndContext,
  useSensor,
  useSensors,
  Modifier,
  PointerSensor,
} from "@dnd-kit/core";

import {
  createSnapModifier,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import * as Widgets from "components/widget-components";
import { addWidgetDb, getStrId, getWidgetDb, removeWidgetDb } from "@/lib/widgetDb";

interface IWidget {
  _id: string;
  widgetType: string;
  position: {x: number, y: number};
  label: string;
  stateValues: unknown;
}

export default function WhiteBoard() {
  const gridSize = 30;

  const [widgets, setWidgets] = useState<IWidget[]>([]);
  const [doSnapGrid, setSnapGrid] = useState<boolean>(false);

  const delayConstraint = {
    delay: 400,
    tolerance: 10,
  };
  const bypassContraint = ({ event }: { event: Event }) => {
    if (event instanceof PointerEvent) {
      const target = event.target as HTMLElement;
      const displayName = target?.getAttribute("data-display-name");

      return displayName === "BouncyBallWidget";
    }

    return false;
  };

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: delayConstraint,
    bypassActivationConstraint: bypassContraint,
  });

  const sensors = useSensors(pointerSensor);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const snapToGrid: Modifier = createSnapModifier(gridSize);

  const removeWidget = (id: number | string) => {
    removeWidgetDb(id);
    setWidgets((prev) =>
      prev.filter((widget: (typeof widgets)[0]) => {
        return widget._id !== id;
      })
    );
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

  useEffect(() => {
    async function fetchData() {
      let widgetData = await getWidgetDb();

      if (widgetData.length == 0) { // FRONT END REQUIREMENT 2.B (statically load 3 items)
        const ids = Array.from({ length: 3 }, () => getStrId());
        const ref = wrapperRef.current;
        const dim = {width: ref?.clientWidth ?? 0, height: ref?.clientHeight ?? 0};
        widgetData = [
          { id:ids[0], title:"ClockWidget"},
          { id:ids[1], pos:{y:0, x:dim.width / 2}, title:"PomodoroWidget"},
          { id:ids[2], pos:{y:dim.height/2, x:dim.width/4}, title:"StickyNoteWidget"}
        ]
        addWidgetDb("ClockWidget", ids[0], "Clock");
        addWidgetDb("PomodoroWidget", ids[1], "Pomodoro Timer", {x: dim.width / 2, y: 0});
        addWidgetDb("StickyNoteWidget", ids[2], "Sticky Note", {x: dim.width/4, y: dim.height/2});
      }

      setWidgets(widgetData);
    }
    fetchData();
  }, []);

  return (
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
          className="bg-white flex-grow border-2 contain-paint"
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={keyHandlerDown}
          onKeyUp={keyHandlerUp}
        >
          {widgets.map((widget) => {
          const WidgetComponent = getWidgetComponent(widget.widgetType);
          if (!WidgetComponent) return;

          const ID = widget._id;
          const coords = widget.position;
          return (
            <WidgetComponent
              key={ID}
              id={ID}
              removeHandler={removeWidget}
              top={coords.y}
              left={coords.x}
              title={widget.label}
              stateValues={widget.stateValues}
            />
          );
        }
      )} {/* FRONT END REQUIREMENT 2.A (Use map to generate item components from array) */}
        </div>
      </DndContext>
  );
}

function getWidgetComponent(widgetType: string) {
  const widget = Object.entries(Widgets).find(([key]) => key == widgetType);

  if (widget) {
    const [, WidgetComponent] = widget;
    if (typeof WidgetComponent === "function") {
      return WidgetComponent;
    }
  }

  return null;
}