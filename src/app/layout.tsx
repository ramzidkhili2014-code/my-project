import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ITDesk Pro - Gestion du Service Informatique & Parc IT",
  description: "Plateforme complète de gestion du support informatique, helpdesk, parc matériel et licences logicielles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
