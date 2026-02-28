import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <div className="space-y-8">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-gray-400 mt-4">
          Deze pagina bestaat niet.
        </p>

        <Link to="/" className="mt-6 text-blue-400 underline">
          Terug naar homepagina
        </Link>
      </div>
    </>
  );
}

export default NotFound