import { css, cx } from "@linaria/core";
import { CSSProperties, styled } from "@linaria/react";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { Chapter, useInfoStore } from "../../hooks/state/state";
import { groupBy } from "../../utils/cmpChapters";
import {
  TableHead
} from "./TablePrimitives";
import VolumeRow from "./TableRow";

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
      {groupedChapters.map(([id, volume]) => (
              <VolumeRow key={id} id={id} volume={volume} />
            ))}
      </OverflowContainer>
    </div>
  );
}
