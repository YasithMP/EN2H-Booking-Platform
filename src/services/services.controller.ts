import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('services')
@Controller('services')
export class ServicesController {
    constructor(private servicesService: ServicesService) { }

    @Get()
    @ApiOperation({ summary: 'Retrieve all services' })
    @ApiResponse({ status: 200, description: 'Array of services returned' })
    async findAll() {
        return this.servicesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve service details by ID' })
    @ApiResponse({ status: 200, description: 'Service details found' })
    @ApiResponse({ status: 404, description: 'Service not found' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.servicesService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new service' })
    @ApiResponse({ status: 201, description: 'Service successfully created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(@Body() dto: CreateServiceDto) {
        return this.servicesService.create(dto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an existing service' })
    @ApiResponse({ status: 200, description: 'Service successfully updated' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Service not found' })
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServiceDto) {
        return this.servicesService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a service' })
    @ApiResponse({ status: 200, description: 'Service successfully deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Service not found' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.servicesService.remove(id);
    }
}
