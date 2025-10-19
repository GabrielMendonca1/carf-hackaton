"use client";

import Form from "next/form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Suspense,
  useActionState,
  useCallback,
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
  const hasRedirectedRef = useRef(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState<LoginActionState, FormData>(login, {
    status: "idle",
    email: "",
  });

  const [email, setEmail] = useState(state.email);

  const status = state.status;

  const { update: updateSession } = useSession();

  useEffect(() => {
    setEmail(state.email);
  }, [state.email]);

  useEffect(() => {
    if (status === "failed") {
      toast({
        type: "error",
        description: "Credenciais inválidas. Verifique e tente novamente.",
      });
    } else if (status === "invalid_data") {
      toast({
        type: "error",
        description: "Verifique os dados informados e tente novamente.",
      });
    }
  }, [status]);

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
    if (status !== "success") {
      hasRedirectedRef.current = false;
      setIsRedirecting(false);
      return;
    }

    if (hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;
    setIsRedirecting(true);

    void (async () => {
      try {
        await updateSession();
      } catch (error) {
        console.error("Failed to refresh session after login:", error);
      }

      router.push(redirectTarget ?? "/chat");
    })();
  }, [status, updateSession, router, redirectTarget]);

  const handleSubmit = useCallback(
    (formData: FormData) => {
      const emailValue = formData.get("email");
      setEmail(typeof emailValue === "string" ? emailValue : "");
      return formAction(formData);
    },
    [formAction]
  );

  const isSubmitting = isPending || isRedirecting;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className={cn("w-full max-w-3xl flex flex-col gap-6")}>
        <Card className="overflow-hidden p-3">
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
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Entrando..." : "Entrar"}
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
                src="/images/carf.png"
                alt="Ilustração do CARF"
                className="absolute inset-0 h-full w-full object-fill dark:brightness-[0.2] dark:grayscale"
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
