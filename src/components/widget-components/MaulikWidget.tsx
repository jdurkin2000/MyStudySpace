import Image from "next/image";
import WidgetBase, { WidgetBaseProps } from "components/WidgetBase";

export function MaulikWidget(props: WidgetBaseProps) {
  return (
      <WidgetBase className="flex max-w-60 justify-center items-center bg-blue-800 p-4" {...props}>
        <Image
          src="/what_algorithms_does_to_a_man.jpg"
          alt="Maulik my beloved"
          width={100}
          height={100}
        />
        <p>
          Sadness is not the enemy, but the poet whispering truths we dare not
          face in the light.
        </p>
      </WidgetBase>
  );
}
