
import React, { useContext, useState } from 'react'
import {  Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import "./Login.css"
import { Link , useNavigate} from 'react-router-dom';
import { useLoginUserMutation } from '../services/appApi';
import { AppContext} from '../context/appContext';
import { Button } from '@mui/material';

function Login() {

  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const navigate = useNavigate();
  const {socket} = useContext(AppContext);

  const [loginUser , {isLoading ,error}] = useLoginUserMutation();


  function handleLogin(e){

    e.preventDefault();

    //login user

   loginUser({email,password}).then(({data})=>{

    if(data){
      //socket connection
      socket.emit("new-user");



      // navigate to chat
      navigate("/chat");
    }
   })



  }


  return (
    <Container >
      <Row>
        <Col md={5} className='login-bg'></Col>
        <Col md={7} className='d-flex align-items-center justify-content-center flex-direction-column'>
        <Form style={{width:"80%" , maxWidth:500}} onSubmit={handleLogin}>
  <Form.Group className='mb-3' controlId="formBasicEmail">
    {error && <p className='alert alert-danger'>{error.data}</p>}
    <Form.Label>Email address</Form.Label>
    <Form.Control type="email" required placeholder="Enter email"  onChange={(e)=> setEmail(e.target.value)} value={email}/>
    <Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text>
  </Form.Group>

  <Form.Group className='mb-3' controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="Password" required onChange={(e)=> setPassword(e.target.value)} value={password}/>
  </Form.Group>
  <Button variant="outlined" type='submit' size='large' color='success'>
    {isLoading ? <Spinner animation='grow' /> : "Login"}
  </Button>

    <div className="py-4">
      <p className='text-center'>Don't have an acccount ? <Link to='/signup'>Signup</Link>
      </p>
    </div>
</Form>
      </Col>
      </Row>
    </Container>
  )
}

export default Login;