import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { GainsService } from './gains.service';
import { CreateGainDto } from './dto/create-gain.dto';
import { UpdateGainDto } from './dto/update-gain.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('gains')
export class GainsController {
  constructor(private readonly gainsService: GainsService) {}

  @Post()
  create(@Body() createGainDto: CreateGainDto, @Req() req: Request) {
    return this.gainsService.create({...createGainDto, userId: req.user!.id});
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.gainsService.findAll(req.user!.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gainsService.findOne(+id);
  }

  @Put(':id')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGainDto: UpdateGainDto) {
    return this.gainsService.update(+id, updateGainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gainsService.remove(+id);
  }
}
