import { useEffect, useState } from "react";

function App() {
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newOrg, setNewOrg] = useState({
    name: "",
    category: "",
    contacts: [{ name: "", role: "", email: "" }]
  });

  useEffect(() => {
    fetchOrganisations();
  }, []);

  const fetchOrganisations = async () => {
    try {
      const response = await fetch("http://localhost:5000/organisations");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setOrganisations(data);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/organisations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrg),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const savedOrg = await response.json();
      setOrganisations([...organisations, savedOrg]);
      
      // Reset form
      setNewOrg({
        name: "",
        category: "",
        contacts: [{ name: "", role: "", email: "" }]
      });
    } catch (error) {
      console.error("Error saving organisation:", error);
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setNewOrg({
      ...newOrg,
      [e.target.name]: e.target.value
    });
  };

  const handleContactChange = (index, field, value) => {
    const newContacts = [...newOrg.contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setNewOrg({ ...newOrg, contacts: newContacts });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Organisations</h1>
      
      {/* Add Organisation Form */}
      <form onSubmit={handleSubmit}>
        <h2>Add New Organisation</h2>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={newOrg.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={newOrg.category}
              onChange={handleChange}
            />
          </label>
        </div>
        
        {/* Contact Fields */}
        <h3>Primary Contact</h3>
        <div>
          <label>
            Contact Name:
            <input
              type="text"
              value={newOrg.contacts[0].name}
              onChange={(e) => handleContactChange(0, "name", e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Contact Role:
            <input
              type="text"
              value={newOrg.contacts[0].role}
              onChange={(e) => handleContactChange(0, "role", e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Contact Email:
            <input
              type="email"
              value={newOrg.contacts[0].email}
              onChange={(e) => handleContactChange(0, "email", e.target.value)}
            />
          </label>
        </div>
        
        <button type="submit">Add Organisation</button>
      </form>

      {/* Organisations List */}
      <h2>Existing Organisations</h2>
      <ul>
        {organisations.map((org) => (
          <li key={org._id}>
            {org.name} ({org.category})
            {org.contacts && org.contacts.length > 0 && (
              <div>
                Contact: {org.contacts[0].name} - {org.contacts[0].email}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
