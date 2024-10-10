import styled from "styled-components";

export const UserItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    @media (max-width: 768px) {
        gap: 6px;
    }
`;
export const UserThumbnail = styled.div`
    width: 55px;
    height: 55px;
    border-radius: 100%;
    border: 1px solid rgba(0,0,0,0.1);
    overflow: hidden;
    @media (max-width: 768px) {
        width: 45px;
        height: 45px;
    }
   
`;
export const UserAvatar = styled.img`
    display: block;
    width: 100%;
    height: 100%;
`;
export const UserInfo = styled.div``;
export const UserName = styled.strong`
    display: block;
    margin: 0 0 4px;
    font-weight: bold;
    font-size: 14px;
`;
export const UserId = styled.span`
    font-size: 13px;
`;
export const PostingDate = styled.span`
    padding-left: 7px;
    font-size: 13px;
    &::before {
        content: '·';
        margin-right: 7px;
    }
    @media (max-width: 768px) {
        padding-left: 4px;
        &::before {
            margin-right: 4px;
        }
    }
`;