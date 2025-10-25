export type role = "creator" | "member" | "invited";

export type Member = {
  email: string;
  role: role;
};
