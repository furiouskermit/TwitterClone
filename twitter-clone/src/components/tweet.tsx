import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { BtnArea, DeleteTweetImg, EditArea, EditAreaBtn, FileArea, FileInput, FileLabel, LikedNumber, PostForm, PostTweet, PostTweetBtn, PostTweetImg, TweetImg, TweetsActionBtn, TweetsBody, TweetsFooter, TweetsHeader } from "../css/tweet-components";

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
const Tweets = styled.div`
    padding: 20px;
    border: 1px solid var(--border-color);
    border-radius: 20px;
    @media (max-width: 768px) {
        border: none;
        border-radius: 0px;
    }
`;
const TweetsContent = styled.div`
    padding: 10px 10px 0;
    line-height: 1.45em;
    white-space: pre-wrap;
    font-size: 16px;
`;
const TweetsImg = styled.img`
    display: block;
    width: 100%;
    margin: 10px 0;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 20px;
`;

export default function Tweet(props: any){
    const { id, tweet, userId, photo, liked } = props
    const user = auth.currentUser;
    const [isLoading, setLoading] = useState(false);
    const [isClicked, setClicked] = useState(false);
    const [isLiked, setLiked] = useState(false);
    const [newTweet, setNewTweeet] = useState("");
    const [newFile, setNewFile] = useState<(File | string) | null>(photo ? photo : null);
    const editTweet = async() => {
        setClicked(true);
    };
    const deleteTweet = async() => {
        const confirmText = confirm("Are you sure you want to delete this tweet?");
        if(!confirmText) return;

        try {
            await deleteDoc(doc(db, "tweets", id))
            if(newFile) {
                const photoRef = ref(storage, `tweets/${user?.uid}/${id}`);
                await deleteObject(photoRef);
            }
        } catch(e) {
            console.log(e);
        }
    };
    const changeLiked = async(type: string) => {
        if(!user) return;
        setLiked(!isLiked);
        const docs = doc(db, "tweets", id);
        await updateDoc(docs, {
            liked: type === "liked" ? arrayRemove(user.uid) : arrayUnion(user.uid)
        });

        if(Object.keys(props).length > 0 && props.changeBoard) {
            const docQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt", "desc"),
                where("userId", "==", user.uid)
            );
            const updatedDoc = await getDocs(docQuery);
            const docData = updatedDoc.docs.map((doc) => {
                const { tweets, photo, createdAt, userId, username, userThumbnail, userEmail, liked } = doc.data();
                return {
                    id: doc.id,
                    tweets,
                    photo,
                    createdAt,
                    userId,
                    username,
                    userThumbnail,
                    userEmail,
                    liked,
                }
            });
            props.changeBoard(docData);
        }
    };
    const changeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewTweeet(e.target.value);
    };
    const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        const maximumSize = 1024 ** 2 * 10; // 10MB
        if(files && files.length === 1) {
            if(files[0].size > maximumSize) {
                alert("The maximum size of the file should be lower than 10MB!");
                return;
            }
            setNewFile(files[0]);
        }
    };
    const deleteFile = async () => {
        try {
            if(typeof(newFile) === "string") {
                const photoRef = ref(storage, `tweets/${user?.uid}/${id}`);
                await deleteObject(photoRef);
            }
        } catch(e) {
            console.log(e);
        } finally {
            setNewFile(null);
        }
    };
    const submitEdit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(isLoading) return;

        try {
            setLoading(true);

            const docRef = doc(db, "tweets", id);

            let locationRef = null;
            let result = null;
            let url = null;
            if(newFile) {
                if(typeof(newFile) !== "string") {
                    locationRef = ref(storage, `tweets/${user?.uid}/${id}`);
                    result = await uploadBytes(locationRef, newFile);
                    url = await getDownloadURL(result.ref);
                } else {
                    url = newFile;
                }
            }

            await updateDoc(docRef, {
                tweet: newTweet,
                photo: url
            });
        } catch(e) {
            console.log(e);
        } finally {
            setLoading(false);
            setClicked(false);
        }
    };

    return (
        <Wrapper>
            <Tweets>
                <TweetsHeader>
                    { props.children }
                    {
                        (!isClicked && user?.uid === userId) ?
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
                </TweetsHeader>
                {
                    !isClicked ?
                    <>
                        <TweetsBody>
                            <TweetsContent>{tweet}</TweetsContent>
                            {
                                photo ? <TweetsImg src={photo} /> : null
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
                        </TweetsFooter>
                    </>
                    : <>
                        <PostForm onSubmit={submitEdit}>
                            <PostTweet defaultValue={tweet} onChange={changeValue} placeholder="What is happening?"></PostTweet>
                            {
                                newFile ? 
                                <PostTweetImg>
                                    <TweetImg src={typeof(newFile) === "string" ? newFile : URL.createObjectURL(newFile)} />
                                    <DeleteTweetImg type="button" onClick={deleteFile} className="bg-secondary-lighten">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </DeleteTweetImg>
                                </PostTweetImg>
                                : null
                            }
                            <BtnArea>
                                <FileArea>
                                    <FileInput type="file" name="file" id={`file-${id}`} onChange={changeFile} accept="image/*" />
                                    <FileLabel htmlFor={`file-${id}`} className="bg-point-lighten">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                    </FileLabel>
                                </FileArea>
                                <PostTweetBtn type="submit" value={isLoading ? "Loading..." : "Edit"} className="bg-point" />
                            </BtnArea>
                        </PostForm>
                    </>
                }
            </Tweets>
        </Wrapper>
    );
}