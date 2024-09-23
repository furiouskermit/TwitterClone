import styled from "styled-components";
import { Form, FormInput } from "../auth-components";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";

const Wrapper = styled.div``;

export default function ModalResetPassword(){
    const [email, setEmail] = useState("");
    const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const resetPassword = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if(email === "") {
                alert("Please type your email.");
                return;
            }

            await sendPasswordResetEmail(auth, email);
            alert("Password reset email is sent!");
        } catch(e) {
            console.log(e);
        }
    };
    return (
        <Wrapper>
            <Form onSubmit={resetPassword}>
                <FormInput type="email" name="email" onChange={onChangeValue} value={email} placeholder="email" />
                <FormInput type="submit" value="Send email" className="bg-point" />
            </Form>
        </Wrapper>
    );
}