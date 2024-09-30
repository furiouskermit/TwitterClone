import styled from "styled-components";

export const ProfileImgList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    justify-content: center;
    gap: 15px 7px;
    margin: 0 0 20px;
    padding: 5px 0 0;
`;
export const ProfileImgItem = styled.div``;
export const ProfileImgItemInput = styled.input`
    display: none;
    &:hover + label,
    &:checked + label {
        &::before {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: rgba(var(--point-rgb), 0.5);
            z-index: 5;
        }
        & img {
            filter: blur(1px);
        }
        & svg {
            display: block;
        }
    }
`;
export const ProfileImgItemLabel = styled.label`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    border-radius: 100%;
    border: 1px solid var(--border-color);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    &::before {
        content: '';
        transition: 0.1s;
    }
    & svg {
        width: 40px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        z-index: 10;
        display: none;
    }
`;
export const ProfileImgItemImg = styled.img`
    width: 80%;
`;