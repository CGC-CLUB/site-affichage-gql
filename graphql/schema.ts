export const schema = /* GraphQL */ `
  enum Role {
    USER
    CHEF
    ADMIN
  }
  scalar DateTime

  type User {
    id: ID!
    first_name: String
    family_name: String
    email: String
    role: Role
    createdAt: DateTime
    updatedAt: DateTime
    posts: [Post]
    department: Department
    validated: Boolean
  }

  type Post {
    id: ID!
    content: String
    author: User
    image: String
    createdAt: DateTime
    updatedAt: DateTime
    validated: Boolean
    department: Department
  }

  type Department {
    id: ID!
    name: String
    chef: User
    TVs: [TV]
    posts: [Post]
    createdAt: DateTime
    updatedAt: DateTime
  }

  type TV {
    id: ID!
    name: String
    department: Department
    password: String
  }

  type Query {
    users(filter: UserFilterInput): [User]
    user(id: ID!): User
    posts(filter: PostFilterInput): [Post]
    post(id: ID!): Post
    departments: [Department]
    department(id: ID!): Department
    TVs: [TV]
    TV(id: ID!): TV
    me: User
  }

  type Mutation {
    login(input: LoginInput!): User
    createUser(input: CreateUserInput!): User
    createPost(input: CreatePostInput!): Post
    createDepartment(input: CreateDepartmentInput!): Department
    createTV(input: CreateTVInput!): TV
    validateUser(input: ValidateUserInput!): User
    validatePost(input: ValidatePostInput!): Post
  }

  input PostFilterInput {
    id: ID
    validated: Boolean
    content: String
    departmentId: ID
  }

  input UserFilterInput {
    id: ID
    email: String
    first_name: String
    family_name: String
    validated: Boolean
    role: Role
  }

  input CreateUserInput {
    email: String!
    first_name: String!
    family_name: String!
    password: String!
    role: Role!
  }

  input CreatePostInput {
    content: String
    image: String
    departmentId: String!
  }

  input CreateDepartmentInput {
    name: String!
    chef: String!
  }

  input CreateTVInput {
    name: String!
    department: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ValidateUserInput {
    id: ID!
  }

  input ValidatePostInput {
    id: ID!
  }
`;
