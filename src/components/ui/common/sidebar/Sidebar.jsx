import React from 'react';
import styled from 'styled-components';
import { Link, NavLink, Routes } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faVideo, faGear, faCircleUser } from '@fortawesome/free-solid-svg-icons';

const SidebarContainer = styled("div")`
	width: 100px;
	height: 100vh;
	background: transparent;
	padding: 20px;
	position: fixed;
	left: 0;
	top: 0;
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	&::-webkit-scrollbar {
		display: none;
	}
`;
const SidebarLogo = styled("div")`
	width: 100%;
	height: 80px;
	padding: 0 15px;
	display: flex;
	align-items: center;
`;
const Logo = styled("h1")`
	color: #000;
	font-size: 30px;
	margin: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0 auto;
`;
const SidebarList = styled("div")`
	width: 100%;
	border-radius: 10px;
	box-shadow:
		inset 1px 1px 0 #ffffff7c,
		inset 0 0 5px #ffffff44;
	flex: 1;
	background: #dec9e972;
	overflow-x: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
`;
const List = styled("div")`
	width: 100%;
	align-items: center;	
`;
const ListItem = styled(NavLink)`
	width: 100%;
	height: 60px;
	text-decoration: none;
	display: flex;
	align-items: center;
	color: #000;
	cursor: pointer;

	&.active {
		color: #000;
		background: #6247AA;
	}
`;
const ItemIcon = styled(FontAwesomeIcon)`
	width: 40px;
	height: 25px;
	margin: auto;
	transition: all 0.2s ease-in-out;
	&:hover {
		transform: scale(1.15);
	}
`;
const SidebarProfile = styled(Link)`
	width: 100%;
	height: 70px;
	display: flex;
	align-items: center;
	color: black;
`;
const ProfileIcon = styled(FontAwesomeIcon)`
	width: 40px;
	height: 30px;
	margin: auto;
		transition: all 0.2s ease-in-out;
	&:hover {
		transform: scale(1.15);
	}
`;
export default function Sidebar() {
    return (
        <>
			<SidebarContainer>
				<SidebarList>
					<SidebarLogo>
						<Logo>V</Logo>
					</SidebarLogo>
					<List>
						<ListItem to="/home">
							<ItemIcon icon={faHouse}/>
						</ListItem>
						<ListItem to="/VideoCall">
							<ItemIcon icon={faVideo}/>
						</ListItem>
						<ListItem to="/settings">
							<ItemIcon icon={faGear}/>
						</ListItem>
					</List>
					<SidebarProfile >
						<ProfileIcon icon={faCircleUser}/>
					</SidebarProfile>
				</SidebarList>
			</SidebarContainer>
        </>
    )
}
