
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AIService } from '../ai/ai.service';

@Injectable()
export class CoursesService {
    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly aiService: AIService,
    ) { }

    async findAll() {
        // Public published courses
        const { data, error } = await this.supabaseService
            .getClient()
            .from('courses')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) throw new InternalServerErrorException(error.message);
        return data;
    }

    async findOne(id: string) {
        // Fetch course details, pages, and questions
        const client = this.supabaseService.getClient();

        const { data: course, error: courseError } = await client
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();

        if (courseError || !course) throw new NotFoundException('Course not found');

        const { data: pages } = await client
            .from('course_pages')
            .select('*')
            .eq('course_id', id)
            .order('page_index', { ascending: true });

        const { data: questions } = await client
            .from('questions')
            .select('*, question_options(*)') // fetch options nested
            .eq('course_id', id);

        return { ...course, pages, questions };
    }

    async generate(userId: string, subject: string) {
        // 1. Generate content via AI
        const content = await this.aiService.generateCourseContent(subject);

        const client = this.supabaseService.getClient();

        // 2. Insert Course
        const { data: courseData, error: courseError } = await client
            .from('courses')
            .insert({
                title: content.title,
                subject: subject,
                description: content.description,
                created_by: userId,
                is_published: true, // Auto-publish for MVP
            })
            .select()
            .single();

        if (courseError) throw new InternalServerErrorException(courseError.message);
        const courseId = courseData.id;

        // 3. Insert Pages
        const pagesToInsert = content.pages.map((p, index) => ({
            course_id: courseId,
            page_index: index,
            title: p.title,
            content_md: p.content_md,
        }));
        await client.from('course_pages').insert(pagesToInsert);

        // 4. Insert Questions & Options
        for (const q of content.questions) {
            const { data: questionData, error: qError } = await client
                .from('questions')
                .insert({
                    course_id: courseId,
                    question_text: q.question_text,
                    type: q.type || 'mcq',
                })
                .select()
                .single();

            if (!qError && questionData) {
                const optionsToInsert = q.options.map((o) => ({
                    question_id: questionData.id,
                    option_text: o.option_text,
                    is_correct: o.is_correct,
                }));
                await client.from('question_options').insert(optionsToInsert);
            }
        }

        return { id: courseId };
    }
}
