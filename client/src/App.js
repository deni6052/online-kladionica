import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import './App.css';
import Dashboard from './views/Dashboard';
import BettingSlip from './components/BettingSlip';
import Login from './views/Login';
import Navigation from './components/Navigation';

function App() {

  return (
    <Router >
      <Navigation />

      <div>

        <p>⚽🎾</p>
        <button >Login</button>
        <br />
        <button >Logout</button>
      </div>
      <main><Routes>
        <Route exact path='/' element={<Dashboard />}> </Route>
        <Route path='/betting-slips' element={<BettingSlip />} />
        <Route path='/login' element={<Login />} />

      </Routes></main>

    </Router>

  );
}

export default App;
