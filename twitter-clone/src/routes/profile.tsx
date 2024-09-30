import styled from "styled-components";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import Modal from "../components/modal/modal";
import ModalEditProfile from "../components/modal/modalEditProfile";
import { doc, getDoc } from "firebase/firestore";

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
const UserThumbnail = styled.div`
    width: 148px;
    height: 148px;
    border-radius: 100%;
    overflow: hidden;
`;
const UserImg = styled.img`
    width: 100%;
`;
const UserInfo = styled.div``;
const UserGuildName = styled.span`
    display: inline-block;
    margin: 0 0 15px;
    padding: 5px 10px;
    background-color: var(--point);
    border-radius: 50px;
`;
const UserName = styled.h3`
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

    const [profileCardInfo, setProfileCardInfo] = useState<ProfileCardInterface>();
    const [guild, setGuild] = useState("");
    const [playstyle, setPlaystyle] = useState<any>([]);
    const [comment, setComment] = useState("");
    const [cardBgImg, setCardBgImg] = useState("/profile/jobs/cardBgImg0.png");

    const [isModalOpened, setModalOpened] = useState(false);
    const openModal = async() => {
        setModalOpened(!isModalOpened);
    };
    const fetchProfile = async() => {
        if(!user) return;
        const profile = doc(db, "profile", user.uid);

        const snapshot = await getDoc(profile);
        const profileDoc = snapshot.data();
        if(!profileDoc) return;
        const profileObject = {
            id: profileDoc.id,
            playstyle: profileDoc.playstyle,
            guild: profileDoc.guild,
            comment: profileDoc.comment,
            cardBgImg: profileDoc.cardBgImg
        }
        setProfileCardInfo(profileObject);
    };

    const handleProfileCardInfo = (data: any) => {
        setProfileCardInfo(data);
    };

    useEffect(()=>{
      fetchProfile();
    }, []);
    useEffect(()=>{
        setGuild(profileCardInfo?.guild ?? "");
        setPlaystyle(profileCardInfo?.playstyle ?? []);
        setComment(profileCardInfo?.comment ?? "");
        setCardBgImg(profileCardInfo?.cardBgImg ?? "");
    }, [profileCardInfo]);

    return (
        <Wrapper>
            <Column>
                <ProfileCard>
                    <ProfileCardThumbnail>
                        <UserThumbnail>
                            <UserImg src={user?.photoURL ?? "/profile/user/UserImg01.png"} />
                        </UserThumbnail>
                        <UserInfo>
                            { guild !== "" ? <UserGuildName>{guild}</UserGuildName> : null }
                            <UserName>{user?.displayName ?? "Anonymous"}</UserName>
                            <UserEmail className="text-muted">{user?.email}</UserEmail>
                        </UserInfo>
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
                </ProfileCard>
                <ProfileBackgroundImg src={cardBgImg} />
                <BtnArea>
                    <ProfileCardBtn type="button">
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

            <Column></Column>

            {
                isModalOpened ? <Modal modalType="full" clickEvent={openModal}  modalTitle=""><ModalEditProfile clickEvent={openModal} changeEvent={(data: string) => handleProfileCardInfo(data)} info={profileCardInfo}></ModalEditProfile></Modal> : null
            }          
        </Wrapper>
    );
}