import InquiriesForm from "../components/Customers/InquiriesForm";
import { Link } from "react-router-dom";
function CreateInquiries() {
  return (
    <div>
      <div className="container mx-auto px-4 py-6">
        <div className="text-sm text-gray-500">
          <Link
            to="/"
            className="hover:bg-gray-50 p-1 rounded-md text-gray-400"
          >
            Home
          </Link>
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
            inquiries
          </Link>
          / <span className="text-gray-900">Add Inquiries</span>
        </div>
        <h1 className="text-3xl font-semibold my-4">Add Inquiries</h1>
        <InquiriesForm />
      </div>
    </div>
  );
}

export default CreateInquiries;
