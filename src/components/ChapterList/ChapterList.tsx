import { CSSProperties, styled } from "@linaria/react";
import { useShallow } from "zustand/react/shallow";

import { useMemo } from "react";
import { useChapterStore } from "../../hooks/state/state";
import { groupBy } from "../../utils/cmpChapters";

import type { Data as ChapterInfo } from "../../types/api/ChaptersInfo";

interface ChapterListProps {
  className?: string;
  style?: CSSProperties;
  chaptersInfo: ChapterInfo[];
}

const TitleTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
`;

const TableHead = styled.thead``;
const TableBody = styled.tbody``;
const ContentRow = styled.tr`
  cursor: "pointer";
  text-align: "left";
`;
const Cell = styled.td``;

const cellStyle: React.CSSProperties = {
  minHeight: "2em",
  minWidth: "4em",
};

export function ChapterList({
  className,
  style,
  chaptersInfo,
}: ChapterListProps) {
  const [, addChapters, toggleChapter, deleteChapters, hasChapter] =
    useChapterStore(
      useShallow((state) => [
        state.chapters,
        state.addChapters,
        state.toggleChapter,
        state.deleteChapters,
        state.hasChapter,
      ])
    );

  const groupedChapters = useMemo(
    () => groupBy("volume", chaptersInfo),
    [chaptersInfo]
  );

  return (
    <TitleTable className={className} style={style}>
      <TableHead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Том</th>
          <th scope="col">Глава</th>
          <th scope="col">Название</th>
        </tr>

        <tr className="controls">
          <td colSpan={4}>
            <input
              type="checkbox"
              className={"controls"}
              name=""
              id=""
              onChange={(event) => {
                if (event.target.checked) addChapters(groupedChapters);
                else deleteChapters();
              }}
            />
            Выбрать все
          </td>
        </tr>
      </TableHead>

      <TableBody>
        {groupedChapters.map(([vol, chs]) =>
          chs.map((ch) => {
            // Perfomance?..
            return (
              <ContentRow
                key={vol + "_" + ch.id}
                onClick={() => toggleChapter(vol, ch)}
              >
                <Cell>
                  {/* Move hasChapter calculation outside of render loop  */}
                  <input type={"checkbox"} checked={hasChapter(ch.id)} />
                </Cell>
                <Cell style={cellStyle}>Том {ch.volume}</Cell>
                <Cell style={cellStyle}>Глава {ch.number}</Cell>
                <Cell>{ch.name ? ch.name : ""}</Cell>
              </ContentRow>
            );
          })
        )}
      </TableBody>
    </TitleTable>
  );
}
