import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@ApiTags('Stations')
@ApiBearerAuth('JWT-auth')
@Controller()
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Post('station')
  @ApiOperation({ summary: 'Create a new station' })
  @ApiResponse({ status: 201, description: 'Station created successfully' })
  create(@Body() createStationDto: CreateStationDto) {
    return this.stationsService.create(createStationDto);
  }

  @Get('station')
  @ApiOperation({ summary: 'Get all stations' })
  @ApiResponse({ status: 200, description: 'List of all stations' })
  findAll() {
    return this.stationsService.findAll();
  }

  @Get('station/:id')
  @ApiOperation({ summary: 'Get a station by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Station found' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stationsService.findOne(id);
  }

  @Put('station/:id/update')
  @ApiOperation({ summary: 'Update a station by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Station updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStationDto: UpdateStationDto,
  ) {
    return this.stationsService.update(id, updateStationDto);
  }

  @Delete('station/:id/destroy')
  @ApiOperation({ summary: 'Delete a station by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Station deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.stationsService.remove(id);
  }

  @Get('fuelRecordByStation/:stationId')
  @ApiOperation({
    summary: 'Get all fuel records for a specific station',
    description:
      'Optional filters: startDate, endDate (YYYY-MM-DD). Omit both to return every record.',
  })
  @ApiParam({ name: 'stationId', type: Number })
  @ApiQuery({ name: 'startDate', required: false, example: '2026-07-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2026-07-31' })
  @ApiResponse({ status: 200, description: 'Fuel records for the station' })
  getFuelRecords(
    @Param('stationId', ParseIntPipe) stationId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.stationsService.getFuelRecordsByStation(stationId, {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  }

  @Get('profitByStation/:stationId')
  @ApiOperation({ summary: 'Get all profit records for a specific station' })
  @ApiParam({ name: 'stationId', type: Number })
  @ApiResponse({ status: 200, description: 'Profit records for the station' })
  getProfits(@Param('stationId', ParseIntPipe) stationId: number) {
    return this.stationsService.getProfitsByStation(stationId);
  }
}
