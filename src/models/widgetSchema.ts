import mongoose, { Model, Schema } from "mongoose";
import type { Coordinates } from "@dnd-kit/core/dist/types";

export interface IWidget extends Document {
    widgetType: string;
    position: Coordinates;
    stateValues?: object;
}

const posSchema = new Schema<Coordinates>({
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    }
})

const widgetSchema = new Schema<IWidget>({
    widgetType: {
        type: String,
        required: true
    },
    position: {
        type: posSchema,
        required: true,
        default: {x: 0, y: 0}
    },
    stateValues: {
        type: Object,
        required: false
    }
})

const Widget: Model<IWidget> = mongoose.models.Widget || mongoose.model<IWidget>("Widget", widgetSchema);
export default Widget;