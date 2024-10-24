import { useState, useRef, useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import '@mantine/core/styles.css'
import { MantineProvider, TextInput, Button, Container, Space } from '@mantine/core'
import { syllable } from 'syllable'

function App() {
  const [text, setText] = useState('')
  const [currentLine, setCurrentLine] = useState(1)
  const [haiku, setHaiku] = useState([])
  const canvasRef = useRef(null)

  const [disableChecks, setDisableChecks] = useState(false)
  const [disableChecksButtonText, setDisableChecksButtonText] = useState('Disable checks')

  const [errorMsg, setErrorMsg] = useState('')

  const map_line_vowels = {1:5, 2:7, 3:5, 4:'no more'}

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
          let count = syllable(text.toLocaleLowerCase())
          if(currentLine === 1 && count == 5){
            setCurrentLine(2)
            setHaiku([...haiku, text])
            setText('')
            setErrorMsg('')
          }
          else if(currentLine === 2 && count == 7){
            setCurrentLine(3)
            setHaiku([...haiku, text])
            setText('')
            setErrorMsg('')
          }
          else if(currentLine === 3 && count == 5){
            setCurrentLine(4)
            setHaiku([...haiku, text])
            setText('')
            setErrorMsg('')
          }
          else{
            setErrorMsg(`Revisit the syllables (${count}) of your haiku, bub. Need ${map_line_vowels[currentLine]}`)
            if(currentLine === 4){
              setErrorMsg('Haiku complete! Disable checks to continue.')
            }
          }
        }
        else{
          setHaiku([...haiku, text])
          setText('')
        }
    }
  }

  const cleanSlate = () => {
    setText('');
    setHaiku([])
    setCurrentLine(1)
    setErrorMsg('')
  }

  return (
    <MantineProvider>
      <Container className='container-class'>
        <canvas ref={canvasRef} width={400} height={300} style={{ }}></canvas>
        <Space h="md" />
        <TextInput
          value={text}
          placeholder="Enter a line of your haiku"
          description={errorMsg}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if(event.key === 'Enter'){
              addLine();
            }
          }}
        />
        <Space h="md" />
        <Container className='buttons-class'>
          <Button onClick={addLine} className='button-class'>Add Line</Button>  
          <Space w="md" />
          <Button className='button-class'
          onClick= {() => {
                            if(disableChecks == true){
                              setDisableChecks(false)
                              setDisableChecksButtonText('Disable checks')
                            }
                            else{
                              setDisableChecks(true)
                              setErrorMsg('')
                              setDisableChecksButtonText("Re-enable checks")
                            }
                            console.log(disableChecks)
                          }
                        }
          >{disableChecksButtonText}</Button>

        </Container>
        <Space h="md" />
        <Button onClick= {cleanSlate}>Clean Slate</Button>
      </Container>
    </MantineProvider>
  )
}

export default App
