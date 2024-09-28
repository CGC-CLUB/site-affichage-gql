import { PostFilterInput, UserFilterInput } from "@/types";
import prisma from "@/utils/prisma";

export function getUsers(filter?: UserFilterInput) {
  const where: UserFilterInput = {};
  if (filter) {
    console.log(filter);
    if (filter.id) {
      where.id = filter.id;
    }
    if (filter.email) {
      where.email = filter.email;
    }
    if (filter.first_name) {
      where.first_name = filter.first_name;
    }
    if (filter.family_name) {
      where.family_name = filter.family_name;
    }
    if (typeof filter.validated === "boolean") {
      where.validated = filter.validated;
    }
    if (filter.role) {
      where.role = filter.role;
    }
  }
  return prisma.user.findMany({
    where,
    include: {
      Post: true,
      Department: true,
    },
  });
}

export function getUser(id: string) {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      Post: true,
      Department: true,
    },
  });
}

export function getPosts(filter?: PostFilterInput) {
  const where: PostFilterInput = {};
  if (filter) {
    if (filter.id) {
      where.id = filter.id;
    }
    if (typeof filter.validated === "boolean") {
      where.validated = filter.validated;
    }
    if (filter.content) {
      where.content = filter.content;
    }
  }
  return prisma.post.findMany({
    where,
    include: {
      author: true,
    },
  });
}

export function getPost(id: string) {
  return prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      author: true,
    },
  });
}

export function getDepartments() {
  return prisma.department.findMany({
    include: {
      TVs: true,
      chef: true,
    },
  });
}

export function getDepartment(id: string) {
  return prisma.department.findUnique({
    where: {
      id: id,
    },
    include: {
      TVs: true,
      chef: true,
    },
  });
}

export function getTVs() {
  return prisma.tVs.findMany({
    include: {
      Department: true,
    },
  });
}

export function getTV(id: string) {
  return prisma.tVs.findUnique({
    where: {
      id: id,
    },
    include: {
      Department: true,
    },
  });
}
