import Image from "next/image"
import WidgetBase, { WidgetBaseProps } from "components/WidgetBase"

/* --IMPORTANT-- make sure your component function is *not* default, and add the export line for 
this component function with braces in the index.ts file within this folder*/
export function ExampleWidget(props: WidgetBaseProps) {

    return (
        // Also must pass in props like below in order for widget to be rendered correctly
        <WidgetBase className="bg-white px-4 py-2 rounded-md" {...props}>
            <Image 
                src="clock.svg"
                alt="clock"
                width={100}
                height={100}
            />
        </WidgetBase>
    )
}