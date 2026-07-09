import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceDto {
    @ApiProperty({ example: 'General Consultation', required: false, description: 'Title of the service' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: '30-minute overview/checkup with general practitioner', required: false, description: 'Brief description of the service' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 30, required: false, description: 'Duration of the service slot in minutes' })
    @IsNumber()
    @Min(1, { message: 'Duration must be at least 1 minute' })
    @IsOptional()
    duration?: number;

    @ApiProperty({ example: 50, required: false, description: 'Cost of service in USD' })
    @IsNumber()
    @Min(0, { message: 'Price must be a positive number' })
    @IsOptional()
    price?: number;

    @ApiProperty({ example: true, required: false, description: 'Whether the service is active and open for booking' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
