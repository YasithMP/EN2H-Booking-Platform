import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateBookingDto) {
        // 1. Verify service exists
        const service = await this.prisma.service.findUnique({
            where: { id: dto.serviceId },
        });
        if (!service) {
            throw new NotFoundException(`Service with ID ${dto.serviceId} not found`);
        }

        // 2. Verify service is active
        if (!service.isActive) {
            throw new BadRequestException('Cannot book an inactive service');
        }

        // 3. Verify booking date/time is in the future
        const now = new Date();
        const bookingDateTime = new Date(`${dto.bookingDate}T${dto.bookingTime}:00`);
        if (isNaN(bookingDateTime.getTime())) {
            throw new BadRequestException('Booking date or time has invalid format');
        }
        if (bookingDateTime < now) {
            throw new BadRequestException('Booking date and time must be in the future');
        }

        // 4. Prevent duplicate bookings for the same service, date, and time
        const duplicateBooking = await this.prisma.booking.findFirst({
            where: {
                serviceId: dto.serviceId,
                bookingDate: dto.bookingDate,
                bookingTime: dto.bookingTime,
                status: {
                    in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
                },
            },
        });

        if (duplicateBooking) {
            throw new ConflictException('This time slot is already booked for the selected service');
        }

        // 5. Create booking (default status is PENDING)
        return this.prisma.booking.create({
            data: {
                customerName: dto.customerName,
                customerEmail: dto.customerEmail,
                customerPhone: dto.customerPhone,
                serviceId: dto.serviceId,
                bookingDate: dto.bookingDate,
                bookingTime: dto.bookingTime,
                notes: dto.notes,
                status: BookingStatus.PENDING,
            },
            include: {
                service: true,
            },
        });
    }

    async findAll() {
        return this.prisma.booking.findMany({
            include: {
                service: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: number) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                service: true,
            },
        });
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }

    async updateStatus(id: number, dto: UpdateBookingStatusDto) {
        const booking = await this.findOne(id);

        // Cancelled bookings cannot be marked as completed
        if (booking.status === BookingStatus.CANCELLED && dto.status === BookingStatus.COMPLETED) {
            throw new BadRequestException('Cancelled bookings cannot be marked as completed');
        }

        return this.prisma.booking.update({
            where: { id },
            data: { status: dto.status },
            include: {
                service: true,
            },
        });
    }

    async cancel(id: number) {
        const booking = await this.findOne(id);

        return this.prisma.booking.update({
            where: { id },
            data: { status: BookingStatus.CANCELLED },
            include: {
                service: true,
            },
        });
    }
}
