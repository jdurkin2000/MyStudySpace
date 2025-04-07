import WidgetBase, { WidgetBaseProps } from "components/WidgetBase";
import styles from "./QuoteWidget.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface QuoteDisplay {
  quote: string;
  anime?: string;
  character?: string;
}

export function QuoteWidget(props: WidgetBaseProps) {
  const [displayQuote, setDisplayQuote] = useState<QuoteDisplay>({
    quote: "I'm going to be king of the skibidi toilets!",
    anime: "One Piece",
    character: "- Luffy",
  });
  const [isFetching, setIsFetching] = useState(false);

  const fetchQuote = () => {
    if (isFetching) return;

    setIsFetching(true);
    fetch("/api/quotes")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error: status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        console.log(json);
        const quote = json.data.content;
        const anime = json.data.anime.name;
        const character = json.data.character.name;
        setDisplayQuote({
          quote: quote,
          anime: anime,
          character: "- " + character,
        });
      })
      .catch((error: Error) => {
        console.error("Failed to fetch quote: ", error);
        setDisplayQuote({
          quote: "Error fetching new quote",
          character: error.message,
        });
      })
      .finally(() => {
        setTimeout(() => setIsFetching(false), 1000); // Cooldown of 1 second
      });
  };

  return (
    <WidgetBase className={styles.base} {...props}>
      <div className={styles.display}>
        <p className="italic leading-tight flex-auto overflow-hidden overflow-ellipsis line-clamp-5">
          {displayQuote.quote}
        </p>
        <div className="w-full border-1 border-black" />
        <p className="text-nowrap overflow-hidden overflow-ellipsis">
          {displayQuote.character}
        </p>
        <p className="font-bold italic text-nowrap overflow-hidden overflow-ellipsis">
          {displayQuote.anime}
        </p>
      </div>
      <button
        onClick={fetchQuote}
        className={styles.button}
        disabled={isFetching}
      >
        <FontAwesomeIcon
          icon={faRotate}
          className={isFetching ? styles.spin : ""}
        />
        {isFetching ? "Loading..." : "Generate Quote"}
      </button>
    </WidgetBase>
  );
}
