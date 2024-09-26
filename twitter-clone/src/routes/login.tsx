import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import { ChangeEvent, useState } from "react";
import Modal from "../components/modal/modal";
import ModalResetPassword from "../components/modal/modalResetPassword";
import { Column, Divider, Error, Form, FormInput, Switcher, Title, Wrapper } from "../css/auth-components";
import { FirebaseError } from "firebase/app";
import GithubLogin from "../components/githubLogin";

const ResetPassword = styled.button`
    padding: 0;
    margin: 0;
`;

export default function Login(){
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [passowrd, setPassowrd] = useState("");
    const [isModalOpened, setModalOpened] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassowrd(value);
        }
    };
    const openModal = async() => {
        setModalOpened(!isModalOpened);
    };
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
                <Title>Log In</Title>
            </Column>
            <Column>
                <GithubLogin text="Continue with Github" />
            </Column>
            <Column>
                <Divider>or</Divider>
                <Form onSubmit={onSubmitLogin}>
                    <FormInput type="email" name="email" onChange={onChangeValue} value={email} placeholder="Email" />
                    <FormInput type="password" name="password" onChange={onChangeValue} value={passowrd} placeholder="Password" />
                    <FormInput type="submit" value={isLoading ? "Loading..." : "Log In"} className="bg-point" />
                </Form>
                {
                    error === "" ? null : <Error>{error}</Error>
                }
                <Switcher>
                    <Link to="/signup">Sign Up</Link>
                    <ResetPassword onClick={openModal}>Forgot Password</ResetPassword>
                </Switcher>
            </Column>

            {
                isModalOpened ? <Modal clickEvent={openModal} modalTitle="Reset Password"><ModalResetPassword></ModalResetPassword></Modal> : null
            }
        </Wrapper>
    );
}