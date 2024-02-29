import { useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {MainContainer,ChatContainer,Message,MessageList,TypingIndicator,MessageInput} from '@chatscope/chat-ui-kit-react';

const API_KEY = "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";

function App() {
  const [typing,setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message : "Hello! I am ChatGpt",
      sender : "ChatGpt",
      
    }
  ])
  const handleSend = async (message) => {
    const newMessage = {
      message : message,
      sender : "user",
      direction : "outgoing",
    }

    const newMessages = [ ...messages,newMessage];

    setMessages(newMessages);
    setTyping(true);
    await processMessagesToChatGpt(newMessages);
    
  }

  async function processMessagesToChatGpt(chatMessages){

    let apiMessage = chatMessages.map((messageObject)=>{
      let role = "";
      if(messageObject.sender === "ChatGPT"){
        role = "assistant"
    }else{
      role = "user"
    }
    return { role : role, content : messageObject.message};
  });

  const systemMessge ={
    role : "system",
    content : "Explain all concepts like I am  a ChatGPT."
  }

  const apiRequestBody = {
    "model" : "gpt-3.5-turbo",
    "messages" : [
      systemMessge,
      ...apiMessage
    ]
  }

  await fetch("https://api.openai.com/v1/chat/completions",{
    method : "POST",
    headers : {
      "Authorization":"Bearer "+ API_KEY,
      "Content-Type" : "application/json",
    },
    body : JSON.stringify(apiRequestBody),
  }).then((data) =>{
    return data.json();
  }).then((data)=>{
    console.log(data)
    console.log(data.choices[0].message.content)
    setMessages(
      [...chatMessages, {
          message: data.choices[0].message.content,
          sender : "ChatGPT",
        }
      ]
    );
    setTyping(false);
  });
  }

  return (
    <div className="App">
      <div style={{ position: "relative",height:"800px",width:"700px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList 
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="ChatGpt is typing"/> : null}>
              {messages.map((message,i) => {
                return <Message key={i} model={message} />
              })}

            </MessageList>
            <MessageInput placeholder='Enter your Prompt' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>

      </div>

      
    </div>
  )
}

export default App
