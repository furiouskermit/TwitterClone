import styled from "styled-components";
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, Unsubscribe, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import Tweet from "./tweet";
import { changeOutletContext } from "./layout";
import { PostingDate, UserAvatar, UserId, UserInfo, UserItem, UserName, UserThumbnail } from "../css/user-components";
import { convertDateYYYYMMDD } from "../utils/helpers";

const Wrapper = styled.div`
    margin: 30px 0 0;
    @media (max-width: 768px) {
        margin: 0;
    }
`;

export interface TweetInterface {
    id: string,
    createdAt: number,
    tweet: string,
    userId: string,
    username: string,
    userEmail: string,
    userThumbnail: string,
    liked: Array<string>,
    photo?: string
};

export default function Timeline(){
    const user = auth.currentUser;
    const [tweets, setTweets] = useState<TweetInterface[]>([]);
    const { globalUserInfo } = changeOutletContext();

    useEffect(()=>{
        let unsubscribe: Unsubscribe | null = null;
        const fetchTweet = async() => {
            const tweetQuery = query(
                collection(db, 'tweets'),
                orderBy("createdAt", "desc"),
                limit(15),
            );
            unsubscribe = await onSnapshot(tweetQuery, (snapshot) => {
                const tweetSnapshot = snapshot.docs.map((doc) => {
                    const { tweet, createdAt, userId, username, userEmail, userThumbnail, photo, liked } = doc.data();
                    return {
                        tweet,
                        createdAt,
                        userId,
                        username: userId === user?.uid ? globalUserInfo.displayName : username,
                        userEmail,
                        userThumbnail: userId === user?.uid ? globalUserInfo.photoURL : userThumbnail,
                        photo,
                        liked,
                        id: doc.id
                    };
                });
                setTweets(tweetSnapshot);
            });
        };
        fetchTweet();
        
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);

    useEffect(()=>{
        if(tweets.length > 0) {
            // if each info in "user" docs is not equal to user info in "tweets" documents,
            // update user info in "tweets" doc
            tweets.forEach(async (item) => {
                const docRef = doc(db, "users", item.userId);
                const userDoc = await getDoc(docRef);
                const userData = userDoc.data();
                if(userData) {
                    if(item.username !== userData.displayName || item.userThumbnail !== userData.photoURL) {
                        await updateDoc(doc(db, "tweets", item.id), {
                            ...(item.username !== userData.displayName && {
                                username: userData.displayName
                            }),
                            ...(item.userThumbnail !== userData.photoURL && {
                                userThumbnail: userData.photoURL
                            }),
                        })
                    }
                }
            })
        }
    }, [tweets])
    
    return (
        <Wrapper>
            {
                tweets.map((tweet) =>
                <Tweet key={tweet.id} {...tweet}>
                    <UserItem className="user">
                        <UserThumbnail><UserAvatar src={tweet.userThumbnail === "" ? "/profile/user/UserImg01.png" : tweet.userThumbnail} /></UserThumbnail>
                        <UserInfo>
                            <UserName>{tweet.username === "" ? "Anonymous" : tweet.username}</UserName>
                            <UserId className="text-muted">@{tweet.userEmail}</UserId>
                            <PostingDate className="text-muted">{convertDateYYYYMMDD(tweet.createdAt)}</PostingDate>
                        </UserInfo>
                    </UserItem>
                </Tweet>)
            }
        </Wrapper>
    );
}