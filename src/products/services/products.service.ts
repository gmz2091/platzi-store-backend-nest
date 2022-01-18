import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';
import { Between, FindConditions, Repository } from 'typeorm';
import { BrandsService } from './brands.service';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';
import { FilterProductsDto } from '../dtos/products.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
  ) {}

  findAll(params?: FilterProductsDto) {
    if (params) {
      const where: FindConditions<Product> = {};
      const { limit, offset } = params;
      const { maxPrice, minPrice } = params;
      if (minPrice && maxPrice) {
        where.price = Between(minPrice, maxPrice);
      }
      return this.productRepository.find({
        relations: ['categories'],
        take: limit,
        skip: offset,
        where,
      });
    }
    return this.productRepository.find({
      relations: ['categories'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne(id, {
      relations: ['categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    const newProduct = this.productRepository.create(data);

    // if (data.categories_id) {
    //   const categories = await this.categoryRepo.findByIds(data.categories_id);
    //   newProduct.categories = categories;
    // }
    if (data.categories_id) {
      const category = await this.categoryRepo.findOne(data.categories_id);
      newProduct.categories = category;
      return this.productRepository.save(newProduct);
    }
  }

  // async update(id: number, changes: UpdateProductDto) {
  //   const product = await this.productRepository.findOne(id);
  //   if (!product) {
  //     throw new NotFoundException(`Product #${id} not found`);
  //   }

  //   if (changes.categories_id) {
  //     const categories = await this.categoryRepo.findByIds(
  //       changes.categories_id,
  //     );
  //     product.categories = categories;
  //   }

  //   this.productRepository.merge(product, changes);
  //   return this.productRepository.save(product);
  // }

  // async removeCategoryByProduct(productId: number, categoryId: number) {
  //   const product = await this.productRepository.findOne(productId, {
  //     relations: ['categories'],
  //   });
  //   product.categories = product.categories.filter(
  //     (item) => item.id !== categoryId,
  //   );
  //   return this.productRepository.save(product);
  // }
}
