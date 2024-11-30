import OpenAI from 'openai';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TaskList = z.object({
  tasks: z.array(z.object({
    title: z.string(),
    quadrant: z.enum([
      'important-urgent',
      'important-not-urgent',
      'not-important-urgent',
      'not-important-not-urgent'
    ]).optional(),
  })),
});

export async function parseTasks(text: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { 
        role: "system", 
        content: `Extract tasks from the given text and return them in JSON format. For each task, determine its quadrant based on these rules:
          - important-urgent: Critical tasks that need immediate attention
          - important-not-urgent: Important tasks that can be scheduled
          - not-important-urgent: Tasks that feel urgent but aren't important
          - not-important-not-urgent: Tasks that can be eliminated or delegated
          
          If the quadrant isn't clear default to important-urgent.
          
          Return format:
          {
            "tasks": [
              { "title": "task description", "quadrant": "quadrant-name" }
            ]
          }`
      },
      { role: "user", content: text },
    ],
  });

  const result = JSON.parse(completion.choices[0].message.content || '');
  const parsed = TaskList.parse(result);
  return parsed.tasks;
} 