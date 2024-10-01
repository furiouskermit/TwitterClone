import styled from "styled-components";
import { auth } from "../firebase";
import { useState } from "react";
import { UserAvatar, UserId, UserInfo, UserItem, UserName, UserThumbnail } from "../css/user-components";

const PostingDate = styled.span`
    padding-left: 7px;
    &::before {
        content: '·';
        margin-right: 7px;
    }
`;

export default function User(props:any){
    const { thumbnail, name, email, date } = props;
    const user = auth.currentUser;

    const [userThumbnail, setThumbnail] = useState(thumbnail);
    const [userName, setUserName] = useState(name);

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
            <UserThumbnail><UserAvatar src={userThumbnail === "" ? "/profile/user/UserImg01.png" : userThumbnail} /></UserThumbnail>
            <UserInfo>
                <UserName>{ userName === "" ? "Anonymous" : userName }</UserName>
                <UserId className="text-muted">@{ email === "" ? user?.email?.split('@')[0] : email }</UserId>
                {
                    date === "" ? null : <PostingDate className="text-muted">{postingDate}</PostingDate>
                }
            </UserInfo>
        </UserItem>
    );
}