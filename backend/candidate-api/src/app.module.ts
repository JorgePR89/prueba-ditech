import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CandidatesController } from './candidates/candidates.controller';

@Module({
  imports: [],
  controllers: [AppController, CandidatesController],
  providers: [],
})
export class AppModule {}
