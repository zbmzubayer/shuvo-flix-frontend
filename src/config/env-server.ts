import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  AUTH_SECRET: z.string(),
});

type EnvServer = z.infer<typeof serverEnvSchema>;

const serverEnvServer: Record<keyof EnvServer, unknown> = {
  NODE_ENV: process.env.NODE_ENV || "development",
  AUTH_SECRET: process.env.AUTH_SECRET ?? "auth-secret",
};

export const ENV_SERVER: Readonly<EnvServer> =
  serverEnvSchema.parse(serverEnvServer);
