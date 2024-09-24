import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  // Sample data to be used in tests
  const mockProductArray = [
    {
      productID: '1',
      productName: 'Product A',
      quantity: 10,
    },
    {
      productID: '2',
      productName: 'Product B',
      quantity: 20,
    },
  ];

  const mockNewProduct = {
    productID: '3',
    productName: 'Product C',
    quantity: 15,
  };

  const mockProductRepo = {
    find: jest.fn().mockResolvedValue(mockProductArray),
    findOneBy: jest.fn().mockImplementation(({ productID }) => 
      mockProductArray.find(product => product.productID === productID)),
    save: jest.fn().mockResolvedValue(mockNewProduct),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully create a new product', async () => {
      const newProductDto = { productName: 'Product C', quantity: 15 };
      const result = await service.create(newProductDto);
      
      expect(result).toEqual(mockNewProduct);
      expect(repository.save).toBeCalledWith(expect.objectContaining(newProductDto));  // Ensuring save was called
    });
  });

  describe('findAll()', () => {
    it('should return an array of products', async () => {
      const products = await service.findAll();

      expect(products).toEqual(mockProductArray);
      expect(repository.find).toBeCalledTimes(1);  // Ensuring find was called
    });
  });

  describe('findOne()', () => {
    it('should return a single product when a valid productID is provided', async () => {
      const product = await service.findOne('1');

      expect(product).toEqual(mockProductArray[0]);
      expect(repository.findOneBy).toBeCalledWith({ productID: '1' });
    });

    it('should return undefined if product is not found', async () => {
      const product = await service.findOne('999');

      expect(product).toBeUndefined();  // Expect no product for an invalid productID
    });
  });

  describe('remove()', () => {
    it('should successfully remove a product', async () => {
      const result = await service.remove('1');

      expect(result).toBeUndefined();
      expect(repository.delete).toBeCalledWith('1');
    });
  });
});
