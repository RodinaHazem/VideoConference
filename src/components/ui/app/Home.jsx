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
const Cards = styled("div")`
	width: 100%;
	height: 200px;
	transform: translateY(50vh);
	display: flex;
	gap: 20px;
	margin-top: 50px;
`;
const Card = styled("div")`
	width: 338px;
	height: 200px;
	padding: 20px;
	background: ${props => props.bg || '#fff'};
	border-radius: 10px;
	box-shadow:
		inset 1px 1px 0 #ffffff7c,
		inset 0 0 5px #ffffff70;
	text-decoration: none;
	transition: all 0.2s ease-in-out;
	&:hover {
		transform: scale(1.03);
		box-shadow:
			inset 2px 1px 0 #ffffffd3,
			inset 0 0 10px #ffffffc3;
		background: ${props => props.bg ? props.bg.replace('71', 'a3') : '#fff'};
	}
`;
const CardLogo = styled("svg")`
	width: 70px;
	height: 60px;
	padding: 0 20px;
	margin-bottom: 40px ;
	background: #ffffff31;
	box-shadow:
		inset 1px 1px 0 #ffffff7c,
		inset 0 0 5px #ffffff70;
	border-radius: 10px;
`;
const CardDetails = styled("div")`
	color: #00000095;
	margin: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0 auto;
`;
const CardTitle = styled("h2")`
	color: #000;
	font-size: 24px;
	margin: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0 auto;
`;
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
				<Cards>
						<Card bg="#ff431071" onClick={createNewMeeting}>
							<CardLogo  width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M30.8571 20.1429H20.1429V30.8571C20.1429 31.4255 19.9171 31.9705 19.5152 32.3724C19.1134 32.7742 18.5683 33 18 33C17.4317 33 16.8866 32.7742 16.4848 32.3724C16.0829 31.9705 15.8571 31.4255 15.8571 30.8571V20.1429H5.14286C4.57454 20.1429 4.02949 19.9171 3.62763 19.5152C3.22577 19.1134 3 18.5683 3 18C3 17.4317 3.22577 16.8866 3.62763 16.4848C4.02949 16.0829 4.57454 15.8571 5.14286 15.8571H15.8571V5.14286C15.8571 4.57454 16.0829 4.02949 16.4848 3.62763C16.8866 3.22576 17.4317 3 18 3C18.5683 3 19.1134 3.22576 19.5152 3.62763C19.9171 4.02949 20.1429 4.57454 20.1429 5.14286V15.8571H30.8571C31.4255 15.8571 31.9705 16.0829 32.3724 16.4848C32.7742 16.8866 33 17.4317 33 18C33 18.5683 32.7742 19.1134 32.3724 19.5152C31.9705 19.9171 31.4255 20.1429 30.8571 20.1429Z" fill="white"/>
							</CardLogo>
							<CardDetails>
								<CardTitle>
									New Meeting
								</CardTitle>
								Setup a new recording
							</CardDetails>
						</Card>
						<Card bg="#0800ff71" >
							<CardLogo width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M23.8466 22.5844C24.6974 22.1273 25.6712 21.8672 26.7083 21.8672H26.7118C26.8173 21.8672 26.8665 21.7406 26.7892 21.6703C25.7106 20.7024 24.4786 19.9206 23.1434 19.357C23.1294 19.35 23.1153 19.3465 23.1013 19.3395C25.2845 17.7539 26.7048 15.177 26.7048 12.2695C26.7048 7.45312 22.8095 3.55078 18.0036 3.55078C13.1977 3.55078 9.30595 7.45312 9.30595 12.2695C9.30595 15.177 10.7263 17.7539 12.913 19.3395C12.8989 19.3465 12.8849 19.35 12.8708 19.357C11.2993 20.0215 9.88954 20.9742 8.67665 22.1906C7.47076 23.3943 6.51072 24.8213 5.85009 26.3918C5.20009 27.9298 4.8493 29.5775 4.81649 31.2469C4.81556 31.2844 4.82214 31.3217 4.83585 31.3567C4.84956 31.3916 4.87013 31.4234 4.89634 31.4503C4.92255 31.4772 4.95388 31.4985 4.98847 31.5131C5.02305 31.5277 5.06021 31.5352 5.09774 31.5352H7.2036C7.35478 31.5352 7.48134 31.4121 7.48485 31.2609C7.55517 28.5469 8.64149 26.0051 10.5645 24.0785C12.5509 22.0852 15.1946 20.9883 18.0071 20.9883C20.0005 20.9883 21.913 21.5402 23.5618 22.5738C23.6042 22.6004 23.6528 22.6154 23.7028 22.6173C23.7528 22.6191 23.8024 22.6078 23.8466 22.5844ZM18.0071 18.3164C16.397 18.3164 14.8817 17.6871 13.7392 16.5445C13.177 15.9838 12.7313 15.3174 12.4278 14.5837C12.1243 13.85 11.969 13.0635 11.9708 12.2695C11.9708 10.6559 12.6001 9.13711 13.7392 7.99453C14.8782 6.85195 16.3934 6.22266 18.0071 6.22266C19.6208 6.22266 21.1325 6.85195 22.2751 7.99453C22.8373 8.55524 23.2829 9.22164 23.5864 9.95534C23.8899 10.689 24.0452 11.4755 24.0434 12.2695C24.0434 13.8832 23.4142 15.402 22.2751 16.5445C21.1325 17.6871 19.6173 18.3164 18.0071 18.3164ZM30.9376 26.6836H27.9845V23.7305C27.9845 23.5758 27.8579 23.4492 27.7032 23.4492H25.7345C25.5798 23.4492 25.4532 23.5758 25.4532 23.7305V26.6836H22.5001C22.3454 26.6836 22.2188 26.8102 22.2188 26.9648V28.9336C22.2188 29.0883 22.3454 29.2148 22.5001 29.2148H25.4532V32.168C25.4532 32.3227 25.5798 32.4492 25.7345 32.4492H27.7032C27.8579 32.4492 27.9845 32.3227 27.9845 32.168V29.2148H30.9376C31.0923 29.2148 31.2188 29.0883 31.2188 28.9336V26.9648C31.2188 26.8102 31.0923 26.6836 30.9376 26.6836Z" fill="white"/>
							</CardLogo>
							<CardDetails>
								<CardTitle>
									Join Meeting
								</CardTitle>
								via invitation link
							</CardDetails>
						</Card>
						<Card bg="#a600ff71">
							<CardLogo width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
								<g clip-path="url(#clip0_1_89)">
									<path d="M24.9609 2C25.3871 2.00006 25.7985 2.15654 26.1171 2.43978C26.4356 2.72302 26.6391 3.11331 26.689 3.53662L26.7011 3.74022V5.48045H30.1816C31.0597 5.48017 31.9054 5.8118 32.5492 6.40885C33.1931 7.0059 33.5875 7.82426 33.6533 8.69986L33.662 8.96089V29.8436C33.6623 30.7216 33.3307 31.5674 32.7336 32.2112C32.1366 32.8551 31.3182 33.2495 30.4426 33.3153L30.1816 33.324H5.81846C4.94038 33.3243 4.09465 32.9927 3.4508 32.3956C2.80695 31.7986 2.41257 30.9802 2.34671 30.1046L2.33801 29.8436V8.96089C2.33773 8.08282 2.66936 7.23708 3.26642 6.59324C3.86347 5.94938 4.68182 5.555 5.55743 5.48915L5.81846 5.48045H9.2989V3.74022C9.2994 3.29668 9.46924 2.87006 9.77372 2.54753C10.0782 2.225 10.4944 2.03092 10.9371 2.00492C11.3799 1.97893 11.8159 2.12299 12.1561 2.40767C12.4962 2.69236 12.7148 3.09617 12.7672 3.53662L12.7794 3.74022V5.48045H23.2207V3.74022C23.2207 3.27869 23.404 2.83605 23.7304 2.5097C24.0567 2.18334 24.4994 2 24.9609 2ZM30.1816 17.662H5.81846V29.8436H30.1816V17.662ZM30.1816 8.96089H5.81846V14.1816H30.1816V8.96089Z" fill="white"/>
								</g>
								<defs>
									<clipPath id="clip0_1_89">
										<rect width="36" height="36" fill="white"/>
									</clipPath>
								</defs>
							</CardLogo>
							<CardDetails>
								<CardTitle>
									Schedule Meeting
								</CardTitle>
								Plan your meeting
							</CardDetails>
						</Card>
						<Card bg="#e5ff0071" >
							<CardLogo  width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M24.4452 23.3074C24.5665 26.0555 22.3486 28.3793 19.4918 28.4961C19.2814 28.505 9.02284 28.4843 9.02284 28.4843C6.17982 28.7001 3.6916 26.6572 3.46735 23.9194C3.45046 23.7154 3.45507 12.7082 3.45507 12.7082C3.32912 9.95717 5.54394 7.62742 8.40233 7.5062C8.61582 7.49586 18.8605 7.51507 18.8605 7.51507C21.7174 7.3022 24.2133 9.35995 24.4345 12.111C24.4498 12.3091 24.4452 23.3074 24.4452 23.3074Z" stroke="white" stroke-width="3.11111" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M24.45 14.9697L29.3895 10.9272C30.6135 9.92519 32.4494 10.7982 32.4479 12.3777L32.43 23.4012C32.4285 24.9807 30.591 25.8462 29.37 24.8442L24.45 20.8017" stroke="white" stroke-width="3.11111" stroke-linecap="round" stroke-linejoin="round"/>
							</CardLogo>
							<CardDetails>
								<CardTitle>
									View Recordings
								</CardTitle>
								Managing recordings
							</CardDetails>
						</Card>

				</Cards>
			{/* <Button onClick={handlesignout}>Logout</Button>
				<Button onClick={handlevideoCall}>VideoCall</Button>	 */}
			</Container>
		</Page>
		</>
	)
}   