// src/components/CustomerForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DocumentTextIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import config from "../../config";

const CustomerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    nationality: "",
    preferred_language: "",
    address: "",
    company_name: "",
    business_category: "",
    country: "",
    joining_date: "",
    source_type: "Tasheel",
    employee_id: "",
    profile_image: null,
    client_id_document: null,
    company_license_document: null,
    other_documents: null,
    note: "",
    note_date: new Date().toISOString().split("T")[0], // Default to today's date
    note_time: new Date().toTimeString().slice(0, 5), // Default to current time (HH:MM)
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountManagers, setAccountManagers] = useState([]);
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  // ... existing state and functions ...

  // State for note modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  useEffect(() => {
    const fetchAccountManagers = async () => {
      setIsLoadingManagers(true);
      const authToken = localStorage.getItem("authToken");

      try {
        const response = await fetch(
          `${config.apiBaseUrl}api/employees_account_mangers`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch account managers");
        }

        const data = await response.json();
        setAccountManagers(data);
      } catch (error) {
        console.error("Error fetching account managers:", error);
        setErrors((prev) => ({
          ...prev,
          accountManagers: "Failed to load account managers",
        }));
      } finally {
        setIsLoadingManagers(false);
      }
    };

    fetchAccountManagers();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setErrors({ auth: "No authentication token found" });
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}api/customers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(result.errors || {});
        } else {
          throw new Error(result.message || "Failed to create customer");
        }
      } else {
        alert("Customer created successfully!");
        navigate("/customers");
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-10">
      {errors.auth && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errors.auth}
        </div>
      )}

      {errors.submit && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/*Customer info */}
        <h1 className="font-semibold">Customer info</h1>
        <div className="md:flex gap-5">
          <div className="w-1/8">
            <label
              htmlFor="profile_image_lable"
              className="bg-gray-50 rounded-lg p-6  flex flex-col items-center justify-center cursor-pointer"
            >
              <img width={80} src="/icons/add-photo.png" alt="Upload" />
              <small className="text-center text-gray-600 mt-2">
                Add Photo
              </small>
            </label>
          </div>

          {/* Right Section: 4/5 */}
          <div className="w-full mt-5 md:mt-0">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile*
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
                  required
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
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
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder="Enter nationality"
                  className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
                />
                {errors.nationality && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nationality}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Language
                </label>
                <input
                  type="text"
                  name="preferred_language"
                  value={formData.preferred_language}
                  onChange={handleChange}
                  placeholder="Enter preferred language"
                  className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
                />
                {errors.preferred_language && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.preferred_language}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <h1 className="font-semibold mt-10">Company and Source</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
          {/* Row 3 */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <select
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
            >
              <option value="">Select company</option>
              <option value="ABC Corporation">ABC Corporation</option>
              <option value="XYZ Enterprises">XYZ Enterprises</option>
              <option value="Acme Inc">Acme Inc</option>
              <option value="Globex Corp">Globex Corp</option>
              <option value="Initech">Initech</option>
              <option value="Other">Other (please specify)</option>
            </select>
            {errors.company_name && (
              <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Category
            </label>
            <select
              name="business_category"
              value={formData.business_category}
              onChange={handleChange}
              className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
            >
              <option value="">Select category</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Other">Other</option>
            </select>
            {errors.business_category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.business_category}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
            >
              <option value="">Select country</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Qatar">Qatar</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Oman">Oman</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Other">Other</option>
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Joining Date
            </label>
            <input
              type="date"
              name="joining_date"
              value={formData.joining_date}
              onChange={handleChange}
              className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
            />
            {errors.joining_date && (
              <p className="mt-1 text-sm text-red-600">{errors.joining_date}</p>
            )}
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Manager
            </label>
            {isLoadingManagers ? (
              <div className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500">
                Loading account managers...
              </div>
            ) : (
              <>
                <select
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
                >
                  <option value="">Select Account Manager</option>
                  {accountManagers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
                {errors.employee_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.employee_id}
                  </p>
                )}
                {errors.accountManagers && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.accountManagers}
                  </p>
                )}
              </>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Type*
            </label>
            <select
              name="source_type"
              value={formData.source_type}
              onChange={handleChange}
              className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
              required
            >
              <option value="Tasheel">Tasheel</option>
              <option value="Typing Center">Typing Center</option>
              <option value="PRO">PRO</option>
              <option value="Social Media">Social Media</option>
              <option value="Referral">Referral</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.source_type && (
              <p className="mt-1 text-sm text-red-600">{errors.source_type}</p>
            )}
          </div>
        </div>

        {/* Row 5 - File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="hidden">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image*
            </label>
            <input
              type="file"
              id="profile_image_lable"
              name="profile_image"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              accept="image/*"
              required
            />
            {errors.profile_image && (
              <p className="mt-1 text-sm text-red-600">
                {errors.profile_image}
              </p>
            )}
          </div>
        </div>

        {/* Row 6 - Other Documents */}
        <h1 className="font-semibold mt-10">Attachments</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label
            htmlFor="client_id_document"
            className="bg-gray-50 p-3 flex items-center justify-center rounded-md border border-dashed border-gray-200 cursor-pointer"
          >
            <DocumentTextIcon className="w-5 h-5" /> Client ID*
          </label>
          <div className="hidden">
            <input
              type="file"
              name="client_id_document"
              id="client_id_document"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              accept=".pdf,.doc,.docx"
            />
            {errors.client_id_document && (
              <p className="mt-1 text-sm text-red-600">
                {errors.client_id_document}
              </p>
            )}
          </div>

          <label
            htmlFor="company_license_document"
            className="bg-gray-50 p-3 flex items-center justify-center rounded-md border border-dashed border-gray-200 cursor-pointer"
          >
            <DocumentTextIcon className="w-5 h-5" />
            Company License*
          </label>
          <div className="hidden">
            <input
              type="file"
              name="company_license_document"
              id="company_license_document"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              accept=".pdf,.doc,.docx"
            />
            {errors.company_license_document && (
              <p className="mt-1 text-sm text-red-600">
                {errors.company_license_document}
              </p>
            )}
          </div>
          <label
            htmlFor="other_documents"
            className="bg-gray-50 p-3 flex items-center justify-center rounded-md border border-dashed border-gray-200 cursor-pointer"
          >
            <DocumentTextIcon className="w-5 h-5" />
            Other Documents*
          </label>

          <div className="hidden">
            <input
              type="file"
              name="other_documents"
              id="other_documents"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            {errors.other_documents && (
              <p className="mt-1 text-sm text-red-600">
                {errors.other_documents}
              </p>
            )}
          </div>
        </div>

        <h1 className="font-semibold mt-10">Notes</h1>
        <button
          type="button"
          onClick={() => setIsNoteModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Note
        </button>
        <div className="container mx-auto p-4">
          {isNoteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add New Note</h2>
                  <button
                    onClick={() => setIsNoteModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="note_date"
                        value={formData.note_date}
                        onChange={handleChange}
                        className="w-full border border-gray-100 rounded-md p-1 bg-gray-50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        name="note_time"
                        value={formData.note_time}
                        onChange={handleChange}
                        className="w-full border border-gray-100 rounded-md p-1 bg-gray-50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Note
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="note"
                      rows={4}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNoteModalOpen(false)}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNoteModalOpen(false)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <Link
            to={"/customers"}
            className="px-3 py-1 border rounded-md border-gray-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
