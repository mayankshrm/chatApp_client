import { useNavigate } from "react-router-dom";
import Message from "../../Component/Message/Message";
import User from "../../Component/User/User";
import "./Home.css";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import io from 'socket.io-client';



export default function Home() {
 
  const navigate = useNavigate();
  
  const [data, setData] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [arivalMessage,setArrivalMessage]=useState(null);
  const { user } = useContext(AuthContext);
  const socket = useRef();
  const scrollRef = useRef();


  useEffect(()=>{

    if(localStorage.getItem("id")){
    socket.current = io("ws://localhost:1234");
    socket.current.on("connect", () => {
      console.log(socket.current.id); 
    });
    }
    },[])
    
    useEffect(()=>{
      socket?.current?.on("getMessage",(data)=>{
        console.log(data);
          setArrivalMessage({
            senderId:data.senderId,
            text:data.text,
            createdAt:Date.now()
          })
        })
        console.log(arivalMessage)
    },[messages,arivalMessage])
    
  useEffect(()=>{
    socket?.current?.emit("addUser",localStorage.getItem('id'));
      socket?.current?.on("getUsers",users=>{
        console.log(users)
      })

  },[localStorage.getItem('id')])

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      navigate("/login");
    }
  }, []);

  //conversation List sbse left mai jo user list hai
  useEffect(() => {
    const getconvo = async () => {
      try {
        const res = await axios.get(
          "http://localhost:1234/api/conversation/" + localStorage.getItem("id")
        );
       
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getconvo();
  }, [user?.user1._id]);

  //message of particular user
  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axios.get(
          "http://localhost:1234/api/messages/" + currentConversation?._id
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getMessage();
  }, [currentConversation]);

  const handleClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    socket.current.disconnect();
    navigate("/login");

  };

  const handleSend = async (e) => {
    e.preventDefault();

    const data = {
      senderId: localStorage.getItem("id"),
      conversationId: currentConversation._id,
      text: newMessage,
    };

    const receiverId=currentConversation.members.find(member=>member!==localStorage.getItem('id'))
   
    socket.current.emit("message",{
      senderId:localStorage.getItem('id'),
      text:newMessage,
      receiverId:receiverId,
    })

    try {
      const res = await axios.post("http://localhost:1234/api/messages", data);
      setMessages([...messages, res.data]);
    } catch (error) {
      console.log(error);
    }

    setNewMessage("");
  };

  useEffect(()=>{
    arivalMessage && currentConversation?.members.includes(arivalMessage?.senderId) && setMessages((prev)=>[...prev,arivalMessage])
  },[currentConversation,arivalMessage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="container1">
        <div className="userChat">
          <input placeholder="search" className="inputSearch"></input>

          {data.map((e) => (
            <div key={e._id} onClick={() => setCurrentConversation(e)}>
              <User
                key={e._id}
                conversation={e}
                currentUser={localStorage.getItem("id")}
              />
            </div>
          ))}

          <button
            className="bg-red-500 text-white fixed bottom-10 left-3 p-2 rounded-md"
            onClick={handleClick}
          >
            Logout
          </button>
        </div>

        <div className="message ">
          <div className="topWrapper">
            {currentConversation ? (
              <>
                <div className="messageTop">
                  {messages.map((e) => (
                    <>
                      <div ref={scrollRef}>
                        <Message
                          key={e}
                          messages={e}
                          own={e.senderId == localStorage.getItem("id")}
                        />
                      </div>
                    </>
                  ))}
                </div>

                <div className="messageBottom">
                  <textarea
                    className="textChat border-gray-400 border-2 rounded p-2"
                    placeholder="type here something..."
                    minLength={2}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                    }}
                    value={newMessage}
                  ></textarea>
                  <button
                    className=" bg-blue-700 p-1 rounded-md text-white ml-4  "
                    onClick={handleSend}
                  >
                    {" "}
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="text-center font-extrabold text-3xl">
                no chat is there{" "}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
