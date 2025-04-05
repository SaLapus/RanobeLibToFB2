import { CSSProperties, styled } from "@linaria/react";
import { useMemo } from "react";

import type { Data as ChapterInfo } from "../../types/api/ChaptersInfo";
import type { TitleInfo } from "../../types/api/Title";

interface TitleInfoProps {
  className?: string;
  style?: CSSProperties;
  titleInfo: TitleInfo;
  chaptersInfo: ChapterInfo[];
}

const InfoTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
`;

export default function TitleInfo({
  className,
  style,
  titleInfo,
  chaptersInfo,
}: TitleInfoProps) {
  const data = useMemo(() => {
    if (!titleInfo || !chaptersInfo) return [];

    return [
      ["Тип", titleInfo.type.label],
      ["Формат", titleInfo.model],
      ["Выпуск", titleInfo.releaseDateString],
      ["Глав", chaptersInfo.length],
      ["Статус", titleInfo.status.label],
      ["Перевод", "&&&"],
      ["Автор", titleInfo.authors.shift()?.name ?? ""],
    ];
  }, [titleInfo, chaptersInfo]);

  return (
    <InfoTable className={className} style={style}>
      {data.map((row) => (
        <tr key={row[0]}>
          <th>{row[0]}</th>
          <td>{row[1]}</td>
        </tr>
      ))}
    </InfoTable>
  );
}
