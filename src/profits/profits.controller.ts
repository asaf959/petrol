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
import { ProfitsService } from './profits.service';
import { CreateProfitDto } from './dto/create-profit.dto';
import { UpdateProfitDto } from './dto/update-profit.dto';

@ApiTags('Profits')
@ApiBearerAuth('JWT-auth')
@Controller()
export class ProfitsController {
  constructor(private readonly profitsService: ProfitsService) {}

  @Post('profit')
  @ApiOperation({ summary: 'Create a new profit record' })
  @ApiResponse({ status: 201, description: 'Profit record created successfully' })
  create(@Body() createProfitDto: CreateProfitDto) {
    return this.profitsService.create(createProfitDto);
  }

  @Get('profit')
  @ApiOperation({ summary: 'Get all profit records' })
  @ApiResponse({ status: 200, description: 'List of all profit records' })
  findAll() {
    return this.profitsService.findAll();
  }

  @Get('profit/:date')
  @ApiOperation({
    summary: 'Get profits by date with calculated summary',
    description: 'Returns all profit records for the given date along with totalRent, totalExpense and net profit.',
  })
  @ApiParam({ name: 'date', type: String, example: '2024-01-15', description: 'Date in YYYY-MM-DD format' })
  @ApiResponse({ status: 200, description: 'Profit records with calculated summary' })
  getByDate(@Param('date') date: string) {
    return this.profitsService.getByDate(date);
  }

  @Get('profitById/:id')
  @ApiOperation({ summary: 'Get a profit record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Profit record found' })
  @ApiResponse({ status: 404, description: 'Profit record not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profitsService.findOne(id);
  }

  @Put('profit/:id/update')
  @ApiOperation({ summary: 'Update a profit record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Profit record updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfitDto: UpdateProfitDto,
  ) {
    return this.profitsService.update(id, updateProfitDto);
  }

  @Delete('profit/:id/destroy')
  @ApiOperation({ summary: 'Delete a profit record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Profit record deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profitsService.remove(id);
  }
}
