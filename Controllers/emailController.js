import nodemailer from "nodemailer";

export const enviarPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, msg: "Nenhum arquivo enviado" });
    }

      //Configuração do Nodemailer usando .env
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔹 Enviar e-mail com anexo
    await transporter.sendMail({
      from: `"Dashboard Bot" <${process.env.EMAIL_USER}>`,
      to: "destinatario@gmail.com",
      subject: "Dashboard em PDF",
      text: "Segue em anexo o relatório do dashboard.",
      attachments: [
        {
          filename: "dashboard.pdf",
          content: req.file.buffer,
        },
      ],
    });

    res.json({ ok: true, msg: "PDF enviado com sucesso!" });
  } catch (err) {
    console.error("Erro no envio de email:", err);
    res.status(500).json({ ok: false, msg: "Erro ao enviar PDF" });
  }
};
