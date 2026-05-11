import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from "react-router-dom";
import Sidebar from '../common/sidebar/Sidebar';
import diverseBusinesspeople from "../../../../public/assests/diverse-businesspeople-having-meeting (1).jpg";
import { db, auth } from "../../../firebase"
// import { log } from 'firebase/firestore/pipelines';
import { v4 as uuidv4 } from "uuid"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import toast from "react-hot-toast"




const gradientShift = keyframes`
	0%   { background-position: 0% 50%; }
	50%  { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
`;
const ImageContainer = styled.div`
	width: 92%;
	height: 50vh;
	position: fixed;
	transform: translateY(-50%);
	border-radius: 20px;
	margin: 200px auto;
	left: 100px;
	overflow: hidden;
`;
const Image = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: center;
	border-radius: 20px;
	z-index: 0;
	
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
const VideoCallButton = styled.button`
	position: fixed;
	bottom: 32px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 100;
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 14px 32px;
	background: linear-gradient(135deg, #9163cb 0%, #6a3fa0 100%);
	color: #ffffff;
	font-size: 16px;
	font-weight: 600;
	letter-spacing: 0.04em;
	border: none;
	border-radius: 50px;
	cursor: pointer;
	box-shadow: 0 8px 24px rgba(145, 99, 203, 0.45);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	&:hover {
		transform: translateX(-50%) translateY(-3px);
		box-shadow: 0 12px 32px rgba(145, 99, 203, 0.65);
	}
	&:active {
		transform: translateX(-50%) translateY(0px);
	}
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
const DateTimeOverlay = styled.div`
	width: 20%;
	height: 30%;
	position: absolute;
	bottom: 20px;
	left: 24px;
	z-index: 10;
	background: rgba(0, 0, 0, 0.45);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 14px;
	padding: 10px 18px;
	display: flex;
	flex-direction: column;
	gap: 2px;
`;
const DateString = styled.p`
	font-size: 30px;
	font-weight: 500;
	color: rgba(255, 255, 255, 0.75);
	margin: 0;
	letter-spacing: 0.04em;
	text-align: center;
`;
const TimeString = styled.p`
	font-size: 30px;
	font-weight: 700;
	color: #ffffff;
	margin: 0;
	letter-spacing: 0.02em;
	text-align: center;
`;
// const MainTItle = styled("h1")`
// 	width: 100%;
// 	margin: auto 0;
// 	font-size: 50px;
// 	color: #000;
// 	text-align: center;
// 	margin-top: 50px;
// `;
export default function Home() {

	const [now, setNow] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	const dateString = now.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	const timeString = now.toLocaleTimeString("en-US", {
		hour12: true,
		hour: "2-digit",
		minute: "2-digit"

	});

	const navigate = useNavigate()

	const createNewMeeting = async () => {
		if (!auth.currentUser) {
			toast.error("Please login first")
			return
		}
		const meetingId = uuidv4()
		const meetingLink = `${window.location.origin}/VideoCall/${meetingId}`
		addDoc(collection(db, "meetings"), {
			meetingId,
			createdAt: serverTimestamp(),
			createdBy: auth.currentUser.email,
			meetingLink,
			status: "active",
			participants: [auth.currentUser.email],
		}).catch((err) => console.error("Firestore write failed:", err))
		navigator.clipboard.writeText(meetingLink)
			.then(() => toast.success("Meeting link copied to clipboard!"))
			.catch(() => {})
		navigate(`/VideoCall/${meetingId}`)
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
					<ImageContainer>
						<Image src={diverseBusinesspeople} alt="" />
						<DateTimeOverlay>
							<DateString>{dateString}</DateString>
							<TimeString>{timeString}</TimeString>
						</DateTimeOverlay>
					</ImageContainer>
				
			{/* <Button onClick={handlesignout}>Logout</Button> */}
			<VideoCallButton onClick={createNewMeeting}>
				📹 New Meeting
			</VideoCallButton>
			</Container>
		</Page>
		</>
	)
}   