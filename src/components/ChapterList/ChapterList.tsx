import { css, cx } from "@linaria/core";
import { CSSProperties, styled } from "@linaria/react";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { Chapter, useInfoStore } from "../../hooks/state/state";

import { groupBy } from "../../utils/cmpChapters";
import { Layer } from "../../utils/css/layers";

import VolumeRow from "./TableRow";

/** ChapterList TODOs
 * Layout & Visual:
 * TODO: Fix chapters <li> elements overlapping each other
 * TODO: Fix chapters overflowing in volume containers
 *
 * Performance Optimizations:
 * TODO: Implement virtualization for large chapter lists
 * TODO: Add pagination or infinite scroll for better memory management
 * TODO: Cache expanded/collapsed state of volumes
 *
 * User Experience:
 * TODO: Add keyboard navigation between chapters
 * TODO: Implement drag-select for multiple chapters
 * TODO: Add search/filter functionality for chapters
 *
 * Accessibility Enhancements:
 * TODO: Improve ARIA labels and roles
 * TODO: Add screen reader announcements for state changes
 */

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

  z-index: ${Layer.Low};
`;

const ControlsContainer = styled.div`
  height: min-content;

  position: sticky;
  top: 0;

  background-color: white;
  z-index: ${Layer.Top};
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
