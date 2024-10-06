import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    font-weight: bold;
    font-size: 36px;
    color: var(--text-muted);
`;

export default function NoPost(){
    return (
        <Wrapper>No Posts Yet 😂</Wrapper>
    );
}