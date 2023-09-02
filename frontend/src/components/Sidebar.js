import React, { useContext, useEffect } from 'react'
import { Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext} from '../context/appContext';
import {addNotifications , resetNotifications} from "../features/userSlice";
import "./Sidebar.css";
import CircleIcon from '@mui/icons-material/Circle';

function Sidebar() {
  const user = useSelector((state)=>state.user);
  const dispatch  = useDispatch();
  const {socket, setMembers, members, setCurrentRoom ,setRooms , privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom} = useContext(AppContext);
 
  function joinRoom(room,isPublic = true){
      if(!user){
        return alert('Please Login')
      }
      socket.emit('join-room' , room ,currentRoom);
      setCurrentRoom(room);


      if(isPublic){
        setPrivateMemberMsg(null)
      }

      //notifications

      dispatch(resetNotifications(room));
      
  }
  socket.off('notifications').on('notifications' , (room)=>{
    if(currentRoom != room)
    dispatch(addNotifications(room));
  })
 
    useEffect(()=>{
          if(user){
            setCurrentRoom('general');
            getRooms();
            socket.emit('join-room', 'general');
            socket.emit('new-user')
          }  
    },[]);
 
 
  socket.off('new-user').on('new-user', (payload)=>{
    setMembers(payload);
  });



  function getRooms(){
    fetch('http://localhost:5000/rooms')
    .then((res)=> res.json())
    .then((data)=> setRooms(data));
  }

  function orderIds(id1, id2){
    if(id1 > id2){
      return id1 + '-' + id2;
    }else{
      return id2 + "-" + id1;
    }
  }

  function handlePrivateMemberMsg(member){
      setPrivateMemberMsg(member);
      const roomId = orderIds(user._id , member._id);
      joinRoom(roomId , false);
     
  }


  if(!user){
    return <></>;
  }

  return (
    <>
    <h2>Available Groups</h2>

    <ListGroup>
    {
      rooms.map((room,index) =>(

        <ListGroupItem onClick={()=> joinRoom(room)} active={room == currentRoom} key={index} style={{cursor:'pointer' , display:'flex', justifyContent:'space-between'}}>{room} {currentRoom !== room && <span className='badge rounded-pill bg-primary'>{user.newMessages[room]}</span>}</ListGroupItem>
      ))
    }

    </ListGroup>

    <h2>Members</h2>
    <ListGroup>


      {members.map((member)=>(<ListGroup.Item key={member.id}  style={{cursor:"pointer"}} active = {privateMemberMsg?._id == member?._id} onClick={()=> handlePrivateMemberMsg(member)} disabled={member._id == user._id}>

        <Row>
          <Col xs={2} className='member-status'>
            <img src={member.picture} className='member-status-img' />
            {member.status ==='online' ? <CircleIcon  className='sidebar-online-status'/> : <CircleIcon className='sidebar-offline-status'/>}
          </Col>

          <Col xs={9}>
            {member.userName}
            {member._id === user?._id && " (You)"}
            {member.status === "offline" && " (offline)"}
          </Col>

          <Col xs={1}>
              <span className='badge rounded-pill bg-primary'>{user.newMessages[orderIds(member._id , user._id)]}</span>
          </Col>
        </Row>
            

      </ListGroup.Item>))}

      </ListGroup>
      

    </>
  )
}

export default Sidebar;