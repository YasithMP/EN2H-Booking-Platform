import { IsOptional, IsInt, Min, Max, IsString, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class GetBookingsQueryDto {
    @ApiProperty({ example: 1, required: false, description: 'Page number for paginated list (default 1)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({ example: 10, required: false, description: 'Number of items per page (default 10, max 100)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiProperty({ example: 'John', required: false, description: 'Search query across customer fields' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ enum: BookingStatus, required: false, description: 'Filter by booking status' })
    @IsOptional()
    @IsEnum(BookingStatus)
    status?: BookingStatus;

    @ApiProperty({ example: 1, required: false, description: 'Filter by service ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    serviceId?: number;

    @ApiProperty({ example: '2026-08-01', required: false, description: 'Filter range starting date (YYYY-MM-DD)' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({ example: '2026-08-31', required: false, description: 'Filter range ending date (YYYY-MM-DD)' })
    @IsOptional()
    @IsDateString()
    endDate?: string;
}
