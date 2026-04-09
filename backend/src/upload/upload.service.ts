import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  ForbiddenException
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { Image, type ImageDocument } from "./entities/image.entity.js"
import {
  STORAGE_SERVICE,
  type StorageService
} from "./storage/storage.interface.js"

const ALLOWED_MIMETYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

const MAGIC_BYTES: Record<string, { offset: number; bytes: number[] }> = {
  "image/jpeg": { offset: 0, bytes: [0xff, 0xd8, 0xff] },
  "image/png": { offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47] },
  "image/webp": { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }
}

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<Image>,
    @Inject(STORAGE_SERVICE) private storage: StorageService
  ) {}

  async upload(
    file: Express.Multer.File,
    userId: string
  ): Promise<ImageDocument> {
    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        "Format non supporté. Formats acceptés : JPEG, PNG, WebP."
      )
    }

    const magic = MAGIC_BYTES[file.mimetype]
    if (
      !magic ||
      file.buffer.length < magic.offset + magic.bytes.length ||
      !magic.bytes.every((b, i) => file.buffer[magic.offset + i] === b)
    ) {
      throw new BadRequestException(
        "Le contenu du fichier ne correspond pas au type déclaré."
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        "Le fichier dépasse la taille maximale de 5 Mo."
      )
    }

    const result = await this.storage.upload(
      file.buffer,
      file.originalname,
      file.mimetype
    )

    return this.imageModel.create({
      ...result,
      userId: new Types.ObjectId(userId)
    })
  }

  async delete(publicId: string, userId: string): Promise<void> {
    const image = await this.imageModel.findOne({ publicId })

    if (!image) {
      throw new NotFoundException("Image non trouvée.")
    }

    if (image.userId.toString() !== userId) {
      throw new ForbiddenException(
        "Vous ne pouvez supprimer que vos propres images."
      )
    }

    await this.storage.delete(publicId)
    await this.imageModel.deleteOne({ _id: image._id })
  }

  async deleteByPublicId(publicId: string): Promise<void> {
    const image = await this.imageModel.findOne({ publicId })
    if (!image) return

    await this.storage.delete(publicId)
    await this.imageModel.deleteOne({ _id: image._id })
  }
}
