export default function filter<T extends Record<string, any>>(data?: T): Partial<T> {
  const where: Partial<T> = {};
  if (data) {
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === "string" || typeof data[key] === "number" || typeof data[key] === "boolean") {
        // @ts-ignore
        where[key] = data[key];
      }
    });

    return where;
  }

  return where;
}
