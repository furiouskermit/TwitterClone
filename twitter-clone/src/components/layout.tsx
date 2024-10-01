import { signOut } from "firebase/auth";
import { Link, Outlet, useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { auth, db } from "../firebase";
import User from "./user";
import { useEffect, useState } from "react";
import { updateUser } from "../utils/helpers";
import { UserAvatar, UserId, UserInfo, UserItem, UserName, UserThumbnail } from "../css/user-components";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 4fr;
    gap: 20px;
    max-width: 1150px;
    height: 100vh;
    margin: 0 auto;
    padding: 20px;
    overflow: hidden;
`;
const Nav = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 40px);
    padding: 20px;
    background-color: #fafbfc;
    border-radius: 20px;
`;
const Column = styled.div`
    & > a {
        display: block;
        text-align: center;
    }
    & .user {
        margin: 15px 0 25px;
        padding: 15px 0 0;
        border-top: 2px dotted var(--border-color);
    }
`;
const Logo = styled.img`
    width: 100px;
`;
const Menu = styled.div`
    display: flex;
    flex-direction: column;
    & > a {
        width: 100%;
        text-decoration: none;
    }
`;
const MenuItem = styled.button`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 15px 7px;
    background-color: inherit;
    border-radius: var(--bd-rad);
    text-transform: uppercase;
    font-weight: bold;
    color: var(--text-muted);
    &:hover {
        background-color: #eaebec;
        color: #333;
    }
    & svg {
        width: 20px;
    }
`;

type ContextType = { changeUserInfo: (item: any)=>void, globalUserInfo: any };

export default function Layout(){
    const user = auth.currentUser;
    const navigate = useNavigate();
    const [globalUserInfo, setUserInfo] = useState({
        displayName: user?.displayName,
        photoURL: user?.photoURL
    });
    const logOut = async() => {
        const confirmText = confirm("Are you sure you want to log out?");
        if(confirmText) {
            await signOut(auth);
            navigate("/login");
        }
    };

    useEffect(()=>{
        if(user) {
            // update user info in "users" collection
            updateUser(user, "users");
        }
    }, []);

    const changeUserInfo = (item: any) => {
        setUserInfo(item);
    }

    return (
        <Wrapper>
            <Nav>
                <Column>
                    <Link to="/"><Logo src="/logo.png" /></Link>
                    <UserItem className="user">
                        <UserThumbnail><UserAvatar src={globalUserInfo?.photoURL ?? "/profile/user/UserImg01.png"} /></UserThumbnail>
                        <UserInfo>
                            <UserName>{ globalUserInfo.displayName ?? "Anonymous" }</UserName>
                            <UserId className="text-muted">@{ user?.email?.split('@')[0] }</UserId>
                        </UserInfo>
                    </UserItem>
                    <Menu>
                        <Link to="/">
                            <MenuItem>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                home
                            </MenuItem>
                        </Link>
                        <Link to="/screenshots">
                            <MenuItem>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                                screenshots
                            </MenuItem>
                        </Link>
                        <Link to="/spoilers">
                            <MenuItem>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                </svg>
                                spoilers
                            </MenuItem>
                        </Link>
                        <Link to="/tips">
                            <MenuItem>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                </svg>
                                tips
                            </MenuItem>
                        </Link>
                        <Link to="/profile">
                            <MenuItem>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                profile
                            </MenuItem>
                        </Link>
                    </Menu>
                </Column>
                <Column>
                    <MenuItem onClick={logOut}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                        </svg>
                        logout
                    </MenuItem>
                </Column>
            </Nav>

            <Outlet context={{changeUserInfo, globalUserInfo} satisfies ContextType} />
        </Wrapper>
    );
}

export function changeOutletContext() {
    return useOutletContext<ContextType>();
}