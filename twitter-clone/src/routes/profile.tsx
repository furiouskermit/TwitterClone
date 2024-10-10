import styled from "styled-components";
import { auth, db } from "../firebase";
import { useEffect, useRef, useState } from "react";
import Modal from "../components/modal/modal";
import ModalEditProfile from "../components/modal/modalEditProfile";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import exportAsImage from "../utils/exportAsImage";
import { convertDateYYYYMMDD, updateUser } from "../utils/helpers";
import Tweet from "../components/tweet";
import Tab from "../components/Tab";
import { PostingDate, UserAvatar, UserId, UserInfo, UserItem, UserName, UserThumbnail } from "../css/user-components";
import TweetScreenshots from "../components/tweet-screenshots";
import NoPost from "../components/no-post";

const Wrapper = styled.div`
    @media (max-width: 768px) {
        height: 100%;
        padding: 0 0 var(--mobile-pb);
    }
`;
const Column = styled.div`
    position: relative;
    &.column_content {
        margin: 30px 0 0;
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
`;

/* ### Profile - card area ### */
const ProfileCard = styled.div`
    padding: 30px;
    background-color: #121A2B;
    border-radius: 20px;
    color: #fff;

    @media (max-width: 768px) {
        padding: 20px;
        border-radius: 0px;
    }
`;
const ProfileCardThumbnail = styled.div`
    margin: 0 0 30px;
    display: flex;
    align-items: center;
    gap: 20px;
    @media (max-width: 768px) {
        gap: 13px;
    }
`;
const CardUserThumbnail = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 148px;
    height: 148px;
    border-radius: 100%;
    background-color: #fff;
    overflow: hidden;
    @media (max-width: 768px) {
        width: 85px;
        height: 85px;
    }

`;
const UserImg = styled.img`
    width: 100%;
    height: 100%;
`;
const CardUserInfo = styled.div`
    @media (max-width: 768px) {
        width: calc(100% - calc(13px + 90px));
    }
`;
const UserGuildName = styled.span`
    display: inline-block;
    margin: 0 0 15px;
    padding: 5px 10px;
    background-color: var(--point);
    border-radius: 50px;
    @media (max-width: 768px) {
        margin: 0 0 12px;
        font-size: 13px;
    }
`;
const CardUserName = styled.h3`
    margin: 0 0 15px;
    font-weight: bold;
    font-size: 42px;
    @media (max-width: 768px) {
        margin: 0 0 8px;
        font-size: 24px;
    }

`;
const UserEmail = styled.div`
    @media (max-width: 768px) {
        font-size: 14px;
    }
`;
const ProfileCardDesc = styled.div`
    margin: 20px 0 0;
`;
const ProfileCardDescTitle = styled.div`
    margin: 0 0 7px;
    @media (max-width: 768px) {
        font-size: 14px;
    }
`;
const ProfileCardDescContent = styled.div``;
const UserPlaystyle = styled.div`
    margin: 10px 0 0;
    @media (max-width: 768px) {
        max-width: calc(100% - 100px);
    }
`;
const UserPlaystyleTag = styled.span`
    display: inline-block;
    margin-right: 7px;
    padding: 7px 15px;
    border: 1px solid #fff;
    border-radius: 50px;
    font-size: 18px;
    @media (max-width: 768px) {
        font-size: 16px;
    }
`;
const UserComment = styled.p`
    min-height: 45px;
    white-space: pre-wrap;
    line-height: 1.35em;
    font-size: 22px;
    @media (max-width: 768px) {
        max-width: calc(100% - 100px);
        font-size: 18px;
    }
`;
const ProfileBackgroundImg = styled.img`
    position: absolute;
    width: 150px;
    bottom: 20px;
    right: 15px;
    @media (max-width: 768px) {
        width: 100px;
        right: 10px;
        bottom: 80px;
    }

`;
const BtnArea = styled.div`
    position: absolute;
    top: 30px;
    right: 30px;
    display: flex;
    align-items: center;
    gap: 7px;

    @media (max-width: 768px) {
        position: static;
        top: unset;
        left: unset;
        padding: 0 20px 20px;
        background-color: #121A2B;
    }
