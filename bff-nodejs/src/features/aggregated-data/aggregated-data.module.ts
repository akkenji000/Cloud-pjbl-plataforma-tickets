import { Module } from '@nestjs/common';
import { AggregatedDataController } from './aggregated-data.controller';
import { AggregatedDataService } from './aggregated-data.service';

@Module({
  controllers: [AggregatedDataController],
  providers: [AggregatedDataService],
})
export class AggregatedDataModule {}
