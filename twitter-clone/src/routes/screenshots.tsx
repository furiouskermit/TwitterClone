import styled from "styled-components";
import PostScreenshotsForm from "../components/post-screenshots-form";
import TimelineScreenshots from "../components/timeline-screenshots";

const Wrapper = styled.div``;

export default function Screenshots(){
    
    return (
        <Wrapper>
            <PostScreenshotsForm />
            <TimelineScreenshots />
        </Wrapper>
    );
}