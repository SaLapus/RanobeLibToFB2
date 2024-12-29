import { fetchedQueryTitle } from "../../utils/api";

import styles from "./SNovel.module.css";

interface SNovelsProps {
  novel: fetchedQueryTitle;
}

export default function SNovel({ novel }: SNovelsProps) {
  return (
    <div className={styles["card"]} data-slug={novel.slug_url}>
      <img className={styles["card-image"]} src={novel.cover.thumb} alt="Обложка" />
      <div className={styles["card-content"]}>
        <p className={styles["status"]}>{novel.status}</p>
        <p className={styles["title"]}>{novel.rus_name}</p>
        <p className={styles["details"]}> {`${novel.type}, ${novel.year}`}</p>
      </div>
    </div>

    // <div>
    //   <img className={styles["card-image"]} src={novel.cover.thumb} alt="" />
    //   <div>{novel.status}</div>
    //   <div>{novel.rus_name}</div>
    //   <div>{novel.type}</div>
    //   <div>{novel.year}</div>
    // </div>
  );
}
