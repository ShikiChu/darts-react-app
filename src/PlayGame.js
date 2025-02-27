import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Card, Button,Modal } from 'react-bootstrap';
import { BsBackspace } from "react-icons/bs";
import './css/styles.css';
import gameData from './gameData'; 
  
const rows = [
  ["26", "1", "2", "3", "57"],
  ["29", "4", "5", "6", "60"],
  ["41", "7", "8", "9", "95"],
  ["45", "Backspace", "0", "Bust", "100"]
];

const PlayGame = () => {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [score1, setScore1] = useState(501);
  const [score2, setScore2] = useState(501);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [inputScore, setInputScore] = useState('');
  const [player1Index, setPlayer1Index] = useState(0);
  const [player2Index, setPlayer2Index] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [winnerName, setWinnerName] = useState("");


  const handleButtonClick = (value) => {
    if (value === "Bust") {
      setInputScore("Bust");
    } else if (value === "Backspace") {
      setInputScore((prev) => prev.slice(0, -1));
    }else if (value === 26) {
      handleScoreSubmit(value); 
    }
    else {
      setInputScore((prev) => prev + value);
    }
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/teams/teams-with-teammates')
      .then((response) => response.json())
      .then((data) => setTeams(data));
  }, []);
  const apiUrl = "http://localhost:5000/api/team_stats/update_team_stats";

  const updateTeamStats = async (loser, winner) => {
    try {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_plays: 1,
          wins: 0,
          team_id: loser.team_id,
        }),
      });

      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_plays: 1,
          wins: 1,
          team_id: winner.team_id,
        }),
      });

      console.log("Team stats updated successfully");
      setWinnerName(winner.team_name);
      setShowModal(true);

      // Refresh the page
    } catch (error) {
      console.error("Error updating team stats:", error);
    }
  };

  useEffect(() => {
    if (score1 === 0) {
      updateTeamStats(team2, team1);
    } else if (score2 === 0) {
      updateTeamStats(team1, team2);
    }
  }, [score1, score2, team1, team2]); //new teams are loaded dynamically

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
    setSelectedBoard('');
    setTeam1(null);
    setTeam2(null);
    setPlayer1('');
    setPlayer2('');
    setScore1(501);
    setScore2(501);
    setCurrentTurn(1);
  };

  const handleBoardChange = (event) => {
    setSelectedBoard(event.target.value);
    const match = gameData[selectedWeek][event.target.value].split(' vs ');
    const teamOne = teams.find(team => team.team_name.includes(match[0]));
    const teamTwo = teams.find(team => team.team_name.includes(match[1]));

    setTeam1(teamOne);
    setTeam2(teamTwo);
    setScore1(501);
    setScore2(501);
    setCurrentTurn(1);

    if (teamOne && teamTwo) {

      setPlayer1(teamOne.teammates[0]?.name || '');
      setPlayer2(teamTwo.teammates[0]?.name || '');

    }
  };


  const handleScoreSubmit = async () => {
    const score = parseInt(inputScore, 10);
    if (isNaN(score) || score <= 0) return;
  
    const highScore171180 = (score === 171 || score === 180) ? 1 : 0;
    const playerData = {
      total_points: score,
      shots: 1,
      games_finished: 0,
      hs: score,
      h_finish: 0,
      high_scores_171_180: highScore171180
    };
  
    const updateScore = async (playerId) => {
      if (playerId) {
        try {
          await fetch(`http://localhost:5000/api/dart_score/scores/${playerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playerData)
          });
          console.log("Score updated in dart_score API");
  
          await fetch(`http://localhost:5000/api/dart_score_night/scores/${playerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playerData)
          });
          console.log("Score updated in dart_score_night API");
        } catch (error) {
          console.error('Error submitting score:', error);
        }
      }
    };
  
    try {
      if (currentTurn === 1) {
        setScore1(prev => Math.max(0, prev - score));
        setPlayer1Index(prevIndex => {
          const newIndex = (prevIndex + 1) % team1.teammates.length;
          setPlayer1(team1.teammates[newIndex]?.name || '');
          return newIndex;
        });
        setCurrentTurn(2);
  
        const player1Id = team1.teammates[player1Index]?.id;
        await updateScore(player1Id);
  
      } else {
        setScore2(prev => Math.max(0, prev - score));
        setPlayer2Index(prevIndex => {
          const newIndex = (prevIndex + 1) % team2.teammates.length;
          setPlayer2(team2.teammates[newIndex]?.name || '');
          return newIndex;
        });
        setCurrentTurn(1);
  
        const player2Id = team2.teammates[player2Index]?.id;
        await updateScore(player2Id);
      }
  
      setInputScore('');
    } catch (error) {
      console.error('Error handling score submission:', error);
    }
  };
  

  return (
    <Container>
      <h2 className="text-center my-4">Play Game Settings</h2>
      <Row className="mb-3">
        <Col sm={6}>
          <Form.Group>
            <Form.Label>Select Week</Form.Label>
            <Form.Select value={selectedWeek} onChange={handleWeekChange}>
              <option value="">Select...</option>
              {Object.keys(gameData).map((week) => (
                <option key={week} value={week}>{week}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group>
            <Form.Label>Select Board</Form.Label>
            <Form.Select 
              value={selectedBoard} 
              onChange={handleBoardChange} 
              disabled={!selectedWeek}
            >
              <option value="">Select...</option>
              {selectedWeek && Object.keys(gameData[selectedWeek]).map((board) => (
                <option key={board} value={board}>{board}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {team1 && team2 && (
        <>
          <Row className="mt-3">
            <Col sm={6}>
              <Card className="p-3">
                <h5>Team {team1.team_name}</h5>       
                <Form.Select value={player1} disabled>
                  {team1.teammates.map(player => (
                    <option key={player.id} value={player.name}>{player.name}</option>
                  ))}
                </Form.Select>
              </Card>
            </Col>
            <Col sm={6}>
              <Card className="p-3">
                <h5>Team {team2.team_name}</h5>
                <Form.Select value={player2} disabled>
                  {team2.teammates.map(player => (
                    <option key={player.id} value={player.name}>{player.name}</option>
                  ))}
                </Form.Select>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col sm={6}>
              <Card className={`p-3 ${currentTurn === 1 ? 'border border-danger' : ''}`}>
                <h4>Team {team1.team_name}</h4>
                <h2>{score1}</h2>
              </Card>
            </Col>
            <Col sm={6}>
              <Card className={`p-3 ${currentTurn === 2 ? 'border border-danger' : ''}`}>
                <h4>Team {team2.team_name}</h4>
                <h2>{score2}</h2>
              </Card>
            </Col>
          </Row>

          <Modal show={showModal} onHide={() => window.location.reload()} centered>
            <Modal.Header closeButton>
              <Modal.Title>🎉 Game Over! 🎉</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h2 className="text-center">🏆 Team {winnerName} wins! 🍻</h2>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => window.location.reload()}>
              Start A New Game
              </Button>
            </Modal.Footer>
          </Modal>

          <Row className="mt-4">
            <Col sm={12} >
              <Form.Group>
                <Form.Label>Enter Your Score</Form.Label>
                <Form.Control 
                  type="number" 
                  value={inputScore} 
                  onChange={(e) => setInputScore(e.target.value)} 
                />
              </Form.Group>
              <div className="d-flex justify-content-between mt-2">
                <Button onClick={handleScoreSubmit}>Submit Score</Button>
                <Button onClick={() => setInputScore('')}>Clear</Button>
              </div>
            </Col>
          </Row>
          <Row className="mt-3 justify-content-center">
            <Col sm={12}>
              <div className="d-grid gap-2">
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="d-flex justify-content-between">
                    {row.map((key, keyIndex) => (
                      <Button 
                        key={keyIndex} 
                        variant={key === "Backspace" ? "danger" : "info"} 
                        onClick={() => handleButtonClick(key)}
                        className="flex-grow-1 mx-1"
                      >
                        {key === "Backspace" ? <BsBackspace /> : key}
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default PlayGame;
