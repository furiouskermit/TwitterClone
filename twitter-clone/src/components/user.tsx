import { auth } from "../firebase";
import { useState } from "react";
import { PostingDate, UserAvatar, UserId, UserInfo, UserItem, UserName, UserThumbnail } from "../css/user-components";

export default function User(props:any){
    const { thumbnail, name, email, date } = props;
    const user = auth.currentUser;

    const [userThumbnail] = useState(thumbnail);
    const [userName] = useState(name);

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