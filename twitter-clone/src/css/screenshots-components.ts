import styled from "styled-components";

export const PostScreenshots = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 20px 0 0;
    @media (max-width: 768px) {
        display: block;
    }
`;
export const PostFormBox = styled.div`
        @media (max-width: 768px) {
            &:not(:last-child) {
                margin: 0 0 15px;
            }
        }
`;
export const PostFormItem = styled.div`
    @media (max-width: 768px) {
        &:not(:last-child) {
            margin: 0 0 10px;
        }
    }
`;
export const PostFormItemTitle = styled.div`
    margin: 0 0 5px;
    font-weight: bold;
`;
export const PostFormItemContent = styled.div`
    position: relative;
    & .text-max-length {
        right: 15px;
    }
`;
export const ScreenshotImg = styled.img`
    border-radius: 14px;
    border: 1px solid rgba(0,0,0,0.02);
`;
export const PostScreenshotsFile = styled.div``;
export const PostScreenshotsFileInput = styled.input``;
export const PostScreenshotsFileLabel = styled.label`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 200px;
    background-color: var(--border-color);
    border-radius: 14px;
    transition: 0.1s;
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }
    & svg {
        width: 40px;
        color: var(--text-muted);
    }
    @media (max-width: 768px) {
        height: 130px;
        & svg {
            width: 30px;
        }
    }
`;
export const PostScreenshotInput = styled.input`
    display: block;
    width: 100%;
    padding: 7px 15px;
    border: 1px solid var(--border-color);
    border-radius: 100px;
    margin: 0 0 4px;
    &[name="comment"] {
        padding-right: 55px;
    }
`;