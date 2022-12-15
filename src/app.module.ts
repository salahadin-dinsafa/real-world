import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ArticlesModule } from './articles/articles.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [AuthModule, ProfilesModule, ArticlesModule, TagsModule],
  controllers: [],
  providers: []
})
export class AppModule { }
