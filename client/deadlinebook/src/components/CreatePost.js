import React, { useState, useRef } from 'react';
import { useMutation, gql } from '@apollo/client';

const GET_ALL_POSTS = gql`
  query {
    getAllPosts {
      id
      title
      content
    }
  }
`;

const CREATE_POST_MUTATION = gql`
  mutation createPost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
      date
    }
  }
`;

const CreatePost = ({ postId, setPostId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    update: (cache, { data: { createPost } }) => {
      const existingPosts = cache.readQuery({ query: GET_ALL_POSTS });
      cache.writeQuery({
        query: GET_ALL_POSTS,
        data: { getAllPosts: [...existingPosts.getAllPosts, createPost] },
      });
    },
  });


  const formRef = useRef(null);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    createPost({ variables: { title, content } });
    setTitle('');
    setContent('');
  };

  const handleEnterKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current.submit();
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form ref={formRef} onSubmit={handlePostSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleEnterKey}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
