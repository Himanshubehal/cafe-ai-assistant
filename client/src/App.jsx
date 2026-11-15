import { useRef } from "react"
import { useEffect } from "react"
import { useState } from "react"

let sessionId = localStorage.getItem("sessionId")

if(!sessionId){
  sessionId = crypto.randomUUID()
  localStorage.setItem("sessionId", sessionId)
}

const API_URL = import.meta.env.VITE_API_URL

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
        const response = await fetch(`${API_URL}/api/chat`, {
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
        const response  = await fetch(`${API_URL}/api/chat/${sessionId}`)
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
    <div className="h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h1 className="text-lg font-semibold">Ask the Cafe</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((msg, index) => {
          return <div key={index} className={`px-4 py-2 rounded-2xl max-w-xs my-2 ${msg.role === "user" ? "ml-auto bg-amber-700 text-white" : "bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"}`}>{msg.text}</div>
        })}
        {loading && <div className="px-4 py-2 rounded-2xl max-w-xs my-2 bg-white border border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">Typing...</div>}
        <div ref={bottomRef}></div>
      </div>
      <div className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
        <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 flex-1 bg-white outline-none focus:border-amber-700 dark:bg-gray-800 dark:border-gray-600" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}/>
        <button className="bg-amber-700 text-white px-4 rounded-lg disabled:opacity-50" disabled ={!input.trim() || loading} onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default App
