import React, { useEffect, useState } from "react";
import axios from "axios";

const DartScores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("http://localhost:5000/api/dart_score/scores")
        .then((response) => {
          setScores(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to fetch scores");
          setLoading(false);
        });
    }, 1000); // Fetch every 1s
  
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);
  

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-4">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Individual Dart Scores</h2>
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Total Points</th>
            <th>Shots</th>
            <th>Games Finished</th>
            <th>Highest Score</th>
            <th>Highest Finish</th>
            <th>171-180 Scores</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score) => (
            <tr key={score.id}>
              <td>{score.name}</td>
              <td>{score.total_points}</td>
              <td>{score.shots}</td>
              <td>{score.games_finished}</td>
              <td>{score.hs}</td>
              <td>{score.h_finish}</td>
              <td>{score.high_scores_171_180}</td>
              <td>{new Date(score.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DartScores;
