import styled from "styled-components";
import User from "./user";
import { useState } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { BtnArea, DeleteTweetImg, FileArea, FileInput, FileLabel, PostForm, PostTweet, PostTweetBtn, PostTweetImg, TweetImg } from "../css/tweet-components";

const Wrapper = styled.div`
    width: 100%;
    padding: 20px;
    border: 1px solid var(--border-color);
    border-radius: 20px;
`;

export default function PostTweetForm(){
    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const changeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    };
    const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        const maximumSize = 1024 ** 2 * 10; // 10MB
        if(files && files.length === 1) {
            if(files[0].size > maximumSize) {
                alert("The maximum size of the file should be lower than 10MB!");
                return;
            }
            setFile(files[0]);
        }
    };
    const deleteFile = () => {
        setFile(null);
    };
    const submitTweet = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = auth.currentUser;
        if(!user || isLoading || (tweet.length === 0 && !file)) return;
        if(tweet.length > 140) {
            alert("You cannot type more than 140 letters!");
            return;
        }

        try {
            setLoading(true);
            const docs = await addDoc(collection(db, 'tweets'), {
                tweet,
                createdAt: Date.now(),
                userId: user.uid,
                userEmail: user.email?.split("@")[0],
                username: user.displayName,
                liked: [],
                userThumbnail: (!user.photoURL || user.photoURL === "") ? "/profile/user/UserImg01.png" : user.photoURL
            });

            if(file) {
                const locationRef = ref(storage, `tweets/${user.uid}/`);
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);

                await updateDoc(docs, {
                    photo: url
                });
            }
        } catch(e) {
            console.log(e);
        } finally {
            setLoading(false);
            setTweet("");
            setFile(null);
        }
    };
    return (
        <Wrapper>
            <PostForm onSubmit={submitTweet}>
                <User thumbnail="" email="" name="" date="" />
                <PostTweet name="tweet" onChange={changeValue} value={tweet} placeholder="What is happening?"></PostTweet>
                {
                    file ? 
                    <PostTweetImg>
                        <TweetImg src={URL.createObjectURL(file)} />
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
                        <FileInput type="file" name="file" id="file" onChange={changeFile} accept="image/*" />
                        <FileLabel htmlFor="file" className="bg-point-lighten">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </FileLabel>
                    </FileArea>
                    <PostTweetBtn type="submit" value={isLoading ? "Loading..." : "Post"} className="bg-point" />
                </BtnArea>
            </PostForm>
        </Wrapper>
    );
}