import { useState } from "react";
import styled from "styled-components";
import { auth } from "../../firebase";
import { FormInput } from "../../css/auth-components";

const Wrapper = styled.div``;
const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

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
const CardBgFile = styled.div``;
const ImgFileInput = styled.input`
    display: none;
`;
const CardBgFileLabel = styled.label`
    position: absolute;
    width: 100%;
    height: calc(250px + 20px + 10px);
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
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.75);
        border-radius: var(--bd-rad) var(--bd-rad) 0 0;
    }
`;

const UserDetails = styled.div`
    position: relative;
`;
const UserThumbnail = styled.div`
    position: absolute;
    top: calc(120px / -2);
    left: 50%;
    transform: translateX(-50%);
`;
const UserImgFileLabel = styled.label`
    display: inline-block;
    width: 120px;
    height: 120px;
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
        background-color: rgba(0,0,0,0.75);
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
`;

const UserDesc = styled.div`
    padding: 90px 0 0;
`;
const UserInfo = styled.div`
    &:not(:last-child) {
        margin: 0 0 15px;
    }
`;
const UserInfoTitle = styled.div`
    margin: 0 0 5px;
`;
const UserInfoContent = styled.div`
    display: flex;
    & input {
        width: 100%;
    }
`;

const Playstyle = styled.div``;
const PlaystyleLabel = styled.label`
    display: inline-flex;
    align-items: center;
    margin: 0 7px 7px 0;
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




export default function ModalEditProfile(){
    const user = auth.currentUser;
    const [newCardBgImg, setNewCardBgImg] = useState("");

    return(
        <Wrapper>
            <Form>
                <CardBg>
                    <CardBgImg src="/profile/jobs/warrior.png" />
                    <CardBgFile>
                        <ImgFileInput type="file" id="cardBgFile" />
                        <CardBgFileLabel htmlFor="cardBgFile">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                            </svg>
                        </CardBgFileLabel>
                    </CardBgFile>
                </CardBg>
                <UserDetails>
                    <UserThumbnail>
                        <ImgFileInput type="file" id="userImgFile" />
                        <UserImgFileLabel htmlFor="userImgFile">
                            <UserImg src={user?.photoURL ?? "/profile/user/UserImg01.png"} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                            </svg>
                        </UserImgFileLabel>
                    </UserThumbnail>
                    <UserDesc>
                        <UserInfo>
                            <UserInfoTitle>PLAYER NAME</UserInfoTitle>
                            <UserInfoContent>
                                <FormInput type="text" placeholder="Gildong" />
                            </UserInfoContent>
                        </UserInfo>

                        <UserInfo>
                            <UserInfoTitle>EMAIL</UserInfoTitle>
                            <UserInfoContent>
                                <FormInput type="email" value={user?.email ?? "-"} placeholder="gildong01@gmail.com" readOnly />
                            </UserInfoContent>
                        </UserInfo>

                        <UserInfo>
                            <UserInfoTitle>PASSWORD</UserInfoTitle>
                            <UserInfoContent>
                                <FormInput type="password" value="" placeholder="Password" />
                            </UserInfoContent>
                        </UserInfo>

                        <UserInfo>
                            <UserInfoTitle>PLAYSTYLE</UserInfoTitle>
                            <UserInfoContent>
                                <Playstyle>
                                    <PlaystyleLabel>
                                        <PlaystyleInput type="checkbox" name="playstyle" value="hard_contents" />
                                        <PlaystyleText>#hard_contents</PlaystyleText> 
                                    </PlaystyleLabel>
                                    <PlaystyleLabel>
                                        <PlaystyleInput type="checkbox" name="playstyle" value="housing" />
                                        <PlaystyleText>#housing</PlaystyleText> 
                                    </PlaystyleLabel>
                                    <PlaystyleLabel>
                                        <PlaystyleInput type="checkbox" name="playstyle" value="C&G" />
                                        <PlaystyleText>#C&G</PlaystyleText> 
                                    </PlaystyleLabel>
                                    <PlaystyleLabel>
                                        <PlaystyleInput type="checkbox" name="playstyle" value="screenshots" />
                                        <PlaystyleText>#screenshots</PlaystyleText> 
                                    </PlaystyleLabel>
                                </Playstyle>
                            </UserInfoContent>
                        </UserInfo>

                        <UserInfo>
                            <UserInfoTitle>PLAYER</UserInfoTitle>
                            <UserInfoContent>
                                <FormInput type="" placeholder="" />
                            </UserInfoContent>
                        </UserInfo>

                    </UserDesc>
                </UserDetails>
                <FormInput type="submit" className="bg-point" value="EDIT" />
            </Form>
        </Wrapper>
    );
}