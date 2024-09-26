import styled from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;
export const Column = styled.div`
    width: 100%;
    max-width: 370px;
`;
export const Title = styled.strong`
    display: block;
    margin: 0 0 40px;
    text-align: center;
    font-weight: bold;
    font-size: 42px;
`;
export const Divider = styled.div`
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
export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 7px;
`;
export const FormInput = styled.input`
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: var(--bd-rad);
    font-size: 15px;
    &[type="submit"] {
        border-color: var(--point);
    }
`;
export const Error = styled.div`
    margin: 10px 0 0;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    color: tomato;
`;
export const Switcher = styled.div`
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