import { memo, useMemo, useState } from "react";

import { Chapter, useInfoStore } from "../../hooks/state/state";
import { Checkbox } from "../utils";

import { css, CSSProperties, cx } from "@linaria/core";
import { styled } from "@linaria/react";
import { useShallow } from "zustand/shallow";

interface ContentRowProps {
  id: number;
  checked: boolean;

  index: number;

  volume: string;
  number: string;
  name: string;

  className?: string;
  style?: CSSProperties;
}
const RawChapterRow = memo(function ChapterRow({
  id,
  checked,
  name,
  number,
  volume,

  className,
  style,
}: ContentRowProps) {
  const toggleChapter = useInfoStore((state) => state.toggleChapter);

  return (
    <li
      className={className}
      style={style}
      tabIndex={0}
      onClick={() => toggleChapter(id)}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          toggleChapter(id);
        }
      }}
    >
      <span>
        <Checkbox checked={checked} />
      </span>
      <span>Том {volume}</span>
      <span>Глава {number}</span>
      <span>{name ? name : ""}</span>
    </li>
  );
});
const ChapterRow = styled(RawChapterRow)`
  display: grid;
  grid-template-columns: 2em 4em 6em 1fr;
  grid-template-rows: 1fr;
  align-items: center;

  opacity: 0;

  animation: fading 500ms linear ${(props) => props.index * 20}ms 1 normal
    forwards;

  @keyframes fading {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  &:hover {
    background-color: var(--color-hover);
  }

  &:active {
    background-color: var(--color-click);
  }
`;

const DropDown = css`
  transition: transform 0.2s ease;

  &.opened {
    transform: rotate(180deg);
  }
`;

const VolumeMain = css`
  background-color: var(--color-selected-bg);

  height: min-content;
  margin: 0;
  padding: 1em;

  & li::marker {
    content: "";
  }
`;
const VolumeHead = css`
  background-color: var(--color-primarly);

  display: grid;
  grid-template-columns: 2em 4em 1fr;
  grid-template-rows: 1fr;
  align-items: center;

  height: 3em;

  border-radius: 1em;

  & > :nth-child(2) {
    height: min-content;
  }

  & > :nth-child(3) {
    cursor: pointer;
  }
`;
const VolumeContent = css`
  height: 100%;
  max-height: 0;
  transition: max-height 0s linear;

  &.opened {
    transition: max-height 500ms linear;
    max-height: max-content;
  }
`;
const Chapters = css`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
`;

interface VolumeRowProps {
  id: string;
  volume: Chapter[];
}
const VolumeRow = function VolumeRow({ id, volume }: VolumeRowProps) {
  const [allChapters, deleteChapters] = useInfoStore(
    useShallow((state) => [state.allChapters, state.deleteChapters])
  );

  const checked = useMemo(
    () => volume.every((chapter) => chapter.checked),
    [volume]
  );
  const chaptersIDs = useMemo(
    () => volume.map((chapter) => chapter.id),
    [volume]
  );

  const [status, toggleView] = useState<boolean>(false);

  return (
    <ul className={VolumeMain}>
      <li
        className={VolumeHead}
        tabIndex={0}
        onClick={() =>
          checked ? deleteChapters(chaptersIDs) : allChapters(chaptersIDs)
        }
        onKeyDown={(event) => {
          if (event.key === " ") {
            event.preventDefault();
            toggleView(!status);
          } else if (event.key === "Enter") {
            event.preventDefault();

            if (checked) deleteChapters(chaptersIDs);
            else allChapters(chaptersIDs);
          }
        }}
      >
        <Checkbox checked={checked} />
        <span>Том {id}</span>
        <span
          onClick={(event) => {
            event.stopPropagation();
            toggleView(!status);
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className={cx(DropDown, status ? "opened" : "")}
          >
            <path
              d="M2 4l4 4 4-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </li>

      <li className={cx(VolumeContent, status && "opened")}>
        {status && (
          <ul className={Chapters}>
            {volume.map((chapter, index) => (
              <ChapterRow
                key={chapter.id}
                index={index}
                id={chapter.id}
                checked={chapter.checked}
                volume={chapter.volume}
                number={chapter.number}
                name={chapter.name}
              />
            ))}
          </ul>
        )}
      </li>
    </ul>
  );
};

export default VolumeRow;
