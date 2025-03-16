import WidgetBase, { WidgetBaseProps } from "components/WidgetBase"

/* --IMPORTANT-- make sure your component function is *not* default, and add the export line for 
this component function with braces in the index.ts file within this folder*/
export function WidgetTemplate(props: WidgetBaseProps) {

    

    return (
        // Leave the props argument as is below, feel free to add other
        // properties to widget base to modify look n feel
        <WidgetBase {...props}>
            
        {/* Everything in return should be wrapped in WidgetBase */}

        </WidgetBase>
    )
}