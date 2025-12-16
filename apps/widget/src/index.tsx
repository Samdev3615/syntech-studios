import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Widget from './Widget';

// Export fonction d'initialisation pour intégration widget
export function initSynTechWidget(containerId: string = 'syntech-widget') {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`SynTech Widget: Container #${containerId} not found`);
    return;
  }

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <Widget />
    </React.StrictMode>
  );

  console.log('✅ SynTech Widget initialized');
}

// Auto-init si mode dev
if (import.meta.env.DEV) {
  const devContainer = document.getElementById('root');
  if (devContainer) {
    const root = ReactDOM.createRoot(devContainer);
    root.render(
      <React.StrictMode>
        <Widget />
      </React.StrictMode>
    );
  }
}

// Export global pour usage script
if (typeof window !== 'undefined') {
  (window as any).SynTechWidget = { init: initSynTechWidget };
}
