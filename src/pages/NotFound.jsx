// src/pages/NotFound.jsx
export default function NotFound() {
  return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-yellow-500 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600">
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
