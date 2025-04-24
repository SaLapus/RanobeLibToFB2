import { css, cx } from "@linaria/core";
import { CSSProperties, styled } from "@linaria/react";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { Chapter, useInfoStore } from "../../hooks/state/state";
import { groupBy } from "../../utils/cmpChapters";
import { Checkbox } from "../utils";
import {
  ContentRow,
  TableBody,
  TableHead,
  TitleTable,
} from "./TablePrimitives";
import TableRow from "./TableRow";

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
const Line = styled.tr`
  width: 100vw;
  height: 2px;
  background-color: var(--color-normal);

  position: absolute;
`;

function MainTableHead() {
  const [allChapters, deleteChapters] = useInfoStore(
    useShallow((state) => [state.allChapters, state.deleteChapters])
  );

  return (
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
              tabIndex={0}
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
  );
}

interface ChapterListProps {
  className?: string;
  style?: CSSProperties;
  chapters: Record<number, Chapter>;
}

export function ChapterList({ className, style, chapters }: ChapterListProps) {
  const groupedChapters = useMemo(
    () => Object.entries(groupBy("volume", chapters)),
    [chapters]
  );

  return (
    <div className={cx(scrollContainer, className)} style={style} tabIndex={-1}>
      <OverflowContainer tabIndex={-1}>
        <TitleTable>
          <MainTableHead />
          <TableBody>
            {groupedChapters.map(([id, volume]) => {
              return (
                <tr key={id}>
                  <td>
                    <Checkbox checked={true} />
                  </td>
                  <th colSpan={2}>Том {id}</th>
                  <td>
                    <svg
                      className="dropdown-arrow"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d="M2 4l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </td>
                </tr>
              );
              <ContentRow key={id}>
                {volume.map((chapter) => (
                  <TableRow
                    key={chapter.id}
                    id={chapter.id}
                    checked={chapter.checked}
                    volume={chapter.volume}
                    number={chapter.number}
                    name={chapter.name}
                  />
                ))}
              </ContentRow>;
            })}
          </TableBody>
        </TitleTable>
      </OverflowContainer>
    </div>
  );
}
