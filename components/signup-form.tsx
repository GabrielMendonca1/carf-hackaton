"use client";

import Form from "next/form";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

interface SignupFormProps {
  action: string | ((formData: FormData) => void | Promise<void>);
  defaultEmail?: string;
  isSuccessful?: boolean;
  firstName?: string;
  lastName?: string;
  cpf?: string;
  areaOfExpertise?: string;
  role?: string;
}

export function SignupForm({
  action,
  defaultEmail = "",
  isSuccessful = false,
  firstName = "",
  lastName = "",
  cpf = "",
  areaOfExpertise = "",
  role = "",
}: SignupFormProps) {
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form action={action} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Criar conta</h1>
                <p className="text-muted-foreground text-balance">
                  Insira suas credenciais para finalizar o cadastro
                </p>
              </div>

              <input name="firstName" type="hidden" value={firstName} />
              <input name="lastName" type="hidden" value={lastName} />
              <input name="cpf" type="hidden" value={cpf} />
              <input name="areaOfExpertise" type="hidden" value={areaOfExpertise} />
              <input name="role" type="hidden" value={role} />

              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="voce@empresa.com"
                  defaultValue={defaultEmail}
                  autoComplete="email"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={isSuccessful}>
                  {isSuccessful ? "Criando conta..." : "Criar conta"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Já possui uma conta?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:underline"
                >
                  Entrar
                </Link>
              </FieldDescription>
            </FieldGroup>
          </Form>

          {/* imagem lateral no desktop */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        Ao continuar, você concorda com nossos{" "}
        <a href="#" className="underline underline-offset-4 hover:underline">
          Termos de Serviço
        </a>{" "}
        e{" "}
        <a href="#" className="underline underline-offset-4 hover:underline">
          Política de Privacidade
        </a>
        .
      </FieldDescription>
    </div>
  );
}
