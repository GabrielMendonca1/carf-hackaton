"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { markOnboardingComplete } from "./actions";
import {
  type OnboardingProfile,
  onboardingAreas,
  onboardingRolesByArea,
} from "./onboarding-config";

export default function Page() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<OnboardingProfile>({
    firstName: "",
    lastName: "",
    cpf: "",
    areaOfExpertise: "",
    role: "",
  });

  const availableRoles = useMemo(
    () => onboardingRolesByArea[profile.areaOfExpertise] ?? [],
    [profile.areaOfExpertise]
  );

  const isValid =
    profile.firstName.trim().length > 1 &&
    profile.lastName.trim().length > 1 &&
    /^\d{11}$/.test(profile.cpf) &&
    profile.areaOfExpertise.length > 0 &&
    profile.role.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      setError("Preencha todas as informações para continuar.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await markOnboardingComplete({
          firstName: profile.firstName.trim(),
          lastName: profile.lastName.trim(),
          cpf: profile.cpf.trim(),
          areaOfExpertise: profile.areaOfExpertise,
          role: profile.role,
        });
        router.push("/register/create");
      } catch (submitError) {
        console.error("Failed to complete onboarding:", submitError);
        setError("Não foi possível avançar. Tente novamente.");
      }
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold" data-testid="onboarding-heading">
                    Bem-vindo
                  </h1>
                  <p className="text-balance text-muted-foreground">
                    Compartilhe alguns dados para personalizarmos sua experiência
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      autoComplete="given-name"
                      id="firstName"
                      onChange={(event) =>
                        setProfile((prev) => ({
                          ...prev,
                          firstName: event.target.value,
                        }))
                      }
                      placeholder="Ana"
                      required
                      value={profile.firstName}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      autoComplete="family-name"
                      id="lastName"
                      onChange={(event) =>
                        setProfile((prev) => ({
                          ...prev,
                          lastName: event.target.value,
                        }))
                      }
                      placeholder="Silva"
                      required
                      value={profile.lastName}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      autoComplete="off"
                      id="cpf"
                      inputMode="numeric"
                      maxLength={14}
                      onChange={(event) => {
                        const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 11);
                        setProfile((prev) => ({
                          ...prev,
                          cpf: digitsOnly,
                        }));
                      }}
                      placeholder="00000000000"
                      required
                      value={profile.cpf}
                    />
                    <span className="text-xs text-muted-foreground">
                      Informe apenas números (11 dígitos).
                    </span>
                  </div>

                  <div className="grid gap-2">
                    <Label>Área de atuação</Label>
                    <Select
                      value={profile.areaOfExpertise}
                      onValueChange={(value) =>
                        setProfile((prev) => ({
                          ...prev,
                          areaOfExpertise: value,
                          role: "",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a área" />
                      </SelectTrigger>
                      <SelectContent>
                        {onboardingAreas.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {profile.areaOfExpertise && (
                    <div className="grid gap-2">
                      <Label>Função</Label>
                      <Select
                        value={profile.role}
                        onValueChange={(value) =>
                          setProfile((prev) => ({
                            ...prev,
                            role: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-sm font-medium text-destructive" role="alert">
                    {error}
                  </p>
                )}

                <Button
                  className="w-full"
                  data-testid="onboarding-continue"
                  disabled={!isValid || isPending}
                  type="submit"
                >
                  {isPending ? "Preparando..." : "Avançar para cadastro"}
                </Button>

                <div className="text-center text-sm">
                  Já possui uma conta?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Entrar
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground mt-4 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          Ao continuar, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
          e <a href="#">Política de Privacidade</a>.
        </div>
      </div>
    </div>
  );
}
