import { Body, Controller, Get, Param, ParseIntPipe, Post, Patch, UseGuards, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { GetBookingsQueryDto } from './dto/get-bookings-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService: BookingsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new public booking slot request' })
    @ApiResponse({ status: 201, description: 'Booking slot successfully created / pending representation' })
    @ApiResponse({ status: 400, description: 'Bad request / invalid parameters' })
    @ApiResponse({ status: 409, description: 'Double-booking conflict' })
    async create(@Body() dto: CreateBookingDto) {
        return this.bookingsService.create(dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List and filter all booking records (Authenticated)' })
    @ApiResponse({ status: 200, description: 'Paginated bookings list with meta data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findAll(@Query() query: GetBookingsQueryDto) {
        return this.bookingsService.findAll(query);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get details of a single booking (Authenticated)' })
    @ApiResponse({ status: 200, description: 'Booking detailed record found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bookingsService.findOne(id);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update status of a booking slot (Authenticated)' })
    @ApiResponse({ status: 200, description: 'Booking status updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request / illegal status path transition' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateBookingStatusDto,
    ) {
        return this.bookingsService.updateStatus(id, dto);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel a booking slot request (Public or Authed)' })
    @ApiResponse({ status: 200, description: 'Booking slot successfully cancelled' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async cancel(@Param('id', ParseIntPipe) id: number) {
        return this.bookingsService.cancel(id);
    }
}
