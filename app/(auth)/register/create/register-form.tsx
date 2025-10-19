"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActionState, useCallback, useEffect, useState } from "react";
import { SignupForm } from "@/components/signup-form";
import { toast } from "@/components/toast";
import type { OnboardingProfile } from "../onboarding-config";
import { getAreaLabel, getRoleLabel } from "../onboarding-config";
import { type RegisterActionState, register } from "../../actions";
import { clearOnboardingFlag } from "../actions";

const formatCpf = (value: string) =>
  value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

export default function RegisterForm({
  defaultProfile,
}: {
  defaultProfile?: OnboardingProfile;
}) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<RegisterActionState, FormData>(register, {
    status: "idle",
    email: "",
  });

  const [email, setEmail] = useState(state.email);

  const { update: updateSession } = useSession();

  useEffect(() => {
    setEmail(state.email);
  }, [state.email]);

  useEffect(() => {
    if (state.status === "user_exists") {
      toast({ type: "error", description: "Uma conta com este e-mail já existe." });
    } else if (state.status === "failed") {
      toast({ type: "error", description: "Não foi possível criar a conta." });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Verifique os dados informados e tente novamente.",
      });
    } else if (state.status === "success") {
      toast({ type: "success", description: "Conta criada com sucesso!" });

      void (async () => {
        try {
          await clearOnboardingFlag();
        } catch (error) {
          console.error("Falha ao limpar flag de onboarding:", error);
        }
        await updateSession();
        router.push("/");
      })();
    }
  }, [state.status, updateSession, router]);

  const handleSubmit = useCallback(
    (formData: FormData) => {
      const emailValue = formData.get("email");
      setEmail(typeof emailValue === "string" ? emailValue : "");
      return formAction(formData);
    },
    [formAction]
  );

  const isSuccessful = state.status === "success";
  const isSubmitting = isPending || isSuccessful;

  const profile = defaultProfile ?? {
    firstName: "",
    lastName: "",
    cpf: "",
    areaOfExpertise: "",
    role: "",
  };

  const areaLabel = profile.areaOfExpertise
    ? getAreaLabel(profile.areaOfExpertise)
    : "—";
  const roleLabel =
    profile.areaOfExpertise && profile.role
      ? getRoleLabel(profile.areaOfExpertise, profile.role)
      : "—";
  const formattedCpf =
    profile.cpf.length === 11 ? formatCpf(profile.cpf) : profile.cpf || "—";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-3xl gap-6">
        <div className="mb-6 flex flex-col items-center justify-center gap-2 text-center">
          <h3 className="font-semibold text-xl">Revise suas informações</h3>
          <p className="text-muted-foreground text-sm">
            Confirme os dados antes de finalizar o cadastro
          </p>
          <div className="mt-4 w-full rounded-xl border border-dashed bg-card px-4 py-3 text-left text-xs">
            <p className="font-medium">Resumo das informações</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Nome:</span>{" "}
                {profile.firstName || "—"}
              </li>
              <li>
                <span className="font-medium text-foreground">Sobrenome:</span>{" "}
                {profile.lastName || "—"}
              </li>
              <li>
                <span className="font-medium text-foreground">CPF:</span>{" "}
                {formattedCpf}
              </li>
              <li>
                <span className="font-medium text-foreground">Área de atuação:</span>{" "}
                {areaLabel}
              </li>
              <li>
                <span className="font-medium text-foreground">Função:</span>{" "}
                {roleLabel}
              </li>
            </ul>
          </div>
        </div>
        <SignupForm
          action={handleSubmit}
          email={email}
          onEmailChange={setEmail}
          isSuccessful={isSuccessful}
          isSubmitting={isSubmitting}
          firstName={profile.firstName}
          lastName={profile.lastName}
          cpf={profile.cpf}
          areaOfExpertise={profile.areaOfExpertise}
          role={profile.role}
        />
      </div>
    </div>
  );
}
