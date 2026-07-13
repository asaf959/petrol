import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

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
    const vehicle = await this.findOne(vehicleId);
    return this.vehicleRepository.manager.find('FuelRecord', {
      where: { vehicle_id: vehicleId },
      relations: ['vehicle', 'station', 'logs'],
    });
  }

  async getProfitsByVehicle(vehicleId: number) {
    await this.findOne(vehicleId);
    return this.vehicleRepository.manager.find('Profit', {
      where: { vehicle_id: vehicleId },
      relations: ['vehicle', 'station'],
    });
  }
}
