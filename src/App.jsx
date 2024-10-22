import { useState, useRef, useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import '@mantine/core/styles.css'
import { MantineProvider, TextInput, Button, Container, Space } from '@mantine/core'

function checkHaiku(text, count){
  let current_count = 0
  const vowels = ['a', 'e', 'i', 'o', 'u']
  for (let idx in text) {
    if (vowels.includes(text[idx])){
      if(vowels.includes(text[idx-1])){
        continue
      }
      current_count += 1
    }
  }

  if(current_count === count){
    return true
  }

  return false
}


function App() {
  const [text, setText] = useState('')
  const [currentLine, setCurrentLine] = useState(1)
  const [haiku, setHaiku] = useState([])
  const canvasRef = useRef(null)

  const [disableChecks, setDisableChecks] = useState(false)

  // Function to draw the haiku on the canvas
  const drawHaiku = () => {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      // Clear the canvas before drawing
      context.clearRect(0, 0, canvas.width, canvas.height)
      
      context.font = '20px Arial'
      context.fillStyle = 'black'
      
      // Draw each line of the haiku
      haiku.forEach((line, index) => {
      context.fillText(line, 10, 40 * (index + 1)) // Adjust line spacing
      })
  }

  // Update the canvas whenever the haiku changes
  useEffect(() => {
      drawHaiku()
  }, [haiku])

  // Function to add a new line to the haiku
  const addLine = () => {
      if(text.trim()){
        if(!disableChecks){
          if(currentLine === 1 && checkHaiku(text.toLowerCase(), 5)){
            setCurrentLine(2)
            setHaiku([...haiku, text])
          }
          else if(currentLine === 2 && checkHaiku(text.toLowerCase(), 7)){
            setCurrentLine(3)
            setHaiku([...haiku, text])
          }
          else if(currentLine === 3 && checkHaiku(text.toLowerCase(), 5)){
            setCurrentLine(1)
            setHaiku([...haiku, text])
          }
          else{
            alert("Revisit the syllables of your haiku!")
          }
        }
        else{
          setHaiku([...haiku, text])
        }
    }
    setText('')
  }

  const cleanSlate = () => {
    setText('');
    setHaiku([])
  }

  return (
    <MantineProvider>
      <Container className='container-class'>
        <canvas ref={canvasRef} width={400} height={300} style={{ border: '1px solid black' }}></canvas>
        <Space h="md" />
        <TextInput
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Enter a line of your haiku"
        />
        <Space h="md" />
        <Container className='buttons-class'>
          <Button onClick={addLine}>Add Line to Haiku</Button>  
          <Space w="s" />
          <Button onClick= {cleanSlate}>Clean Slate</Button>
          <br/>
          <Button onClick= {() => {setDisableChecks(true)}}>Disable checks and set me free</Button>
        </Container>
      </Container>
    </MantineProvider>
  )
}

export default App
