import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.url(),
  NEXT_PUBLIC_API_BASE_URL: z.url(),
});

type ClientEnv = z.infer<typeof clientEnvSchema>;

const clientEnvConfig: Record<keyof ClientEnv, unknown> = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
};

export const ENV_CLIENT: Readonly<ClientEnv> =
  clientEnvSchema.parse(clientEnvConfig);
