import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { DocumentTextIcon, ViewColumnsIcon } from "@heroicons/react/24/outline";
import config from "../config"
function Customer() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
         `${config.apiBaseUrl}api/customers/${id}`,
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
        <div className="text-sm text-gray-500">
          <Link to="/" className="hover:bg-gray-50 p-1 rounded-md text-gray-400">
            Home
          </Link>{" "}
          /
          <Link to="/customers" className="hover:bg-gray-50 p-1 rounded-md text-gray-400">
            Customers
          </Link>
          / <span className="text-gray-900">{customer.name}</span>
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
            type="date"
            name="joining_date"
            readOnly
            value={customer.joining_date}
            className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Manager
          </label>

          <select
            name="employee_id"
            value={customer.employee_id}
            className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
          >
            <option value={customer.employee_id}>{customer.employee_id}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source Type*
          </label>
          <select
            name="source_type"
            value={customer.source_type}
            className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
            required
            readOnly
          >
            <option value={customer.source_type}>{customer.source_type}</option>
          </select>
        </div>
      </div>

      {/* Attachments */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Attachments
        </h2>
        {customer.attachments && customer.attachments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-4 border rounded-lg border-dashed bg-gray-50 border-gray-200 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="w-5 h-5" />
                  <span className="text-sm">{attachment.original_name}</span>
                </div>
                <a
                  href={attachment.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  <ViewColumnsIcon className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No attachments found</p>
        )}
      </div>

      {/* contracts */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Contracts</h2>

        <table className="w-full">
          <thead className="bg-gray-50 h-10">
            <th className="text-start text-gray-800 font-semibold p-3 border-gray-200 border-l-1">
              Contract Number
            </th>
            <th className="text-start text-gray-800 font-semibold p-3 border-gray-200 border-l-1">
              Contract
            </th>
            <th className="text-start text-gray-800 font-semibold p-3 border-gray-200 border-l-1">
              Start Date
            </th>
            <th className="text-start text-gray-800 font-semibold p-3 border-gray-200 border-l-1">
              End Date
            </th>
            <th className="text-start text-gray-800 font-semibold p-3 border-gray-200 border-l-1">
              Contract amount
            </th>
          </thead>
          <tbody>
            {customer.contracts && customer.contracts.length > 0 ? (
              <>
                {customer.contracts.map((contract) => (
                  <tr key={contract.id} className=" border-b border-gray-200">
                    <td className="p-3">{contract.contract_number}</td>
                    <td className="p-3">{"CID-" + contract.id}</td>
                    <td className="p-3">
                      {new Date(contract.start_date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {new Date(contract.expiry_date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{contract.contract_amount}</td>
                  </tr>
                ))}
              </>
            ) : (
              <p className="text-gray-500 text-center">No contracts found</p>
            )}
          </tbody>
        </table>
      </div>

      {/* contracts */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Notes</h2>

        <table className="w-full">
          <thead className="bg-gray-50 h-10">
            <th className="text-start text-gray-800 font-semibold p-3 border-gray-200 border-l-1">
              Note
            </th>
            <th className="text-start text-gray-800 font-semibold p-3 border-gray-200 border-l-1">
              Date Added
            </th>
            <th className="text-start text-gray-800 font-semibold p-3 border-gray-200 border-l-1">
              Added by
            </th>
          </thead>
          <tbody>
            {customer.notes && customer.notes.length > 0 ? (
              <>
                {customer.notes.map((note) => (
                  <tr key={note.id} className=" border-b border-gray-200">
                    <td className="p-3">{note.note}</td>
                    <td className="p-3">
                      {new Date(note.note_date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{customer.name}</td>
                  </tr>
                ))}
              </>
            ) : (
              <p className="text-gray-500 text-center">No contracts found</p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customer;
