import { CSSProperties, styled } from "@linaria/react";
import { useMemo } from "react";

import { Chapter } from "../../hooks/state/state";
import type { TitleInfo } from "../../types/api/Title";

const LayoutContainer = styled.div`
  height: 100%;
  width: 100%;
`;
const InfoTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  & * {
    height: fit-content;
  }
`;

interface TitleInfoProps {
  className?: string;
  style?: CSSProperties;
  titleInfo: TitleInfo;
  chapters: Record<number, Chapter>;
}
export default function TitleInfo({
  className,
  style,
  titleInfo,
  chapters,
}: TitleInfoProps) {
  const data = useMemo(() => {
    if (!titleInfo || !chapters) return [];

    return [
      ["Тип", titleInfo.type.label],
      ["Формат", titleInfo.model],
      ["Выпуск", titleInfo.releaseDateString],
      ["Глав", Object.keys(chapters).length],
      ["Статус", titleInfo.status.label],
      ["Перевод", "&&&"],
      ["Автор", titleInfo.authors[0]?.name ?? ""],
    ];
  }, [titleInfo, chapters]);

  return (
    <LayoutContainer>
      <InfoTable className={className} style={style}>
        <tbody>
          {data.map((row) => (
            <tr key={row[0]}>
              <th>{row[0]}</th>
              <td>{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </InfoTable>
    </LayoutContainer>
  );
}
