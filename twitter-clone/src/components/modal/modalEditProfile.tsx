import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import { FormInput } from "../../css/auth-components";
import { signOut, updatePassword, updateProfile } from "firebase/auth";
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import Modal from "./modal";
import ModalProfileCardBg from "./modal-profile-card-bg";
import { useNavigate } from "react-router-dom";
import ModalProfileUserImg from "./modal-profile-user-img";
import { checkMaxLength, convertDateYYYYMMDD } from "../../utils/helpers";
import { changeOutletContext } from "../layout";
import { TextMaxLength } from "../../css/tweet-components";

const Wrapper = styled.div``;
const Form = styled.form``;

const CardBg = styled.div`
    height: 250px;
    text-align: center;
`;
const CardBgImg = styled.img`
    position: absolute;
    height: 250px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
`;
const CardBgButton = styled.button`
    position: absolute;
    width: 100%;
    height: calc(250px + 20px);
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    & svg {
        width: 40px;
        color: #fff;
        position: relative;
    }
    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0,0,0,0.55);
        border-radius: var(--bd-rad) var(--bd-rad) 0 0;
    }
`;

const UserDetails = styled.div`
    height: calc(100% - calc(250px + 20px + 40px));
    margin: 0 0 20px;
    position: relative;
`;
const UserThumbnail = styled.div`
    position: absolute;
    top: calc(120px / -2);
    left: 50%;
    transform: translateX(-50%);
`;
const UserImgButton = styled.button`
    display: inline-block;
    width: 120px;
    height: 120px;
    padding: 0;
    background-color: #fff;
    border-radius: 100%;
    overflow: hidden;
    cursor: pointer;
    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-radius: 100%;
        background-color: rgba(0,0,0,0.55);
    }
    & svg {
        position: absolute;
        width: 30px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        z-index: 1;
    }
`;
const UserImg = styled.img`
    width: 100%;
    height: 100%;
`;

const UserDesc = styled.div`
    padding: 90px 0 0;
`;
const UserDescInner = styled.div``;
const UserInfo = styled.div`
    &:not(:last-child) {
        margin: 0 0 25px;
    }
`;
const UserInfoTitle = styled.div`
    font-weight: bold;
    position: relative;
`;

const UserInfoContent = styled.div`
    display: flex;
    & :is(input, textarea) {
        margin: 7px 0 0;
    }
    & input {
        width: 100%;
    }
`;

const Playstyle = styled.div``;
const PlaystyleLabel = styled.label`
    display: inline-flex;
    align-items: center;
    margin: 5px 7px 0 0;
    cursor: pointer;
`;
const PlaystyleInput = styled.input`
    display: none;
    &:checked + span {
        background-color: rgba(var(--point-rgb), 0.13);
        color: var(--point);
    }    
`;
const PlaystyleText = styled.span`
    padding: 7px 15px;
    border: 1px solid var(--border-color);
    border-radius: 100px;
    color: var(--text-muted);
`;
const FormTextarea = styled.textarea`
    width: 100%;
    height: 65px;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: var(--bd-rad);
    line-height: 1.35em;
    font-size: 15px;
    &:focus {
        outline: none;
    }
`;

