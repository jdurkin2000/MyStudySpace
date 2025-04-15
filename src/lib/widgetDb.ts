import { Coordinates } from "@dnd-kit/core/dist/types";
import { Types } from "mongoose";

export async function addWidgetDb(
  widgetType: string,
  id: string | Types.ObjectId,
  title: string,
  pos?: Coordinates
) {
  const response = await fetch("/api/widgets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      widgetType: widgetType,
      position: { x: pos?.x ?? 0, y: pos?.y ?? 0 },
      label: title,
      _id: typeof id === "string" ? id : id.toHexString(),
    }),
  });

  if (!response.ok) throw new Error("Error trying to add widget");
}

export async function removeWidgetDb(id: number | string) {
  const response = await fetch(`/api/widgets/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) console.error("Error trying to delete widget");

  return response;
}

export async function getWidgetDb() {
  const response = await fetch("api/widgets");
  if (!response.ok) {
    console.error("Error trying to fetch database");
    return;
  }

  const json = await response.json();

  const array = json.widgets;

  return array;
}

export async function updateWidgetDb({
  id,
  position,
  stateValues,
  label,
}: {
  id: string | number;
  position?: Coordinates;
  stateValues?: object;
  label?: string;
}) {
  // Define the type of jsonBody
  const jsonBody: {
    position?: Coordinates;
    stateValues?: object;
    label?: string;
  } = {};

  if (position !== null && position !== undefined) jsonBody.position = position;
  if (stateValues !== null && stateValues !== undefined)
    jsonBody.stateValues = stateValues;
  if (label !== null && label !== undefined) jsonBody.label = label;

  const response = await fetch(`/api/widgets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonBody),
  });

  if (!response.ok) {
    console.error("Error updating widget");
  }

  return response;
}

export function getStrId() {
  return new Types.ObjectId().toHexString();
}
