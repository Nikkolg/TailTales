import { styled } from "styled-components";

export const BlogWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row; 
    border: 1px solid black;
    flex-wrap: wrap;
`;

export const NewPostButton = styled.div`
    margin-left: auto;
    flex: 0 0 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;

export const BlogAvatar = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
`;

export const Post = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border: 1px solid black;
    flex: 3;
`;

export const AvatarPost = styled.div`
    margin: 50px;
    width: 70%;
    height: 70%;
    border: 1px solid black;
    padding: 10px;
`

export const TimePost = styled.div`
    display: flex;
    justify-content: flex-start;
    flex: 3;
`

export const EditPost = styled.button`
    flex: 1;
`

export const DeletePost = styled.button`
    flex: 1;
`

export const TextPost = styled.div`
    border: 1px solid black;
    flex: 0 0 100%;
`

export const FooterPosts = styled.div`
    flex: 0 0 100%;
    border: 1px solid black;
`







export const NewPost = styled.form`
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid black;
    margin: 0 auto;
    padding: 50px;
`