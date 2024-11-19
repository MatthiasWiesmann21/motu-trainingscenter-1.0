import { WidgetCard } from "./widgetCard";

const WidgetList = () => {
  return (
    <div className="rounded-lg shadow-md">
      <ul>
        <WidgetCard />
        <WidgetCard />
      </ul>
    </div>
  );
};

export default WidgetList;
