import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { Response } from 'express';
import { FuelRecordsService } from './fuel-records.service';
import { CreateFuelRecordDto } from './dto/create-fuel-record.dto';
import { UpdateFuelRecordDto } from './dto/update-fuel-record.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { UpdatePaymentLogDto } from './dto/update-payment-log.dto';
import { PDF_UPLOAD_OPTIONS } from '../common/upload/pdf-upload';

@ApiTags('Fuel Records')
@ApiBearerAuth('JWT-auth')
@Controller()
export class FuelRecordsController {
  constructor(private readonly fuelRecordsService: FuelRecordsService) {}

  @Post('fuelRecord')
  @UseInterceptors(FileInterceptor('document', PDF_UPLOAD_OPTIONS))
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiOperation({ summary: 'Create a new fuel record (auto-creates first payment log)' })
  @ApiResponse({ status: 201, description: 'Fuel record created with initial log entry' })
  create(
    @Body() createFuelRecordDto: CreateFuelRecordDto,
    @UploadedFile() document?: Express.Multer.File,
  ) {
    return this.fuelRecordsService.create(createFuelRecordDto, document?.buffer);
  }

  @Get('fuelRecord')
  @ApiOperation({ summary: 'Get all fuel records with vehicle, station and payment logs' })
  @ApiResponse({ status: 200, description: 'List of all fuel records' })
  findAll() {
    return this.fuelRecordsService.findAll();
  }

  @Get('fuelRecord/documents/:filename')
  @ApiOperation({ summary: 'Open an authenticated fuel record PDF' })
  @ApiParam({ name: 'filename', type: String })
  openDocument(@Param('filename') filename: string, @Res() response: Response) {
    return response.sendFile(this.fuelRecordsService.getDocumentPath(filename), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  @Get('fuelRecord/:id')
  @ApiOperation({ summary: 'Get a fuel record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Fuel record found' })
  @ApiResponse({ status: 404, description: 'Fuel record not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fuelRecordsService.findOne(id);
  }

  @Post('fuelRecord/:id/payment')
  @UseInterceptors(FileInterceptor('document', PDF_UPLOAD_OPTIONS))
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiOperation({
    summary: 'Add a partial or full payment',
    description:
      'Adds a dated payment against the remaining balance, creates a payment history log, and recalculates paid/remaining/status.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 201, description: 'Payment recorded successfully' })
  @ApiResponse({ status: 400, description: 'Payment exceeds remaining balance or already paid' })
  @ApiResponse({ status: 404, description: 'Fuel record not found' })
  addPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() addPaymentDto: AddPaymentDto,
    @UploadedFile() document?: Express.Multer.File,
  ) {
    return this.fuelRecordsService.addPayment(id, addPaymentDto, document?.buffer);
  }

  @Put('fuelRecord/:id/payment/:logId/update')
  @UseInterceptors(FileInterceptor('document', PDF_UPLOAD_OPTIONS))
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiOperation({
    summary: 'Update a payment history entry',
    description:
      'Edit payment date, amount, or PDF for an existing log entry and recalculate paid/remaining totals.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'logId', type: Number })
  @ApiResponse({ status: 200, description: 'Payment log updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payment amount or exceeds total' })
  @ApiResponse({ status: 404, description: 'Fuel record or payment log not found' })
  updatePaymentLog(
    @Param('id', ParseIntPipe) id: number,
    @Param('logId', ParseIntPipe) logId: number,
    @Body() updatePaymentLogDto: UpdatePaymentLogDto,
    @UploadedFile() document?: Express.Multer.File,
  ) {
    return this.fuelRecordsService.updatePaymentLog(
      id,
      logId,
      updatePaymentLogDto,
      document?.buffer,
    );
  }

  @Put('fuelRecord/:id/update')
  @ApiOperation({
    summary: 'Update a fuel record',
    description:
      'If `amount_paid` is increased, it treats the difference as a new payment, logs it, and recalculates remaining. Prefer POST /fuelRecord/:id/payment for partial payments.',
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
