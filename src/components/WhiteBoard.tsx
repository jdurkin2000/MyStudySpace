"use client";

import React, { ReactElement, useEffect, useRef, useState } from "react";

import {
  DndContext,
  useSensor,
  useSensors,
  Modifier,
  PointerSensor,
} from "@dnd-kit/core";

import WidgetBase, { WidgetBaseProps } from "components/WidgetBase";
import { IWidget } from "models/widgetSchema";
import {
  createSnapModifier,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import * as Widgets from "components/widget-components";
import { Types } from "mongoose";

export default function WhiteBoard() {
  const gridSize = 30;

  const [widgets, setWidgets] = useState<ReactElement<typeof WidgetBase>[]>([]);
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
        const item = widget as unknown as ReactElement<WidgetBaseProps>;
        return item.props.id !== id;
      })
    );
  };

  const clickHandler = (widgetName: string) => {
    const WidgetComponent = getWidgetComponent(widgetName);

    if (!WidgetComponent) return;

    const currId = new Types.ObjectId();
    const strId = currId.toHexString();

    addWidgetDb(widgetName, currId);
    setWidgets([
      ...widgets,
      <WidgetComponent key={strId} id={strId} removeHandler={removeWidget} />,
    ]);
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
      const widgetData = await getWidgetDb();

      const widgetComponents = widgetData.map(
        (widget: IWidget & Types.ObjectId) => {
          const WidgetComponent = getWidgetComponent(widget.widgetType);
          if (!WidgetComponent) return;

          const ID = widget._id as unknown as string;
          const coords = widget.position;
          return (
            <WidgetComponent
              key={ID}
              id={ID}
              removeHandler={removeWidget}
              top={coords.y}
              left={coords.x}
            />
          );
        }
      );

      setWidgets(widgetComponents);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          className="bg-white flex-grow border-2 contain-paint"
          onContextMenu={(e) => e.preventDefault()}
        >
          {widgets}
        </div>
      </DndContext>
    </div>
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

async function addWidgetDb(widgetType: string, id: Types.ObjectId) {
  const response = await fetch("/api/widgets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      widgetType: widgetType,
      position: { x: 0, y: 0 },
      _id: id,
    }),
  });

  if (!response.ok) throw new Error("Error trying to add widget");
}

async function removeWidgetDb(id: number | string) {
  const response = await fetch(`/api/widgets/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) console.error("Error trying to delete widget");

  return response;
}

async function getWidgetDb() {
  const response = await fetch("api/widgets");
  if (!response.ok) {
    console.error("Error trying to fetch database");
    return;
  }

  const json = await response.json();

  const array = json.widgets;

  return array;
}
