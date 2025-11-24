import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [agencies, setAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [newAgencyName, setNewAgencyName] = useState('');
  const [agencyProgress, setAgencyProgress] = useState({});

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Fetch all agencies
  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const res = await fetch(`${API_URL}/api/agencies`);
      const data = await res.json();
      setAgencies(data);
    } catch (err) {
      console.error('Error fetching agencies:', err);
    }
  };

  // Fetch checklist items
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const res = await fetch(`${API_URL}/api/checklist`);
        const data = await res.json();
        setChecklist(data);
      } catch (err) {
        console.error('Error fetching checklist:', err);
      }
    };
    fetchChecklist();
  }, []);

  // Fetch agency progress when selected
  useEffect(() => {
    if (selectedAgency) {
      fetchAgencyProgress(selectedAgency);
    }
  }, [selectedAgency]);

  const fetchAgencyProgress = async (agencyId) => {
    try {
      const res = await fetch(`${API_URL}/api/agencies/${agencyId}`);
      const data = await res.json();
      const progressMap = {};
      data.progress.forEach(p => {
        progressMap[p.id] = p.completed || false;
      });
      setAgencyProgress(progressMap);
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  const createAgency = async (e) => {
    e.preventDefault();
    if (!newAgencyName.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/agencies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newAgencyName })
      });
      const newAgency = await res.json();
      setAgencies([...agencies, newAgency]);
      setNewAgencyName('');
    } catch (err) {
      console.error('Error creating agency:', err);
    }
  };

  const toggleCheckboxItem = async (itemId) => {
    const completed = !agencyProgress[itemId];
    try {
      await fetch(`${API_URL}/api/agencies/${selectedAgency}/progress/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
      setAgencyProgress({ ...agencyProgress, [itemId]: completed });
      fetchAgencies(); // Refresh progress counts
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const currentAgency = agencies.find(a => a.id === selectedAgency);
  const completedCount = Object.values(agencyProgress).filter(v => v).length;

  return (
    <div className="app">
      <header className="header">
        <h1>Copilot Readiness Checklist</h1>
        <p>Help your agency prepare for Copilot adoption</p>
      </header>

      <div className="container">
        <div className="sidebar">
          <div className="form-section">
            <h2>Add Agency</h2>
            <form onSubmit={createAgency}>
              <input
                type="text"
                placeholder="Agency name"
                value={newAgencyName}
                onChange={(e) => setNewAgencyName(e.target.value)}
              />
              <button type="submit">Add</button>
            </form>
          </div>

          <div className="agencies-section">
            <h2>Agencies</h2>
            <ul className="agencies-list">
              {agencies.map(agency => (
                <li key={agency.id}>
                  <button
                    className={`agency-btn ${selectedAgency === agency.id ? 'active' : ''}`}
                    onClick={() => setSelectedAgency(agency.id)}
                  >
                    <span className="name">{agency.name}</span>
                    <span className="progress">
                      {agency.completed_items}/{agency.total_items}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="main">
          {selectedAgency && currentAgency ? (
            <div className="checklist-section">
              <h2>{currentAgency.name}</h2>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(completedCount / checklist.length) * 100}%` }}></div>
              </div>
              <p className="progress-text">{completedCount} of {checklist.length} items completed</p>

              <div className="checklist">
                {checklist.map(item => (
                  <div key={item.id} className="checklist-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={agencyProgress[item.id] || false}
                        onChange={() => toggleCheckboxItem(item.id)}
                      />
                      <span className="item-text">
                        <strong>{item.item}</strong>
                        <p>{item.description}</p>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>Select or create an agency to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
