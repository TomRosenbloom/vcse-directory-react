import { useEffect, useState } from "react";

function App() {
  const [organisations, setOrganisations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/organisations")
      .then((res) => res.json())
      .then((data) => setOrganisations(data));
  }, []);

  return (
    <div>
      <h1>Organisations</h1>
      <ul>
        {organisations.map((org) => (
          <li key={org._id}>{org.name} ({org.category})</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
