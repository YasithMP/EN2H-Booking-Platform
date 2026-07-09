import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
    @ApiProperty({ example: 'John Doe', description: 'Name of the booking customer' })
    @IsString()
    @IsNotEmpty({ message: 'Customer name is required' })
    customerName: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the booking customer' })
    @IsEmail({}, { message: 'Please enter a valid customer email' })
    @IsNotEmpty({ message: 'Customer email is required' })
    customerEmail: string;

    @ApiProperty({ example: '+1234567890', description: 'Phone number of the booking customer' })
    @IsString()
    @IsNotEmpty({ message: 'Customer phone is required' })
    customerPhone: string;

    @ApiProperty({ example: 1, description: 'ID of the service slot mapped to this booking' })
    @IsInt({ message: 'Service ID must be an integer' })
    serviceId: number;

    @ApiProperty({ example: '2026-08-15', description: 'Desired booking date (YYYY-MM-DD)' })
    @IsDateString({}, { message: 'Booking date must be in YYYY-MM-DD format' })
    @IsNotEmpty({ message: 'Booking date is required' })
    bookingDate: string;

    @ApiProperty({ example: '14:30', description: 'Desired booking start time (HH:MM)' })
    @IsString()
    @IsNotEmpty({ message: 'Booking time is required' })
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Booking time must be in HH:MM format',
    })
    bookingTime: string;

    @ApiProperty({ example: 'Please prepare the intake forms.', required: false, description: 'Extra details or instructions' })
    @IsString()
    @IsOptional()
    notes?: string;
}
