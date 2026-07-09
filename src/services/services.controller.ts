import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('services')
export class ServicesController {
    constructor(private servicesService: ServicesService) { }

    @Get()
    async findAll() {
        return this.servicesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.servicesService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto: CreateServiceDto) {
        return this.servicesService.create(dto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServiceDto) {
        return this.servicesService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.servicesService.remove(id);
    }
}
