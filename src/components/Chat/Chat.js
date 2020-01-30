import React, {useState, useEffect} from 'react';
import './Chat.css';
import io from 'socket.io-client';
import queryString from 'query-string';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;

const Chat = ({ location })=>{ 
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([])
    const ENDPOINT = 'https://emojireactchat.herokuapp.com/';
    
    

    useEffect(()=>{
        const {name, room}= queryString.parse(location.search);
        
        socket = io(ENDPOINT);
        
        setName(name);
        setRoom(room);
      
        socket.emit('join', {name, room}, ()=>{
            // this function gets executed when callback from server/index.js is called
        });
        
        return () => {
            socket.emit('disconnect');
            socket.off();
            // socket.disconnect();
        }

    },[ENDPOINT, location.search ]);

    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages, message]);
        })
        socket.on('roomData', ({ users }) => {
            setUsers(users);
          })
    },[messages])

    const sendMessage = (event) =>{
        event.preventDefault()
        if(message){
            socket.emit('sendMessage', message, ()=> setMessage(''))
        }
    }
    console.log(message, messages)

    return (
       <div className="outerContainer">
           <div className="container">
               <InfoBar room={room}/>
               <Messages name={name} messages={messages}/>
               <Input 
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
               />
               
           </div>
           <TextContainer users={users}/>
       </div>
    )
}

export default Chat;