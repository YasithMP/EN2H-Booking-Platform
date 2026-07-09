import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty({ message: 'Customer name is required' })
    customerName: string;

    @IsEmail({}, { message: 'Please enter a valid customer email' })
    @IsNotEmpty({ message: 'Customer email is required' })
    customerEmail: string;

    @IsString()
    @IsNotEmpty({ message: 'Customer phone is required' })
    customerPhone: string;

    @IsInt({ message: 'Service ID must be an integer' })
    serviceId: number;

    @IsDateString({}, { message: 'Booking date must be in YYYY-MM-DD format' })
    @IsNotEmpty({ message: 'Booking date is required' })
    bookingDate: string;

    @IsString()
    @IsNotEmpty({ message: 'Booking time is required' })
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Booking time must be in HH:MM format',
    })
    bookingTime: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
