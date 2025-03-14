import { Wrapper } from "@/src/lib/BaseWidgetStuff"
import Image from "next/image"

export default function ExampleWidget() {


    return (
        <div className="flex items-center flex-col bg-white max-w-50 max-h-auto">
            <Image src="/what_algorithms_does_to_a_man.jpg" alt="Maulik my beloved" width={50} height={50}/>
            <p>Sadness is not the enemy, but the poet whispering truths we dare not face in the light.</p>
        </div>
    )
}