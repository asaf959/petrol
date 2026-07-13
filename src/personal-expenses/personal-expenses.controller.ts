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
import { PersonalExpensesService } from './personal-expenses.service';
import { CreatePersonalExpenseDto } from './dto/create-personal-expense.dto';
import { UpdatePersonalExpenseDto } from './dto/update-personal-expense.dto';

@ApiTags('Personal Expenses')
@ApiBearerAuth('JWT-auth')
@Controller()
export class PersonalExpensesController {
  constructor(private readonly personalExpensesService: PersonalExpensesService) {}

  @Post('personalExpense')
  @ApiOperation({ summary: 'Create a new personal expense' })
  @ApiResponse({ status: 201, description: 'Personal expense created successfully' })
  create(@Body() createDto: CreatePersonalExpenseDto) {
    return this.personalExpensesService.create(createDto);
  }

  @Get('personalExpense')
  @ApiOperation({ summary: 'Get all personal expenses' })
  @ApiResponse({ status: 200, description: 'List of all personal expenses' })
  findAll() {
    return this.personalExpensesService.findAll();
  }

  @Get('personalExpense/:id')
  @ApiOperation({ summary: 'Get a personal expense by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Personal expense found' })
  @ApiResponse({ status: 404, description: 'Personal expense not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.personalExpensesService.findOne(id);
  }

  @Put('personalExpense/:id/update')
  @ApiOperation({ summary: 'Update a personal expense by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Personal expense updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePersonalExpenseDto,
  ) {
    return this.personalExpensesService.update(id, updateDto);
  }

  @Delete('personalExpense/:id/destroy')
  @ApiOperation({ summary: 'Delete a personal expense by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Personal expense deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.personalExpensesService.remove(id);
  }
}
