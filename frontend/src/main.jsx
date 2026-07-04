import { createRoot } from 'react-dom/client';
import Home from './pages/Home';
import './main.css';

createRoot(document.getElementById('root')).render(
  <div style={{ width: '100vw', height: '100vh' }}>
    <Home />
  </div>
)
