import React from 'react';
import { createRoot } from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, useMutation, gql } from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import CreatePostComment from './components/CreatePostComment';

if (process.env.NODE_ENV !== "production") {
  loadDevMessages();
  loadErrorMessages();
}

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', 
  cache: new InMemoryCache(),
});

const GET_ALL_POSTS = gql`
  query {
    getAllPosts {
      id
      title
      content
    }
  }
`;

const REMOVE_ALL_POSTS_MUTATION = gql`
  mutation {
    removeAllPosts
  }
`;

const QueryComponent = () => {
  const [removeAllPosts] = useMutation(REMOVE_ALL_POSTS_MUTATION, {
    refetchQueries: [{ query: GET_ALL_POSTS }]
  });

  const { loading: postsLoading, error: postsError, data: postsData } = useQuery(GET_ALL_POSTS);

  if (postsLoading) {
    return <div>Loading...</div>;
  }

  if (postsError) {
    return <div>Error loading posts.</div>;
  }

  const posts = postsData.getAllPosts;

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
      <button onClick={removeAllPosts}>Remove All Posts</button>
    </div>
  );
};

const root = document.getElementById('root');
const rootElement = (
  <ApolloProvider client={client}>
    <CreatePostComment />
    <QueryComponent />
  </ApolloProvider>
);
createRoot(root).render(rootElement);
