import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Profit } from '../profits/entities/profit.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

export type ProfitDateFilter = {
  year?: number;
  month?: number;
  day?: number;
};

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  async findAll() {
    return this.vehicleRepository.find();
  }

  async findOne(id: number) {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    if (!vehicle) throw new NotFoundException(`Vehicle with id ${id} not found`);
    return vehicle;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);
    Object.assign(vehicle, updateVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  async remove(id: number) {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
    return { message: `Vehicle ${id} deleted successfully` };
  }

  async getFuelRecordsByVehicle(vehicleId: number) {
    await this.findOne(vehicleId);
    return this.vehicleRepository.manager.find('FuelRecord', {
      where: { vehicle_id: vehicleId },
      relations: ['vehicle', 'station', 'logs'],
    });
  }

  async getProfitsByVehicle(vehicleId: number, filters: ProfitDateFilter = {}) {
    await this.findOne(vehicleId);

    const qb = this.vehicleRepository.manager
      .getRepository(Profit)
      .createQueryBuilder('profit')
      .leftJoinAndSelect('profit.vehicle', 'vehicle')
      .leftJoinAndSelect('profit.station', 'station')
      .where('profit.vehicle_id = :vehicleId', { vehicleId })
      .orderBy('profit.date', 'DESC')
      .addOrderBy('profit.id', 'DESC');

    if (filters.year && Number.isFinite(filters.year)) {
      qb.andWhere('EXTRACT(YEAR FROM profit.date) = :year', {
        year: filters.year,
      });
    }
    if (filters.month && Number.isFinite(filters.month)) {
      qb.andWhere('EXTRACT(MONTH FROM profit.date) = :month', {
        month: filters.month,
      });
    }
    if (filters.day && Number.isFinite(filters.day)) {
      qb.andWhere('EXTRACT(DAY FROM profit.date) = :day', {
        day: filters.day,
      });
    }

    return qb.getMany();
  }
}
