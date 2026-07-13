import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { FuelRecordsService } from './fuel-records.service';
import { CreateFuelRecordDto } from './dto/create-fuel-record.dto';
import { UpdateFuelRecordDto } from './dto/update-fuel-record.dto';

@ApiTags('Fuel Records')
@ApiBearerAuth('JWT-auth')
@Controller()
export class FuelRecordsController {
  constructor(private readonly fuelRecordsService: FuelRecordsService) {}

  @Post('fuelRecord')
  @ApiOperation({ summary: 'Create a new fuel record (auto-creates first payment log)' })
  @ApiResponse({ status: 201, description: 'Fuel record created with initial log entry' })
  create(@Body() createFuelRecordDto: CreateFuelRecordDto) {
    return this.fuelRecordsService.create(createFuelRecordDto);
  }

  @Get('fuelRecord')
  @ApiOperation({ summary: 'Get all fuel records with vehicle, station and payment logs' })
  @ApiResponse({ status: 200, description: 'List of all fuel records' })
  findAll() {
    return this.fuelRecordsService.findAll();
  }

  @Get('fuelRecord/:id')
  @ApiOperation({ summary: 'Get a fuel record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Fuel record found' })
  @ApiResponse({ status: 404, description: 'Fuel record not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fuelRecordsService.findOne(id);
  }

  @Put('fuelRecord/:id/update')
  @ApiOperation({
    summary: 'Update a fuel record',
    description:
      'If `amountPaid` is provided, it adds a new payment log entry and recalculates the remaining balance automatically.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Fuel record updated successfully' })
  @ApiResponse({ status: 400, description: 'Payment exceeds remaining balance' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFuelRecordDto: UpdateFuelRecordDto,
  ) {
    return this.fuelRecordsService.update(id, updateFuelRecordDto);
  }

  @Delete('fuelRecord/:id/destroy')
  @ApiOperation({ summary: 'Delete a fuel record and all its logs' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Fuel record deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fuelRecordsService.remove(id);
  }
}
