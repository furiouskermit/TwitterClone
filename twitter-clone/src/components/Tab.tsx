import styled from "styled-components";

const Wrapper = styled.div`
    padding: 10px;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
    border-radius: 100px;
`;
const TabBtn = styled.button`
    width: 100%;
    padding: 12px 0;
    border-radius: 100px;
    font-weight: bold;
    color: var(--text-muted);
    transition: 0.2s;
    &.active {
        background-color: rgba(var(--point-rgb), 0.18);
        color: var(--point);
    }
    &:not(.active):hover {
        background-color: var(--border-color);
    }
    @media (max-width: 768px)  {
        font-size: 14px;
    }
`;

export default function Tab(props: any){
    const { tabCnt, tabTitle, tabValue, currentTab, changeEvent } = props;
    const TabMenu = styled.div`
        display: grid;
        grid-template-columns: repeat(${tabCnt}, 1fr);
        align-items: center;
        justify-content: space-evenly;
    `;
    return (
        <Wrapper>
            <TabMenu>
                {
                    Array.from({length: tabCnt}, (_, index)=> 
                        <TabBtn 
                            type="button"
                            key={tabValue[index]}
                            onClick={() => changeEvent(tabValue[index])}
                            className={currentTab === tabValue[index] ? "active" : ""}
                        >
                            {tabTitle[index]}
                        </TabBtn>
                    )
                }
            </TabMenu>
        </Wrapper>
    );
}