import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
    @ApiProperty({ example: 'General Consultation', description: 'Title of the service' })
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @ApiProperty({ example: '30-minute overview/checkup with general practitioner', description: 'Brief description of the service' })
    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    @ApiProperty({ example: 30, description: 'Duration of the service slot in minutes' })
    @IsNumber()
    @Min(1, { message: 'Duration must be at least 1 minute' })
    duration: number;

    @ApiProperty({ example: 50, description: 'Cost of service in USD' })
    @IsNumber()
    @Min(0, { message: 'Price must be a positive number' })
    price: number;

    @ApiProperty({ example: true, required: false, description: 'Whether the service is active and open for booking' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
