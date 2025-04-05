import { styled } from "@linaria/react";

import { useInfoStore } from "../../hooks/state/state";
import { FetchedQueryTitle } from "../../utils/api";

// Img height 100%
// img align center
// Flex box every item with same heght
const Card = styled.article`
  --input-width: min(40em, 90vw);

  height: min-content;
  max-height: min-content;
  width: var(--input-width);

  flex-shrink: 0;

  display: grid;
  grid-template-columns: 10em 1fr;
  grid-template-rows: repeat(3, 3fr);
  column-gap: 10px;

  border-radius: 8px;
  box-shadow: 2px 4px 8px rgb(0 0 0 / 10%);

  overflow: hidden;

  &:hover {
    cursor: pointer;
    outline: 1px solid var(--color-hover);
    background-color: var(--color-selected-bg);
    transition: background-color 0.3s linear;
  }
`;

const CardImage = styled.img`
  width: 100%;
  object-fit: cover;

  /* TODO: Media query: Add media query for mobile screen sizes */

  grid-column: 1 / 2;
  grid-row: 1 / 4;
`;
const CardTitle = styled.h2`
  margin: 0;
`;
const CardStatus = styled.p``;
const CardFooter = styled.footer``;

interface SearchedCardProps {
  novel: FetchedQueryTitle;
}


export default function SearchedCard({ novel }: SearchedCardProps) {
  const setSlug = useInfoStore((state) => state.setSlug);

  return (
    <Card
      onClick={() => {
        void setSlug(novel.slug_url);
      }}
    >
      <CardImage
        src={novel.cover.thumb}
        alt={`Обложка ${novel.rus_name}`}
        decoding={"async"}
        loading={"lazy"}
      ></CardImage>

      <CardTitle>{novel.rus_name}</CardTitle>
      <CardStatus>{novel.status}</CardStatus>
      <CardFooter>{`${novel.type}, ${novel.year}`}</CardFooter>
    </Card>
  );
}
