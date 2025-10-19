"use server";

import { z } from "zod";

import { createUser, getUser } from "@/lib/db/queries";

import { signIn } from "./auth";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerFormSchema = authFormSchema.extend({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  cpf: z.string().regex(/^\d{11}$/),
  areaOfExpertise: z.enum(["1", "2", "3", "4"]),
  role: z.string().min(2),
});

export type LoginActionState = {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
  email: string;
};

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const email = typeof rawEmail === "string" ? rawEmail : "";
  const password = typeof rawPassword === "string" ? rawPassword : "";

  try {
    const parsedData = authFormSchema.safeParse({
      email,
      password,
    });

    if (!parsedData.success) {
      return { status: "invalid_data", email };
    }

    const validatedData = parsedData.data;

    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    if (result && !result.ok) {
      return { status: "failed", email: validatedData.email };
    }

    if (result?.error) {
      return { status: "failed", email: validatedData.email };
    }

    return { status: "success", email: validatedData.email };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data", email };
    }

    return { status: "failed", email };
  }
};

export type RegisterActionState = {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data";
  email: string;
};

export const register = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  const rawEmail = formData.get("email");
  const email = typeof rawEmail === "string" ? rawEmail : "";

  try {
    const parsedData = registerFormSchema.safeParse({
      email,
      password: formData.get("password"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      cpf: formData.get("cpf"),
      areaOfExpertise: formData.get("areaOfExpertise"),
      role: formData.get("role"),
    });

    if (!parsedData.success) {
      return { status: "invalid_data", email };
    }

    const validatedData = parsedData.data;

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: "user_exists", email: validatedData.email };
    }
    await createUser({
      email: validatedData.email,
      password: validatedData.password,
      profile: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        cpf: validatedData.cpf,
        areaOfExpertise: validatedData.areaOfExpertise,
        role: validatedData.role,
      },
    });
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success", email: validatedData.email };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data", email };
    }

    return { status: "failed", email };
  }
};
