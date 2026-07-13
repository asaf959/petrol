import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
  ) {}

  async create(createStationDto: CreateStationDto) {
    const station = this.stationRepository.create(createStationDto);
    return this.stationRepository.save(station);
  }

  async findAll() {
    return this.stationRepository.find();
  }

  async findOne(id: number) {
    const station = await this.stationRepository.findOne({ where: { id } });
    if (!station) throw new NotFoundException(`Station with id ${id} not found`);
    return station;
  }

  async update(id: number, updateStationDto: UpdateStationDto) {
    const station = await this.findOne(id);
    Object.assign(station, updateStationDto);
    return this.stationRepository.save(station);
  }

  async remove(id: number) {
    const station = await this.findOne(id);
    await this.stationRepository.remove(station);
    return { message: `Station ${id} deleted successfully` };
  }

  async getFuelRecordsByStation(stationId: number) {
    await this.findOne(stationId);
    return this.stationRepository.manager.find('FuelRecord', {
      where: { station_id: stationId },
      relations: ['vehicle', 'station', 'logs'],
    });
  }

  async getProfitsByStation(stationId: number) {
    await this.findOne(stationId);
    return this.stationRepository.manager.find('Profit', {
      where: { station_id: stationId },
      relations: ['vehicle', 'station'],
    });
  }
}
