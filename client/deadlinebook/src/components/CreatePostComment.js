import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from 'apollo-boost';

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

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $text: String!) {
    createComment(postId: $postId, text: $text) {
      id
      postId
      text
      date
    }
  }
`;

const CreatePostComment = ({ postId, setPostId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [text, setText] = useState('');

  const [createPost] = useMutation(CREATE_POST_MUTATION);
  const [createComment, { error: commentError, loading: commentLoading }] = useMutation(CREATE_COMMENT_MUTATION);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    createPost({ variables: { title, content } });
    setTitle('');
    setContent('');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // Use the actual postId passed as a prop to create the comment for the specific post.
    createComment({ variables: { postId, text } })
      .then(() => {
        // Comment creation is successful, reset postId and text states
        setPostId('');
        setText('');
      })
      .catch((error) => {
        // Handle error, if any
        console.error('Error creating comment:', error);
      });
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handlePostSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Create Post</button>
      </form>

      <h2>Create Comment</h2>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          placeholder="Comment text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" disabled={commentLoading}>
          Create Comment
        </button>
        {commentError && <p>Error creating comment: {commentError.message}</p>}
      </form>
    </div>
  );
};

export default CreatePostComment;
