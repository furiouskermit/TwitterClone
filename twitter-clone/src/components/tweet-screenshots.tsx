import styled from "styled-components";
import { EditArea, EditAreaBtn, LikedNumber, TweetsActionBtn, TweetsBody, TweetsFooter, TweetsHeader } from "../css/tweet-components";
import { auth, db, storage } from "../firebase";
import { useState } from "react";
import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore";
import PostScreenshotsForm from "./post-screenshots-form";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
    &:not(:last-child) {
        margin: 0 0 15px;
    }
    @media (max-width: 768px) {
        &:not(:last-child) {
            margin: 0;
            border-bottom: 1px solid var(--border-color);
        }   
    }
`;
const Screenshots = styled.div`
    padding: 20px;
    border: 1px solid var(--border-color);
    border-radius: 14px;
    @media (max-width: 768px) {
        border: none;
        border-radius: 0px;
    }
`;
const ScreenshotImg = styled.img`
    border-radius: 14px;
`;
const ScreenshotComment = styled.p`
    margin: 10px 0 0;
    padding: 0 10px;
    white-space: pre-wrap;
    font-weight: bold;
    font-size: 20px;
`;
const ScreenshotHashtag = styled.div`
    margin: 12px 0 0;
`;
const Hashtag = styled.span`
    display: inline-block;
    margin-right: 4px;
    padding: 6px 8px;
    border-radius: 100px;
    background-color: rgba(var(--point-rgb), 0.1);
    font-size: 13px;
    color: var(--point);
`;

export default function TweetScreenshots(props: any){
    const user = auth.currentUser;
    const { userId, id, photo, comment, hashtag, liked } = props;

    const [isClicked, setClicked] = useState(false);
    const [isLiked, setLiked] = useState(false);

    const editTweet = async() => {
        setClicked(true);
    };
    const deleteTweet = async() => {
        setClicked(true);
        
        const confirmText = confirm("Are you sure you want to delete post?");
        if(!user || !confirmText) return;

        try {
            await deleteDoc(doc(db, "screenshots", id));

            const photoRef = ref(storage, `screenshots/${user.uid}/${id}`);
            await deleteObject(photoRef);
            
            if(Object.keys(props).length > 0 && props.changeBoardStatus) {
                props.changeBoardStatus();
            }
        } catch(e) {
            console.log(e);
        }
    };
    const changeLiked = async(status: string) => {
        if(!user) return;
        setLiked(!isLiked);
        const docRef = doc(db, "screenshots", id);
        await updateDoc(docRef, {
            liked: status === "liked" ? arrayRemove(user.uid) : arrayUnion(user.uid)
        })

        if(Object.keys(props).length > 0 && props.changeBoardStatus) {
            props.changeBoardStatus();
        }
    };
    const sendParentToChildEvent = () => {
        setClicked(!isClicked);
    };

    return (
        <Wrapper>
            <Screenshots>
                <TweetsHeader>
                    { props.children }
                </TweetsHeader>
                {
                    !isClicked ?
                    <>
                        <TweetsBody>
                            <ScreenshotImg src={photo} className="w-100" />
                            {
                                comment !== "" ?
                                <ScreenshotComment>{ comment }</ScreenshotComment>
                                : null
                            }
                            {
                                hashtag && hashtag.length > 0 ? 
                                <ScreenshotHashtag>
                                    {
                                        hashtag.map((item: string, index: number) => item !== "" ? <Hashtag key={`${id}_${item}_${index}`}>#{item}</Hashtag> : null)
                                    }
                                </ScreenshotHashtag>
                                : null
                            }
                        </TweetsBody>
                        <TweetsFooter>
                            <TweetsActionBtn type="button" onClick={() => changeLiked(isLiked ? "liked" : "unliked")}>
                                    {
                                        user != null && liked.includes(user.uid) ?
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 liked">
                                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                    }
                                    <LikedNumber className="text-muted">{ liked ? liked.length : 0 }</LikedNumber>
                                </TweetsActionBtn>
                                {
                                    !isClicked && (user?.uid === userId) ?
                                    <EditArea>
                                        <EditAreaBtn className="btnEdit" onClick={editTweet}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                            </svg>
                                        </EditAreaBtn>
                                        <EditAreaBtn className="btnDelete" onClick={deleteTweet}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </EditAreaBtn>
                                    </EditArea>
                                    : null
                                }
                        </TweetsFooter>
                    </>
                    : <PostScreenshotsForm {...props} clickEvent={sendParentToChildEvent} />
                }
            </Screenshots>
        </Wrapper>
    );
}