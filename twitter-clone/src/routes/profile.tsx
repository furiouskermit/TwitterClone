import styled from "styled-components";
import { auth } from "../firebase";
import { useState } from "react";
import Modal from "../components/modal/modal";
import ModalEditProfile from "../components/modal/modalEditProfile";

const Wrapper = styled.div``;
const Column = styled.div``;

const ProfileCard = styled.div`
    background-color: #121A2B;
    color: #fff;
`;
const ProfileCardThumbnail = styled.div``;
const UserThumbnail = styled.div``;
const UserImg = styled.img``;
const UserInfo = styled.div``;
const UserGuildName = styled.div``;
const UserName = styled.div``;
const UserEmail = styled.div``;

const ProfileCardDesc = styled.div``;
const ProfileCardDescTitle = styled.div``;
const ProfileCardDescContent = styled.div``;
const UserPlaystyle = styled.div``;
const UserPlaystyleTag = styled.span``;
const UserComment = styled.p`
    white-space: pre-wrap;
`;


const ProfileBackgroundImg = styled.img``;
const BtnArea = styled.div``;
const ProfileCardBtn = styled.button``;

export interface ProfileCard {
    guild: string,
    playstyle: Array<String>,
    comment: string
};

export default function Profile(){
    const user = auth.currentUser;

    const [guild, setGuild] = useState("");
    const [playstyle, setPlaystyle] = useState([]);
    const [comment, setComment] = useState("");

    const [isModalOpened, setModalOpened] = useState(false);
    const openModal = async() => {
        setModalOpened(!isModalOpened);
    };

    return (
        <Wrapper>
            <Column>
                <ProfileCard>
                    <ProfileCardThumbnail>
                        <UserThumbnail>
                            <UserImg src={user?.photoURL ?? "/profile/user/UserImg01.png"} />
                        </UserThumbnail>
                        <UserInfo>
                            <UserGuildName></UserGuildName>
                            <UserName>{user?.displayName ?? "Anonymous"}</UserName>
                            <UserEmail className="text-muted">{user?.email}</UserEmail>
                        </UserInfo>
                    </ProfileCardThumbnail>

                    <ProfileCardDesc>
                        <ProfileCardDescTitle className="text-muted">PLAYSTYLE</ProfileCardDescTitle>
                        <ProfileCardDescContent>
                            <UserPlaystyle>
                                <UserPlaystyleTag></UserPlaystyleTag>
                            </UserPlaystyle>
                        </ProfileCardDescContent>
                    </ProfileCardDesc>

                    <ProfileCardDesc>
                        <ProfileCardDescTitle className="text-muted">COMMENT</ProfileCardDescTitle>
                        <ProfileCardDescContent>
                            <UserComment></UserComment>
                        </ProfileCardDescContent>
                    </ProfileCardDesc>
                </ProfileCard>
                <ProfileBackgroundImg src="" />
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
                isModalOpened ? <Modal clickEvent={openModal}  modalTitle=""><ModalEditProfile></ModalEditProfile></Modal> : null
            }            
        </Wrapper>
    );
}