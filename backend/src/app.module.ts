
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { CoursesModule } from './courses/courses.module';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', }),
    SupabaseModule,
    CoursesModule,
    AIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
