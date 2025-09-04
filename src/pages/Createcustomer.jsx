import CustomerForm from "../components/Customers/CustomerForm";
import { Link } from "react-router-dom";
function Createcustomer() {
  return (
    <div>
      <div className="container mx-auto px-4 py-6">
        <div className="text-sm text-gray-500">
          <Link to="/" className="hover:bg-gray-100 p-1 rounded-md text-gray-400">
            Home
          </Link> /
          <Link to="/customers" className="hover:bg-gray-100 p-1 rounded-md text-gray-400">
            Customers
          </Link>
          / <span className="text-gray-900">Add Customers</span>
        </div>
        <h1 className="text-3xl font-semibold my-4">Add Customer</h1>
        <CustomerForm />
      </div>
    </div>
  );
}

export default Createcustomer;
