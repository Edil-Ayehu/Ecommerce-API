import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ){}

    async create (createCategoryDto: CreateCategoryDto) {
        const existing = await this.categoryRepository.findOne({
            where: {name: createCategoryDto.name}
        });
        if(existing) throw new BadRequestException("Category Already Exists")
            
        const category = await this.categoryRepository.create(createCategoryDto)
        return await this.categoryRepository.save(category);
    }

    async findAll(paginationDto:PaginationDto){
        const {page, limit} = paginationDto;

        const [docs, total] = await this.categoryRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        })

        return {
            docs,
            total,
            page,
            limit, 
        }
    }

    async findOne(id:number) {
        const category = await this.categoryRepository.findOne({
            where: {id}
        })

        if(!category) throw new NotFoundException("Category Not Found")

        return category;
    }

    async update(id:number, updateCategoryDto:UpdateCategoryDto) {
        const category = await this.findOne(id)

        if(!category) throw new NotFoundException("Category Not Found")

        const updatedCategory = Object.assign(category,updateCategoryDto)

        return this.categoryRepository.save(updatedCategory);
    }

    async remove(id:number) {
        const category = await this.findOne(id)

        if(!category) throw new NotFoundException("Category Not Found")

        this.categoryRepository.softDelete(id)

        return {
            id,
            deleted: true,
        }
    }
}
