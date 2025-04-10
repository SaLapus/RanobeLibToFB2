import { CSSProperties, styled } from "@linaria/react";
import { useShallow } from "zustand/react/shallow";

import { useMemo } from "react";
import { Chapter, useInfoStore } from "../../hooks/state/state";
import { sortChapters } from "../../utils/cmpChapters";

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

interface ChapterListProps {
  className?: string;
  style?: CSSProperties;
  chapters: Record<number, Chapter>;
}

export function ChapterList({ className, style, chapters }: ChapterListProps) {
  const [toggleChapter, allChapters, deleteChapters] = useInfoStore(
    useShallow((state) => [
      state.toggleChapter,
      state.allChapters,
      state.deleteChapters,
    ])
  );

  const groupedChapters = useMemo(
    () => Object.values(chapters).sort(sortChapters()),
    [chapters]
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
                  if (event.target.checked) allChapters();
                  else deleteChapters();
                }}
              />
              Выбрать все
            </td>
          </tr>
        </TableHead>

        <TableBody>
          {groupedChapters.map((chapter, i) =>
            useMemo(
              () => (
                <ContentRow
                  key={chapter.id}
                  tabIndex={0}
                  onClick={() => toggleChapter(chapter.id)}
                  onKeyDown={(event) => {
                    if (event.key === " " || event.key === "Enter") {
                      event.preventDefault();
                      toggleChapter(chapter.id);
                    }
                  }}
                >
                  <Cell>
                    <input
                      type={"checkbox"}
                      tabIndex={-1}
                      checked={chapter.checked}
                      onChange={() => {
                        return;
                      }}
                    />
                  </Cell>
                  <Cell>Том {chapter.volume}</Cell>
                  <Cell>Глава {chapter.number}</Cell>
                  <Cell>{chapter.name ? chapter.name : ""}</Cell>
                </ContentRow>
              ),
              [groupedChapters[i].checked]
            )
          )}
        </TableBody>
      </TitleTable>
    </OverflowContainer>
  );
}
