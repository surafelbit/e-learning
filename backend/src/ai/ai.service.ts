
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AIService {
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('AI_API_KEY');
        if (apiKey) {
            this.openai = new OpenAI({ apiKey });
        }
    }

    async generateCourseContent(subject: string): Promise<any> {
        if (!this.openai) {
            // Return mock data if no API key
            return this.getMockCourseData(subject);
        }

        const prompt = `
      Generate a course about "${subject}".
      Return ONLY a valid JSON object with this structure:
      {
        "title": "Course Title",
        "description": "Short description",
        "pages": [
          { "title": "Page 1 Title", "content_md": "Markdown content for page 1..." },
          { "title": "Page 2 Title", "content_md": "Markdown content for page 2..." },
          { "title": "Page 3 Title", "content_md": "Markdown content for page 3..." },
          { "title": "Page 4 Title", "content_md": "Markdown content for page 4..." }
        ],
        "questions": [
          {
            "question_text": "Question 1 text",
            "type": "mcq",
            "options": [
              { "option_text": "Option A", "is_correct": true },
              { "option_text": "Option B", "is_correct": false },
              { "option_text": "Option C", "is_correct": false }
            ]
          },
          {
            "question_text": "Question 2 text",
            "type": "mcq",
            "options": [
              { "option_text": "Option X", "is_correct": true },
              { "option_text": "Option Y", "is_correct": false }
            ]
          }
        ]
      }
    `;

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [{ role: 'system', content: 'You are a helpful education assistant.' }, { role: 'user', content: prompt }],
                model: 'gpt-3.5-turbo',
                response_format: { type: 'json_object' },
            });

            const content = completion.choices[0].message.content;
            if (!content) throw new Error('No content generated');
            return JSON.parse(content);
        } catch (error) {
            console.error('AI Generation Warning:', error);
            return this.getMockCourseData(subject);
        }
    }

    private getMockCourseData(subject: string) {
        return {
            title: `Introduction to ${subject} (Mock)`,
            description: `This is a generated course about ${subject}.`,
            pages: [
                { title: 'Chapter 1: Basics', content_md: `# Basics of ${subject}\n\nThis is the first chapter content.` },
                { title: 'Chapter 2: Intermediate', content_md: `## Going Deeper\n\nMore details about ${subject}.` },
                { title: 'Chapter 3: Advanced', content_md: `### Advanced Concepts\n\nComplex topics in ${subject}.` },
                { title: 'Chapter 4: Conclusion', content_md: `#### Summary\n\nWrap up of ${subject}.` }
            ],
            questions: [
                {
                    question_text: `What is ${subject}?`,
                    type: 'mcq',
                    options: [
                        { option_text: 'A good thing', is_correct: true },
                        { option_text: 'A bad thing', is_correct: false },
                        { option_text: 'Nothing', is_correct: false }
                    ]
                },
                {
                    question_text: `Is ${subject} hard?`,
                    type: 'mcq',
                    options: [
                        { option_text: 'Yes', is_correct: true },
                        { option_text: 'No', is_correct: false }
                    ]
                }
            ]
        };
    }
}
