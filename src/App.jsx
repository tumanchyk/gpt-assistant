import { useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT!",
      sender: "ChatGPT"
    }
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      sender: 'user',
      direction: 'outgoing'
    }
  
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);
    await processMessageToChatGPT(newMessages)

  }

  async function processMessageToChatGPT(chatMessages) {
    let apiMessage = chatMessages.map((messageObject) => {
      let role = '';
      if (messageObject.sender === "ChatGPT") {
        role = 'assistant'
      } else {
        role = 'user'
      }
      return { role, content: messageObject.message }
    });

    const systemMessages = {
      "role": "system",
      "content": "Expect all concents like I'm Junior Software Engineer"
    }
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [systemMessages, ...apiMessage]
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json()
    }).then((data) => {
      console.log(data);
      setMessages([...chatMessages, {
        sender: "ChatGPT",
        messages: data.choices[0].message.content
      }]);
      setTyping(false);
    });
  }

  return (
    <>
      <div style={{position: "relative", width: "700px", height: "100vh"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content='ChatGPT is typing' /> : null}>
              {messages.map((message, index)=> <Message key={index} model={message}/>)}
            </MessageList>
            
            <MessageInput placeholder='Type message here' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  )
}

export default App
