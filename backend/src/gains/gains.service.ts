import { Injectable } from '@nestjs/common';
import { CreateGainDto } from './dto/create-gain.dto';
import { UpdateGainDto } from './dto/update-gain.dto';
import { Gain } from './entities/gain.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GainsService {
  constructor(private prismaService: PrismaService) {}

  async create(createGainDto: CreateGainDto & { userId: number }): Promise<Gain> {
    return await this.prismaService.gain.create({
      data: {...createGainDto, date: new Date(createGainDto.date)}
    });
  }

  async findAll(userId: number): Promise<Gain[]> {
    return this.prismaService.gain.findMany({
      where: { userId }
    });
  }

  async findOne(id: number): Promise<Gain> {
    return this.prismaService.gain.findUnique({
      where: { id }
    });
  }

  async update(id: number, updateGainDto: UpdateGainDto): Promise<Gain> {
    return this.prismaService.gain.update({ 
      where: { id },
      data: {...updateGainDto, date: new Date(updateGainDto.date)}
    });
  }

  async remove(id: number): Promise<Gain> {
    return this.prismaService.gain.delete({ 
      where: { id }
    });
  }
}
