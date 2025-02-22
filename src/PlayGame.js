import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Card, Button } from 'react-bootstrap';
import { BsBackspace } from "react-icons/bs";


const gameData = {
  "25": {
    "Board 1": "8 vs 11",
    "Board 2": "9 vs 10",
    "Board 3": "1 vs 3",
    "Board 4": "6 vs 13",
    "Board 5": "4 vs 2",
    "Board 6": "7 vs 12",
    "Board 7": "5 vs 14"
  },
  "26": {
    "Board 1": "5 vs 12",
    "Board 2": "1 vs 2",
    "Board 3": "6 vs 11",
    "Board 4": "3 vs 14",
    "Board 5": "7 vs 10",
    "Board 6": "8 vs 9",
    "Board 7": "4 vs 13"
  }
};

  
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


  const handleButtonClick = (value) => {
    if (value === "Bust") {
      setInputScore("Bust");
    } else if (value === "Backspace") {
      setInputScore((prev) => prev.slice(0, -1));
    } else {
      setInputScore((prev) => prev + value);
    }
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/teams/teams-with-teammates')
      .then((response) => response.json())
      .then((data) => setTeams(data));
  }, []);




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
      hs: 0,
      h_finish: 0,
      high_scores_171_180: highScore171180
    };
  
    try {
      // Update the score and player index first
      if (currentTurn === 1) {
        setScore1(prev => Math.max(0, prev - score));
        setPlayer1Index(prevIndex => {
          const newIndex = (prevIndex + 1) % team1.teammates.length;
          setPlayer1(team1.teammates[newIndex]?.name || ''); // Update player1
          return newIndex;
        });
        setCurrentTurn(2);
  
        // After updating the player, send the API request
        const player1Id = team1.teammates[player1Index]?.id; // Use the updated index
        if (player1Id) {
          fetch(`http://localhost:5000/api/dart_score/scores/${player1Id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerData)
          });
          console.log("player1 added record");
        }
  
      } else {
        setScore2(prev => Math.max(0, prev - score));
        setPlayer2Index(prevIndex => {
          const newIndex = (prevIndex + 1) % team2.teammates.length;
          setPlayer2(team2.teammates[newIndex]?.name || ''); // Update player2
          return newIndex;
        });
        setCurrentTurn(1);
  
        // After updating the player, send the API request
        const player2Id = team2.teammates[player2Index]?.id; // Use the updated index
        if (player2Id) {
          fetch(`http://localhost:5000/api/dart_score/scores/${player2Id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerData)
          });
          console.log("player2 added record");
        }
      }
  
      setInputScore('');
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };
  
  
  

  return (
    <Container>
      <h2 className="text-center my-4">Play Game Settings</h2>
      <Row className="mb-3">
        <Col md={6}>
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
        <Col md={6}>
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
          <Col md={6}>
        <Card className="p-3">
          <h5>Team {team1.team_name}</h5>
          <Form.Select value={player1} disabled>
            {team1.teammates.map(player => (
              <option key={player.id} value={player.name}>{player.name}</option>
            ))}
          </Form.Select>
        </Card>
      </Col>
      <Col md={6}>
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
            <Col md={6}>
              <Card className={`p-3 ${currentTurn === 1 ? 'border border-danger' : ''}`}>
                <h4>Team {team1.team_name}</h4>
                <h2>{score1}</h2>
              </Card>
            </Col>
            <Col md={6}>
              <Card className={`p-3 ${currentTurn === 2 ? 'border border-danger' : ''}`}>
                <h4>Team {team2.team_name}</h4>
                <h2>{score2}</h2>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={6} className="offset-md-3">
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
            <Col md={6}>
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
