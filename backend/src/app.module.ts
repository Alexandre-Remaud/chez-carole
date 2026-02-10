import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { RecipesModule } from "./recipes/recipes.module"
import { validate } from "./config/env.validation"

@Module({
  imports: [
    ConfigModule.forRoot({ validate, isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URI")
      }),
      inject: [ConfigService]
    }),
    RecipesModule
  ]
})
export class AppModule {}
