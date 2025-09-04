import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import config from "../../config";
import { format } from "date-fns";
import { ClockIcon } from "@heroicons/react/24/outline";
function Inquirie() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${config.apiBaseUrl}api/inquiries/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }

        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No customer data found
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* head */}
      <div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <Link
              to="/"
              className="hover:bg-gray-50 p-1 rounded-md text-gray-400"
            >
              Home
            </Link>{" "}
            /
            <Link
              to="/customers"
              className="hover:bg-gray-50 p-1 rounded-md text-gray-400"
            >
              Customers
            </Link>
            /
            <Link
              to="/inquiries"
              className="hover:bg-gray-50 p-1 rounded-md text-gray-400"
            >
              Inquirie
            </Link>
            / <span className="text-gray-900">{customer.name}</span>
          </div>
          <button className="border px-3 py-1 rounded-lg flex items-center gap-1">
            <ClockIcon className="w-5 h-5" />
            <span>Add Riminder</span>
          </button>
        </div>
        <h1 className="text-3xl font-semibold my-4">{customer.name}</h1>
      </div>
      {/* customer info */}
      <h1 className="font-semibold">Customer info</h1>
      <div className="md:flex gap-5">
        <div className="w-1/8">
          <label htmlFor="profile_image_lable" className=" rounded-lg">
            <img
              className="rounded-lg mt-3"
              width={150}
              height={200}
              src={customer.profile_image}
              alt="Upload"
            />
          </label>
        </div>

        {/* Right Section: 4/5 */}
        <div className="w-full mt-5 md:mt-0">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={customer.name}
                placeholder="Enter customer name"
                className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
                required
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                value={customer.mobile}
                placeholder="Enter mobile number"
                className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
                required
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={customer.email}
                placeholder="Enter email address"
                className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
                required
                readOnly
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                value={customer.nationality}
                placeholder="Enter nationality"
                readOnly
                className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Language
              </label>
              <input
                type="text"
                name="preferred_language"
                value={customer.preferred_language}
                readOnly
                placeholder="Enter preferred language"
                className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={customer.address}
                readOnly
                placeholder="Enter address"
                className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      {/* company and sources */}
      <div className="mt-10">
        <h1 className="font-semibold mt-10">Company and Source</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
        {/* Row 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <select
            name="company_name"
            value={customer.company_name}
            readOnly
            className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
          >
            <option value="">Select company</option>
            <option value={customer.company_name}>
              {customer.company_name}
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Category
          </label>
          <select
            name="business_category"
            value={customer.business_category}
            readOnly
            className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
          >
            <option value={customer.business_category}>
              {customer.business_category}
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            name="country"
            value={customer.country}
            className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
          >
            <option value={customer.country}>{customer.country}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Joining Date
          </label>
          <input
            name="joining_date"
            readOnly
            value={format(customer.joining_date, "M-d-Y")}
            className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Contract Amount
          </label>

          <select
            name="employee_id"
            value={customer.expected_contract_amount}
            className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
          >
            <option value={customer.expected_contract_amount}>
              {customer.expected_contract_amount} AED
            </option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Discount
          </label>
          <select
            name="source_type"
            value={customer.expected_discount}
            className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
            required
            readOnly
          >
            <option value={customer.expected_discount}>
              {customer.expected_discount} %
            </option>
          </select>
        </div>
      </div>

      <div className="mt-10">
        <h1 className="font-semibold">TimeLine</h1>
        <div className="flex">
          <div className="w-10 p-3 flex flex-col items-center justify-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full "></div>
            </div>
            <div className="h-20 w-1 bg-slate-200"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full "></div>
            </div>
            <div className="h-20 w-1 bg-slate-200"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full "></div>
            </div>
          </div>
          <div className="p-5 flex flex-col items-start justify-between">
            <div className="flex flex-col items-start justify-start">
              <span className="font-bold">Client Added</span>
              <small className="text-gray-400">13 March 2024 5:50 PM</small>
            </div>
            <div className="flex flex-col items-start justify-start">
              <span className="font-bold">
                Account Manger <span className="text-yellow-600">Adel ali</span>{" "}
                contected with customer
              </span>
              <small className="text-gray-400">13 March 2024 5:50 PM</small>
            </div>
            <div className="flex flex-col items-start justify-start">
              <span className="font-bold">
                Client Agreed The Terms of Contract
              </span>
              <small className="text-gray-400">13 March 2024 5:50 PM</small>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6 gap-3">
        <button className="px-3 py-1 border rounded-md border-gray-200">
          Archive
        </button>
        <button className="px-3 py-1 border rounded-md border-gray-200">
          Add Note
        </button>
        <button
          type="submit"
          className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
        >
          Add as a Customer
        </button>
      </div>
    </div>
  );
}

export default Inquirie;
