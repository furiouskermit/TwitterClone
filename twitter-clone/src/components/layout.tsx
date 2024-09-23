import { signOut } from "firebase/auth";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";

const Wrapper = styled.div`
    display: flex;
    gap: 20px;
`;
const Nav = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;
const Column = styled.div``;
const Logo = styled.img`
    width: 100px;
`;
const Menu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const MenuItem = styled.button`
    text-transform: uppercase;
`;

export default function Layout(){
    const navigate = useNavigate();
    const logOut = async() => {
        const confirmText = confirm("Are you sure you want to log out?");
        if(confirmText) {
            await signOut(auth);
            navigate("/login");
        }
    }
    return (
        <Wrapper>
            <Nav>
                <Column>
                    <Link to="/"><Logo src="/logo.png" /></Link>
                    <Menu>
                        <Link to="/">
                            <MenuItem>home</MenuItem>
                        </Link>
                        <Link to="/screenshots">
                            <MenuItem>screenshots</MenuItem>
                        </Link>
                        <Link to="/spoilers">
                            <MenuItem>spoilers</MenuItem>
                        </Link>
                        <Link to="/tips">
                            <MenuItem>tips</MenuItem>
                        </Link>
                        <Link to="/profile">
                            <MenuItem>profile</MenuItem>
                        </Link>
                    </Menu>
                </Column>
                <Column>
                    <MenuItem onClick={logOut}>Logout</MenuItem>
                </Column>
            </Nav>

            <Outlet />
        </Wrapper>
    );
}