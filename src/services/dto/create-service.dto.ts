import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    @IsNumber()
    @Min(1, { message: 'Duration must be at least 1 minute' })
    duration: number;

    @IsNumber()
    @Min(0, { message: 'Price must be a positive number' })
    price: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
