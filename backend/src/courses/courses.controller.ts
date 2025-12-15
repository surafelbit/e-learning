
import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { GenerateCourseDto } from './dto/generate-course.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    // List ONLY the logged-in user's courses
    @Get()
    @UseGuards(AuthGuard)
    findAll(@Request() req) {
        const userId = req.user.id;
        const accessToken = req.headers.authorization?.split(' ')[1];
        return this.coursesService.findAll(userId, accessToken);
    }

    // Get a single course (relies on Supabase RLS + user token)
    @Get(':id')
    @UseGuards(AuthGuard)
    findOne(@Param('id') id: string, @Request() req) {
        const accessToken = req.headers.authorization?.split(' ')[1];
        return this.coursesService.findOne(id, accessToken);
    }

    @Post('generate')
    @UseGuards(AuthGuard)
    generate(@Request() req, @Body() body: GenerateCourseDto) {
        const userId = req.user.id;
        const accessToken = req.headers.authorization?.split(' ')[1];
        return this.coursesService.generate(userId, body.subject, accessToken);
    }
}
