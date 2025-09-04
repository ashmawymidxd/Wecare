// src/components/InquiriesForm.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import config from "../../config";

const InquiriesForm = () => {
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
    expected_contract_amount: 100,
    expected_discount: 10,
    profile_image: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ... existing state and functions ...

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
      const response = await fetch(`${config.apiBaseUrl}api/inquiries`, {
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
        alert("Inquiries created successfully!");
        navigate("/inquiries");
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
              Expected contract amount
            </label>
            <input
              type="text"
              name="expected_contract_amount"
              value={formData.expected_contract_amount}
              onChange={handleChange}
              placeholder="Enter expected contract amount"
              className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
            />
            {errors.expected_contract_amount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.expected_contract_amount}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Discount
            </label>
            <input
              type="text"
              name="expected_discount"
              value={formData.expected_discount}
              onChange={handleChange}
              placeholder="Enter expected contract amount"
              className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 text-gray-500 focus:outline-none"
            />
            {errors.expected_discount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.expected_discount}
              </p>
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

export default InquiriesForm;
