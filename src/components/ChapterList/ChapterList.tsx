import { css, cx } from "@linaria/core";
import { CSSProperties, styled } from "@linaria/react";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { Chapter, useInfoStore } from "../../hooks/state/state";
import { sortChapters } from "../../utils/cmpChapters";

const scrollContainer = css`
  height: 100%;

  margin: 0 1em -5em 0;
  padding: 1em 0 1em 10px;

  overflow-x: hidden;
`;
const OverflowContainer = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;

  width: calc(100% + 20px);
`;

const TitleTable = styled.table`
  width: 100%;

  table-layout: fixed;
  border-collapse: collapse;

  & * {
    height: fit-content;
  }

  text-align: left;
`;

const TableHead = styled.thead`
  position: sticky;
  top: 0;

  background-color: white;
  box-shadow: 0 3px 8px rgba(0 0 0 / 24%);

  & th:nth-child(1) {
    width: 2em;
  }

  & th:nth-child(2) {
    width: 4em;
  }

  & th:nth-child(3) {
    width: 6em;
  }

  & th:nth-child(4) {
    width: auto;
  }
`;
const Line = styled.tr`
  width: 100vw;
  height: 2px;
  background-color: var(--color-normal);

  position: absolute;
`;
const TableBody = styled.tbody``;
const ContentRow = styled.tr`
  margin-inline: 2px;
  cursor: pointer;

  &:hover {
    background-color: var(--color-hover);
  }

  &:active {
    background-color: var(--color-click);
  }
`;
const Checkbox = styled.div<{ checked: boolean }>`
  width: 16px;
  height: 16px;
  border: 2px solid
    ${(props) =>
      props.checked ? "var(--color-normal)" : "var(--font-primary)"};
  border-radius: 3px;
  background-color: ${(props) =>
    props.checked ? "var(--color-normal)" : "transparent"};
  position: static;

  &::after {
    content: "";
    display: ${(props) => (props.checked ? "block" : "none")};
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    position: relative;
    top: 0;
    left: 5px;
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
    <div className={cx(scrollContainer, className)} style={style} tabIndex={-1}>
      <OverflowContainer tabIndex={-1}>
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
                <label>
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
                </label>
              </td>
            </tr>

            <Line />
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
                      <Checkbox checked={chapter.checked} />
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
    </div>
  );
}
