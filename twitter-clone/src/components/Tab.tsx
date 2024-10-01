import styled from "styled-components";

const Wrapper = styled.div``;
const TabMenu = styled.div``;
const TabBtn = styled.button``;

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