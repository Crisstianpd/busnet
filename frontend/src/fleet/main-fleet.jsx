import { createRoot } from 'react-dom/client';
import '@ds/styles.css';
import './fleet.css';
import FleetDashboard from './FleetDashboard';

createRoot(document.getElementById('fleet-root')).render(<FleetDashboard />);
