interface Tool {
    name: string;
    description: string;
    link: string;
}

export const Tools: Record<string, Tool[]> = {
    "Jobs": [
        {
            name: "Resume/Cover Letter Converter",
            description: "A tool to convert job descriptions into tailored resumes and cover letters.",
            link: "/tools/resume-cover-letter-convertor"
        }, 
        {
            name: "Resume/Cover Letter Converter 2",
            description: "A tool to convert job descriptions into tailored resumes and cover letters.",
            link: "/tools/resume-cover-letter-convertor"
        }, 
        {
            name: "Resume/Cover Letter Converter 3",
            description: "A tool to convert job descriptions into tailored resumes and cover letters.",
            link: "/tools/resume-cover-letter-convertor"
        }
    ],
    "Finance": [
        {
            name: "Resume/Cover Letter Converter 4",
            description: "A tool to convert job descriptions into tailored resumes and cover letters.",
            link: "/tools/resume-cover-letter-convertor"
        }, 
        {
            name: "Resume/Cover Letter Converter 5",
            description: "A tool to convert job descriptions into tailored resumes and cover letters.",
            link: "/tools/resume-cover-letter-convertor"
        }, 
        {
            name: "Resume/Cover Letter Converter 6",
            description: "A tool to convert job descriptions into tailored resumes and cover letters.",
            link: "/tools/resume-cover-letter-convertor"
        }
    ]
};