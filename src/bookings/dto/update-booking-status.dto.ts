import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookingStatusDto {
    @ApiProperty({ enum: BookingStatus, example: BookingStatus.CONFIRMED, description: 'New booking status' })
    @IsEnum(BookingStatus, {
        message: 'Status must be PENDING, CONFIRMED, CANCELLED, or COMPLETED',
    })
    @IsNotEmpty({ message: 'Status is required' })
    status: BookingStatus;
}
