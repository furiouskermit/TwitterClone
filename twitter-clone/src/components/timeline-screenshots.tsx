import { Unsubscribe, collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { PostingDate, UserAvatar, UserId, UserInfo, UserItem, UserName, UserThumbnail } from "../css/user-components";
import { changeOutletContext } from "./layout";
import { convertDateYYYYMMDD } from "../utils/helpers";
import TweetScreenshots from "./tweet-screenshots";

const Wrapper = styled.div``;

export interface screenshotInterface {
    id: string,
    userThumbnail: string,
    createdAt: string,
    comment: string,
    hashtag: Array<string>,
    liked: Array<string>,
    photo: string,
    userEmail: string,
    userId: string,
    username: string,
}

export default function TimelineScreenshots(){
    const user = auth.currentUser;

    const [screenshots, setScreenshots] = useState<screenshotInterface[]>([]);
    const { globalUserInfo } = changeOutletContext();
        
    useEffect(()=>{
        if(!user) return;

        let unsubscribe: Unsubscribe | null = null;
        const fetchScreenshots = async() => {
            const screenshotQuery = query(
                collection(db, "screenshots"),
                orderBy("createdAt", "desc"),
                limit(15)
            );
            unsubscribe = await onSnapshot(screenshotQuery, (snapshot) => {
                const screenshotSnapshot = snapshot.docs.map((doc) => {
                    const { createdAt, userThumbnail, comment, hashtag, liked, photo, userEmail, userId, username } = doc.data();
                    return {
                        createdAt,
                        userId,
                        userEmail,
                        userThumbnail: userId === user.uid ? globalUserInfo.photoURL : userThumbnail,
                        username: username === user.displayName ? globalUserInfo.displayName : username,
                        comment,
                        hashtag,
                        liked,
                        photo,
                        id: doc.id,
                    };
                });
                setScreenshots(screenshotSnapshot);
            });
        };
        fetchScreenshots();
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);
    return (
        <Wrapper>
            {
                screenshots.map((screenshot) => 
                    <TweetScreenshots key={screenshot.id} {...screenshot}>
                        <UserItem className="user">
                            <UserThumbnail><UserAvatar src={screenshot.userThumbnail === "" ? "/profile/user/UserImg01.png" : screenshot.userThumbnail} /></UserThumbnail>
                            <UserInfo>
                                <UserName>{screenshot.username === "" ? "Anonymous" : screenshot.username}</UserName>
                                <UserId className="text-muted">@{screenshot.userEmail}</UserId>
                                <PostingDate className="text-muted">{convertDateYYYYMMDD(screenshot.createdAt)}</PostingDate>
                            </UserInfo>
                        </UserItem>
                    </TweetScreenshots>
                )
            }
        </Wrapper>
    );
}