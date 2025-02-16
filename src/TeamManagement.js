import { useState, useEffect } from "react";

export default function TeamManagement() {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teammateName, setTeammateName] = useState("");
  const [allTeams, setAllTeams] = useState([]);
  const [selectedTeammate, setSelectedTeammate] = useState("");
  const [teammates, setTeammates] = useState([]);
  const [newTeam, setNewTeam] = useState("");

  useEffect(() => {
    fetchTeams();
    fetchAllTeams();
    fetchTeammates();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/teams/teams-with-teammates");
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      } else {
        console.error("Failed to fetch teams");
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchAllTeams = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/teams");
      if (response.ok) {
        const data = await response.json();
        setAllTeams(data.teams);
      } else {
        console.error("Failed to fetch all teams");
      }
    } catch (error) {
      console.error("Error fetching all teams:", error);
    }
  };

  const fetchTeammates = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/teams/teammates");
      if (response.ok) {
        const data = await response.json();
        setTeammates(data);
      } else {
        console.error("Failed to fetch teammates");
      }
    } catch (error) {
      console.error("Error fetching teammates:", error);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/teams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName }),
      });
      if (response.ok) {
        setTeamName("");
        fetchTeams();
        alert("Team created successfully!");
      } else {
        alert("Failed to create team");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeammate = async () => {
    if (!selectedTeam || !teammateName.trim()) return;
    try {
      const response = await fetch(`http://localhost:5000/api/teams/${selectedTeam}/teammates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teammateName }),
      });
      if (response.ok) {
        setTeammateName("");
        fetchTeams();
        alert("Teammate added successfully!");
      } else {
        alert("Failed to add teammate");
      }
    } catch (error) {
      console.error("Error adding teammate:", error);
      alert("An error occurred");
    }
  };



  const handleChangeTeammateTeam = async () => {
    if (!selectedTeammate || !newTeam) return;
    try {
      const response = await fetch(`http://localhost:5000/api/teams/teammates/${selectedTeammate}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: newTeam }), // Ensure the key matches what the backend expects
      });
  
      if (response.ok) {
        fetchTeams();
        fetchTeammates();
        alert("Teammate team updated successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to update teammate team:", errorData);
        alert("Failed to update teammate team");
      }
    } catch (error) {
      console.error("Error updating teammate team:", error);
      alert("An error occurred");
    }
  };
  

  return (
    <div className="container d-flex flex-wrap align-items-start justify-content-center min-vh-100">
      <div className="mt-4 w-100">
        <h3>Teams and Teammates</h3>
        {teams.length > 0 ? (
          <ul className="list-group">
            {teams.map((team) => (
              <li key={team.team_id} className="list-group-item">
                <strong>Team {team.team_name}</strong>
                <ul>
                  {team.teammates.map((mate, index) => (
                    <li key={index}>{mate?.name ?? "Unknown"}</li> 
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No teams available</p>
        )}
      </div>
      <div className="card w-50 p-4 m-2">
        <div className="card-body">
          <h4>Create a Team</h4>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            disabled={loading}
          />
          <button className="btn btn-primary w-100" onClick={handleCreateTeam} disabled={loading}>
            {loading ? "Creating..." : "Create Team"}
          </button>
        </div>
      </div>
      <div className="card w-50 p-4 m-2">
        <div className="card-body">
          <h4>New Teammate into a team</h4>
          <select
            className="form-select mb-3"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">Select a team</option>
            {allTeams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <input
            type="text"
            className="form-control mb-3"
            placeholder =  "Name"
            value={teammateName}
            onChange={(e) => setTeammateName(e.target.value)}
          />
          <button className="btn btn-success w-100" onClick={handleAddTeammate}>
            Add New Teammate
          </button>
        </div>
      </div>
      <div className="card w-50 p-4 m-2">
        <div className="card-body">
          <h4>Change Teammate's Team</h4>
          <h5>From</h5>
          <select
            className="form-select mb-3"
            value={selectedTeammate}
            onChange={(e) => setSelectedTeammate(e.target.value)}
          >
            <option value="">Select a teammate</option>
            {teammates.map((teammate) => (
              <option key={teammate.id} value={teammate.id}>{teammate.name}</option>
            ))}
          </select>
          <h5>To</h5>
          <select
            className="form-select mb-3"
            value={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
          >
            <option value="">Select a team</option>
            {allTeams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <button className="btn btn-warning w-100" onClick={handleChangeTeammateTeam}>
            Change Team
          </button>
        </div>
      </div>
      
    </div>
  );
}
