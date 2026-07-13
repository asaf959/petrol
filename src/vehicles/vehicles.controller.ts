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
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@ApiTags('Vehicles')
@ApiBearerAuth('JWT-auth')
@Controller()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post('vehicle')
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully' })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get('vehicle')
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({ status: 200, description: 'List of all vehicles' })
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get('vehicle/:id')
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Vehicle found' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.findOne(id);
  }

  @Put('vehicle/:id/update')
  @ApiOperation({ summary: 'Update a vehicle by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete('vehicle/:id/destroy')
  @ApiOperation({ summary: 'Delete a vehicle by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Vehicle deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.remove(id);
  }

  @Get('fuelRecordByVehicle/:vehicleId')
  @ApiOperation({ summary: 'Get all fuel records for a specific vehicle' })
  @ApiParam({ name: 'vehicleId', type: Number })
  @ApiResponse({ status: 200, description: 'Fuel records for the vehicle' })
  getFuelRecords(@Param('vehicleId', ParseIntPipe) vehicleId: number) {
    return this.vehiclesService.getFuelRecordsByVehicle(vehicleId);
  }

  @Get('profitByVehicle/:vehicleId')
  @ApiOperation({ summary: 'Get all profit records for a specific vehicle' })
  @ApiParam({ name: 'vehicleId', type: Number })
  @ApiResponse({ status: 200, description: 'Profit records for the vehicle' })
  getProfits(@Param('vehicleId', ParseIntPipe) vehicleId: number) {
    return this.vehiclesService.getProfitsByVehicle(vehicleId);
  }
}
