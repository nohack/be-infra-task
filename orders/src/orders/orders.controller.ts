import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Orders } from './order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrder: CreateOrderDto): Promise<Orders> {
    return this.ordersService.create(createOrder);
  }

  @Get()
  findAll(): Promise<Orders[]> {
    return this.ordersService.findAll();
  }

  @Get(':orderID')
  findOne(@Param('orderID') orderID: string): Promise<Orders> {
    return this.ordersService.findOne(orderID);
  }

  @Delete(':orderID')
  remove(@Param('orderID') orderID: string): Promise<void> {
    return this.ordersService.remove(orderID);
  }
}