export default function ModalEditProfile(props: any){
    const user = auth.currentUser;
    const navigate = useNavigate();
    const playstyleType = [
        {
            id: 0,
            name: "raid"
        },
        {
            id: 1,
            name: "housing"
        },
        {
            id: 2,
            name: "C&G"
        },
        {
            id: 3,
            name: "screenshots"
        },
    ];
    const [newName, setNewName] = useState(user?.displayName ?? "Anonymous");
    const [newUserImg, setNewUserImg] = useState(user?.photoURL ?? "/profile/user/UserImg01.png");
    const [newPassword, setNewPassword] = useState("");
    const [newCardBgImg, setNewCardBgImg] = useState(props.info.cardBgImg);
    const [newGuild, setNewGuild] = useState(props.info.guild);
    const [newPlaystyle, setNewPlaystyle] = useState<Array<String>>(props.info.playstyle);
    const [newComment, setNewComment] = useState(props.info.comment);

    const [isModalOpened, setModalOpened] = useState(false);
    const [subModalType, setSubModalType] = useState("");

    const { changeUserInfo } = changeOutletContext();

    const changeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if(name === "name") {
            setNewName(value);
        } else if(name === "password") {
            setNewPassword(value);
        } else if(name === "guild") {
            setNewGuild(value);
        } else if(name === "comment") {
            setNewComment(value);
        }
    };

    const openSubModal = async(e: React.SyntheticEvent<HTMLButtonElement>) => {
        const { type } = e.currentTarget.dataset;
        openModal();
        setSubModalType(type ?? "");
    };
    const openModal = async() => {
        setModalOpened(!isModalOpened);
    };
    const changeCardBg = (data: string) => {
        setNewCardBgImg(data);
    };
    const changeUserImg = (data: string) => {
        setNewUserImg(data);
    };

    const changePlaystyle = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if(checked) {
            if(!newPlaystyle.includes(value)) {
                setNewPlaystyle(current => [...current, value]);
            }
        } else {
            if(newPlaystyle.includes(value)) {
                setNewPlaystyle((current) => current.filter((item) => item !== value));
            }
        }
    };

    const submitProfile = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!user) return;

        try {
            // doc 불러오기
            const profile = await getDoc(doc(db, "profile", user.uid));
            const userDoc = doc(collection(db, "profile"), user.uid);

            if(user.displayName !== newName || user.photoURL !== newUserImg) {
                // update profile
                await updateProfile(user, {
                    ...(user.displayName !== newName && {
                        displayName: newName
                    }),
                    ...(user.photoURL !== newUserImg && {
                        photoURL: newUserImg
                    })
                })

                // update document
                const docQuery = query(
                    collection(db, props.currentTab),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc"),
                );
                const tweetDoc = await getDocs(docQuery);
                tweetDoc.docs.forEach(async (item) => {
                    if(item.data()) {
                        const { username, userThumbnail } = item.data();
                        if(username !== newName || userThumbnail !== newUserImg) {
                            await updateDoc(doc(db, props.currentTab, item.id), {
                                ...(username !== newName && {
                                    username: newName
                                }),
                                ...(userThumbnail !== newUserImg && {
                                    userThumbnail: newUserImg
                                })
                            });
                        }
                    }
                });

                const tweetInfo = tweetDoc.docs.map((item) => {
                    if(item.data()){
                        if(props.currentTab === "tweets") {
                            const { tweet, photo, createdAt, userId, username, userThumbnail, userEmail, liked } = item.data();
                            return {
                                id: item.id,
                                tweet,
                                photo: photo ? photo : null,
                                createdAt: convertDateYYYYMMDD(createdAt),
                                userId,
                                username: username !== newName ? newName : username,
                                userThumbnail: userThumbnail !== newUserImg ? newUserImg : userThumbnail,
                                userEmail,
                                liked
                            };
                        } else if(props.currentTab === "screenshots") {
                            const { comment, hashtag, photo, createdAt, userId, username, userThumbnail, userEmail, liked } = item.data();
                            return {
                                id: item.id,
                                comment,
                                hashtag,
                                photo,
                                createdAt,
                                userId,
                                username,
                                userThumbnail,
                                userEmail,
                                liked,
                            }
                        }
                    };
                });

                props.changeBoard(tweetInfo);
            }

            // if user's profile data is not stored in firestore, use setDoc()
            // if not, use updateDoc()
            if(!profile.data()) {
                await setDoc(userDoc, {
                    id: user.uid,
                    cardBgImg: newCardBgImg,
                    guild: newGuild,
                    playstyle: newPlaystyle,
                    comment: newComment
                })
            } else {
                // update profile data in firestore
                await updateDoc(userDoc, {
                    guild: newGuild,
                    cardBgImg: newCardBgImg,
                    playstyle: newPlaystyle,
                    comment: newComment
                });

                // update profile.tsx file's profileCardInfo variable state
                const sendData = {
                    id: user.uid,
                    cardBgImg: newCardBgImg,
                    guild: newGuild,
                    playstyle: newPlaystyle,
                    comment: newComment
                };
                props.changeEvent(sendData);
            }

            // change user info for changing user detail in the header
            const changedUserInfoObject = {
                displayName: newName,
                photoURL: newUserImg
            };
            changeUserInfo(changedUserInfoObject);

            // update password
            if(newPassword !== "") {
                await updatePassword(user, newPassword);
            }
        } catch(e) {
            console.log(e);
        } finally {
            if(newPassword !== "") {
                alert("Your password has been changed successfully!");
                await signOut(auth);
                navigate("/login");
            } else {
                // close modal
                props.clickEvent();
            }
        }
    }

    return(
        <>
            <Wrapper className="h-100">
                <Form className="h-100" onSubmit={submitProfile}>
                    <CardBg>
                        <CardBgImg src={newCardBgImg === "" ? "/profile/jobs/cardBgImg0.png" : newCardBgImg} />
                        <CardBgButton type="button" onClick={openSubModal} data-type="cardBg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                            </svg>
                        </CardBgButton>
                    </CardBg>
                    <UserDetails>
                        <UserThumbnail>
                            <UserImgButton type="button" onClick={openSubModal} data-type="userImg">
                                <UserImg src={newUserImg === "" ? "/profile/user/UserImg01.png" : newUserImg} />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                </svg>
                            </UserImgButton>
                        </UserThumbnail>
                        <UserDesc className="h-100">
                            <UserDescInner className="h-100 overflow-y">
                                <UserInfo>
                                    <UserInfoTitle>PLAYER NAME</UserInfoTitle>
                                    <UserInfoContent>
                                        <FormInput type="text" name="name" onChange={changeValue} defaultValue={newName} placeholder="Jane Doe" />
                                    </UserInfoContent>
                                </UserInfo>

                                <UserInfo>
                                    <UserInfoTitle>EMAIL</UserInfoTitle>
                                    <UserInfoContent>
                                        <FormInput type="email" name="email" value={user?.email ?? "-"} placeholder="janedoe01@example.com" readOnly />
                                    </UserInfoContent>
                                </UserInfo>

                                <UserInfo>
                                    <UserInfoTitle>PASSWORD</UserInfoTitle>
                                    <UserInfoContent>
                                        <FormInput type="password" autoComplete="new-password" name="password" onChange={changeValue} value={newPassword} />
                                    </UserInfoContent>
                                </UserInfo>

                                <UserInfo>
                                    <UserInfoTitle>GUILD</UserInfoTitle>
                                    <UserInfoContent>
                                        <FormInput type="text" name="guild" maxLength={20} onChange={changeValue} value={newGuild} placeholder="Newbies" />
                                    </UserInfoContent>
                                </UserInfo>

                                <UserInfo>
                                    <UserInfoTitle>PLAYSTYLE</UserInfoTitle>
                                    <UserInfoContent>
                                        <Playstyle key="playstyle">
                                            {
                                                playstyleType.map((item) =>
                                                    <PlaystyleLabel key={`playstyle_${item.name}`}>
                                                        <PlaystyleInput type="checkbox" name="playstyle" onChange={changePlaystyle} defaultValue={item.name} checked={newPlaystyle.includes(item.name)} />
                                                        <PlaystyleText>#{item.name}</PlaystyleText>
                                                    </PlaystyleLabel>
                                                )
                                            }
                                        </Playstyle>
                                    </UserInfoContent>
                                </UserInfo>

                                <UserInfo>
                                    <UserInfoTitle>
                                        COMMENT
                                        <TextMaxLength>{newComment.length}/50</TextMaxLength>
                                    </UserInfoTitle>
                                    <UserInfoContent>
                                        <FormTextarea name="comment" maxLength={50} value={newComment} onChange={changeValue} onKeyUp={()=>checkMaxLength(newComment, 50, ()=>setNewComment(newComment.slice(0, 50)))}></FormTextarea>
                                    </UserInfoContent>
                                </UserInfo>
                            </UserDescInner>
                        </UserDesc>
                    </UserDetails>
                    <FormInput type="submit" className="d-block w-100 bg-point" value="EDIT" />
                </Form>
            </Wrapper>

            {
                isModalOpened ? 
                    <Modal modalType="" clickEvent={openModal} modalTitle={subModalType === "cardBg" ? "Select Card Character" : "Select User Thumbnail"}>
                        {
                            subModalType === "cardBg" ?
                            <ModalProfileCardBg clickEvent={openModal} changeEvent={(item:string)=>changeCardBg(item)} curentImg={newCardBgImg}></ModalProfileCardBg>
                            : <ModalProfileUserImg clickEvent={openModal} changeEvent={(item:string)=>changeUserImg(item)} currentImg={newUserImg}></ModalProfileUserImg>
                        }
                    </Modal>
                : null
            }
        </>
    );
}