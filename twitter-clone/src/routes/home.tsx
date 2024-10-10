import styled from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
    height: 100%;
    overflow-y: auto;
    @media (max-width: 768px) {
        padding: 0 0 var(--mobile-pb);
    }
`;

export default function Home(){
    return (
        <Wrapper>
            <PostTweetForm />
            <Timeline />
        </Wrapper>
    );
}