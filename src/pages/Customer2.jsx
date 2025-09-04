import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import config from "../config";
function Customer() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${config.apiBaseUrl}api/customers/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch customer data');
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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={customer.profile_image} 
                alt={customer.name} 
                className="w-20 h-20 rounded-full border-4 border-white object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold">{customer.name}</h1>
                <p className="text-blue-100">{customer.company_name}</p>
              </div>
            </div>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {customer.status}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left Column - Personal Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="font-medium">{customer.mobile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nationality</p>
                  <p className="font-medium">{customer.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preferred Language</p>
                  <p className="font-medium">{customer.preferred_language}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{customer.address}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Business Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Company Name</p>
                  <p className="font-medium">{customer.company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Business Category</p>
                  <p className="font-medium">{customer.business_category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium">{customer.country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joining Date</p>
                  <p className="font-medium">{customer.joining_date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Source Type</p>
                  <p className="font-medium">{customer.source_type}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Contracts */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contracts</h2>
              {customer.contracts && customer.contracts.length > 0 ? (
                <div className="space-y-4">
                  {customer.contracts.map(contract => (
                    <div key={contract.id} className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-blue-700">{contract.contract_number}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${contract.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {contract.status}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Start Date</p>
                          <p>{new Date(contract.start_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Expiry Date</p>
                          <p>{new Date(contract.expiry_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Office Type</p>
                          <p>{contract.office_type}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">City</p>
                          <p>{contract.city}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-gray-500">Contract Amount</p>
                        <p className="font-bold text-lg">${contract.contract_amount}</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-500">Notes</p>
                        <p className="text-sm italic">{contract.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No contracts found</p>
              )}
            </div>
          </div>

          {/* Right Column - Attachments & Notes */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Attachments</h2>
              {customer.attachments && customer.attachments.length > 0 ? (
                <div className="space-y-3">
                  {customer.attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-100">
                      <div className="flex items-center space-x-2">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{attachment.original_name}</span>
                      </div>
                      <a 
                        href={attachment.file_path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No attachments found</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Notes</h2>
              {customer.notes && customer.notes.length > 0 ? (
                <div className="space-y-4">
                  {customer.notes.map(note => (
                    <div key={note.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                      <p className="text-gray-700">{note.note}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {note.note_date} at {note.note_time}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No notes found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customer;