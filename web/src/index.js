import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/app.js';
import Signup from './components/Authentication/signup.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = document.getElementById('root');
const reactRoot = createRoot(root);

reactRoot.render(
    <App />
);