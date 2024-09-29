import { useEffect, useState } from "react";
import styled from "styled-components";
import { FormInput } from "../../css/auth-components";

const Wrapper = styled.div``;
const CardBgList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    justify-content: center;
    gap: 15px 7px;
    margin: 0 0 20px;
    padding: 5px 0 0;
`;
const CardBgItem = styled.div``;
const CardBgItemInput = styled.input`
    display: none;
    &:hover + label,
    &:checked + label {
        &::before {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: rgba(var(--point-rgb), 0.5);
        }
    }
`;
const CardBgItemLabel = styled.label`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    border-radius: 100%;
    border: 1px solid var(--border-color);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    &::before {
        content: '';
        transition: 0.1s;
    }
`;
const CardBgItemImg = styled.img`
    width: 80%;
`;

export default function ModalProfileCardBg(props: any){
    const [selectedImg, setSelectedImg] = useState("");
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
            <CardBgList>
                {
                    Array.from({length: 6}, (_, index)=>
                        <CardBgItem key={`cardBgItem${index}`}>
                            <CardBgItemInput type="radio" name="cardBgImg" id={`cardBgImg${index}`} onChange={changeImg} value={`cardBgImg${index}`} defaultChecked={props.curentImg === `/profile/jobs/cardBgImg${index}.png` ? true : false} />
                            <CardBgItemLabel htmlFor={`cardBgImg${index}`}>
                                <CardBgItemImg src={`/profile/jobs/cardBgImg${index}.png`} />
                            </CardBgItemLabel>
                        </CardBgItem>
                    )
                }
            </CardBgList>
            <FormInput type="submit" onClick={sendCardBgImg} className="w-100 bg-point" value="SELECT" />
        </Wrapper>
    );
}