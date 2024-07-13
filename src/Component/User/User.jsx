
import { useEffect, useState } from "react"
import "./User.css"

import axios from "axios"
export default function User({conversation,currentUser}) {

  const [user,setUser]=useState(null);
  const[friend,setFriend]=useState();

  useEffect(()=>{
      const friend1=conversation.members.find((m)=>m!==currentUser);

      const getUser=async()=>{
        try {
          const res=await axios.get("http://localhost:1234/api/singleuser?userId="+friend1);
          
          setFriend(res.data);
        } catch (error) {
          console.log(error);
        }
      }
  
      getUser();
  },[])


 
  return (

    <>      
    <div className='userContainer'>
        <img  src="https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"  alt=" "  className="userImg"/>

        <span className="userSpan">{friend?.email}</span>
                      

    </div>

    </>
  )
}
