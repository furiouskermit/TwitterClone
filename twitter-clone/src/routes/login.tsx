import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth/cordova";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import { ChangeEvent, useState } from "react";
import Modal from "../components/modal/modal";
import ModalResetPassword from "../components/modal/modalResetPassword";
import { Form, FormInput } from "../components/auth-components";
import { FirebaseError } from "firebase/app";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;
const Column = styled.div`
    width: 100%;
    max-width: 370px;
`;
const Title = styled.strong`
    display: block;
    margin: 0 0 40px;
    text-align: center;
    font-weight: bold;
    font-size: 42px;
`;
const AuthProviderLogin = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: var(--bd-rad);
    font-weight: 500;
    position: relative;
    & svg {
        position: absolute;
        width: 20px;
        top: 50%;
        transform: translateY(-50%);
        left: 10px;
    }
`;
const Divider = styled.div`
    margin: 20px 0;
    text-align: center;
    position: relative;
    &::before, &::after {
        content: '';
        position: absolute;
        width: 42%;
        height: 1px;
        top: 50%;
        transform: translateY(-50%);
        background-color: var(--border-color);
    }
    &::before {
        left: 0;
    }
    &::after {
        right: 0;
    }
`;
const Error = styled.div`
    margin: 10px 0 0;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    color: tomato;
`;
const Switcher = styled.div`
    margin: 20px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    & :is(a, button) {
        text-decoration: none;
        color: var(--text-muted);
        position: relative;
        &:hover {
            color: var(--point);
            text-decoration: underline;
        }
        &:last-child:not(:first-child):before {
            content: '';
            position: absolute;
            width: 2px;
            height: 12px;
            top: 50%;
            transform: translateY(-50%);
            left: -12px;
            background-color: var(--border-color);
        }
    }
`;
const ResetPassword = styled.button`
    padding: 0;
    margin: 0;
`;

export default function Login(){
    const [email, setEmail] = useState("");
    const [passowrd, setPassowrd] = useState("");
    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassowrd(value);
        }
    };
    const navigate = useNavigate();
    const githubLogin = async() => {
        try {
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch(e) {
            console.log(e);
        }
    };
    const [isModalOpened, setModalOpened] = useState(false);
    const openModal = async() => {
        setModalOpened(!isModalOpened);
    };
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const onSubmitLogin = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); // reset error message

        if(isLoading) return;

        if(email === "" || passowrd === "") {
            alert(`Please type your ${email === "" ? "email" : "password"}`);
            return;
        };

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, passowrd);
            navigate("/");
        } catch(e) {
            console.log(e);
            if(e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Wrapper>
            <Column>
                <Title>Login</Title>
            </Column>
            <Column>
                <AuthProviderLogin onClick={githubLogin}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"></path></svg>
                    Continue with Github
                </AuthProviderLogin>
            </Column>
            <Column>
                <Divider>or</Divider>
                <Form onSubmit={onSubmitLogin}>
                    <FormInput type="email" name="email" onChange={onChangeValue} value={email} placeholder="Email" />
                    <FormInput type="password" name="password" onChange={onChangeValue} value={passowrd} placeholder="Password" />
                    <FormInput type="submit" className="bg-point" />
                </Form>
                {
                    error === "" ? null : <Error>{error}</Error>
                }
                <Switcher>
                    <Link to="signup">Sign Up</Link>
                    <ResetPassword onClick={openModal}>Forgot Password</ResetPassword>
                </Switcher>
            </Column>

            {
                isModalOpened ? <Modal clickEvent={openModal} modalTitle="Reset Password"><ModalResetPassword></ModalResetPassword></Modal> : null
            }
        </Wrapper>
    );
}