
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AIService {
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('AI_API_KEY');
        if (apiKey) {
            // Support both OpenAI and Groq APIs
            const baseURL = apiKey.startsWith('gsk_') 
                ? 'https://api.groq.com/openai/v1'
                : undefined; // Use default OpenAI endpoint
            
            this.openai = new OpenAI({ 
                apiKey,
                baseURL 
            });
        }
    }

    async generateCourseContent(subject: string): Promise<any> {
        if (!this.openai) {
            // Return mock data if no API key
            return this.getMockCourseData(subject);
        }

        const prompt = `
Create an engaging educational course about "${subject}".

Generate a complete mini-course with 4 chapters and a quiz. Each chapter should have substantial educational content (at least 3-4 paragraphs) in Markdown format.

IMPORTANT: Return ONLY a valid JSON object with NO additional text or explanation. Use this EXACT structure:

{
  "title": "An engaging course title about ${subject}",
  "description": "A compelling 1-2 sentence description of what students will learn",
  "pages": [
    {
      "title": "Chapter 1: Introduction to ${subject}",
      "content_md": "# Introduction\n\nDetailed markdown content with multiple paragraphs explaining the fundamentals. Include practical examples and clear explanations.\n\n## Key Concepts\n\n- Bullet point 1\n- Bullet point 2\n\nMore detailed content..."
    },
    {
      "title": "Chapter 2: [Relevant Topic]",
      "content_md": "Comprehensive markdown content for chapter 2 with headings, paragraphs, and examples"
    },
    {
      "title": "Chapter 3: [Advanced Topic]",
      "content_md": "In-depth markdown content for chapter 3 covering more complex aspects"
    },
    {
      "title": "Chapter 4: Practical Application",
      "content_md": "Real-world applications, best practices, and summary of key takeaways"
    }
  ],
  "questions": [
    {
      "question_text": "A clear, specific question testing understanding of chapter 1-2 content",
      "type": "mcq",
      "options": [
        { "option_text": "Correct answer with clear reasoning", "is_correct": true },
        { "option_text": "Plausible but incorrect option", "is_correct": false },
        { "option_text": "Another incorrect but reasonable option", "is_correct": false },
        { "option_text": "Third incorrect option", "is_correct": false }
      ]
    },
    {
      "question_text": "Another question testing understanding of chapter 3-4 content",
      "type": "mcq",
      "options": [
        { "option_text": "First option", "is_correct": false },
        { "option_text": "Correct answer", "is_correct": true },
        { "option_text": "Third option", "is_correct": false },
        { "option_text": "Fourth option", "is_correct": false }
      ]
    },
    {
      "question_text": "A third question covering core concepts",
      "type": "mcq",
      "options": [
        { "option_text": "Option A", "is_correct": false },
        { "option_text": "Option B", "is_correct": false },
        { "option_text": "Correct option C", "is_correct": true },
        { "option_text": "Option D", "is_correct": false }
      ]
    }
  ]
}
    `;

        try {
            // Determine which model to use based on API key
            const apiKey = this.configService.get<string>('AI_API_KEY');
            const model = apiKey?.startsWith('gsk_') 
                ? 'llama-3.3-70b-versatile' // Groq model
                : 'gpt-3.5-turbo'; // OpenAI model

            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are a helpful education assistant. Always respond with valid JSON.' }, 
                    { role: 'user', content: prompt }
                ],
                model: model,
                response_format: { type: 'json_object' },
                temperature: 0.7,
            });

            const content = completion.choices[0].message.content;
            if (!content) throw new Error('No content generated');
            
            const parsed = JSON.parse(content);
            console.log('AI Course Generated Successfully:', parsed.title);
            return parsed;
        } catch (error) {
            console.error('AI Generation Error:', error);
            console.log('Falling back to mock data');
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
