import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('blog')
export class BlogController {
    constructor(
        private readonly blogService: BlogService
    ) {}

    @Post('create-blog')
    @Roles('admin', 'superadmin')
    createBlog(@Body() createBlogDto: CreateBlogDto) {
        return this.blogService.createBlog(createBlogDto);
    }

    @Patch('update-blog/:id')
    @Roles('admin', 'superadmin')
    updateBlog(@Param('id', ParseIntPipe) id: number,
        @Body() updateBlogDto: UpdateBlogDto) {
        return this.blogService.updateBlog(id,updateBlogDto);
    }

    @Delete('delete-blog/:id')
    @Roles('admin', 'superadmin')
    deleteBlog(@Param('id', ParseIntPipe) id:number) {
        return this.blogService.deleteBlog(id)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.blogService.findOne(id)
    }

    @Get()
    findAll() {
        return this.blogService.findAll()
    }
}
