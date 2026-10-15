import { VALUE_PROPS } from "../../constants/home";

const ValueProps = () => (
  <div className="value-strip">
    {VALUE_PROPS.map((item) => (
      <div key={item.num} className="value-item">
        <span className="value-num">{item.num}</span>
        <div>
          <h4 className="value-title">{item.title}</h4>
          <p className="value-desc">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

export default ValueProps;
