import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { auth } from "../../(auth)/auth";
import { TrendingUp } from "lucide-react";

export const metadata = {
  title: "Performance | CARF",
  description: "Análise de performance e métricas",
};

export default async function PerformancePage() {
  const session = await auth();

  if (!session) {
    redirect(`/login?redirectUrl=${encodeURIComponent("/performance")}`);
  }

  return (
    <div className="flex flex-col w-full h-full">
      <AppHeader />

      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl mx-auto py-6 px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
              <TrendingUp className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Performance
            </h1>
            <p className="text-muted-foreground max-w-md">
              Esta funcionalidade está em desenvolvimento. Em breve você poderá
              visualizar métricas detalhadas de performance e produtividade.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
