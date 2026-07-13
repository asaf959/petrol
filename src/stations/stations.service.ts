import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './entities/station.entity';
import { FuelRecord } from '../fuel-records/entities/fuel-record.entity';
import { Profit } from '../profits/entities/profit.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    @InjectRepository(FuelRecord)
    private fuelRecordRepository: Repository<FuelRecord>,
    @InjectRepository(Profit)
    private profitRepository: Repository<Profit>,
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
    const records = await this.fuelRecordRepository.find({
      where: { station_id: stationId },
      relations: ['vehicle', 'station', 'logs'],
      order: { date: 'DESC', id: 'DESC' },
    });

    // Keep returning a plain array so existing clients stay compatible.
    // Amounts are always numeric floats from the entity.
    return records.map((r) => ({
      ...r,
      total_amount: Number(r.total_amount) || 0,
      amount_paid: Number(r.amount_paid) || 0,
      amount_remaining: Number(r.amount_remaining) || 0,
    }));
  }

  async getProfitsByStation(stationId: number) {
    await this.findOne(stationId);
    return this.profitRepository.find({
      where: { station_id: stationId },
      relations: ['vehicle', 'station'],
      order: { date: 'DESC', id: 'DESC' },
    });
  }
}
