import { Role } from "@prisma/client";

export type CreateUserInput = {
  email: string;
  first_name: string;
  family_name: string;
  password: string;
  role: Role;
};

export type CreatePostInput = {
  content: string;
  image: string;
};

export type CreateDepartmentInput = {
  name: string;
  chef: string;
};

export type CreateTVInput = {
  name: string;
  department: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ValidateUserInput = {
  id: string;
};

export type ValidatePostInput = {
  id: string;
};

export type UserFilterInput = {
  id?: string;
  email?: string;
  first_name?: string;
  family_name?: string;
  validated?: boolean;
  role?: Role;
};

export type PostFilterInput = {
  id?: string;
  validated?: boolean;
  content?: string;
};
