import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      
      // Reset form and close modal
      setNewOrg({
        name: "",
        category: "",
        contacts: [{ name: "", role: "", email: "" }]
      });
      setIsModalOpen(false);
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Organisations</h1>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          Add New Organisation
        </button>
      </div>

      {/* Organisations List */}
      <div className="organisations-list">
        {organisations.map((org) => (
          <div key={org._id} className="org-item">
            <h2 className="org-title">{org.name}</h2>
            
            <div className="org-section">
              <h3 className="section-title">Categories</h3>
              <div className="section-content">
                {org.category || 'No categories assigned'}
              </div>
            </div>

            <div className="org-section">
              <h3 className="section-title">Contacts</h3>
              {org.contacts && org.contacts.length > 0 ? (
                <div className="contact-details">
                  <div className="contact-field">
                    <span className="field-label">Name:</span>
                    <span className="field-value">{org.contacts[0].name || 'N/A'}</span>
                  </div>
                  <div className="contact-field">
                    <span className="field-label">Role:</span>
                    <span className="field-value">{org.contacts[0].role || 'N/A'}</span>
                  </div>
                  <div className="contact-field">
                    <span className="field-label">Email:</span>
                    <span className="field-value">{org.contacts[0].email || 'N/A'}</span>
                  </div>
                </div>
              ) : (
                <div className="section-content">No contacts added</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Organisation</h2>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
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
              <div className="form-group">
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
              
              <h3>Primary Contact</h3>
              <div className="form-group">
                <label>
                  Contact Name:
                  <input
                    type="text"
                    value={newOrg.contacts[0].name}
                    onChange={(e) => handleContactChange(0, "name", e.target.value)}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Contact Role:
                  <input
                    type="text"
                    value={newOrg.contacts[0].role}
                    onChange={(e) => handleContactChange(0, "role", e.target.value)}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Contact Email:
                  <input
                    type="email"
                    value={newOrg.contacts[0].email}
                    onChange={(e) => handleContactChange(0, "email", e.target.value)}
                  />
                </label>
              </div>
              
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Add Organisation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
