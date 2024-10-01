import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 60px;
    color: var(--text-muted);
`;

export default function Temporary(){
    return (
        <Wrapper>
            STILL WORKING 😂...
        </Wrapper>
    );
}