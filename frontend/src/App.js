import './App.css';
import Card from './components/Card';
import MetaMaskConnector from './components/MetaMaskConnector';
import Navbar from './components/NavBar';

function App() {
  return (
    <div className="App bg-bg min-h-screen">
   <Navbar/>
      <Card />
    </div>
  );
}

export default App;
