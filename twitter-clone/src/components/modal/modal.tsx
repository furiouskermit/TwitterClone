import styled from "styled-components";

const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 990;
`;
const ModalBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.45);
    z-index: 991;
`;
const ModalContent = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    border-radius: var(--bd-rad);
    width: 100%;
    max-width: 400px;
    z-index: 992;
    position: relative;
`;
const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 10px;
`;
const ModalTitle = styled.strong`
    font-weight: bold;
    font-size: 20px;
`;
const CloseModalButton = styled.button`
    border-radius: var(--bd-rad);
    transition: 0.1s;
    &:hover {
        background-color: var(--border-color);
    }
    & svg {
        width: 25px;
        color: var(--text-muted);
    }
`;

export default function Modal({ children, clickEvent, modalTitle }: { children: React.ReactNode, clickEvent: ()=>{}, modalTitle: string}){
    return (
        <Wrapper>
            <ModalBackground onClick={clickEvent}></ModalBackground>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>{modalTitle}</ModalTitle>
                    <CloseModalButton onClick={clickEvent}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg></CloseModalButton>
                </ModalHeader>
                { children }
            </ModalContent>
        </Wrapper>
    );
}