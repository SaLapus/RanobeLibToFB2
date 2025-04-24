import { memo } from "react";

import { useInfoStore } from "../../hooks/state/state";
import { Checkbox } from "../utils";
import { Cell, ContentRow } from "./TablePrimitives";

interface ContentRowProps {
  id: number;
  checked: boolean;

  volume: string;
  number: string;
  name: string;
}
const TableRow = memo(function TableRow({
  id,
  checked,
  name,
  number,
  volume,
}: ContentRowProps) {
  const toggleChapter = useInfoStore((state) => state.toggleChapter);

  return (
    <ContentRow
      tabIndex={0}
      onClick={() => toggleChapter(id)}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          toggleChapter(id);
        }
      }}
    >
      <Cell>
        <Checkbox checked={checked} />
      </Cell>
      <Cell>Том {volume}</Cell>
      <Cell>Глава {number}</Cell>
      <Cell>{name ? name : ""}</Cell>
    </ContentRow>
  );
});

export default TableRow;
