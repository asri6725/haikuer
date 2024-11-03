import { useState, useRef, useEffect } from 'react'
import '../App.css'
import '@mantine/core/styles.css'
import { TextInput, Button, Container, Space } from '@mantine/core'
import { syllable } from 'syllable'
import socket from './socketService'

function MultiPlayer({roomId}){
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

  const addLine = () => {
    if(text.trim()){
        if(!disableChecks){
            let count = syllable(text.toLocaleLowerCase())
            if(currentLine === 1 && count == 5){
                socket.emit('new-line', { room: roomId, haiku: text })
                setCurrentLine(2)
                setText('')
                setErrorMsg('')
            }
            else if(currentLine === 2 && count == 7){
                socket.emit('new-line', { room: roomId, haiku: text })
                setCurrentLine(3)
                setText('')
                setErrorMsg('')
            }
            else if(currentLine === 3 && count == 5){
                socket.emit('new-line', { room: roomId, haiku: text })
                setCurrentLine(4)
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
            socket.emit('new-line', { room: roomId, haiku: text })
            setText('')
        }
    }
  }

  const cleanSlate = () => {
    socket.emit('clean-slate', { room: roomId })
  }

  useEffect(() => {

    socket.on('new-line', (data) => {
        setHaiku(data.haiku)
        let line = data.haiku.length + 1
        if(disableChecks && line > 3)
            line = 3

        setCurrentLine(line)
      })
  
      socket.on('clean-slate', () => {
        setText('')
        setHaiku([])
        setCurrentLine(1)
        setErrorMsg('')
      })
  
      // Clean up the listener when the component unmounts
      return () => {
        socket.off('new-line')
        socket.off('clean-slate')
      }
    }, [])

  return (
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
                addLine()
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
                            }
                        }
            >{disableChecksButtonText}</Button>

        </Container>
        <Space h="md" />
        <Button onClick= {cleanSlate}>Clean Slate</Button>
    </Container>
  )
}

export default MultiPlayer