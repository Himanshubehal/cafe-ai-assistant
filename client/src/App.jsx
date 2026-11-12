import { useRef } from "react"
import { useEffect } from "react"
import { useState } from "react"

let sessionId = localStorage.getItem("sessionId")

if(!sessionId){
  sessionId = crypto.randomUUID()
  localStorage.setItem("sessionId", sessionId)
}



function App() {

  const [ input, setInput ] = useState("")
  const [ messages, setMessages ] = useState([])
  const [loading, setLoading ] = useState(false)
  const bottomRef = useRef(null)


  async function handleSend(){
    if(!input.trim() || loading) return
    setMessages([
      ...messages,
      {
        role: "user",
        text: input
      }
    ])
    setInput("")
    setLoading(true)
   
    try {
        const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({message :input, sessionId})
    })
    const data = await response.json()
    if(!response.ok){
      setMessages(prev => [
        ...prev, {
          role: "bot",
          text: "Sorry, something went wrong"
        }
      ])
      return
    }
    setMessages(prev => [
      ...prev, {
        role: "bot",
        text: data.reply
      }
    ])
    } catch (error) {
      console.error(error)
      setMessages(prev => [
        ...prev, {
          role: "bot",
          text: "Sorry, something went wrong"
        }
      ])
    }finally{
      setLoading(false)
    }

  }
  useEffect(() => {
    async function loadChat() {
      try {
        const response  = await fetch(`http://localhost:5000/api/chat/${sessionId}`)
      const data = await response.json()
      if(response.ok) setMessages(data) 
      } catch (error) {
        console.error(error)
      }
    }
    loadChat()
  }, [])


  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: "smooth"})
  }, [messages, loading])
  
  


  return (
    <div className="h-screen flex flex-col bg-amber-50">
      <header className="bg-amber-900 text-white p-4">
        <h1>Ask the Cafe</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => {
          return <div key={index} className={`p-3 rounded-lg max-w-xs my-2 ${msg.role === "user" ? "ml-auto bg-amber-900 text-white" : "bg-white"}`}>{msg.text}</div>
        })}
        {loading && <div className="p-3 rounded-lg max-w-xs my-2 bg-white">Typing...</div>}
        <div ref={bottomRef}></div>
      </div>
      <div className="flex gap-2 p-4">
        <input type="text" className="border rounded p-2 flex-1" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}/>
        <button className="bg-amber-900 text-white px-4 rounded disabled:opacity-50" disabled ={!input.trim() || loading} onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default App
