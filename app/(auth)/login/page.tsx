"use client";

import Form from "next/form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Suspense,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

import { toast } from "@/components/toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

import { type LoginActionState, login } from "../actions";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const hasRedirectedRef = useRef(false);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  const [state, formAction] = useActionState<LoginActionState, FormData>(login, {
    status: "idle",
  });

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === "failed") {
      toast({
        type: "error",
        description: "Credenciais inválidas. Verifique e tente novamente.",
      });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Verifique os dados informados e tente novamente.",
      });
    }
  }, [state.status]);

  useEffect(() => {
    if (!redirectUrl) {
      setRedirectTarget(null);
      return;
    }

    try {
      const decodedRedirectUrl = decodeURIComponent(redirectUrl);
      const url = new URL(decodedRedirectUrl, window.location.origin);
      const isSameOrigin = url.origin === window.location.origin;
      const hasFileExtension = /\.[^/]+$/.test(url.pathname);
      const isAuthRoute =
        url.pathname.startsWith("/login") || url.pathname.startsWith("/register");

      if (isSameOrigin && !hasFileExtension && !isAuthRoute) {
        setRedirectTarget(
          `${url.pathname}${url.search}${url.hash}` || "/chat"
        );
        return;
      }
    } catch (error) {
      console.error("Invalid redirectUrl provided:", error);
    }

    setRedirectTarget(null);
  }, [redirectUrl]);

  useEffect(() => {
    if (state.status !== "success" || hasRedirectedRef.current) {
      if (state.status !== "success") {
        hasRedirectedRef.current = false;
      }
      return;
    }

    hasRedirectedRef.current = true;
    setIsSuccessful(true);

    void (async () => {
      await updateSession();

      const destination = redirectTarget ?? "/chat";
      router.push(destination);
    })();
  }, [state.status, updateSession, router, redirectTarget]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className={cn("w-full max-w-3xl flex flex-col gap-6")}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <Form action={handleSubmit} className="p-6 md:p-8">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1
                    className="text-2xl font-bold"
                    data-testid="login-heading"
                  >
                    Bem-vindo de volta
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    Acesse sua conta para continuar
                  </p>
                </div>

                <Field>
                  <FieldLabel htmlFor="email">E-mail</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="voce@empresa.com"
                    defaultValue={email}
                    autoComplete="email"
                    autoFocus
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </Field>

                <Field>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSuccessful}
                  >
                    {isSuccessful ? "Entrando..." : "Entrar"}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Não possui uma conta?{" "}
                  <Link
                    href="/register"
                    className="underline underline-offset-4 hover:underline"
                  >
                    Criar conta
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </Form>

            {/* Imagem lateral visível apenas em telas médias+ */}
            <div className="bg-muted relative hidden md:block">
              <img
                src="/placeholder.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>

        <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
          Ao continuar, você concorda com nossos{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:underline hover:text-primary"
          >
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:underline hover:text-primary"
          >
            Política de Privacidade
          </a>
          .
        </FieldDescription>
      </div>
    </div>
  );
}
