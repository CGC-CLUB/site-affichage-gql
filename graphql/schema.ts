export const schema = /* GraphQL */ `
  enum Role {
    USER
    CHEF
    ADMIN
  }
  scalar DateTime

  type User {
    id: ID!
    email: String
    family_name: String
    first_name: String
    role: Role
    password: String
    createdAt: DateTime
    posts: [Post]
    departmentId: ID
    department: Department
    validated: Boolean
  }

  type Post {
    id: ID!
    content: String
    author: User
    authorId: ID
    image: String
    createdAt: DateTime
    validated: Boolean
    department: Department
    departmentId: ID
    important: Boolean
  }

  type Department {
    id: ID!
    name: String
    chef: User
    chefId: ID
    TVs: [TV]
    posts: [Post]
    createdAt: DateTime
  }

  type TV {
    id: ID!
    name: String
    department: Department
    departmentId: ID
    password: String
    createdAt: DateTime
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
    loginTv(input: LoginTvInput!): TV
    logout: String
    invalidatePost(input: ValidatePostInput!): Post
    invalidateUser(input: ValidateUserInput!): User
  }

  input PostFilterInput {
    id: ID
    validated: Boolean
    content: String
    departmentId: ID
    authorId: ID
    chefId: ID
  }

  input UserFilterInput {
    id: ID
    email: String
    first_name: String
    family_name: String
    validated: Boolean
    role: Role
  }
  input LoginTvInput {
    name: String!
    password: String!
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
