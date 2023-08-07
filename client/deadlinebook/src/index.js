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

const GET_ALL_COMMENTS = gql`
  query {
    getAllComments {
      id
      postId
      text
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
  const { loading: postsLoading, error: postsError, data: postsData } = useQuery(GET_ALL_POSTS);
  const { loading: commentsLoading, error: commentsError, data: commentsData } = useQuery(GET_ALL_COMMENTS);

  if (postsLoading || commentsLoading) {
    return <div>Loading...</div>;
  }

  if (postsError) {
    return <div>Error loading posts.</div>;
  }

  if (commentsError) {
    return <div>Error loading comments.</div>;
  }

  const posts = postsData.getAllPosts;
  const comments = commentsData.getAllComments;

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>

          <h4>Comments:</h4>
          <ul>
            {comments.map((comment) => (
              comment.postId === post.id && (
                <li key={comment.id}>{comment.text}</li>
              )
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};


const root = document.getElementById('root');
const rootElement = <ParentComponent />;
createRoot(root).render(rootElement);
