import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import CreatePostComment from './components/CreatePostComment';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';

// Create the Apollo Client instance
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});

// Create a parent component to wrap the CreatePostComment component
const ParentComponent = () => {
  // State to keep track of the selected post id
  const [selectedPostId, setSelectedPostId] = React.useState(null);

  // Assuming you have a list of posts with their respective ids
  const posts = [
    { id: 'post1', title: 'Post 1', content: 'Content of Post 1' },
    { id: 'post2', title: 'Post 2', content: 'Content of Post 2' },
    // Add more posts as needed
  ];

  const handlePostSelect = (postId) => {
    setSelectedPostId(postId);
  };

  return (
    <ApolloProvider client={client}>
      {/* Render the CreatePostComment component */}
      <CreatePostComment postId={selectedPostId} />

      {/* Display the list of posts */}
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <button onClick={() => handlePostSelect(post.id)}>Select Post</button>
        </div>
      ))}
    </ApolloProvider>
  );
};

const root = document.getElementById('root');
const rootElement = <ParentComponent />;
createRoot(root).render(rootElement);
