import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-weight: bold;
    font-size: 42px;
`;

export default function Loading(){
    return (
        <Wrapper>
            Loading...
        </Wrapper>
    );
}