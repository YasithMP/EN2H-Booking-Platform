import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateServiceDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(1, { message: 'Duration must be at least 1 minute' })
    @IsOptional()
    duration?: number;

    @IsNumber()
    @Min(0, { message: 'Price must be a positive number' })
    @IsOptional()
    price?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
