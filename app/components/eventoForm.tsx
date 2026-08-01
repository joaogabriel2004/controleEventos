"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Custo {
  id: number;
  descricao: string;
  valor: string | number;
}

interface EventoData {
  nome: string;
  data: string;
  promotores: string | number;
  funcao: string;
  valorServico: string | number;
  statusNf: string;
  email: string;
  custos: Custo[];
  totalCustos?: number;
  lucroEstimado?: number;
}

interface EventoFormProps {
  initialData?: EventoData;
  onSubmit: (formData: EventoData) => Promise<void>;
  isSubmitting?: boolean;
}

export function EventoForm({ initialData, onSubmit, isSubmitting = false }: EventoFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<EventoData>({
    nome: "",
    data: "",
    promotores: "",
    funcao: "",
    valorServico: "",
    statusNf: "Pendente",
    email: "",
    custos: [{ id: Date.now(), descricao: "", valor: "" }]
  });

  // Atualiza o estado assim que os dados do Firebase chegam na página pai
  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || "",
        data: initialData.data || "",
        promotores: initialData.promotores || "",
        funcao: initialData.funcao || "",
        valorServico: initialData.valorServico || "",
        statusNf: initialData.statusNf || "Pendente",
        email: initialData.email || "",
        custos: initialData.custos && initialData.custos.length > 0 
          ? initialData.custos 
          : [{ id: Date.now(), descricao: "", valor: "" }]
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNfStatus = (status: string) => {
    setFormData({ ...formData, statusNf: status });
  };

  const handleCostChange = (id: number, field: keyof Custo, value: string) => {
    setFormData(prev => ({
      ...prev,
      custos: prev.custos.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const addCost = () => {
    setFormData(prev => ({
      ...prev,
      custos: [...prev.custos, { id: Date.now(), descricao: "", valor: "" }]
    }));
  };

  const removeCost = (id: number) => {
    setFormData(prev => ({
      ...prev,
      custos: prev.custos.filter(c => c.id !== id)
    }));
  };

  const parseCurrency = (value: string | number) => {
    if (!value) return 0;
    const parsed = parseFloat(value.toString().replace(/[^0-9,.-]+/g, "").replace(",", "."));
    return isNaN(parsed) ? 0 : parsed;
  };

  const totalCustos = formData.custos.reduce((acc, custo) => acc + parseCurrency(custo.valor), 0);
  const lucroEstimado = parseCurrency(formData.valorServico) - totalCustos;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, totalCustos, lucroEstimado });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-[#0c0c10] min-h-screen py-8 px-4 sm:px-6">
      <main className="flex w-full max-w-3xl flex-col px-6 py-8 md:p-10 bg-[#16161e] text-white sm:rounded-2xl sm:border sm:border-[#ffffff14] shadow-xl">
        
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => router.back()} type="button" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
            ← Voltar
          </button>
          <h1 className="text-xl md:text-2xl font-bold">{initialData?.nome ? "Editar Evento" : "Novo Evento"}</h1>
          <div className="w-16"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          
          <section className="flex flex-col gap-5">
            <h2 className="text-[#7c6af5] text-sm md:text-base font-semibold flex items-center gap-2 border-b border-[#ffffff14] pb-2">📋 Dados Básicos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs md:text-sm text-gray-400">Nome do Evento *</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="bg-[#1c1c2a] border border-[#ffffff14] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6af5] transition-colors w-full" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs md:text-sm text-gray-400">Data do Evento *</label>
                <input type="date" name="data" value={formData.data} onChange={handleChange} className="bg-[#1c1c2a] border border-[#ffffff14] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6af5] transition-colors [color-scheme:dark] w-full" required />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-[#7c6af5] text-sm md:text-base font-semibold flex items-center gap-2 border-b border-[#ffffff14] pb-2">👥 Equipe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs md:text-sm text-gray-400">Nº de Promotores *</label>
                <input type="number" name="promotores" value={formData.promotores} onChange={handleChange} className="bg-[#1c1c2a] border border-[#ffffff14] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6af5] transition-colors w-full" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs md:text-sm text-gray-400">Função *</label>
                <input type="text" name="funcao" value={formData.funcao} onChange={handleChange} className="bg-[#1c1c2a] border border-[#ffffff14] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6af5] transition-colors w-full" required />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-[#7c6af5] text-sm md:text-base font-semibold flex items-center gap-2 border-b border-[#ffffff14] pb-2">🔥 Financeiro</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs md:text-sm text-gray-400">Valor Cobrado pelo Serviço *</label>
                <input type="text" name="valorServico" value={formData.valorServico} onChange={handleChange} className="bg-[#1c1c2a] border border-[#ffffff14] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6af5] transition-colors w-full" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs md:text-sm text-gray-400">Status da Nota Fiscal</label>
                <div className="flex gap-4">
                  <button type="button" onClick={() => handleNfStatus("Emitida")} className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${formData.statusNf === "Emitida" ? "border-[#22c55e] text-[#22c55e] bg-[#22c55e]/10" : "border-[#ffffff14] text-gray-400 bg-[#1c1c2a]"}`}>✓ Emitida</button>
                  <button type="button" onClick={() => handleNfStatus("Pendente")} className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${formData.statusNf === "Pendente" ? "border-[#7c6af5] text-[#7c6af5] bg-[#7c6af5]/10" : "border-[#ffffff14] text-gray-400 bg-[#1c1c2a]"}`}>⏳ Pendente</button>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-5 bg-[#1c1c2a]/50 p-5 rounded-2xl border border-[#ffffff0a]">
            <h2 className="text-white text-sm md:text-base font-semibold flex items-center gap-2">🧾 Custos da Operação</h2>
            <div className="flex flex-col gap-3">
              {formData.custos.map((custo, index) => (
                <div key={custo.id || index} className="flex gap-3 items-center">
                  <input type="text" value={custo.descricao} onChange={(e) => handleCostChange(custo.id, "descricao", e.target.value)} placeholder={`Custo ${index + 1}`} className="bg-[#1c1c2a] border border-[#ffffff14] rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-[#7c6af5]" />
                  <input type="text" value={custo.valor} onChange={(e) => handleCostChange(custo.id, "valor", e.target.value)} placeholder="0" className="bg-[#1c1c2a] border border-[#ffffff14] rounded-xl px-4 py-3 text-sm w-24 md:w-32 focus:outline-none focus:border-[#7c6af5]" />
                  <button type="button" onClick={() => removeCost(custo.id)} className="text-red-500 hover:text-red-400 px-2 text-xl font-bold">×</button>
                </div>
              ))}
              <button type="button" onClick={addCost} className="mt-2 w-full py-3 rounded-xl text-sm font-medium border border-dashed border-[#ffffff20] text-gray-400 hover:text-white transition-all">+ Adicionar custo</button>
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-white text-sm md:text-base font-semibold flex items-center gap-2">📧 Relatório por E-mail</h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs md:text-sm text-gray-400">E-mail para envio (opcional)</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="bg-[#1c1c2a] border border-[#ffffff14] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6af5] transition-colors w-full" />
            </div>
          </section>

          <div className="bg-[#1c1c2a] rounded-2xl p-6 border border-[#ffffff14] flex justify-between items-center mt-2 shadow-lg">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 mb-1">Lucro estimado</span>
              <span className={`text-xl md:text-2xl font-bold ${lucroEstimado >= 0 ? 'text-[#22c55e]' : 'text-red-500'}`}>{formatCurrency(lucroEstimado)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400 mb-1">Total custos</span>
              <span className="text-lg md:text-xl font-bold text-white">{formatCurrency(totalCustos)}</span>
            </div>
          </div>

          <div className="mt-2">
            <button type="submit" disabled={isSubmitting} className={`w-full text-white font-semibold py-4 rounded-xl transition-all ${isSubmitting ? "bg-gray-600 cursor-not-allowed" : "bg-[#7c6af5] hover:bg-[#6b5ae0]"}`}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}