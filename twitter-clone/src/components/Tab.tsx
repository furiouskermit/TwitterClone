import styled from "styled-components";

const Wrapper = styled.div`
    padding: 10px;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
    border-radius: 100px;
`;
const TabMenu = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-items: center;
    text-align: center;
`;
const TabBtn = styled.button`
    width: 100%;
    padding: 12px 0;
    border-radius: 100px;
    font-weight: bold;
    transition: 0.2s;
    color: var(--text-muted);
    &.active {
        background-color: rgba(var(--point-rgb), 0.18);
        color: var(--point);
    }
    &:not(.active):hover {
        background-color: var(--border-color);
    }
`;

export default function Tab(props: any){
    const { tabCnt, tabTitle, tabValue, currentTab, changeEvent } = props;
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