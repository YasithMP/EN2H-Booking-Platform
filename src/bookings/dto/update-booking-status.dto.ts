import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingStatusDto {
    @IsEnum(BookingStatus, {
        message: 'Status must be PENDING, CONFIRMED, CANCELLED, or COMPLETED',
    })
    @IsNotEmpty({ message: 'Status is required' })
    status: BookingStatus;
}
