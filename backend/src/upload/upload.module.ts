import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { MulterModule } from "@nestjs/platform-express"
import { ConfigService } from "@nestjs/config"
import { memoryStorage } from "multer"
import { UploadController } from "./upload.controller.js"
import { UploadService } from "./upload.service.js"
import { Image, ImageSchema } from "./entities/image.entity.js"
import { STORAGE_SERVICE } from "./storage/storage.interface.js"
import { LocalStorageService } from "./storage/local-storage.service.js"
import { S3StorageService } from "./storage/s3-storage.service.js"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    MulterModule.register({
      storage: memoryStorage()
    })
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: STORAGE_SERVICE,
      useFactory: (configService: ConfigService) => {
        const provider = configService.get<string>("STORAGE_PROVIDER", "local")
        return provider === "s3"
          ? new S3StorageService(configService)
          : new LocalStorageService(configService)
      },
      inject: [ConfigService]
    }
  ],
  exports: [UploadService]
})
export class UploadModule {}
