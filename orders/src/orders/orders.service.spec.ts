import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { Orders } from './order.entity';
import { Repository } from 'typeorm';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: Repository<Orders>;

  // Sample data to be used in tests
  const mockOrderArray = [
    {
      orderID: '1',
      isCancelled: false,
    },
    {
      orderID: '2',
      isCancelled: true,
    },
  ];

  const mockNewOrder = {
    orderID: '3',
    isCancelled: false,
  };

  const mockOrdersRepo = {
    find: jest.fn().mockResolvedValue(mockOrderArray),
    findOneBy: jest.fn().mockImplementation(({ orderID }) => 
      mockOrderArray.find(order => order.orderID === orderID)),
    save: jest.fn().mockResolvedValue(mockNewOrder),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Orders),
          useValue: mockOrdersRepo,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<Repository<Orders>>(getRepositoryToken(Orders));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully create a new order', async () => {
      const newOrderDto = { orderID: '4', isCancelled: false };
      const result = await service.create(newOrderDto);
      
      expect(result).toEqual(mockNewOrder);
      expect(repository.save).toBeCalledWith(expect.objectContaining(newOrderDto));  // Ensuring save was called
    });
  });

  describe('findAll()', () => {
    it('should return an array of orders', async () => {
      const orders = await service.findAll();

      expect(orders).toEqual(mockOrderArray);
      expect(repository.find).toBeCalledTimes(1);  // Ensuring find was called
    });
  });

  describe('findOne()', () => {
    it('should return a single order when a valid orderID is provided', async () => {
      const order = await service.findOne('1');

      expect(order).toEqual(mockOrderArray[0]);
      expect(repository.findOneBy).toBeCalledWith({ orderID: '1' });
    });

    it('should return undefined if order is not found', async () => {
      const order = await service.findOne('999');

      expect(order).toBeUndefined();  // Expect no order for an invalid orderID
    });
  });

  describe('remove()', () => {
    it('should successfully remove an order', async () => {
      const result = await service.remove('1');

      expect(result).toBeUndefined();
      expect(repository.delete).toBeCalledWith('1');
    });

    it('should throw an error if no order is removed', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

      await expect(service.remove('999')).rejects.toThrow('Order not found');
    });
  });
});
