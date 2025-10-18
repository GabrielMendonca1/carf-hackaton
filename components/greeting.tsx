import { motion } from "framer-motion";
import { SearchSlashIcon, TrendingUp, FileIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";

export const Greeting = () => {
  const shortcuts = [
    {
      Icon: FileIcon,
      label: "Meus processos",
      href: "/processos",
      badge: 8,
    },
    {
      Icon: SearchSlashIcon,
      label: "Consultar processos",
      href: "/consultar",
    },
    {
      Icon: TrendingUp,
      label: "Performance",
      href: "/performance",
    },
  ];

  return (
    <div
      className="mx-auto mt-4 flex size-full max-w-3xl flex-col justify-center px-4 md:mt-12 md:px-8"
      key="overview"
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="font-semibold text-xl md:text-2xl"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
      >
        Bem vindo ao Carf
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-xl text-zinc-500 md:text-2xl"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
      >
        Como posso te ajudar ?
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 flex flex-row flex-wrap gap-4"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.8 }}
      >
        {shortcuts.map(({ Icon, label, href, badge }) => (
          <Link
            className="flex min-w-[12rem] flex-1 flex-col items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
            key={label}
            href={href}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <Icon className="size-5" />
              </div>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <div>
              <p className="font-medium text-zinc-900">{label}</p>
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
};
