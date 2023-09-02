import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useSignupUserMutation } from '../services/appApi';
import { Link , useNavigate } from 'react-router-dom';
import "./Signup.css";
import proPic from "../assets/profile.png";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';





function Signup() {



  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [userName,setUserName] = useState("");
  const navigate = useNavigate();
  const [signupUser , {isLoading,error}] = useSignupUserMutation();



  //image upload

  const [image,setImage] = useState(null);
  const [uploading,setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);


  function validateImg(e){

    const file = e.target.files[0];
  
    if(file.size >= 1048576){
      return alert('Maximum file six=ze is 1mb');
    }else{
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

 async function uploadImage(){
  const data = new FormData();
  data.append('file',image);
  data.append('upload_preset' ,'yztll8fw');
  try{
    setUploading(true);
    let res = await fetch('https://api.cloudinary.com/v1_1/dhbufy6s6/image/upload',{
      method:'post',
      body:data
    })
    const urlData = await res.json();
    setUploading(false);
    return urlData.url
  }catch(error){
    setUploading(false);
    console.log(error);
   }
 } 

  
async function handleSignup(e){
  e.preventDefault();

  if(!image) return alert("Please upload yuour profile picture");

  const url = await uploadImage(image);

  console.log(url);

  signupUser({userName ,email,password,picture:url}).then(({data})=>{
    if(data){
      console.log(data);
      navigate("/chat");
    }
  })

  //signup user

}

  return (
    <Container >
      <Row>
        <Col md={7} className='d-flex align-items-center justify-content-center flex-direction-column'>
        <Form style={{width:"80%" , maxWidth:500}} onSubmit={handleSignup}>
          <h2 className='text-center'>Create an account</h2>

          <div className='signup_profile_container'>
            <img src={imagePreview || proPic} alt="signup-profile-pic" className='signup-profile-pic' />
            <label htmlFor="image-upload" className='image-upload-label'>
              <AddCircleOutlineOutlinedIcon className='icon'/>
            </label>
            <input type="file" id='image-upload' hidden accepts="image/png, image/jpeg" onChange={validateImg}/>
          </div>
          {error && <p className='alert alert-danger'>{error.data}</p>}
  <Form.Group className='mb-3' controlId="formBasicEmail" >
    <Form.Label>Username</Form.Label>
    <Form.Control type="username" required placeholder="Enter username" onChange={(e)=> setUserName(e.target.value)} value={userName}/>
  </Form.Group>

  <Form.Group className='mb-3' controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control type="email" required placeholder="Enter email"  onChange={(e)=> setEmail(e.target.value)} value={email}/>
    <Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text>
  </Form.Group>

  <Form.Group className='mb-3' controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" required placeholder="Password"  onChange={(e)=> setPassword(e.target.value)} value={password}/>
  </Form.Group>
  <Button style={{marginTop:"10px" , padding:"10px 30px" ,backgroundColor:"green", }} type="submit">
    {uploading || isLoading? 'Creating your account....' : 'Signup'}
  </Button>

    <div className="py-4">
      <p className='text-center'>Already have an account ? <Link to='/login'>Login</Link>
      </p>
    </div>
</Form>
      </Col>
      <Col md={5} className='signup-bg'></Col>
      </Row>
    </Container>
  )
}

export default Signup;