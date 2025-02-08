import { useShallow } from "zustand/react/shallow";

import { titleInfo as titleInfoClass } from "../../pages/Title/Title.module.css";

import { useInfoStore } from "../../hooks/state/state";

export default function TitleInfo() {
  const [titleInfo, chaptersInfo] = useInfoStore(
    useShallow((state) => [state.titleInfo, state.chaptersInfo])
  );

  if (!titleInfo || !chaptersInfo) return null;

  const author = titleInfo.authors.shift()?.name || "";

  return (
    <div className={titleInfoClass}>
      <div className="infoElement">
        <span className="name">Тип</span>
        <span className="value">{titleInfo.type.label}</span>
      </div>
      <div className="infoElement">
        <span className="name">Формат</span>
        <span className="value">{titleInfo.model}</span>
      </div>
      <div className="infoElement">
        <span className="name">Выпуск</span>
        <span className="value">{titleInfo.releaseDateString}</span>
      </div>
      <div className="infoElement">
        <span className="name">Глав</span>
        <span className="value">{chaptersInfo.length}</span>
      </div>
      <div className="infoElement">
        <span className="name">Статус</span>
        <span className="value">{titleInfo.status.label}</span>
      </div>
      <div className="infoElement">
        <span className="name">Перевод</span>
        <span className="value">{"&&&"} </span>
      </div>
      <div className="infoElement">
        <span className="name">Автор</span>
        <span className="value">{author}</span>
      </div>
    </div>
  );
}
