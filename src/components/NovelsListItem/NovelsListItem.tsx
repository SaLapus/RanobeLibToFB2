import { useInfoStore } from "../../hooks/state/state";
import { FetchedQueryTitle } from "../../utils/api";

import { Image, List, Typography, Flex } from "antd";
import { useShallow } from "zustand/react/shallow";

interface NovelsListItemProps {
  novel: FetchedQueryTitle;
}

export default function NovelsListItem({ novel }: NovelsListItemProps) {
  const setSlug = useInfoStore(useShallow((state) => state.setSlug));

  return (
    <List.Item onClick={() => setSlug(novel.slug_url)}>
      <Flex justify="space-evenly" align="center">
        <Image
          src={novel.cover.thumb}
          preview={false}
          placeholder={true}
          alt={`Обложка ${novel.rus_name}`}
          width={100}
        />
        <Typography style={{ width: "400px", textAlign: "left" }}>
          <Typography.Title level={5}>{novel.rus_name}</Typography.Title>

          <Typography.Paragraph>{novel.status}</Typography.Paragraph>

          <Typography.Paragraph type="secondary">{`${novel.type}, ${novel.year}`}</Typography.Paragraph>
        </Typography>
      </Flex>
    </List.Item>

    // <div>
    //   <img className={styles["card-image"]} src={novel.cover.thumb} alt="" />
    //   <div>{novel.status}</div>
    //   <div>{novel.rus_name}</div>
    //   <div>{novel.type}</div>
    //   <div>{novel.year}</div>
    // </div>
  );
}
