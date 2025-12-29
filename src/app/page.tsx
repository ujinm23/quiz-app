"use client";
import Step1 from "./content/Step1";
import AppShell from "./_features/AppShell";
import { useEffect } from "react";

export default function Home() {

  const getData = async() => {
    try{
    const data = await fetch("/api/routes/article");
    console.log(data);
  } catch(err){
    console.log(err);
  }
}
  useEffect (()=>{
    getData()
  }, []);

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
