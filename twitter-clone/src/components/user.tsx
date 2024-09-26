import styled from "styled-components";
import { auth } from "../firebase";

const UserItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;
const UserThumbnail = styled.div`
    width: 55px;
    height: 55px;
    border-radius: 100%;
    border: 1px solid rgba(0,0,0,0.1);
    overflow: hidden;
`;
const UserAvatar = styled.img`
    display: block;
    width: 100%;
    height: 100%;
`;
const UserInfo = styled.div``;
const UserName = styled.strong`
    display: block;
    margin: 0 0 4px;
    font-weight: bold;
    font-size: 14px;
`;
const UserId = styled.span``;
const PostingDate = styled.span`
    padding-left: 7px;
    &::before {
        content: '·';
        margin-right: 7px;
    }
`;

export default function User({ thumbnail, name, email, date } : { thumbnail: string, name: string, email: string, date: string }){
    const user = auth.currentUser;
    const getDate = date === "" ? null : new Date(Number(date));
    const convertNumber = (number: number) => {
        if(number < 10) {
            return `0${number}`;
        } else {
            return number;
        }
    };
    const postingDate = getDate ? `${getDate.getFullYear()}-${convertNumber(getDate.getMonth()+1)}-${convertNumber(getDate.getDate())}` : "";
    return (
        <UserItem className="user">
            <UserThumbnail><UserAvatar src={thumbnail === "" ? user?.photoURL ? user.photoURL : "/defaultProfileImg.png" : thumbnail} /></UserThumbnail>
            <UserInfo>
                <UserName>{ name === "" ? user?.displayName : name }</UserName>
                <UserId className="text-muted">@{ email === "" ? user?.email?.split('@')[0] : email }</UserId>
                {
                    date === "" ? null : <PostingDate className="text-muted">{postingDate}</PostingDate>
                }
            </UserInfo>
        </UserItem>
    );
}