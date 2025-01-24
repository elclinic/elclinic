import type { APIRoute } from "astro";
import postmark from "postmark";

// Настройте клиента Postmark с вашим серверным API-ключом
const client = new postmark.ServerClient('cb424df8-30e9-46a7-a797-3a7f7aeb94c4');

export const POST: APIRoute = async ({ request }) => {
// export const POST: ({request}: { request: any }) => Promise<Response> = async ({ request }) => {
    try {
        const { to, subject, message } = await request.json();

        // Отправка письма через Postmark
        const response = await client.sendEmail({
            From: "admin@elclinic.com.ua", // Ваш подтвержденный отправитель
            To: to,
            Subject: subject,
            TextBody: message,
            MessageStream: "outbound"
        });

        return new Response(JSON.stringify({ success: true, response }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        if (typeof error === "object" && error !== null && "message" in error) {
            console.error("Ошибка:", (error as { message: string }).message);
        } else {
            console.error("Неизвестная ошибка:", error);
        }
        return new Response(JSON.stringify({ success: false }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
