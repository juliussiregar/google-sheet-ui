const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  return { apiKey, model: OPENAI_MODEL };
}

export function getOpenAIConfigError(): string {
  return "OpenAI API key belum dikonfigurasi. Tambahkan OPENAI_API_KEY di Vercel Environment Variables.";
}
