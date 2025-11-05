import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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

    async updateBlog(id:string, updateBlogDto: UpdateBlogDto) {
        const blog = await this.blogRepository.findOne({where: {id}})
        if(!blog) throw new NotFoundException('Blog Not Found');

        const updatedBlog = Object.assign(blog, updateBlogDto);

        return this.blogRepository.save(updatedBlog);
    }

    async deleteBlog(id:string) {
        const blog = await this.blogRepository.findOne({where: {id}})
        if(!blog) throw new NotFoundException('Blog Not Found');

        await this.blogRepository.softDelete(id);
        return {
            id,
            deleted: true,
        }
    }

    async findOne(id:string) {
        const blog = await this.blogRepository.findOne({where: {id}})
        if(!blog) throw new NotFoundException('Blog Not Found with this id!');

        return blog;
    }

    async findAll(paginationDto:PaginationDto) {
        const {page, limit} = paginationDto;

        const [docs, total] = await this.blogRepository.findAndCount({
            skip: (paginationDto.page - 1) * paginationDto.limit,
            take: paginationDto.limit,
        });

        return {
            docs,
            total,
            page,
            limit,
        }
    }
}
