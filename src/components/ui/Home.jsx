import React from 'react';
import styled, { keyframes } from 'styled-components';
import { auth } from '../../firebase';
import { useNavigate, Link, NavLink, Routes } from "react-router-dom";
import Sidebar from './common/sidebar/Sidebar';

const gradientShift = keyframes`
	0%   { background-position: 0% 50%; }
	50%  { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
`;

const floatUp = keyframes`
	0%   { transform: translateY(0px) scale(1);   opacity: 0.6; }
	50%  { transform: translateY(-30px) scale(1.05); opacity: 0.4; }
	100% { transform: translateY(0px) scale(1);   opacity: 0.6; }
`;
const GridDots = styled.div`
	position: fixed;
	inset: 0;
	z-index: 0;
	background-image: radial-gradient(
		rgba(255, 255, 255, 0.04) 1px,
		transparent 1px
	);
	background-size: 32px 32px;
	mask-image: radial-gradient(
		ellipse 80% 80% at 50% 50%,
		black 40%,
		transparent 100%
	);
`;
const Page = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100vh;
	background: transparent;
`;
const AnimatedBg = styled.div`
	position: fixed;
	inset: 0;
	background: linear-gradient(
		135deg,
		#dec9e9 0%,
		#9163CB 20%,
		#c19ee0 40%,
		#dac3e8 60%,
		#c19ee0 80%,
		#dac3e8 100%
	);
	background-size: 400% 400%;
	animation: ${gradientShift} 14s ease infinite;
	z-index: 0;
`;

const Blob = styled.div`
	position: fixed;
	border-radius: 50%;
	filter: blur(80px);
	z-index: 0;
	animation: ${floatUp} ${({ dur }) => dur || '8s'} ease-in-out infinite;
	animation-delay: ${({ delay }) => delay || '0s'};
`;

const Blob1 = styled(Blob)`
	width: 500px;
	height: 500px;
	top: -120px;
	left: -150px;
	background: radial-gradient(circle, #b185db 0%, transparent 70%);
`;

const Blob2 = styled(Blob)`
	width: 450px;
	height: 450px;
	bottom: -100px;
	right: -120px;
	background: radial-gradient(circle, #dec9e9 0%, transparent 70%);
`;

const Blob3 = styled(Blob)`
	width: 300px;
	height: 300px;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: radial-gradient(circle, #815ac0 0%, transparent 70%);
`;
const Button = styled.button`
    padding: 10px 20px;
    background-color: #ff0000;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const Container = styled.div`
	width: calc(100% - 100px);
	background: transparent;
	position: absolute;
	right: 0;
	top: 0;
	align-items: center;
	justify-content: center;
`;
const MainTItle = styled("h1")`
	width: 100%;
	margin: auto 0;
	font-size: 50px;
	color: #000;
	text-align: center;
	margin-top: 50px;
`;
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
		<Page>
			<AnimatedBg />
			<GridDots />
			<Blob1 dur="9s" delay="0s" />
			<Blob2 dur="11s" delay="2s" />
			<Blob3 dur="7s" delay="4s" />	 
			<Sidebar />
			<Container>
				<MainTItle>Welcome to VEXORA</MainTItle>
				<Button onClick={handlesignout}>Logout</Button>
				<Button onClick={handlevideoCall}>VideoCall</Button>	
			</Container>
		</Page>
		</>
	)
}   