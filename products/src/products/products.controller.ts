import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { CreateProductDto} from "./dto/create-product.dto";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createUserDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':productID')
  findOne(@Param('productID') productID: string): Promise<Product> {
    return this.productsService.findOne(productID);
  }

  @Delete(':productID')
  remove(@Param('productID') productID: string): Promise<void> {
    return this.productsService.remove(productID);
  }
}
