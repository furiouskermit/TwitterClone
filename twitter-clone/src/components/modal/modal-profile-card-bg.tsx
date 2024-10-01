import { useState } from "react";
import styled from "styled-components";
import { FormInput } from "../../css/auth-components";
import { ProfileImgItem, ProfileImgItemInput, ProfileImgItemLabel, ProfileImgList } from "../../css/profile-components";

const Wrapper = styled.div``;
const ProfileImgItemImg = styled.img`
    width: 80%;
`;

export default function ModalProfileCardBg(props: any){
    const [selectedImg, setSelectedImg] = useState(props.curentImg);
    const changeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSelectedImg(`/profile/jobs/${value}.png`);
    }
    
    const sendCardBgImg = () => {
        props.changeEvent(selectedImg);
        props.clickEvent();
    }
    return (
        <Wrapper>
            <ProfileImgList>
                {
                    Array.from({length: 6}, (_, index)=>
                        <ProfileImgItem key={`cardBgItem${index}`}>
                            <ProfileImgItemInput type="radio" name="cardBgImg" id={`cardBgImg${index}`} onChange={changeImg} value={`cardBgImg${index}`} defaultChecked={selectedImg === `/profile/jobs/cardBgImg${index}.png` ? true : false} />
                            <ProfileImgItemLabel htmlFor={`cardBgImg${index}`}>
                                <ProfileImgItemImg src={`/profile/jobs/cardBgImg${index}.png`} />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </ProfileImgItemLabel>
                        </ProfileImgItem>
                    )
                }
            </ProfileImgList>
            <FormInput type="submit" onClick={sendCardBgImg} className="w-100 bg-point" value="SELECT" />
        </Wrapper>
    );
}