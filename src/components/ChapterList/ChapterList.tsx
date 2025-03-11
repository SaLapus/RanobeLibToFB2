import { useShallow } from "zustand/react/shallow";

import { chapter } from "./ChapterList.module.css";

import { Checkbox, Col, List, Row } from "antd";
import { useChapterStore, useInfoStore } from "../../hooks/state/state";
import { groupBy } from "../../utils/cmpChapters";

export function ChapterList() {
  const chaptersInfo = useInfoStore((state) => state.chaptersInfo);
  const [, addChapters, toggleChapter, deleteChapters, hasChapter] = useChapterStore(
    useShallow((state) => [
      state.chapters,
      state.addChapters,
      state.toggleChapter,
      state.deleteChapters,
      state.hasChapter,
    ])
  );

  if (!chaptersInfo) return null;

  const groupedChapters = groupBy("volume", chaptersInfo);

  return (
    <>
      <Row className="controls" justify={"space-evenly"}>
        <Col span={1}>#</Col>
        <Col span={2}>Том</Col>
        <Col span={2}>Глава</Col>
        <Col span={19}>Название</Col>

        <Checkbox
          onChange={(event) => {
            if (event.target.checked) addChapters(groupedChapters);
            else deleteChapters();
          }}
        >
          Выбрать все
        </Checkbox>
      </Row>

      <List
        itemLayout="vertical"
        style={{
          overflowY: "scroll",
          height: "100%",
        }}
      >
        {groupedChapters.map(([vol, chs], ind) => (
          <List.Item
            key={vol}
            style={{
              backgroundColor: ind % 2 ? "#535353" : "",
            }}
          >
            {chs.map((ch) => {
              return (
                <Row
                  className={chapter}
                  key={ch.id}
                  align={"middle"}
                  onClick={() => toggleChapter(vol, ch)}
                  style={{
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <Col span={1}>
                    <Checkbox checked={hasChapter(ch.id)} />
                  </Col>
                  <Col span={2}>Том {ch.volume}</Col>
                  <Col span={2}>Глава {ch.number}</Col>
                  <Col span={19}>{ch.name ? ch.name : ""}</Col>
                </Row>
              );
            })}
          </List.Item>
        ))}
      </List>
    </>
  );
}
