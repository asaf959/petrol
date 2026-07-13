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
import { PartnerExpensesService } from './partner-expenses.service';
import { CreatePartnerExpenseDto } from './dto/create-partner-expense.dto';
import { UpdatePartnerExpenseDto } from './dto/update-partner-expense.dto';

@ApiTags('Partner Expenses')
@ApiBearerAuth('JWT-auth')
@Controller()
export class PartnerExpensesController {
  constructor(private readonly partnerExpensesService: PartnerExpensesService) {}

  @Post('partnerExpense')
  @ApiOperation({ summary: 'Create a new partner expense' })
  @ApiResponse({ status: 201, description: 'Partner expense created successfully' })
  create(@Body() createDto: CreatePartnerExpenseDto) {
    return this.partnerExpensesService.create(createDto);
  }

  @Get('partnerExpense')
  @ApiOperation({ summary: 'Get all partner expenses' })
  @ApiResponse({ status: 200, description: 'List of all partner expenses' })
  findAll() {
    return this.partnerExpensesService.findAll();
  }

  @Get('partnerExpense/:id')
  @ApiOperation({ summary: 'Get a partner expense by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Partner expense found' })
  @ApiResponse({ status: 404, description: 'Partner expense not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partnerExpensesService.findOne(id);
  }

  @Put('partnerExpense/:id/update')
  @ApiOperation({ summary: 'Update a partner expense by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Partner expense updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePartnerExpenseDto,
  ) {
    return this.partnerExpensesService.update(id, updateDto);
  }

  @Delete('partnerExpense/:id/destroy')
  @ApiOperation({ summary: 'Delete a partner expense by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Partner expense deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.partnerExpensesService.remove(id);
  }
}
