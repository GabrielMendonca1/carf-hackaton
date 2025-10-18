import { redirect } from "next/navigation";
import { auth } from "../../(auth)/auth";
import { ConsultarPageClient } from "./page-client";

export const metadata = {
  title: "Consultar Processos | CARF",
  description: "Visão panorâmica de todos os processos em andamento no CARF",
};

export default async function ConsultarPage() {
  const session = await auth();

  if (!session) {
    redirect(`/login?redirectUrl=${encodeURIComponent("/consultar")}`);
  }

  return <ConsultarPageClient />;
}
