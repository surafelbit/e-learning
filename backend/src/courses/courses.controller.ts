
import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { GenerateCourseDto } from './dto/generate-course.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Get()
    findAll() {
        return this.coursesService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard) // Protect details? Or public? MVP says protect.
    findOne(@Param('id') id: string) {
        return this.coursesService.findOne(id);
    }

    @Post('generate')
    @UseGuards(AuthGuard)
    generate(@Request() req, @Body() body: GenerateCourseDto) {
        const userId = req.user.id;
        return this.coursesService.generate(userId, body.subject);
    }
}
