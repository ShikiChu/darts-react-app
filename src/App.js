import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import Register from './Register';
import TeamManagement from './TeamManagement';
import PlayGame from './PlayGame';
import DartScores from './DartScores';


const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Wednesday Darts League
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/team-management">
                Manage Teams
              </Nav.Link>
              <Nav.Link as={Link} to="/play-game">Play Game</Nav.Link>
              <Nav.Link as={Link} to="/dart-score">Check Stats</Nav.Link>

              {!token ? (
                <>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                  {/* <Nav.Link as={Link} to="/privateregister">
                    Register
                  </Nav.Link> */}
                </>
              ) : (
                <Button variant="outline-light w-20" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/team-management" element={token ? <TeamManagement /> : <Navigate to="/login" replace />} />
          <Route path="/play-game" element={token ? <PlayGame />  : <Navigate to="/login" replace />  } />
          <Route path="/dart-score" element={token ? <DartScores />  : <Navigate to="/login" replace />  } />
          <Route path="*" element={<Navigate to={token ? '/play-game' : '/login'} />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
