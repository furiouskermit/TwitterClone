import styled from "styled-components";
import { ProfileImgItem, ProfileImgItemInput, ProfileImgItemLabel, ProfileImgList } from "../../css/profile-components";
import { FormInput } from "../../css/auth-components";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../../firebase";

const Wrapper = styled.div``;
const ProfileImgItemImg = styled.img``;
const ProfileImgItemUpload = styled.span`
    display: block;
    width: 100%;
    height: 100%;
    background-color: var(--text-muted);
`;

export default function ModalProfileUserImg(props: any){
    const user = auth.currentUser;
    const [selectedImg, setSelectedImg] = useState(props.currentImg);
    const changeFile = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        if(name === "userImg") {
            setSelectedImg(`/profile/user/${e.target.value}.png`);
        } else if(name === "userImgFile") {
            const { files } = e.target;
            if(files && files.length === 1) {
                const imgRef = ref(storage, `profile/${user?.uid}/`);
                const uploadResult = await uploadBytes(imgRef, files[0]);
                const imgUrl = await getDownloadURL(uploadResult.ref);
                setSelectedImg(imgUrl);
            }
        };
    };
    const sendUserImg = async() => {
        props.changeEvent(selectedImg);
        props.clickEvent();
    };
    return (
        <Wrapper>
            <ProfileImgList>
                {
                    Array.from({length: 6}, (_, index) =>
                        <ProfileImgItem key={`cardBgItem${index}`}>
                            {
                                index < 5 ?
                                <>
                                    <ProfileImgItemInput type="radio" onChange={changeFile} name="userImg" id={`UserImg${index < 10 ? `0${index+1}` : index+1}`} value={`UserImg${index < 10 ? `0${index+1}` : index+1}`} defaultChecked={selectedImg === `/profile/user/UserImg${index < 10 ? `0${index+1}` : index+1}.png` ? true : false} />
                                    <ProfileImgItemLabel htmlFor={`UserImg${index < 10 ? `0${index+1}` : index+1}`}>
                                        <ProfileImgItemImg src={`/profile/user/UserImg${index < 10 ? `0${index+1}` : index+1}.png`} className="w-100" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                    </ProfileImgItemLabel>
                                </>
                                :
                                <>
                                    <ProfileImgItemInput type="file" onChange={changeFile} name="userImgFile" id="userImgFile" />
                                    <ProfileImgItemLabel htmlFor="userImgFile" className="custom">
                                        <ProfileImgItemUpload></ProfileImgItemUpload>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </ProfileImgItemLabel>
                                </>
                            }
                            
                        </ProfileImgItem>
                    )
                }
            </ProfileImgList>
            <FormInput type="submit" onClick={sendUserImg} className="w-100 bg-point" value="SELECT" />
        </Wrapper>
    );
}