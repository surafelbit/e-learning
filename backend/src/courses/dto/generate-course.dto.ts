
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateCourseDto {
    @IsNotEmpty()
    @IsString()
    subject: string;
}
