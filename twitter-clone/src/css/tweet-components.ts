import styled from "styled-components";

export const PostForm = styled.form``;
export const PostTweet = styled.textarea`
    display: block;
    width: 100%;
    height: 120px;
    margin: 10px 0;
    padding: 10px;
    border: none;
    line-height: 1.45em;
    font-size: 16px;
    &:focus {
        outline: none;
    }
`;
export const PostTweetImg = styled.div`
    margin: 0 0 10px;
    position: relative;
`;
export const TweetImg = styled.img`
    width: 100%;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 20px;
`;
export const DeleteTweetImg = styled.button`
    position: absolute;
    top: -15px;
    right: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    & svg {
        width: 20px;
    }
`;
export const BtnArea = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
export const FileArea = styled.div``;
export const FileInput = styled.input`
    display: none;
`;
export const FileLabel = styled.label`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    cursor: pointer;
    & svg {
        width: 20px;
    }
`;
export const PostTweetBtn = styled.input`
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 35px;
    border: none;
    border-radius: 50px;
`;

export const TweetsHeader = styled.div``;
export const TweetsBody = styled.div`
    margin: 10px 0 0;
`;
export const TweetsFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0 0;
`;
export const TweetsActionBtn = styled.button`
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    & svg {
        width: 18px;
        &.liked {
            color: tomato;
        }
    }
`;
export const LikedNumber = styled.span``;
export const EditArea = styled.div`
    display: flex;
    align-items: center;
    gap: 7px;
`;
export const EditAreaBtn = styled.button`
    padding: 7px;
    border-radius: var(--bd-rad);
    transition: 0.1s;
    &:hover {
        background-color: var(--border-color);
    }
    & svg {
        width: 18px;
        color: var(--text-muted);
    }
`;

export const TextMaxLength = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    font-weight: normal;
    font-size: 13px;
    color: var(--text-muted);
`;
export const InfoText = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 2px;
    line-height: 1.3em;
    font-size: 13px;
    color: var(--text-muted);
    & svg {
        width: 18px;
    }
`;