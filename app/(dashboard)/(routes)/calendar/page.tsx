import CalendarWidget from "./_components/calendar";
import WidgetList from "./_components/widgetList";

const CalendarPage = () => {

  return (
    <div className="flex min-h-screen flex-col m-2w">
      <div className="mx-auto w-full max-w-2xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="col-span-1 w-full">
            <CalendarWidget />
          </div>
          <div className="col-span-1">
            <WidgetList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
