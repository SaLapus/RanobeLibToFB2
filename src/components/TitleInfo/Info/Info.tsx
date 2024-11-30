interface InfoProps {
  type: string;
  format: string;
  published: string;
  chaptersCount: number;
  status: string;
  translateStatus: string;
  author: string;
}

export default function Info(props: InfoProps) {
  return (
    <div>
      <div className="infoElement">
        <div className="name">Тип</div>
        <div className="value">{props.type}</div>
      </div>
      <div className="infoElement">
        <div className="name">Формат</div>
        <div className="value">{props.format}</div>
      </div>
      <div className="infoElement">
        <div className="name">Выпуск</div>
        <div className="value">{props.published}</div>
      </div>
      <div className="infoElement">
        <div className="name">Глав</div>
        <div className="value">{props.chaptersCount}</div>
      </div>
      <div className="infoElement">
        <div className="name">Статус</div>
        <div className="value">{props.status}</div>
      </div>
      <div className="infoElement">
        <div className="name">Перевод</div>
        <div className="value">{props.translateStatus} </div>
      </div>
      <div className="infoElement">
        <div className="name">Автор</div>
        <div className="value">{props.author}</div>
      </div>
    </div>
  );
}
