import React from 'react';
import { createRoot } from 'react-dom/client';
import CreatePostComment from './components/CreatePostComment';
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

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

const ParentComponent = () => {
  const [selectedPostId, setSelectedPostId] = React.useState(null);

  return (
    <ApolloProvider client={client}>
      <CreatePostComment postId={selectedPostId} setPostId={setSelectedPostId} />
      <QueryComponent />
    </ApolloProvider>
  );
};

const QueryComponent = () => {
  const { loading, error, data } = useQuery(GET_ALL_POSTS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading posts.</div>;
  }

  const posts = data.getAllPosts;

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

const root = document.getElementById('root');
const rootElement = <ParentComponent />;
createRoot(root).render(rootElement);
