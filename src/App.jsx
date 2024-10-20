import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'

function App() {

  return (
    <MantineProvider>
      <p>Hello World</p>
    </MantineProvider>
  )
}

export default App
