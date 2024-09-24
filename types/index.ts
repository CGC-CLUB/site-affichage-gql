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
