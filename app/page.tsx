"use client";

import { useRouter } from "next/navigation";
import { ButtonInicial } from "./components/buttonInicial";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center font-sans bg-[#0c0c10] text-white px-4 sm:px-6">
      <main className="flex w-full max-w-2xl flex-col items-center py-12 px-6 sm:px-12 bg-[#16161e] sm:rounded-2xl sm:border sm:border-[#ffffff14] shadow-2xl transition-all">
        
        {/* Cabeçalho / Logo */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-[#7c6af5]/10 border border-[#7c6af5]/30 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <span className="text-2xl font-black tracking-wider text-[#7c6af5]">IG</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">IGLA</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-2">
            Gerenciamento inteligente de eventos e custos operacionais
          </p>
        </div>

        {/* Grade / Lista de Botões de Ação */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          <div 
            onClick={() => router.push("/formEvento")}
            className="group relative flex items-center justify-between p-5 bg-[#1c1c2a] border border-[#ffffff14] rounded-xl hover:border-[#7c6af5] hover:bg-[#7c6af5]/5 cursor-pointer transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl p-2 bg-[#7c6af5]/10 rounded-lg group-hover:scale-110 transition-transform">➕</span>
              <div>
                <h3 className="font-semibold text-white group-hover:text-[#7c6af5] transition-colors">Adicionar Evento</h3>
                <p className="text-xs text-gray-400">Cadastrar novo evento e custos</p>
              </div>
            </div>
            <span className="text-gray-500 group-hover:translate-x-1 group-hover:text-[#7c6af5] transition-all">→</span>
          </div>

          <div 
            onClick={() => router.push("/visualizar-eventos")}
            className="group relative flex items-center justify-between p-5 bg-[#1c1c2a] border border-[#ffffff14] rounded-xl hover:border-[#7c6af5] hover:bg-[#7c6af5]/5 cursor-pointer transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl p-2 bg-[#7c6af5]/10 rounded-lg group-hover:scale-110 transition-transform">📊</span>
              <div>
                <h3 className="font-semibold text-white group-hover:text-[#7c6af5] transition-colors">Visualizar Eventos</h3>
                <p className="text-xs text-gray-400">Consultar histórico, editar e acompanhar lucros</p>
              </div>
            </div>
            <span className="text-gray-500 group-hover:translate-x-1 group-hover:text-[#7c6af5] transition-all">→</span>
          </div>
        </div>

        {/* Rodapé sutil */}
        <div className="mt-12 text-center text-xs text-gray-600">
          IGLA © {new Date().getFullYear()}
        </div>

      </main>
    </div>
  );
}