import React, { useEffect, useState } from "react";

const TeamStats = () => {
    const [teamStats, setTeamStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetch("http://localhost:5000/api/team_stats/all_team_stats")
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response failed");
                    }
                    return response.json();
                })
                .then((data) => {
                    const sortedData = data.sort((a, b) => b.wins - a.wins);
                    setTeamStats(sortedData);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        }, 1000); 
    

        return () => clearInterval(intervalId);
    }, []); 
    

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Team Stats</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">Error: {error}</p>}
            {!loading && !error && (
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Position</th>
                            <th>Name</th>
                            <th>Team</th>
                            <th>Game Plays</th>
                            <th>Wins</th>
                            <th>Loss</th>
                            <th>Game Behind</th>
                            <th>Win %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamStats.map((team, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{team.nickname}</td>
                                <td>{team.name}</td>
                                <td>{team.game_plays}</td>
                                <td>{team.wins}</td>
                                <td>{team.game_plays - team.wins}</td>
                                <td>{index === 0 ? "-" : teamStats[0].wins - team.wins}</td>
                                <td>{team.game_plays > 0 ? ((team.wins / team.game_plays) * 100).toFixed(2) + "%" : "0.00%"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TeamStats;
