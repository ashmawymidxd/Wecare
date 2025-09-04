// src/components/Dashboard/DashboardHeader.jsx
import { Link } from "react-router-dom";
import { DateRange } from "react-date-range";
import { CalendarDateRangeIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import format from "date-fns/format";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DashboardHeader = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
    <div className="flex justify-between items-center">
      {/* Left Section */}
      <div>
        <nav className="mb-3">
          <Link to="/" className="hover:bg-gray-100 p-1 rounded-md">
            Home
          </Link>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <small className="text-gray-500">Take a look on your statistics</small>
      </div>

      {/* Right Date Section */}
      <div className="py-1 px-3 bg-gray-50 rounded-lg w-64 flex items-center">
        <CalendarDateRangeIcon className="h-4 w-8 text-gray-500 mr-2" />
        <div
          className="flex items-center border px-3 py-1 cursor-pointer bg-gray-50 w-full"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <span className="text-sm text-gray-600">
            {format(range[0].startDate, "dd MMMM")} →{" "}
            {format(range[0].endDate, "dd MMMM")}
          </span>
          <svg
            className="w-4 h-4 ml-2 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {showCalendar && (
          <div className="absolute right-0 z-10 mt-[400px] shadow-lg">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={range}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
