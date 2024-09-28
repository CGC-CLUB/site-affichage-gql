import { PostFilterInput, UserFilterInput } from "@/types";
import prisma from "@/utils/prisma";
import Filter from "@/utils/filter";

export function getUsers(filter?: UserFilterInput) {
  const where = Filter<UserFilterInput>(filter);
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
  const where = Filter<PostFilterInput>(filter);
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
