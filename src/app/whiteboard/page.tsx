"use client";
import classNames from "classnames";
import WhiteBoard from "components/WhiteBoard";
import { useState } from "react";
import styles from "styles/loading.module.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <WhiteBoard
        loadingHandler={setIsLoading}
        className={classNames(isLoading && "filter: brightness-25")}
      />
      {/* {isLoading && ( */}

        <div className="flex flex-col-">
          <p className={styles.loadingText}>
            Please wait while your widgets load...
          </p>
          <div className={styles.loading} />
        </div>
      {/* )} */}
    </>
  );
}
