import React, { useState, useRef, useEffect } from 'react';

const ChatWindow = ({ messages, onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSendMessage(message);
    setMessage('');
  };

  // Format message text to handle URLs and code blocks
  // Plus add word-wrapping
  const formatMessage = (text) => {
    if (!text) return '';
    
    // Handle code blocks (text between triple backticks)
    let formattedText = text.split('```');
    
    // Function to wrap long text
    const wrapText = (str) => {
      // Break long strings that don't have spaces
      if (str.length > 30 && !str.includes(' ')) {
        let result = '';
        for (let i = 0; i < str.length; i += 30) {
          result += str.substring(i, i + 30) + ' ';
        }
        return result;
      }
      return str;
    };
    
    // Apply text wrapping to regular text
    const wrapRegularText = (text) => {
      return text.split(' ').map(word => wrapText(word)).join(' ');
    };
    
    if (formattedText.length > 1) {
      // We have code blocks
      return (
        <>
          {formattedText.map((part, index) => {
            // Even indices are regular text, odd indices are code blocks
            if (index % 2 === 0) {
              return <span key={index} className="wrapped-text">{wrapRegularText(part)}</span>;
            } else {
              return (
                <pre key={index} className="code-block">
                  <code>{part}</code>
                </pre>
              );
            }
          })}
        </>
      );
    }
    
    // Handle URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    if (parts.length > 1) {
      return (
        <>
          {parts.map((part, index) => {
            if (part.match(urlRegex)) {
              return (
                <a key={index} href={part} target="_blank" rel="noopener noreferrer">
                  {part}
                </a>
              );
            } else {
              return <span key={index} className="wrapped-text">{wrapRegularText(part)}</span>;
            }
          })}
        </>
      );
    }
    
    return wrapRegularText(text);
  };

  // Clear messages container when it gets too long
  const clearOldMessages = () => {
    const container = messagesContainerRef.current;
    if (container && messages.length > 50) {
      // Keep only the last 20 messages if we have more than 50
      onSendMessage({
        type: 'system',
        text: 'The chat has been cleared to maintain performance. Previous messages have been removed.'
      });
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>AI Assistant</h2>
      </div>
      
      <div className="messages-container" ref={messagesContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.type}`}>
            <div className="message-content">
              {formatMessage(msg.text)}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message system">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about the stock or request analysis..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !message.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
// import React, { useState, useRef, useEffect } from 'react';

// const ChatWindow = ({ messages, onSendMessage, isLoading }) => {
//   const [message, setMessage] = useState('');
//   const messagesEndRef = useRef(null);
//   const messagesContainerRef = useRef(null);

//   // Auto-scroll to bottom when messages update
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!message.trim()) return;
    
//     onSendMessage(message);
//     setMessage('');
//   };

//   // Format message text to handle URLs and code blocks
//   const formatMessage = (text) => {
//     if (!text) return '';
    
//     // Handle code blocks (text between triple backticks)
//     let formattedText = text.split('```');
    
//     if (formattedText.length > 1) {
//       // We have code blocks
//       return (
//         <>
//           {formattedText.map((part, index) => {
//             // Even indices are regular text, odd indices are code blocks
//             if (index % 2 === 0) {
//               return <span key={index}>{part}</span>;
//             } else {
//               return (
//                 <pre key={index} className="code-block">
//                   <code>{part}</code>
//                 </pre>
//               );
//             }
//           })}
//         </>
//       );
//     }
    
//     // Handle URLs
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     const parts = text.split(urlRegex);
    
//     if (parts.length > 1) {
//       return (
//         <>
//           {parts.map((part, index) => {
//             if (part.match(urlRegex)) {
//               return (
//                 <a key={index} href={part} target="_blank" rel="noopener noreferrer">
//                   {part}
//                 </a>
//               );
//             } else {
//               return <span key={index}>{part}</span>;
//             }
//           })}
//         </>
//       );
//     }
    
//     return text;
//   };

//   // Clear messages container when it gets too long
//   const clearOldMessages = () => {
//     const container = messagesContainerRef.current;
//     if (container && messages.length > 50) {
//       // Keep only the last 20 messages if we have more than 50
//       onSendMessage({
//         type: 'system',
//         text: 'The chat has been cleared to maintain performance. Previous messages have been removed.'
//       });
//     }
//   };

//   return (
//     <div className="chat-window">
//       <div className="chat-header">
//         <h2>AI Assistant</h2>
//       </div>
      
//       <div className="messages-container" ref={messagesContainerRef}>
//         {messages.map((msg) => (
//           <div key={msg.id} className={`message ${msg.type}`}>
//             <div className="message-content">
//               {formatMessage(msg.text)}
//             </div>
//           </div>
//         ))}
        
//         {isLoading && (
//           <div className="message system">
//             <div className="message-content">
//               <div className="typing-indicator">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//               </div>
//             </div>
//           </div>
//         )}
        
//         <div ref={messagesEndRef} />
//       </div>
      
//       <form className="message-form" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Ask about the stock or request analysis..."
//           disabled={isLoading}
//         />
//         <button type="submit" disabled={isLoading || !message.trim()}>
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatWindow;