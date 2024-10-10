import styled from "styled-components";
import PostScreenshotsForm from "../components/post-screenshots-form";
import TimelineScreenshots from "../components/timeline-screenshots";

const Wrapper = styled.div`
    @media (max-width: 768px) {
        height: 100%;
        padding-bottom: var(--mobile-pb);
    }
`;

export default function Screenshots(){
    
    return (
        <Wrapper className="overflow-y">
            <PostScreenshotsForm />
            <TimelineScreenshots />
        </Wrapper>
    );
}