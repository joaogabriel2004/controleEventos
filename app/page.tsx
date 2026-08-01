"use client";

import { ButtonInicial } from "./components/buttonInicial";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-[#0c0c10]">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center  py-10 px-16 bg-[#16161e] sm:items-start text-white">
        <h1 className="text-4xl font-bold">IGLA</h1>

        <div className="mt-6 text-lg flex flex-1 gap-15 items-center w-full flex-col">

          <ButtonInicial 
            texto="Adicionar Evento"
            onClick={() => router.push("/formEvento")}
            
          />

          <ButtonInicial 
            texto="Visualizar Eventos"
            onClick={() => router.push("/visualizar-eventos")}
          />
        </div>

        
      </main>
    </div>
  );
}
