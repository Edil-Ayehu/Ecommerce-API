import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  imports: [TypeOrmModule.forFeature([Blog])]
})
export class BlogModule {}
