export type UserSubPlan = {
  id: string;
  username: string;
  name: string | null;
  email?: string | null;
  subscriptionPlan: "FREE" | "BASIC" | "PRO" | null;
};
