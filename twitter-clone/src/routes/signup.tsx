import styled from "styled-components";
import { Column, Divider, Error, Form, FormInput, Switcher, Title, Wrapper } from "../css/auth-components";
import GithubLogin from "../components/githubLogin";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";

const SwitcherSpan = styled.span`
    color: var(--text-muted);
    & :is(a, button) {
        margin-left: 6px;
        /* color: var(--point); */
        font-weight: bold;
    }
`;

export default function Signup(){
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if(name === "name") {
            setName(value);
        } else if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassword(value);
        }
    }
    const onSubmitForm = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(isLoading) return;

        if(email === "" || password === "") {
            alert(`Please type ${email === "" ? "email" : "password"}`);
            return;
        };

        setLoading(true);

        try {
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(credentials.user, {
                displayName: name === "" ? "Anonymous" : name
            });
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
                <Title>Sign Up</Title>
            </Column>
            <Column>
                <GithubLogin text="Sign up with Github" />
            </Column>
            <Column>
                <Divider>or</Divider>
                <Form onSubmit={onSubmitForm}>
                    <FormInput type="text" name="name" onChange={onChangeValue} value={name} placeholder="Name" />
                    <FormInput type="email" name="email" onChange={onChangeValue} value={email} placeholder="Email" required />
                    <FormInput type="password" name="password" onChange={onChangeValue} value={password} placeholder="password" required />
                    <FormInput type="submit" value={isLoading ? "Loading..." : "Join"} className="bg-point" />
                </Form>
                {
                    error === "" ? null : <Error>{error}</Error>
                }
                <Switcher>
                    <SwitcherSpan>
                        Already have an account? <Link to="/login">Log In</Link>
                    </SwitcherSpan>
                </Switcher>
            </Column>
        </Wrapper>
    );
}