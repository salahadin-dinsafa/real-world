import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { UserEntity } from '../auth/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService]
})
export class ProfilesModule { }
