import styled from "styled-components";

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