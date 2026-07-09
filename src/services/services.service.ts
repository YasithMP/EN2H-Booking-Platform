import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateServiceDto) {
        return this.prisma.service.create({
            data: dto,
        });
    }

    async findAll() {
        return this.prisma.service.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number) {
        const service = await this.prisma.service.findUnique({
            where: { id },
        });
        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }
        return service;
    }

    async update(id: number, dto: UpdateServiceDto) {
        await this.findOne(id);
        return this.prisma.service.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.prisma.service.delete({
            where: { id },
        });
        return { message: `Service with ID ${id} successfully deleted` };
    }
}
