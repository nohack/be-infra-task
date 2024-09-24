import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserArray = [
    {
      uid: '1',
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      uid: '2',
      firstName: 'Jane',
      lastName: 'Smith',
    },
  ];

  const mockNewUser = {
    uid: '3',
    firstName: 'Michael',
    lastName: 'Jordan',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(mockUserArray),
            findOneBy: jest.fn().mockImplementation(({ uid }) => 
              mockUserArray.find(user => user.uid === uid)),
            save: jest.fn().mockResolvedValue(mockNewUser),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully create a new user', async () => {
      const newUserDto = { firstName: 'Michael', lastName: 'Jordan' };
      const result = await service.create(newUserDto);
      
      expect(result).toEqual(mockNewUser);
      expect(repository.save).toBeCalledWith(newUserDto);  // Ensuring save was called
    });
  });

  describe('findAll()', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();

      expect(users).toEqual(mockUserArray);
      expect(repository.find).toBeCalledTimes(1);  // Ensuring find was called
    });
  });

  describe('findOne()', () => {
    it('should return a single user when a valid uid is provided', async () => {
      const user = await service.findOne('1');

      expect(user).toEqual(mockUserArray[0]);
      expect(repository.findOneBy).toBeCalledWith({ uid: '1' });
    });

    it('should return undefined if user is not found', async () => {
      const user = await service.findOne('999');

      expect(user).toBeUndefined();  // Expect no user for an invalid uid
    });
  });

  describe('remove()', () => {
    it('should successfully remove a user', async () => {
      const result = await service.remove('1');

      expect(result).toBeUndefined();
      expect(repository.delete).toBeCalledWith('1');
    });
  });
});
