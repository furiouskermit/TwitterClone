import styled from "styled-components";

export const UserItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;
export const UserThumbnail = styled.div`
    width: 55px;
    height: 55px;
    border-radius: 100%;
    border: 1px solid rgba(0,0,0,0.1);
    overflow: hidden;
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
export const UserId = styled.span``;