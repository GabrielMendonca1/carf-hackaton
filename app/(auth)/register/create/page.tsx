import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  REGISTER_ONBOARDING_COOKIE,
  REGISTER_ONBOARDING_DATA_COOKIE,
  type OnboardingProfile,
} from "../onboarding-config";
import RegisterForm from "./register-form";

export default async function Page() {
  const cookieStore = await cookies();

  if (!cookieStore.get(REGISTER_ONBOARDING_COOKIE)) {
    redirect("/register");
  }

  const onboardingData = cookieStore.get(REGISTER_ONBOARDING_DATA_COOKIE)?.value;

  let defaultProfile: OnboardingProfile | undefined;
  if (onboardingData) {
    try {
      defaultProfile = JSON.parse(onboardingData) as OnboardingProfile;
    } catch (error) {
      console.error("Failed to parse onboarding data cookie", error);
    }
  }

  return <RegisterForm defaultProfile={defaultProfile} />;
}
