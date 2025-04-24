import { styled } from "@linaria/react";

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
const TableBody = styled.tbody``;
const ContentRow = styled.tr`
  margin-inline: 2px;
  cursor: pointer;
`;
const Cell = styled.td`
  min-height: 2em;
  min-width: 4em;
`;

export { Cell, ContentRow, TableBody, TableHead, TitleTable };

