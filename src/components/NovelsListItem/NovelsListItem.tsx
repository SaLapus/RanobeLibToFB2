import { Card, Image, Typography } from "antd";
import { useShallow } from "zustand/react/shallow";

import { useInfoStore } from "../../hooks/state/state";
import { FetchedQueryTitle } from "../../utils/api";

interface NovelsListItemProps {
  novel: FetchedQueryTitle;
}

export default function NovelsListItem({ novel }: NovelsListItemProps) {
  const setSlug = useInfoStore(useShallow((state) => state.setSlug));

  return (
    <Card
      hoverable={true}
      cover={
        <Image
          src={novel.cover.thumb}
          preview={false}
          placeholder={true}
          alt={`Обложка ${novel.rus_name}`}
          width={100}
        />
      }
      style={{
        height: "10rem",

        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",

        padding: "16px",
        borderRadius: "8px",
      }}
      styles={{
        cover: {
          width: "20%",
        },
        body: {
          width: "80%",
        },
      }}
      onClick={() => setSlug(novel.slug_url)}
    >
      <Typography style={{ textAlign: "left" }}>
        <Typography.Title level={5}>{novel.rus_name}</Typography.Title>

        <Typography.Paragraph>{novel.status}</Typography.Paragraph>

        <Typography.Paragraph type="secondary">{`${novel.type}, ${novel.year}`}</Typography.Paragraph>
      </Typography>
    </Card>
  );

  // <List.Item
  //     onClick={() => setSlug(novel.slug_url)}
  //     style={{
  //       cursor: "pointer",
  //     }}
  //   >
  //     <Flex justify="space-evenly" align="center">
  //       <Image
  //         src={novel.cover.thumb}
  //         preview={false}
  //         placeholder={true}
  //         alt={`Обложка ${novel.rus_name}`}
  //         width={100}
  //       />
  //       <Typography style={{ width: "400px", textAlign: "left" }}>
  //         <Typography.Title level={5}>{novel.rus_name}</Typography.Title>

  //         <Typography.Paragraph>{novel.status}</Typography.Paragraph>

  //         <Typography.Paragraph type="secondary">{`${novel.type}, ${novel.year}`}</Typography.Paragraph>
  //       </Typography>
  //     </Flex>
  //   </List.Item>

  // <div>
  //   <img className={styles["card-image"]} src={novel.cover.thumb} alt="" />
  //   <div>{novel.status}</div>
  //   <div>{novel.rus_name}</div>
  //   <div>{novel.type}</div>
  //   <div>{novel.year}</div>
  // </div>
}
