import styled from "styled-components";
import { BtnArea, InfoText, PostForm, PostTweetBtn, TextMaxLength } from "../css/tweet-components";
import User from "./user";
import { auth, db, storage } from "../firebase";
import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { checkMaxLength } from "../utils/helpers";
import { PostFormBox, PostFormItem, PostFormItemContent, PostFormItemTitle, PostScreenshotInput, PostScreenshots, PostScreenshotsFile, PostScreenshotsFileInput, PostScreenshotsFileLabel, ScreenshotImg } from "../css/screenshots-components";

const Wrapper = styled.div`
    &:not(.edit-form) {
        padding: 20px;
        border: 1px solid var(--border-color);
        border-radius: 20px;
    }
    @media (max-width: 768px) {
        &:not(.edit-form) {
            border-radius: 0px;
            border: none;
            border-bottom: 1px solid var(--border-color);
        }
    }
`;

export default function PostScreenshotsForm(props: any){
    const user = auth.currentUser;

    const [isLoading, setLoading] = useState(false);
    const [file, setFile] = useState<(File | string) | null>(Object.keys(props).length === 0 ? null : props.photo);
    const [comment, setComment] = useState(Object.keys(props).length === 0 ? "" : props.comment);
    const [hashtag, setHashtag] = useState(Object.keys(props).length === 0 ? "" : props.hashtag?.length > 0 ? props.hashtag.join(",") : "");

    const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if(files && files.length === 1) {
            setFile(files[0]);
        }        
    };
    const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if(name === "comment") {
            setComment(value);
        } else if(name === "hashtag") {
            setHashtag(value);
        }
    };
    const submitForm = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!user || !file) return;
        
        try {
            setLoading(true);

            const splitHashtag = hashtag.split(",");
            let hashtagArray: any = [];
            if(hashtag !== "" && splitHashtag.length > 0) {
                const hashtagItem = splitHashtag.map((item: string) => {
                    if(item !== "") {
                        return item;
                    }
                });
                hashtagArray = hashtagItem;
            };

            let newDoc: any = null;
            let photoLink: any = null;
            if(Object.keys(props).length === 0) {
                newDoc = await addDoc(collection(db, "screenshots"), {
                    createdAt: Date.now(),
                    userId: user.uid,
                    userThumbnail: user.photoURL,
                    userEmail: user.email,
                    username: user.displayName,
                    comment,
                    liked: [],
                    hashtag: hashtagArray,
                });
            } else {
                await updateDoc(doc(db, "screenshots", props.id), {
                    comment,
                    hashtag: hashtagArray,
                });
            };

            const locationRef = ref(storage, `screenshots/${user.uid}/${Object.keys(props).length === 0 ? newDoc.id : props.id}/`);
            if(typeof(file) !== "string") {
                const updatePhoto = await uploadBytes(locationRef, file);
                photoLink = await getDownloadURL(updatePhoto.ref);
            } else {
                photoLink = file;
            };

            await updateDoc(Object.keys(props).length === 0 ? newDoc : doc(db, "screenshots", props.id), {
                photo: photoLink
            });

            if(Object.keys(props).length > 0 && props.changeBoardStatus) {
                props.changeBoardStatus();
            }
        } catch(e) {
            console.log(e);
        } finally {
            if(Object.keys(props).length === 0) {
                // reset form
                setFile(null);
                setComment("");
                setHashtag("");
            } else {
                props.clickEvent();
            }

            setLoading(false);
        }
    };

    return (
        <Wrapper className={Object.keys(props).length === 0 ? "" : "edit-form"}>
            <PostForm onSubmit={submitForm}>
                {
                    Object.keys(props).length === 0 ?
                    <User thumbnail={user?.photoURL ?? ""} email={user?.email} name={user?.displayName ?? ""} date="" />
                    : null
                }
                <PostScreenshots>
                    <PostFormBox>
                        <PostFormItemTitle className="d-flex align-items-center">
                            SCREENSHOT <InfoText className="fw-normal">(Required)</InfoText>
                        </PostFormItemTitle>
                        <PostFormItemContent>
                            <PostScreenshotsFile>
                                <PostScreenshotsFileInput type="file" name="postScreenshotFile" id={Object.keys(props).length === 0 ? "postScreenshotFile" : `editScrennshotFile_${props.id}`} onChange={changeFile} className="d-none" />
                                <PostScreenshotsFileLabel htmlFor={Object.keys(props).length === 0 ? "postScreenshotFile" : `editScrennshotFile_${props.id}`}>
                                    {
                                        file ?
                                        <ScreenshotImg src={typeof(file) !== "string" ? URL.createObjectURL(file) : file} className="w-100 h-100" />
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                                            <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                </PostScreenshotsFileLabel>
                            </PostScreenshotsFile>
                        </PostFormItemContent>
                    </PostFormBox>

                    <PostFormBox className="d-flex flex-column justify-content-around">
                        <PostFormItem>
                            <PostFormItemTitle>COMMENT</PostFormItemTitle>
                            <PostFormItemContent>
                                <PostScreenshotInput type="text" name="comment" onChange={changeValue} onKeyUp={()=>checkMaxLength(comment, 20, ()=>setComment(comment.slice(0,20)))} value={comment} maxLength={20} placeholder="Explain your screenshot" />
                                <TextMaxLength className="text-max-length">{comment ? comment.length : 0}/20</TextMaxLength>
                            </PostFormItemContent>
                        </PostFormItem>

                        <PostFormItem>
                            <PostFormItemTitle>HASHTAG</PostFormItemTitle>
                            <PostFormItemContent>
                                <PostScreenshotInput type="text" name="hashtag" onChange={changeValue} value={hashtag} placeholder="keyword" />
                                
                                <InfoText>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                                    </svg>
                                    Type a comma(,) followed by your keyword or keywords, with no spaces.
                                </InfoText>
                            </PostFormItemContent>
                        </PostFormItem>

                        <BtnArea className="justify-content-end">
                            <PostTweetBtn type="submit" value={isLoading ? "Loading..." : Object.keys(props).length === 0 ? "Post" : "Edit"} className="bg-point" />
                        </BtnArea>
                    </PostFormBox>
                </PostScreenshots>
            </PostForm>
        </Wrapper>
    );
};