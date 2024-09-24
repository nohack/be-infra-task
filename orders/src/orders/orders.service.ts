import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Orders } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {}

  create(createOrderDto: CreateOrderDto): Promise<Orders> {
    const orders = new Orders();
    orders.isCancelled = createOrderDto.isCancelled;

    return this.ordersRepository.save(orders);
  }

  async findAll(): Promise<Orders[]> {
    return this.ordersRepository.find();
  }

  findOne(orderID: string): Promise<Orders> {
    return this.ordersRepository.findOneBy({ orderID: orderID });
  }

  async remove(orderID: string): Promise<void> {
    await this.ordersRepository.delete(orderID);
  }
}
