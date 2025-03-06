import { z } from "zod";

// Define the User type
export interface User {
  id: number;
  username: string;
  password: string;
}

// Define the schema for inserting new users
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;