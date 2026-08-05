import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, evento } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-mail não informado." }, { status: 400 });
    }

    const formatCurrency = (val: number) =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    };

    // Monta a lista de custos em HTML
    const custosHtml = evento.custos && evento.custos.length > 0
      ? evento.custos.map((c: { descricao: string; valor: number }) => `
          <li style="margin-bottom: 6px;">
            <strong>${c.descricao}:</strong> ${formatCurrency(c.valor)}
          </li>
        `).join('')
      : '<li>Nenhum custo registrado.</li>';

    // Layout do e-mail nas cores da aplicação (#000000, #023270 e #fcefe0)
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #fcefe0; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
        
        <h1 style="color: #fcefe0; font-size: 22px; margin-bottom: 20px; border-bottom: 1px solid #023270; padding-bottom: 12px;">
          📊 Relatório de Evento: ${evento.nome}
        </h1>

        <div style="margin-bottom: 24px;">
          <p style="margin: 6px 0;"><strong>📅 Data:</strong> ${formatDate(evento.data)}</p>
          <p style="margin: 6px 0;"><strong>📜 Status NF:</strong> ${evento.statusNf || 'Pendente'}</p>
        </div>

        <h3 style="color: #fcefe0; font-size: 16px; border-bottom: 1px solid #023270; padding-bottom: 6px; margin-top: 24px;">
          🧾 Detalhamento de Custos
        </h3>
        <ul style="padding-left: 20px; color: #fcefe0; margin-top: 12px;">
          ${custosHtml}
        </ul>

        <div style="background-color: #023270; padding: 18px; border-radius: 12px; margin-top: 28px; border: 1px solid rgba(252, 239, 224, 0.2);">
          <p style="margin: 4px 0; font-size: 14px; opacity: 0.9;">
            <strong>Total de Custos:</strong> ${formatCurrency(evento.totalCustos)}
          </p>
          <p style="margin: 8px 0 0 0; font-size: 18px; color: ${evento.lucroEstimado >= 0 ? '#22c55e' : '#ef4444'};">
            <strong>Lucro Estimado:</strong> ${formatCurrency(evento.lucroEstimado)}
          </p>
        </div>

      </div>
    `;

    // Envio via Resend
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>", // Altere para seu e-mail cadastrado quando tiver domínio próprio
      to: [email],
      subject: `Relatório do Evento: ${evento.nome}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erro no Resend:", error);
    return NextResponse.json({ error: "Falha ao enviar e-mail." }, { status: 500 });
  }
}