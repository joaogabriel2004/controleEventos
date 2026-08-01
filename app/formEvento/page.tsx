"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormEvento() {
  const router = useRouter();

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    data: "",
    promotores: "",
    funcao: "",
    valorServico: "",
    statusNf: "Pendente",
    custos: [{ id: 1, descricao: "Transporte", valor: "" }]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNfStatus = (status: string) => {
    setFormData({ ...formData, statusNf: status });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados do Evento:", formData);
    // Aqui você integraria com sua API ou banco de dados
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-[#0c0c10] min-h-screen py-8">
      <main className="flex w-full max-w-md flex-col px-6 py-8 bg-[#16161e] text-white sm:rounded-2xl sm:border sm:border-[#ffffff14] shadow-xl">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Voltar
          </button>
          <h1 className="text-xl font-bold">Novo Evento</h1>
          <div className="w-16"></div> {/* Espaçador para centralizar o título */}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* Seção: Novo Evento */}
          <section className="flex flex-col gap-4">
            <h2 className="text-[#7c6af5] text-sm font-semibold flex items-center gap-2">
              📋 Dados Básicos
            </h2>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Nome do Evento *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Degustação Coca-Cola no Mercado"
                className="bg-[#1c1c2a] border border-[#ffffff14] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6af5] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Data do Evento *</label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="bg-[#1c1c2a] border border-[#ffffff14] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6af5] transition-colors [color-scheme:dark]"
                required
              />
            </div>
          </section>

          {/* Seção: Equipe */}
          <section className="flex flex-col gap-4">
            <h2 className="text-[#7c6af5] text-sm font-semibold flex items-center gap-2">
              👥 Equipe
            </h2>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Nº de Promotores *</label>
              <input
                type="number"
                name="promotores"
                value={formData.promotores}
                onChange={handleChange}
                placeholder="Ex: 3"
                className="bg-[#1c1c2a] border border-[#ffffff14] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6af5] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Função *</label>
              <input
                type="text"
                name="funcao"
                value={formData.funcao}
                onChange={handleChange}
                placeholder="Ex: Promotor(a) de Vendas"
                className="bg-[#1c1c2a] border border-[#ffffff14] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6af5] transition-colors"
                required
              />
            </div>
          </section>

          {/* Seção: Financeiro */}
          <section className="flex flex-col gap-4">
            <h2 className="text-[#7c6af5] text-sm font-semibold flex items-center gap-2">
              🔥 Financeiro
            </h2>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Valor Cobrado pelo Serviço *</label>
              <input
                type="text"
                name="valorServico"
                value={formData.valorServico}
                onChange={handleChange}
                placeholder="R$ 0,00"
                className="bg-[#1c1c2a] border border-[#ffffff14] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6af5] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs text-gray-400">Status da Nota Fiscal</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleNfStatus("Emitida")}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors flex justify-center items-center gap-2 ${
                    formData.statusNf === "Emitida"
                      ? "border-[#22c55e] text-[#22c55e] bg-[#22c55e]/10"
                      : "border-[#ffffff14] text-gray-400 bg-[#1c1c2a] hover:bg-[#252536]"
                  }`}
                >
                  ✓ Emitida
                </button>
                <button
                  type="button"
                  onClick={() => handleNfStatus("Pendente")}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors flex justify-center items-center gap-2 ${
                    formData.statusNf === "Pendente"
                      ? "border-[#7c6af5] text-[#7c6af5] bg-[#7c6af5]/10"
                      : "border-[#ffffff14] text-gray-400 bg-[#1c1c2a] hover:bg-[#252536]"
                  }`}
                >
                  ⏳ Pendente
                </button>
              </div>
            </div>
          </section>

          {/* Botão de Salvar */}
          <button
            type="submit"
            className="mt-6 w-full bg-[#7c6af5] hover:bg-[#6b5ae0] text-white font-semibold py-4 rounded-xl transition-colors shadow-lg shadow-[#7c6af5]/20"
          >
            Salvar Evento
          </button>
        </form>

      </main>
    </div>
  );
}