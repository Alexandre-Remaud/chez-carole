import "dotenv/config";

const getEnv = (key: string, required = true): string => {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(`❌ Environment variable ${key} is required`);
  }

  return value || "";
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  mongoUri: getEnv("MONGO_URI"),
};
