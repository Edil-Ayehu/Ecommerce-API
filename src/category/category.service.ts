import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ){}

    async create (createCategoryDto: CreateCategoryDto) {
        const category = await this.categoryRepository.create(createCategoryDto)
        return await this.categoryRepository.save(category);
    }

    findAll(){
        return this.categoryRepository.find()
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
