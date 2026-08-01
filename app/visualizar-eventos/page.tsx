"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

// Definindo o tipo para ajudar o TypeScript
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

  // Busca os eventos no Firebase ao carregar a página
  const fetchEventos = async () => {
    try {
      // Cria uma query para trazer os eventos ordenados pela data de criação
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
        // Atualiza a lista removendo o item excluído
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
    <div className="flex flex-col flex-1 items-center font-sans bg-[#0c0c10] min-h-screen py-8 px-4 sm:px-6">
      <main className="flex w-full max-w-4xl flex-col px-6 py-8 md:p-10 bg-[#16161e] text-white sm:rounded-2xl sm:border sm:border-[#ffffff14] shadow-xl">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#ffffff14]">
          <button 
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            ← Início
          </button>
          <h1 className="text-xl md:text-2xl font-bold">Meus Eventos</h1>
          <button 
            onClick={() => router.push("/formEvento")}
            className="text-sm bg-[#7c6af5] hover:bg-[#6b5ae0] px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Novo
          </button>
        </div>

        {/* Lista de Eventos */}
        {loading ? (
          <div className="flex justify-center py-10 text-gray-400">Carregando eventos...</div>
        ) : eventos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-center gap-4">
            <p>Nenhum evento encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {eventos.map((evento) => (
              <div key={evento.id} className="bg-[#1c1c2a] border border-[#ffffff14] rounded-2xl p-5 flex flex-col gap-4 hover:border-[#ffffff2a] transition-all">
                
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col">
                    <h2 className="font-bold text-lg leading-tight mb-1">{evento.nome}</h2>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      📅 {formatDate(evento.data)}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    evento.statusNf === "Emitida" ? "bg-[#22c55e]/20 text-[#22c55e]" : "bg-[#7c6af5]/20 text-[#7c6af5]"
                  }`}>
                    {evento.statusNf}
                  </span>
                </div>

                <div className="bg-[#16161e] rounded-xl p-3 border border-[#ffffff0a] flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-400">Lucro Estimado</span>
                  <span className={`font-bold ${evento.lucroEstimado >= 0 ? 'text-[#22c55e]' : 'text-red-500'}`}>
                    {formatCurrency(evento.lucroEstimado)}
                  </span>
                </div>

                <div className="flex gap-3 mt-2">
                  <button 
                    onClick={() => router.push(`/formEvento/${evento.id}`)}
                    className="flex-1 py-2 bg-[#ffffff0a] hover:bg-[#ffffff14] text-white rounded-lg text-sm font-medium transition-colors border border-[#ffffff0a]"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(evento.id)}
                    className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
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