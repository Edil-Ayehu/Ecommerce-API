import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('blog')
export class BlogController {
    constructor(
        private readonly blogService: BlogService
    ) {}

    @Post('create-blog')
    @Roles('admin', 'superadmin')
    async createBlog(@Body() createBlogDto: CreateBlogDto) {
        const result = await this.blogService.createBlog(createBlogDto);
        return new ResponseDto(result, "Blog created successfully");
    }

    @Patch('update-blog/:id')
    @Roles('admin', 'superadmin')
    async updateBlog(@Param('id') id: string,
        @Body() updateBlogDto: UpdateBlogDto) {
        const result = await this.blogService.updateBlog(id,updateBlogDto);
        return new ResponseDto(result, "Blog updated successfully");
    }

    @Delete('delete-blog/:id')
    @Roles('admin', 'superadmin')
    async  deleteBlog(@Param('id') id:string) {
        const result = await this.blogService.deleteBlog(id);
        return new ResponseDto(result, "Blog deleted successfully");
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const result =  await this.blogService.findOne(id)
        return new ResponseDto(result, "Blog fetched successfully");
    }

    @Get()
    async findAll(@Body() paginationDto:PaginationDto) {
        const result = await  this.blogService.findAll(paginationDto)
        return new ResponseDto(result, "Blogs fetched successfully");
    }

    @Get('filterBlogByTag/:tag')
    async filterByTag(
        @Param('tag') tag: string,
        @Query() paginationDto: PaginationDto,
    ) {
        const result = await this.blogService.findByTag(tag, paginationDto);
        return new ResponseDto(result, 'Filtered blog fetched successfully!');
    }
}
