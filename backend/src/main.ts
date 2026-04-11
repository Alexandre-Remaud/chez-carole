import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ConfigService } from "@nestjs/config"
import helmet from "helmet"
import { ValidationPipe } from "@nestjs/common"
import { Response, NextFunction } from "express"
import cookieParser from "cookie-parser"
import express from "express"
import * as path from "node:path"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  app.use(cookieParser())
  app.use(helmet())
  app.enableCors({
    origin: configService.get<string>("FRONTEND_URL", "http://localhost:5173"),
    credentials: true
  })

  app.use(
    "/uploads",
    (_req: unknown, res: Response, next: NextFunction) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin")
      next()
    },
    express.static(path.join(process.cwd(), "uploads"))
  )

  const port = configService.get<number>("PORT", 3000)
  try {
    await app.listen(port)
    console.log(`Server running on ${port}`)
  } catch (err) {
    console.error("Failed to start server:", err)
    process.exit(1)
  }
}
void bootstrap()
