import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  Row,
} from "react-bootstrap";
import SendIcon from "@mui/icons-material/Send";
import "./MessageForm.css";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { Alert, IconButton } from "@mui/material";

function MessageForm() {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const { socket, currentRoom, setMessages, messages, privateMemberMsg } =
    useContext(AppContext);
  const messageEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return day + "/" + month + "/" + year;
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    console.log("room messages", roomMessages);
    setMessages(roomMessages);
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    setMessage("");
  }

  return (
    <>
      <div className="message-output">
        {user && !privateMemberMsg?._id && (
          <div>
            <Alert variant="filled" severity="info">
              You are in the {currentRoom} room
            </Alert>
          </div>
        )}

        {user && privateMemberMsg?._id && (
          <>
            <div className=" alert alert-info conversation-info">
              <div>
                Your conversation with {privateMemberMsg.userName}{" "}
                <img
                  src={privateMemberMsg.picture}
                  className="conversation-profile-picture"
                  alt=""
                />
              </div>
            </div>
          </>
        )}

        {!user && <div className="alert alert-danger">Please Login</div>}

        {user &&
          messages.map(({ _id: date, messagesByDate }, index) => (
            <div key={index}>
              <p className=" text-center message-date-indicator">
                <Alert icon={false} severity="info">
                  {date}
                </Alert>
              </p>

              {messagesByDate?.map(({ content, time, from: sender }, idx) => (
                <div
                  key={idx}
                  className={
                    sender?.email == user?.email
                      ? "message"
                      : "incoming-message"
                  }
                >
                  <div className="message-inner">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={sender.picture}
                        alt=""
                        style={{
                          width: 35,
                          height: 35,
                          objectFit: "cover",
                          borderRadius: "50%",
                          marginRight: 10,
                        }}
                      />

                      <p className="message-sender">
                        {" "}
                        {sender._id == user?._id ? "You" : sender.userName}
                      </p>
                    </div>
                    <p className="message-content">{content}</p>
                    <p className="message-timestamp-left">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}

        <div ref={messageEndRef} />
      </div>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={10}>
            <FormGroup>
              <FormControl
                disabled={!user}
                type="text"
                placeholder="Type message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ border: "none", width: "100%", padding: "10px" }}
              ></FormControl>
            </FormGroup>
          </Col>

          <Col md={2}>
            <Button
              disabled={!user}
              variant="primary"
              type="submit"
              style={{
                width: "80%",
                border: "none",
                borderRadius: "50%",
                backgroundColor: "#32bff4",
              }}
            >
              <IconButton>
                <SendIcon style={{ color: "#fff" }} />
              </IconButton>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default MessageForm;
