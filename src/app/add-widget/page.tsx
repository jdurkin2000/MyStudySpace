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
    <div className="w-full min-h-250 flex justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center p-2 bg-blue-600 gap-2"
      >
        <select
          name="widgetType"
          value={formData.widgetType}
          onChange={handleChange}
          required
          className="bg-white"
        >
          <option value="" />
          {Object.entries(Widgets).map(([key], k) => {
            return (
              <option key={k} value={key}>
                {key}
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
        <button type="submit" className="bg-green-400">
          Add Widget
        </button>
        <Link href="/whiteboard" className="bg-red-500 flex justify-center">
          Cancel
        </Link>
      </form>
    </div>
  );
}
