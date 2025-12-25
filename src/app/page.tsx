import Header from "./_features/header";
import { AppSidebar } from "./_features/appSideBar";
import Step1 from "./content/Step1";
import AppShell from "./_features/AppShell";

export default function Home() {
  return (
    <AppShell>
      <div className="flex flex-col w-screen h-auto">
        <div className="flex w-full">
          <div className="flex w-auto justify-center items-center">
            <Step1 />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
