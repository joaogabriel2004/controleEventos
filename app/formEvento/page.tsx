"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { EventoForm } from "../components/eventoForm";

export default function NovoEventoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCriar = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const eventoData = {
        ...formData,
        promotores: Number(formData.promotores),
        valorServicoNum: parseFloat(formData.valorServico.replace(/[^0-9,.-]+/g, "").replace(",", ".")),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "eventos"), eventoData);
      router.push("/visualizar-eventos");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar o evento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Aqui chamamos o formulário passando a função de salvar
  return <EventoForm onSubmit={handleCriar} isSubmitting={isSubmitting} />;
}