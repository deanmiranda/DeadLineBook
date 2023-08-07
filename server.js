const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

// Replace 'YourMongoDBURL' with your actual MongoDB URL
const MONGO_DB_URL = 'mongodb://localhost:27017/deadlinebook/db';

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Create Mongoose schemas and models
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
});

const commentSchema = new mongoose.Schema({
  postId: mongoose.Types.ObjectId,
  text: String,
  date: Date,
});

const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

// GraphQL schema
const schema = buildSchema(`
  type Post {
    id: ID!
    title: String!
    content: String!
    date: String!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    postId: ID!
    text: String!
    date: String!
  }

  type Query {
    getPost(id: ID!): Post
    getAllPosts: [Post]
    getComment(id: ID!): Comment
    getAllComments: [Comment]
  }

  type Mutation {
    createPost(title: String!, content: String!): Post
    createComment(postId: ID!, text: String!): Comment
  }
`);

// Root resolver
const root = {
  getPost: async ({ id }) => {
    try {
      const post = await Post.findById(id);
      return post;
    } catch (error) {
      throw new Error('Error fetching post from the database.');
    }
  },

  getAllPosts: async () => {
    try {
      const posts = await Post.find();
      return posts;
    } catch (error) {
      throw new Error('Error fetching posts from the database.');
    }
  },

  getComment: async ({ id }) => {
    try {
      const comment = await Comment.findById(id);
      return comment;
    } catch (error) {
      throw new Error('Error fetching comment from the database.');
    }
  },

  getAllComments: async () => {
    try {
      const comments = await Comment.find();
      return comments;
    } catch (error) {
      throw new Error('Error fetching comments from the database.');
    }
  },

  createPost: async ({ title, content }) => {
    try {
      const post = new Post({ title, content, date: new Date() });
      await post.save();
      return post;
    } catch (error) {
      throw new Error('Error creating post.');
    }
  },

  createComment: async ({ postId, text }) => {
    try {
      const comment = new Comment({ postId, text, date: new Date() });
      await comment.save();
      return comment;
    } catch (error) {
      throw new Error('Error creating comment.');
    }
  },
};

const app = express();

// Define the GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Set this to false in production to disable the GraphQL IDE
}));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/graphql`);
});
