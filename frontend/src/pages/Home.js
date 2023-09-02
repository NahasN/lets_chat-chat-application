import React from 'react'
import {Row,Col} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import "./Home.css";
import { Button } from '@mui/material';

function Home() {
  return (
    <Row>
      <Col md={6} className='d-flex flex-direction-column align-items-center justify-content-center'>
        <div style={{textAlign:"center"}}>
          <h1>Share the world with your friends</h1>
          <p>Chat App lets connect with the world</p>
          <LinkContainer to='/chat'>
          <Button variant="outlined" color='success' endIcon={<ForumOutlinedIcon/>}>
  Get Started
</Button>
          
          </LinkContainer>
          </div>
      </Col>
      <Col md={6} className='home-bg'>
        
      </Col>
    </Row>
  )
}

export default Home;