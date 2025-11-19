import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from "@langchain/core/prompts";

dotenv.config();

const user = [
    'human',
    'You are a human user. Provide the text to be processed by the writer. User inputs: Job Description: {jobDescription}, Resume: {resume}, Cover Letter: {coverLetter}'
];

const writer = [
    'system',
    `
        You are a human writer. Update and write resume and cover letter content based on user input. 
        User Input will include a job description, resume, and cover letter.
        Follow these exact rules in everything you write.
        DO:
        - Use clear, short sentences (average 10-20 words). 
        - Stick with active voice most of the time. 
        - Favor plain, everyday words. 
        - Mix sentence lengths; keep paragraphs varied. 
        - Add numbers, names, and concrete details wherever possible. 
        - Use commas, periods, and question marks for most punctuation. 
        DON'T:
        - Use semicolons or em dashes. 
        - Repeat tired phrases like "at the end of the day," "cutting-edge," "game changer," or "moving forward." 
        - Rely on adverbs like "however," "moreover," or "ultimately." 
        - Hedge with "might," "could," "would," or "may." 
        - Write overlong sentences with stacked clauses. 
        - Sound corporate, cliché, or overly formal. 
        - Mention AI, apologies, or limitations.
    `
];

const formatter = [
    'developer',
    `
        You are a meticulous formatter. Ensure the final resume and cover letter are polished and professional.         
        Follow these exact rules in everything you write.
   
        DO:
        - Make the name as the header in bold, large font.
        - Use consistent fonts and sizes throughout.
        - Ensure proper alignment and spacing.
        - Use bullet points for lists.
        - Normalize section headings (e.g., "Experience", "Education") and make them bold.
        - Use proper capitalization and punctuation.
        - Italicize dates and locations.
        - Ensure the resume is one page if possible.
        - Use a professional tone and style.
        - Try to keep the format similar to the original resume and cover letter.
        
        DON'T:
        - No double spaces.
        - No inconsistent fonts or sizes.
        - No excessive bolding or italics.
        - No large blocks of text without breaks.
        - No new lines after headings.
        - No slashes or unnecessary symbols.

        Return the final resume and cover letter in markdown format with escaped special characters, then put them in a JSON object with keys "finalResume" and "finalCoverLetter". Make sure the JSON is properly formatted and can be parsed by JSON.parse().
    `
];

export async function POST(request: Request) {
    try {
        const { jobDescription, resume, coverLetter } = await request.json()
        
        // TODO: Implement rate limiting if needed
        // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        // const userAgent = req.headers['user-agent'];
        // const checkSum = calculateChecksum(`${ip}-${userAgent}`);

        if (!jobDescription || !resume || !coverLetter) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Missing required fields',
                    finalResume: '',
                    finalCoverLetter: ''
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' } 
                }
            );
        }

        const prompt = ChatPromptTemplate.fromMessages([
            [user[0], user[1]],
            [writer[0], writer[1]],
            [formatter[0], formatter[1]],
        ]);

        const llm = new ChatOpenAI({ 
            model: process.env.OPENAI_MODEL || 'gpt-5.1',
            openAIApiKey: process.env.OPENAI_API_KEY
        });
        const chain = prompt.pipe(llm);

        const response = await chain.invoke({ 
            jobDescription,
            resume,
            coverLetter,
        });

        if (!response || !response.content) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Failed to generate documents',
                    finalResume: '',
                    finalCoverLetter: ''
                }),
                { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const json = JSON.parse(response.content.toString());

        return new Response(
            JSON.stringify({
                success: true,
                finalResume: json["finalResume"],
                finalCoverLetter: json["finalCoverLetter"],
                message: 'Documents generated successfully'
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('Error generating documents:', error);
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Internal server error',
                finalResume: '',
                finalCoverLetter: ''
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}