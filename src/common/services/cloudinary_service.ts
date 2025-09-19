import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

async uploadImage(file: Express.Multer.File, folder = 'categories'): Promise<string> {
  try {
    const result = await new Promise<any>((resolve, reject) => { // <-- use any
      const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      stream.end(file.buffer);
    });

    return result.secure_url; // return the Cloudinary URL
  } catch (error) {
    throw new InternalServerErrorException('Failed to upload image to Cloudinary');
  }
}

}
