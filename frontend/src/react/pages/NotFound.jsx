import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <div className="space-y-8">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-gray-400 mt-4">
          This page does not exist. Please check the URL or return to the home page.
        </p>

        <Link to="/" className="mt-6 text-blue-400 underline">
          Return to Home Page
        </Link>
      </div>
    </>
  );
}

export default NotFound