import { css, cx } from "@linaria/core";
import { CSSProperties, styled } from "@linaria/react";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { Chapter, useInfoStore } from "../../hooks/state/state";

import { groupBy } from "../../utils/cmpChapters";

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

const ControlsContainer = styled.div`
  height: min-content;

  position: sticky;
  top: 0;

  background-color: white;
`;

const Line = styled.div`
  width: 100vw;
  height: 2px;
  background-color: var(--color-normal);

  position: absolute;
`;

function Controls() {
  const [allChapters, deleteChapters] = useInfoStore(
    useShallow((state) => [state.allChapters, state.deleteChapters])
  );

  return (
    <ControlsContainer>
          <label>
            <input
              type="checkbox"
              tabIndex={0}
              name=""
              id=""
              onChange={(event) => {
                if (event.target.checked) allChapters();
                else deleteChapters();
              }}
            />
            Выбрать все
          </label>
      <Line />
    </ControlsContainer>
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
        <Controls />
      {groupedChapters.map(([id, volume]) => (
              <VolumeRow key={id} id={id} volume={volume} />
            ))}
      </OverflowContainer>
    </div>
  );
}
