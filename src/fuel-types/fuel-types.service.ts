import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuelType } from './entities/fuel-type.entity';
import { CreateFuelTypeDto } from './dto/create-fuel-type.dto';
import { UpdateFuelTypeDto } from './dto/update-fuel-type.dto';

const DEFAULT_FUEL_TYPES = [
  { name: 'Petrol', liter_price: 0 },
  { name: 'Diesel', liter_price: 0 },
  { name: 'CNG', liter_price: 0 },
  { name: 'Petrol 91', liter_price: 0 },
  { name: 'Petrol 95', liter_price: 0 },
];

@Injectable()
export class FuelTypesService implements OnModuleInit {
  constructor(
    @InjectRepository(FuelType)
    private fuelTypeRepository: Repository<FuelType>,
  ) {}

  async onModuleInit() {
    const count = await this.fuelTypeRepository.count();
    if (count === 0) {
      await this.fuelTypeRepository.save(
        DEFAULT_FUEL_TYPES.map((item) => this.fuelTypeRepository.create(item)),
      );
    }
  }

  async create(createFuelTypeDto: CreateFuelTypeDto) {
    const existing = await this.fuelTypeRepository.findOne({
      where: { name: createFuelTypeDto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Fuel type "${createFuelTypeDto.name}" already exists`,
      );
    }
    const fuelType = this.fuelTypeRepository.create(createFuelTypeDto);
    return this.fuelTypeRepository.save(fuelType);
  }

  async findAll() {
    return this.fuelTypeRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number) {
    const fuelType = await this.fuelTypeRepository.findOne({ where: { id } });
    if (!fuelType) {
      throw new NotFoundException(`Fuel type with id ${id} not found`);
    }
    return fuelType;
  }

  async update(id: number, updateFuelTypeDto: UpdateFuelTypeDto) {
    const fuelType = await this.findOne(id);

    if (updateFuelTypeDto.name && updateFuelTypeDto.name !== fuelType.name) {
      const existing = await this.fuelTypeRepository.findOne({
        where: { name: updateFuelTypeDto.name },
      });
      if (existing) {
        throw new ConflictException(
          `Fuel type "${updateFuelTypeDto.name}" already exists`,
        );
      }
    }

    Object.assign(fuelType, updateFuelTypeDto);
    return this.fuelTypeRepository.save(fuelType);
  }

  async remove(id: number) {
    const fuelType = await this.findOne(id);
    await this.fuelTypeRepository.remove(fuelType);
    return { message: `Fuel type ${id} deleted successfully` };
  }
}
