import styled from "styled-components";
import User from "./user";
import { TweetInterface } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { BtnArea, DeleteTweetImg, FileArea, FileInput, FileLabel, PostForm, PostTweet, PostTweetBtn, PostTweetImg, TweetImg } from "../css/tweet-components";

const Wrapper = styled.div`
    &:not(:last-child) {
        margin: 0 0 15px;
    }
`;
const Tweets = styled.div`
    padding: 20px;
    border: 1px solid var(--border-color);
    border-radius: 20px;
`;

const TweetsHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
const EditArea = styled.div`
    display: flex;
    align-items: center;
    gap: 7px;
`;
const EditAreaBtn = styled.button`
    padding: 7px;
    border-radius: var(--bd-rad);
    transition: 0.1s;
    &:hover {
        background-color: var(--border-color);
    }
    & svg {
        width: 20px;
        color: var(--text-muted);
    }
`;

const TweetsBody = styled.div`
    margin: 10px 0 0;
`;
const TweetsContent = styled.div`
    padding: 10px;
    line-height: 1.45em;
    white-space: pre-wrap;
    font-size: 16px;
`;
const TweetsImg = styled.img`
    display: block;
    width: 100%;
    margin: 10px 0 0;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 20px;
`;

export default function Tweet({ id, tweet, createdAt, userId, username, userEmail, userThumbnail, photo }: TweetInterface){
    const user = auth.currentUser;
    const [isLoading, setLoading] = useState(false);
    const [isClicked, setClicked] = useState(false);
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

            const docRef = doc(db, 'tweets', id);

            let locationRef = null;
            let result = null;
            let url = null;
            if(newFile) {
                if(typeof(newFile) !== "string") {
                    locationRef = ref(storage, `tweets/${user?.uid}/`);
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
                    <User thumbnail={userThumbnail} email={userEmail} name={username} date={String(createdAt)} />
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
                    <TweetsBody>
                        <TweetsContent>{tweet}</TweetsContent>
                        {
                            photo ? <TweetsImg src={photo} /> : null
                        }
                    </TweetsBody>
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