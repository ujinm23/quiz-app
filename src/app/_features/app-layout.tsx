"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import AppHeader from "@/components/AppHeader";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <AppHeader />

        <SidebarProvider>
          <div className="flex min-h-[calc(100vh-64px)]">
            <AppSidebar />

            <main className="flex-1 bg-zinc-50 flex">
              <div className="px-4 pt-4 border-r border-zinc-200 bg-white">
                <SidebarTrigger />
              </div>

              <div className="flex-1">{children}</div>
            </main>
          </div>
        </SidebarProvider>
      </SignedIn>
    </>
  );
}