`;
const ProfileCardBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 7px 15px;
    border: 1px solid #fff;
    border-radius: 50px;
    font-size: 14px;
    color: #fff;
    & svg {
        width: 20px;
    }
    @media (max-width: 768px) {
        flex: 1;
    }
`;

/* ### Profile - tweets area ### */
const TabContent = styled.div``;

export interface ProfileCardInterface {
    id?: string,
    guild?: string,
    playstyle?: Array<String>,
    comment?: string,
    cardBgImg?: string,
};

export default function Profile(){
    const user = auth.currentUser;
    const exportImgRef = useRef<HTMLDivElement>(null);

    const [profileCardInfo, setProfileCardInfo] = useState<ProfileCardInterface>();
    const [guild, setGuild] = useState("");
    const [playstyle, setPlaystyle] = useState<any>([]);
    const [comment, setComment] = useState("");
    const [cardBgImg, setCardBgImg] = useState("/profile/jobs/cardBgImg0.png");

    const [tab, setTab] = useState("tweets")
    const [board, setBoard] = useState<any>([]);

    const [isModalOpened, setModalOpened] = useState(false);
    const openModal = async() => {
        setModalOpened(!isModalOpened);
    };
    const fetchProfile = async() => {
        if(!user) return;
        const profile = doc(db, "profile", user.uid);

        const snapshot = await getDoc(profile);
        const profileDoc = snapshot.data();
        let profileObject = {};
        profileObject = {
            id: profileDoc ? profileDoc.id : user.uid,
            playstyle: profileDoc ? profileDoc.playstyle : [],
            guild: profileDoc ? profileDoc.guild : "",
            comment: profileDoc ? profileDoc.comment : "",
            cardBgImg: profileDoc ? profileDoc.cardBgImg : ""
        }
        setProfileCardInfo(profileObject);
    };

    const handleProfileCardInfo = (data: any) => {
        setProfileCardInfo(data);
    };

    const changeTab = (data: any) => {
        setTab(data);
    };
    const fetchBoard = async(tabName: string) => {
        if(!user) return;
        const docQuery = query(
            collection(db, tabName),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const tweetDoc = await getDocs(docQuery);
        const boardInfo = tweetDoc.docs.map((doc) => {
            if(tabName === "tweets") {
                const { tweet, photo, username, createdAt, userThumbnail, userId, userEmail, liked } = doc.data();
                return {
                    id: doc.id,
                    username: username === user.displayName ? username : user.displayName,
                    createdAt: convertDateYYYYMMDD(createdAt),
                    userThumbnail: userThumbnail === user.photoURL ? userThumbnail : user.photoURL,
                    userId,
                    userEmail,
                    liked,
                    tweet,
                    photo: photo ? photo : null,
                };
            } else if(tabName === "screenshots") {
                const { photo, username, createdAt, userThumbnail, userId, userEmail, liked, comment, hashtag } = doc.data();
                return {
                    id: doc.id,
                    username: username === user.displayName ? username : user.displayName,
                    createdAt,
                    userThumbnail: userThumbnail === user.photoURL ? userThumbnail : user.photoURL,
                    userId,
                    userEmail,
                    liked,
                    photo,
                    comment,
                    hashtag
                };
            }
            
        })
        setBoard(boardInfo);
    };
    const changeBoard = (data: any) => {
        setBoard(data);
    }

    useEffect(()=>{
      fetchProfile();
      fetchBoard(tab);
    }, []);

    useEffect(()=>{
        setGuild(profileCardInfo?.guild ?? "");
        setPlaystyle(profileCardInfo?.playstyle ?? []);
        setComment(profileCardInfo?.comment ?? "");
        setCardBgImg(profileCardInfo?.cardBgImg ?? "");

        updateUser(user, "users");
    }, [profileCardInfo]);

    useEffect(()=>{
        fetchBoard(tab);
    }, [tab]);

    return (
        <Wrapper className="overflow-y">
            <Column>
                <ProfileCard ref={exportImgRef}>
                    <ProfileCardThumbnail>
                        <CardUserThumbnail>
                            <UserImg src={user?.photoURL ?? "/profile/user/UserImg01.png"} />
                        </CardUserThumbnail>
                        <CardUserInfo>
                            { guild !== "" ? <UserGuildName>{guild}</UserGuildName> : null }
                            <CardUserName>{user?.displayName ?? "Anonymous"}</CardUserName>
                            <UserEmail className="text-muted">{user?.email}</UserEmail>
                        </CardUserInfo>
                    </ProfileCardThumbnail>

                    <ProfileCardDesc>
                        <ProfileCardDescTitle className="text-muted">PLAYSTYLE</ProfileCardDescTitle>
                        <ProfileCardDescContent>
                            <UserPlaystyle>
                                {
                                    playstyle.length > 0 ? playstyle.map((item: string) => <UserPlaystyleTag key={`user_playstyle_${item}`}>#{item}</UserPlaystyleTag>) : "There is no selected playstyle."
                                }
                            </UserPlaystyle>
                        </ProfileCardDescContent>
                    </ProfileCardDesc>

                    <ProfileCardDesc>
                        <ProfileCardDescTitle className="text-muted">COMMENT</ProfileCardDescTitle>
                        <ProfileCardDescContent>
                            <UserComment>{comment}</UserComment>
                        </ProfileCardDescContent>
                    </ProfileCardDesc>

                    <ProfileBackgroundImg src={cardBgImg} />
                </ProfileCard>
                <BtnArea>
                    <ProfileCardBtn type="button" onClick={() => exportAsImage(exportImgRef.current, "myProfileCard")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download Profile
                    </ProfileCardBtn>
                    <ProfileCardBtn type="button" onClick={openModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                        Edit Profile
                    </ProfileCardBtn>
                </BtnArea>
            </Column>

            <Column className="column_content">
                {/* <Tab tabCnt={4} currentTab={tab} tabTitle={["Home", "Screenshots", "Spoilers", "Tips"]} tabValue={["tweets", "screenshots", "spoilers", "tips"]} changeEvent={(data: any) => changeTab(data)} /> */}
                <Tab tabCnt={2} currentTab={tab} tabTitle={["Home", "Screenshots"]} tabValue={["tweets", "screenshots"]} changeEvent={(data: any) => changeTab(data)} />
                
                <TabContent>
                    {
                        tab === "tweets" ? 
                            board.length === 0 ? <NoPost /> :
                            board.map((boardItem: any) =>
                                <Tweet key={`profile_${boardItem.id}`} {...boardItem} changeBoard={(data: any) => changeBoard(data)}>
                                    <UserItem className="user">
                                        <UserThumbnail><UserAvatar src={boardItem.userThumbnail === "" ? "/profile/user/UserImg01.png" : boardItem.userThumbnail} /></UserThumbnail>
                                        <UserInfo>
                                            <UserName>{boardItem.username === "" ? "Anonymous" : boardItem.username}</UserName>
                                            <UserId className="text-muted">@{boardItem.userEmail}</UserId>
                                            <PostingDate className="text-muted">{boardItem.createdAt}</PostingDate>
                                        </UserInfo>
                                    </UserItem>
                                </Tweet>
                            )
                        : tab === "screenshots" ? 
                            !board ? <NoPost /> :
                            board.map((boardItem: any) => 
                                <TweetScreenshots key={`profile_${boardItem.id}`} {...boardItem} changeBoard={(data: any) => changeBoard(data)}>
                                    <UserItem className="user">
                                        <UserThumbnail><UserAvatar src={boardItem.userThumbnail === "" ? "/profile/user/UserImg01.png" : boardItem.userThumbnail} /></UserThumbnail>
                                        <UserInfo>
                                            <UserName>{boardItem.username === "" ? "Anonymous" : boardItem.username}</UserName>
                                            <UserId className="text-muted">@{boardItem.userEmail}</UserId>
                                            <PostingDate className="text-muted">{convertDateYYYYMMDD(boardItem.createdAt)}</PostingDate>
                                        </UserInfo>
                                    </UserItem>
                                </TweetScreenshots>
                            )
                        : tab === "tips" ? <></>
                        : null
                    }
                </TabContent>
            </Column>

            {
                isModalOpened ? <Modal modalType="full" clickEvent={openModal}  modalTitle=""><ModalEditProfile clickEvent={openModal} changeEvent={(data: string) => handleProfileCardInfo(data)} info={profileCardInfo} currentTab={tab} changeTab={(data: any) => changeTab(data)} changeBoard={(data: any) => changeBoard(data)}></ModalEditProfile></Modal> : null
            }          
        </Wrapper>
    );
}