import React, { useEffect, useState } from "react";

const DartScoresNight = () => {
  const [scores, setScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    const fetchScores = () => {
      fetch("http://localhost:5000/api/dart_score_night/scores")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch scores");
          }
          return response.json();
        })
        .then((data) => {
          const processedData = data.map(score => ({
            ...score,
            average_score: score.shots ? score.total_points / score.shots : 0,
            formatted_date: new Date(score.created_at).toISOString().split('T')[0]
          })).sort((a, b) => b.average_score - a.average_score);
  
          setScores(processedData);
          setFilteredScores(selectedDate ? processedData.filter(score => score.formatted_date === selectedDate) : processedData);
  
          const uniqueDates = [...new Set(processedData.map(score => score.formatted_date))];
          setAvailableDates(uniqueDates);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };
    
    fetchScores();
    const interval = setInterval(fetchScores, 1000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const handleDateChange = (event) => {
    const selected = event.target.value;
    setSelectedDate(selected);
    setFilteredScores(scores.filter(score => score.formatted_date === selected));
  };

  if (loading) return <p className="text-center mt-3">Loading...</p>;
  if (error) return <p className="text-center text-danger mt-3">Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Dart Scores Night</h2>
      <div className="mb-3 text-center">
        <label className="me-2">Select Date:</label>
        <select className="form-select d-inline w-auto" value={selectedDate} onChange={handleDateChange}>
          <option value="">All Dates</option>
          {availableDates.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Position</th>
            <th>Name</th>
            <th>Total Points</th>
            <th>Shots</th>
            <th>Average Score</th>
            <th>Games Finished</th>
            <th>Highest Score</th>
            <th>Highest Finish</th>
            <th>High Scores (171-180)</th>
          </tr>
        </thead>
        <tbody>
          {filteredScores.map((score, index) => (
            <tr key={score.id}>
              <td>{index + 1}</td>
              <td>{score.name}</td>
              <td>{score.total_points}</td>
              <td>{score.shots}</td>
              <td>{score.average_score.toFixed(2)}</td>
              <td>{score.games_finished}</td>
              <td>{score.hs}</td>
              <td>{score.h_finish}</td>
              <td>{score.high_scores_171_180}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DartScoresNight;
