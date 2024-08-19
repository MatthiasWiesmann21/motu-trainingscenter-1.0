"use client";

const Tabs = ({ currentTab, setCurrentTab }: any) => (
  <div>
    <div className="sm:hidden">
      <label htmlFor="tabs" className="sr-only">
        Select a tab
      </label>
      <select
        id="tabs"
        name="tabs"
        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option selected>Team Members</option>
        <option>Billing</option>
      </select>
    </div>
    <div className="hidden sm:block">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setCurrentTab(1)}
            className={`${
              currentTab == 1
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } w-1/2 border-b-2 px-1 py-4 text-center text-sm font-medium`}
          >
            Private
          </button>
          <button
            onClick={() => setCurrentTab(2)}
            className={`${
              currentTab == 2
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } w-1/2 border-b-2 px-1 py-4 text-center text-sm font-medium`}
          >
            Public
          </button>
        </nav>
      </div>
    </div>
  </div>
);

export default Tabs;
