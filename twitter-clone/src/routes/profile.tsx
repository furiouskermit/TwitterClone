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

const Wrapper = styled.div``;
const Column = styled.div`
    position: relative;
`;

const ProfileCard = styled.div`
    padding: 30px;
    background-color: #121A2B;
    border-radius: 20px;
    color: #fff;
`;
const ProfileCardThumbnail = styled.div`
    margin: 0 0 30px;
    display: flex;
    align-items: center;
    gap: 20px;
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
`;
const UserImg = styled.img`
    width: 100%;
    height: 100%;
`;
const CardUserInfo = styled.div``;
const UserGuildName = styled.span`
    display: inline-block;
    margin: 0 0 15px;
    padding: 5px 10px;
    background-color: var(--point);
    border-radius: 50px;
`;
const CardUserName = styled.h3`
    margin: 0 0 15px;
    font-weight: bold;
    font-size: 42px;
`;
const UserEmail = styled.div``;

const ProfileCardDesc = styled.div`
    margin: 20px 0 0;
`;
const ProfileCardDescTitle = styled.div`
    margin: 0 0 7px;
`;
const ProfileCardDescContent = styled.div``;
const UserPlaystyle = styled.div`
    margin: 10px 0 0;
    font-size: 22px;
`;
const UserPlaystyleTag = styled.span`
    display: inline-block;
    margin-right: 7px;
    padding: 7px 15px;
    border: 1px solid #fff;
    border-radius: 50px;
    font-size: 18px;
`;
const UserComment = styled.p`
    min-height: 45px;
    white-space: pre-wrap;
    line-height: 1.35em;
    font-size: 22px;
`;

const ProfileBackgroundImg = styled.img`
    position: absolute;
    width: 150px;
    bottom: 20px;
    right: 15px;
`;
const BtnArea = styled.div`
    position: absolute;
    top: 30px;
    right: 30px;
    display: flex;
    align-items: center;
    gap: 7px;
`;
const ProfileCardBtn = styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 7px 15px;
    border: 1px solid #fff;
    border-radius: 50px;
    font-size: 14px;
    color: #fff;
    & svg {
        width: 20px;
    }
`;

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
        console.log('tab tab')
    };
    const fetchBoard = async() => {
        if(!user) return;
        const docQuery = query(
            collection(db, "tweets"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const tweetDoc = await getDocs(docQuery);
        const boardInfo = tweetDoc.docs.map((doc) => {
            const { tweet, username, createdAt, userThumbnail, userId, userEmail, liked } = doc.data();
            return {
                id: doc.id,
                username,
                createdAt: convertDateYYYYMMDD(createdAt),
                userThumbnail,
                userId,
                userEmail,
                liked,
                tweet
            }
        })
        setBoard(boardInfo);
    };
    const changeBoard = (data: any) => {
        setBoard(data);
    }

    useEffect(()=>{
      fetchProfile();
      fetchBoard();
    }, []);

    useEffect(()=>{
        setGuild(profileCardInfo?.guild ?? "");
        setPlaystyle(profileCardInfo?.playstyle ?? []);
        setComment(profileCardInfo?.comment ?? "");
        setCardBgImg(profileCardInfo?.cardBgImg ?? "");

        updateUser(user, "users");
    }, [profileCardInfo]);

    return (
        <Wrapper>
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
                    <ProfileCardBtn type="button" onClick={() => exportAsImage(exportImgRef.current, "test")}>
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

            <Column>
                <Tab tabCnt={4} currentTab={tab} tabTitle={["Home", "Screenshots", "Spoilers", "Tips"]} tabValue={["tweets", "screenshots", "spoilers", "tips"]} changeEvent={(data: any) => changeTab(data)} />
                {
                    board.map((boardItem: any) =>
                        <Tweet key={`profile_${boardItem.id}`} {...boardItem}>
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
                }
            </Column>

            {
                isModalOpened ? <Modal modalType="full" clickEvent={openModal}  modalTitle=""><ModalEditProfile clickEvent={openModal} changeEvent={(data: string) => handleProfileCardInfo(data)} info={profileCardInfo} currentTab={tab} changeTab={(data: any) => changeTab(data)} changeBoard={(data: any) => changeBoard(data)}></ModalEditProfile></Modal> : null
            }          
        </Wrapper>
    );
}