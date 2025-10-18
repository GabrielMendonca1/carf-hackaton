"use server";

import { cookies } from "next/headers";
import { z } from "zod";

import {
  REGISTER_ONBOARDING_COOKIE,
  REGISTER_ONBOARDING_DATA_COOKIE,
  type OnboardingProfile,
} from "./onboarding-config";

const onboardingProfileSchema = z.object({
  firstName: z.string().min(2, "Informe um nome válido."),
  lastName: z.string().min(2, "Informe um sobrenome válido."),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve conter 11 dígitos numéricos."),
  areaOfExpertise: z.enum(["1", "2", "3", "4"]),
  role: z.string().min(2, "Selecione uma função válida."),
});

export async function markOnboardingComplete(data: OnboardingProfile) {
  const profile = onboardingProfileSchema.parse(data);
  const cookieStore = await cookies();

  cookieStore.set(REGISTER_ONBOARDING_COOKIE, "true", {
    path: "/",
    maxAge: 60 * 10,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  cookieStore.set(REGISTER_ONBOARDING_DATA_COOKIE, JSON.stringify(profile), {
    path: "/",
    maxAge: 60 * 10,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearOnboardingFlag() {
  const cookieStore = await cookies();
  cookieStore.delete(REGISTER_ONBOARDING_COOKIE);
  cookieStore.delete(REGISTER_ONBOARDING_DATA_COOKIE);
}
