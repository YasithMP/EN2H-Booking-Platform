import { Body, Controller, Get, Param, ParseIntPipe, Post, Patch, UseGuards, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { GetBookingsQueryDto } from './dto/get-bookings-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService: BookingsService) { }

    @Post()
    async create(@Body() dto: CreateBookingDto) {
        return this.bookingsService.create(dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Query() query: GetBookingsQueryDto) {
        return this.bookingsService.findAll(query);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bookingsService.findOne(id);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateBookingStatusDto,
    ) {
        return this.bookingsService.updateStatus(id, dto);
    }

    @Patch(':id/cancel')
    async cancel(@Param('id', ParseIntPipe) id: number) {
        return this.bookingsService.cancel(id);
    }
}
