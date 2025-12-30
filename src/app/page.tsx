"use client";
import Step1 from "./content/Step1";
import AppShell from "./_features/AppShell";
import { useEffect } from "react";

export default function Home() {
  const getData = async () => {
    try {
      const data = await fetch("/api/routes/article");
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <AppShell>
      <div className="flex justify-center pt-50 w-screen h-screen">
        <Step1 />
      </div>
    </AppShell>
  );
}
