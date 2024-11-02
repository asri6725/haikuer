import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SnackbarProvider } from 'notistack';

// module.exports = {
//   plugins: {
//     'postcss-preset-mantine': {},
//     'postcss-simple-vars': {
//       variables: {
//         'mantine-breakpoint-xs': '36em',
//         'mantine-breakpoint-sm': '48em',
//         'mantine-breakpoint-md': '62em',
//         'mantine-breakpoint-lg': '75em',
//         'mantine-breakpoint-xl': '88em',
//       },
//     },
//   },
// };

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </StrictMode>,
)
