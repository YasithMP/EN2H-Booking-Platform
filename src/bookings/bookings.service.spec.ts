import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('BookingsService', () => {
    let service: BookingsService;
    let prismaMock: any;

    beforeEach(async () => {
        prismaMock = {
            service: {
                findUnique: jest.fn(),
            },
            booking: {
                findUnique: jest.fn(),
                findFirst: jest.fn(),
                create: jest.fn(),
                findMany: jest.fn(),
                count: jest.fn(),
                update: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingsService,
                { provide: PrismaService, useValue: prismaMock },
            ],
        }).compile();

        service = module.get<BookingsService>(BookingsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createDto = {
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            customerPhone: '+1234567890',
            serviceId: 1,
            bookingDate: '2026-12-01',
            bookingTime: '10:00',
        };

        it('should successfully create a booking', async () => {
            prismaMock.service.findUnique.mockResolvedValue({ id: 1, isActive: true });
            prismaMock.booking.findFirst.mockResolvedValue(null);
            prismaMock.booking.create.mockResolvedValue({
                id: 100,
                ...createDto,
                status: BookingStatus.PENDING,
            });

            const result = await service.create(createDto);
            expect(result.id).toBe(100);
            expect(prismaMock.service.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(prismaMock.booking.create).toHaveBeenCalled();
        });

        it('should throw NotFoundException if service does not exist', async () => {
            prismaMock.service.findUnique.mockResolvedValue(null);

            await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if service is inactive', async () => {
            prismaMock.service.findUnique.mockResolvedValue({ id: 1, isActive: false });

            await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if booking date is in the past', async () => {
            prismaMock.service.findUnique.mockResolvedValue({ id: 1, isActive: true });
            const pastDto = { ...createDto, bookingDate: '2020-01-01' };

            await expect(service.create(pastDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw ConflictException if time slot is already booked', async () => {
            prismaMock.service.findUnique.mockResolvedValue({ id: 1, isActive: true });
            prismaMock.booking.findFirst.mockResolvedValue({ id: 99 }); // Conflicting booking

            await expect(service.create(createDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        it('should return paginated bookings', async () => {
            const bookings = [{ id: 1, customerName: 'John Doe' }];
            prismaMock.booking.findMany.mockResolvedValue(bookings);
            prismaMock.booking.count.mockResolvedValue(1);

            const result = await service.findAll({ page: 1, limit: 10 });
            expect(result.data).toEqual(bookings);
            expect(result.meta.totalItems).toBe(1);
            expect(result.meta.totalPages).toBe(1);
        });
    });

    describe('updateStatus', () => {
        it('should successfully update status', async () => {
            prismaMock.booking.findUnique.mockResolvedValue({ id: 1, status: BookingStatus.PENDING });
            prismaMock.booking.update.mockResolvedValue({ id: 1, status: BookingStatus.CONFIRMED });

            const result = await service.updateStatus(1, { status: BookingStatus.CONFIRMED });
            expect(result.status).toBe(BookingStatus.CONFIRMED);
        });

        it('should throw BadRequestException when changing CANCELLED to COMPLETED', async () => {
            prismaMock.booking.findUnique.mockResolvedValue({ id: 1, status: BookingStatus.CANCELLED });

            await expect(
                service.updateStatus(1, { status: BookingStatus.COMPLETED })
            ).rejects.toThrow(BadRequestException);
        });
    });
});
