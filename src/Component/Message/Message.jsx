import "./Message.css"
import {format} from "timeago.js"

export default function Message({messages,own}) {
  return (
    <>
        <div className={own?"messageContainer own ":"messageContainer"}>
            <div className="chatTop">
           
                <div className="chatText">
                <div className="chatName">Mayank</div>
                {messages.text} </div>
            </div>
            <div className="chatBottom">{format(messages.createdAt)}</div>

        </div>

    </>
  )
}
