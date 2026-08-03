"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface Evento {
  id: string;
  nome: string;
  data: string;
  statusNf: string;
  lucroEstimado: number;
}

export default function VisualizarEventos() {
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEventos = async () => {
    try {
      const q = query(collection(db, "eventos"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const listaEventos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Evento[];
      
      setEventos(listaEventos);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      try {
        await deleteDoc(doc(db, "eventos", id));
        setEventos(eventos.filter(evento => evento.id !== id));
      } catch (error) {
        console.error("Erro ao deletar evento:", error);
        alert("Erro ao excluir o evento.");
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex flex-col flex-1 items-center font-sans bg-[#000000] min-h-screen py-8 px-4 sm:px-6 text-[#fcefe0]">
      <main className="flex w-full max-w-4xl flex-col px-6 py-8 md:p-10 bg-[#023270]/20 text-[#fcefe0] sm:rounded-2xl sm:border sm:border-[#023270] shadow-xl">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#023270]">
          <button 
            onClick={() => router.push("/")}
            className="text-[#fcefe0]/70 hover:text-[#fcefe0] transition-colors text-sm font-medium"
          >
            ← Início
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-[#fcefe0]">Meus Eventos</h1>
          <button 
            onClick={() => router.push("/formEvento")}
            className="text-sm bg-[#fcefe0] hover:bg-white text-[#000000] px-4 py-2 rounded-lg font-bold transition-colors shadow"
          >
            + Novo
          </button>
        </div>

        {/* Lista de Eventos */}
        {loading ? (
          <div className="flex justify-center py-10 text-[#fcefe0]/70">Carregando eventos...</div>
        ) : eventos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-[#fcefe0]/70 text-center gap-4">
            <p>Nenhum evento encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {eventos.map((evento) => (
              <div key={evento.id} className="bg-[#023270]/40 border border-[#023270] rounded-2xl p-5 flex flex-col gap-4 hover:border-[#fcefe0]/40 transition-all shadow-lg">
                
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col">
                    <h2 className="font-bold text-lg leading-tight mb-1 text-[#fcefe0]">{evento.nome}</h2>
                    <span className="text-xs text-[#fcefe0]/70 flex items-center gap-1">
                      📅 {formatDate(evento.data)}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    evento.statusNf === "Emitida" ? "bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30" : "bg-[#023270] text-[#fcefe0] border border-[#fcefe0]/30"
                  }`}>
                    {evento.statusNf}
                  </span>
                </div>

                <div className="bg-[#000000]/40 rounded-xl p-3 border border-[#023270] flex justify-between items-center mt-2">
                  <span className="text-sm text-[#fcefe0]/70">Lucro Estimado</span>
                  <span className={`font-bold ${evento.lucroEstimado >= 0 ? 'text-[#22c55e]' : 'text-red-500'}`}>
                    {formatCurrency(evento.lucroEstimado)}
                  </span>
                </div>

                <div className="flex gap-3 mt-2">
                  <button 
                    onClick={() => router.push(`/formEvento/${evento.id}`)}
                    className="flex-1 py-2 bg-[#023270] hover:bg-[#023270]/80 text-[#fcefe0] rounded-lg text-sm font-medium transition-colors border border-[#fcefe0]/20"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(evento.id)}
                    className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
                  >
                    🗑️ Excluir
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}