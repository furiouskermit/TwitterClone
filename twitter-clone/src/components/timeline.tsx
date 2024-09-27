import styled from "styled-components";
import { collection, limit, onSnapshot, orderBy, query, Unsubscribe } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import Tweet from "./tweet";

const Wrapper = styled.div`
    margin: 30px 0 0;
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
    const [tweets, setTweets] = useState<TweetInterface[]>([]);
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
                        username,
                        userEmail,
                        userThumbnail,
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
    
    return (
        <Wrapper>
            {
                tweets.map((tweet) => <Tweet key={tweet.id} {...tweet} />)
            }
        </Wrapper>
    );
}