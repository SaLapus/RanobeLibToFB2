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

const OverflowContainer = styled.div`
  overflow: scroll;
`;

const TitleTable = styled.table`
  width: 100%;

  table-layout: fixed;
  border-collapse: collapse;
  border-color: var(--color-normal);
  overflow: hidden;

  & * {
    height: fit-content;
  }

  text-align: left;
`;

const TableHead = styled.thead`
  position: sticky;
  top: 0;
  background-color: white;

  & th:nth-child(1) {
    width: 10%;
  }

  & th:nth-child(2) {
    width: 15%;
  }

  & th:nth-child(3) {
    width: 15%;
  }

  & th:nth-child(4) {
    width: 60%;
  }
`;
const TableBody = styled.tbody`
  overflow-y: scroll;
`;
const ContentRow = styled.tr`
  cursor: pointer;

  &:hover {
    background-color: var(--color-hover);
  }
`;
const Cell = styled.td`
  min-height: 2em;
  min-width: 4em;
`;

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
    <OverflowContainer className={className} style={style} tabIndex={-1}>
      <TitleTable>
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
                  key={ch.id}
                  tabIndex={0}
                  onClick={() => toggleChapter(vol, ch)}
                  onKeyDown={(event) => {
                    if (event.key === " " || event.key === "Enter") {
                      event.preventDefault();
                      toggleChapter(vol, ch);

                      // if (event.) addChapters(groupedChapters);
                    }
                  }}
                >
                  <Cell>
                    {/* Move hasChapter calculation outside of render loop  */}
                    <input
                      type={"checkbox"}
                      tabIndex={-1}
                      checked={hasChapter(ch.id)}
                      onChange={() => {
                        return;
                      }}
                    />
                  </Cell>
                  <Cell>Том {ch.volume}</Cell>
                  <Cell>Глава {ch.number}</Cell>
                  <Cell>{ch.name ? ch.name : ""}</Cell>
                </ContentRow>
              );
            })
          )}
        </TableBody>
      </TitleTable>
    </OverflowContainer>
  );
}
