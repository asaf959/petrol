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
import { FuelTypesService } from './fuel-types.service';
import { CreateFuelTypeDto } from './dto/create-fuel-type.dto';
import { UpdateFuelTypeDto } from './dto/update-fuel-type.dto';

@ApiTags('Fuel Types')
@ApiBearerAuth('JWT-auth')
@Controller()
export class FuelTypesController {
  constructor(private readonly fuelTypesService: FuelTypesService) {}

  @Post('fuelType')
  @ApiOperation({ summary: 'Create a new fuel type with liter price' })
  @ApiResponse({ status: 201, description: 'Fuel type created successfully' })
  @ApiResponse({ status: 409, description: 'Fuel type name already exists' })
  create(@Body() createFuelTypeDto: CreateFuelTypeDto) {
    return this.fuelTypesService.create(createFuelTypeDto);
  }

  @Get('fuelType')
  @ApiOperation({ summary: 'Get all fuel types' })
  @ApiResponse({ status: 200, description: 'List of all fuel types' })
  findAll() {
    return this.fuelTypesService.findAll();
  }

  @Get('fuelType/:id')
  @ApiOperation({ summary: 'Get a fuel type by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Fuel type found' })
  @ApiResponse({ status: 404, description: 'Fuel type not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fuelTypesService.findOne(id);
  }

  @Put('fuelType/:id/update')
  @ApiOperation({ summary: 'Update a fuel type by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Fuel type updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFuelTypeDto: UpdateFuelTypeDto,
  ) {
    return this.fuelTypesService.update(id, updateFuelTypeDto);
  }

  @Delete('fuelType/:id/destroy')
  @ApiOperation({ summary: 'Delete a fuel type by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Fuel type deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fuelTypesService.remove(id);
  }
}
