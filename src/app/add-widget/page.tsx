"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { addWidgetDb } from "lib/widgetDb";
import { Types } from "mongoose";
import * as Widgets from "components/widget-components/index";
import Link from "next/link";

export default function WidgetAddForm() {
  const [formData, setFormData] = useState({
    // Req. 3A: use state
    widgetType: "",
    title: "",
  });

  const router = useRouter();

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // Req. 3B: onChange
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    // Req. 3C onSubmit
    event.preventDefault();

    try {
      addWidgetDb(formData.widgetType, new Types.ObjectId(), formData.title);

      setFormData({ widgetType: "", title: "" }); // Req. 3D: clear input
      router.push("/whiteboard");
    } catch (error) {
      console.error("Error adding widget: ", error);
    }
  };

  return (
    <div className="flex grow w-full h-full justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col h-fit justify-center p-4 bg-gray-300 gap-2 rounded-lg"
      >
        <select
          name="widgetType"
          value={formData.widgetType}
          onChange={handleChange}
          required
          className="bg-white"
        >
          <option value="">--Choose A Widget--</option>
          {Object.entries(Widgets).map(([key], k) => {
            const formattedKey = key.split(/(?=[A-Z])/).join(" "); // Split camelCase or PascalCase into words
            return (
              <option key={k} value={key}>
                {formattedKey}
              </option>
            );
          })}
        </select>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="bg-white"
        />
        <button type="submit" className="bg-blue-400 rounded py-1 text-white mt-4">
          Add Widget
        </button>
        <Link
          href="/whiteboard"
          className="bg-red-500 flex justify-center rounded text-white"
        >
          Cancel
        </Link>
      </form>
    </div>
  );
}
