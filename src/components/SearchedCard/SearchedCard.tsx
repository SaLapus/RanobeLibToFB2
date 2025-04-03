import { styled } from "@linaria/react";

import { useInfoStore } from "../../hooks/state/state";
import { FetchedQueryTitle } from "../../utils/api";

interface SearchedCardProps {
  novel: FetchedQueryTitle;
}

const Card = styled.article`
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-rows: repeat(3, 3fr);
  column-gap: 10px;

  outline: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 2px 4px 8px rgb(0 0 0 / 10%);

  &:hover {
    cursor: pointer;
  }
`;

const CardImage = styled.img`
  grid-column: 1 / 2;
  grid-row: 1 / 4;
`;
const CardTitle = styled.h2``;
const CardStatus = styled.p``;
const CardFooter = styled.footer``;

export default function SearchedCard({ novel }: SearchedCardProps) {
  const setSlug = useInfoStore((state) => state.setSlug);

  return (
    <Card
      onClick={() => {
        setSlug(novel.slug_url);
      }}
    >
      <CardImage
        src={novel.cover.thumb}
        alt={`Обложка ${novel.rus_name}`}
      ></CardImage>

      <CardTitle>{novel.rus_name}</CardTitle>
      <CardStatus>{novel.status}</CardStatus>
      <CardFooter>{`${novel.type}, ${novel.year}`}</CardFooter>
    </Card>
  );
}
