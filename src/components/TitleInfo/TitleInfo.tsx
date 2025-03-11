import { Row, Col } from "antd";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { useInfoStore } from "../../hooks/state/state";

export default function TitleInfo() {
  const [titleInfo, chaptersInfo] = useInfoStore(
    useShallow((state) => [state.titleInfo, state.chaptersInfo])
  );

  const data = useMemo(() => {
    if (!titleInfo || !chaptersInfo) return [];

    return [
      ["Тип", titleInfo.type.label],
      ["Формат", titleInfo.model],
      ["Выпуск", titleInfo.releaseDateString],
      ["Глав", chaptersInfo.length],
      ["Статус", titleInfo.status.label],
      ["Перевод", "&&&"],
      ["Автор", titleInfo.authors.shift()?.name || ""],
    ];
  }, [titleInfo, chaptersInfo]);

  if (!data.length) return;

  return (
    <>
      {data.map((row) => (
        <Row key={row[0]}>
          <Col>{row[0]}</Col>
          <Col>{row[1]}</Col>
        </Row>
      ))}
    </>
  );
}
