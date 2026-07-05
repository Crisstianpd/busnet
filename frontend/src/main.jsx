import { createRoot } from 'react-dom/client';
import Home from './pages/Home';
import '@ds/styles.css';
import './main.css';

createRoot(document.getElementById('root')).render(
  <div className="app-root">
    <Home />
  </div>
)
