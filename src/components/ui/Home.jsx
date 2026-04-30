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
  return (
    <>
        <h1>Ho</h1>
          <Button onClick={handlesignout}>Logout</Button>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae ullam animi consequuntur vel quod, cumque cum quae iste necessitatibus aliquid a commodi, eligendi molestiae, optio harum facere nemo exercitationem ipsam!</p>
    </>
  )
}   