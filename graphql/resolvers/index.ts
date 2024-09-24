import prisma from "../../utils/primsa";

export function getUsers() {
  return prisma.user.findMany();
}

export function getUser(id: string) {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
  });
}

export function getPosts() {
  return prisma.post.findMany();
}

export function getPost(id: string) {
  return prisma.post.findUnique({
    where: {
      id: id,
    },
  });
}

export function getDepartments() {
  return prisma.department.findMany();
}

export function getDepartment(id: string) {
  return prisma.department.findUnique({
    where: {
      id: id,
    },
  });
}

export function getTVs() {
  return prisma.tVs.findMany();
}

export function getTV(id: string) {
  return prisma.tVs.findUnique({
    where: {
      id: id,
    },
  });
}
