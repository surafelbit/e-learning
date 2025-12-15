
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AIService } from '../ai/ai.service';

@Injectable()
export class CoursesService {
    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly aiService: AIService,
    ) { }

    async findAll(userId: string, accessToken: string) {
        // Use client with user's JWT so RLS + user filter ensures they only see their own courses
        const client = this.supabaseService.getClientWithAuth(accessToken);

        const { data, error } = await client
            .from('courses')
            .select('*')
            .eq('created_by', userId)
            .order('created_at', { ascending: false });

        if (error) throw new InternalServerErrorException(error.message);
        return data;
    }

    async findOne(id: string, accessToken: string) {
        // Fetch course details, pages, and questions with user's auth token
        const client = this.supabaseService.getClientWithAuth(accessToken);

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

    async generate(userId: string, subject: string, accessToken: string) {
        // 1. Generate content via AI
        const content = await this.aiService.generateCourseContent(subject);

        // 2. Use client with user's JWT token to respect RLS
        const client = this.supabaseService.getClientWithAuth(accessToken);

        // 3. Insert Course
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

        if (courseError) {
            console.error('Course insert error:', courseError);
            throw new InternalServerErrorException(`Failed to create course: ${courseError.message}`);
        }
        const courseId = courseData.id;

        // 4. Insert Pages
        const pagesToInsert = content.pages.map((p, index) => ({
            course_id: courseId,
            page_index: index,
            title: p.title,
            content_md: p.content_md,
        }));
        const { error: pagesError } = await client.from('course_pages').insert(pagesToInsert);
        
        if (pagesError) {
            console.error('Pages insert error:', pagesError);
            throw new InternalServerErrorException(`Failed to create course pages: ${pagesError.message}`);
        }

        // 5. Insert Questions & Options
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

            if (qError) {
                console.error('Question insert error:', qError);
                throw new InternalServerErrorException(`Failed to create question: ${qError.message}`);
            }

            if (questionData) {
                const optionsToInsert = q.options.map((o) => ({
                    question_id: questionData.id,
                    option_text: o.option_text,
                    is_correct: o.is_correct,
                }));
                const { error: optionsError } = await client.from('question_options').insert(optionsToInsert);
                
                if (optionsError) {
                    console.error('Options insert error:', optionsError);
                    throw new InternalServerErrorException(`Failed to create question options: ${optionsError.message}`);
                }
            }
        }

        return { id: courseId };
    }
}
