import React from 'react'
import styled from 'styled-components'
import { auth } from '../../firebase'
import { useNavigate } from 'react-router-dom'

const Button = styled.button`
    padding: 10px 20px;
    background-color: #ff0000;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`
export default function Home(){
    const navigate = useNavigate()
    const handlesignout = ()=>{
        auth.signOut()
        navigate("/")
    }
        const handlevideoCall = ()=>{
        navigate("/VideoCall")
    }
  return (
    <>
        <h1>Ho</h1>
          <Button onClick={handlesignout}>Logout</Button>
          <Button onClick={handlevideoCall}>VideoCall</Button>
    </>
  )
}   