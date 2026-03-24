import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//import 'papercss/dist/paper.min.css'
import 'water.css/out/water.min.css'
import './index.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
