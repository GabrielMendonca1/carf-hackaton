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
  redirectTo: string;
};

const sanitizeRedirect = (rawRedirect: unknown) => {
  if (typeof rawRedirect !== "string" || rawRedirect.length === 0) {
    return "/";
  }

  try {
    const decoded = decodeURIComponent(rawRedirect);
    if (!decoded.startsWith("/") || decoded.startsWith("//")) {
      return "/";
    }

    if (
      decoded.startsWith("/login") ||
      decoded.startsWith("/register")
    ) {
      return "/";
    }

    if (/\.[^/]+$/.test(decoded.split("?")[0] ?? "")) {
      return "/";
    }

    return decoded || "/";
  } catch {
    return "/";
  }
};

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");
  const rawRedirect = formData.get("redirectUrl");

  const email = typeof rawEmail === "string" ? rawEmail : "";
  const password = typeof rawPassword === "string" ? rawPassword : "";
  const redirectTo = sanitizeRedirect(rawRedirect);

  console.info("[login action] received submit", {
    email,
    hasPassword: password.length > 0,
    redirectTo,
  });

  try {
    const parsedData = authFormSchema.safeParse({
      email,
      password,
    });

    if (!parsedData.success) {
      console.warn("[login action] invalid form data", {
        email,
        issues: parsedData.error.issues,
      });
      return { status: "invalid_data", email, redirectTo };
    }

    const validatedData = parsedData.data;

    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    console.info("[login action] signIn result", {
      type: result ? result.constructor?.name ?? "object" : "nullish",
      keys: result ? Object.keys(result) : null,
      resultOk: (result as any)?.ok ?? null,
      resultStatus: (result as any)?.status ?? null,
      hasError: Boolean((result as any)?.error),
      error: (result as any)?.error ?? null,
    });

    if ((result as any)?.error) {
      console.warn("[login action] signIn returned error", {
        email: validatedData.email,
        error: (result as any).error,
      });
      return {
        status: "failed",
        email: validatedData.email,
        redirectTo,
      };
    }

    if ((result as any)?.ok === false) {
      console.warn("[login action] credentials rejected by signIn", {
        email: validatedData.email,
        status: (result as any).status,
        error: (result as any).error ?? null,
      });
      return {
        status: "failed",
        email: validatedData.email,
        redirectTo,
      };
    }

    console.info("[login action] credentials accepted", {
      email: validatedData.email,
      redirectTo,
    });

    return {
      status: "success",
      email: validatedData.email,
      redirectTo,
    };
  } catch (error) {
    console.error("[login action] caught error", {
      email,
      error,
    });
    if (error instanceof z.ZodError) {
      console.warn("[login action] zod validation error in catch", {
        email,
        issues: error.issues,
      });
      return { status: "invalid_data", email, redirectTo };
    }

    console.error("[login action] unexpected failure", {
      email,
    });
    return { status: "failed", email, redirectTo };
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
