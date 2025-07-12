import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>
    ) {}

    async createBlog(createBlogDto:CreateBlogDto) {
        const blog = this.blogRepository.create(createBlogDto);
        return this.blogRepository.save(blog)
    }

    async updateBlog(id:number, updateBlogDto: UpdateBlogDto) {
        const blog = await this.blogRepository.findOne({where: {id}})
        if(!blog) throw new NotFoundException('Blog Not Found');

        const updatedBlog = Object.assign(blog, updateBlogDto);

        return this.blogRepository.save(updatedBlog);
    }

    async deleteBlog(id:number) {
        const blog = this.blogRepository.findOne({where: {id}})
        if(!blog) throw new NotFoundException('Blog Not Found');

        await this.blogRepository.softDelete(id);
        return {
            id,
            deleted: true,
        }
    }

    async findOne(id:number) {
        const blog = this.blogRepository.findOne({where: {id}})
        if(!blog) throw new NotFoundException('Blog Not Found');

        return blog;
    }

    findAll() {
        return this.blogRepository.find()
    }
}
