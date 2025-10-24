interface Tool {
    name: string;
    description: string;
    link: string;
}

interface Category {
    name: string;
    description: string;
    slug: string;
}

export enum ToolCategory {
    Jobs = "Jobs & Career",
    Health = "Health & Wellness",
    Finance = "Finance & Money"
}

export const Categories: Record<string, Category> = {
    [ToolCategory.Jobs]: {
        name: "Jobs & Career Tools",
        description: "Professional job search and career development tools",
        slug: "jobs"
    },
    [ToolCategory.Health]: {
        name: "Health & Wellness Tools", 
        description: "Health calculators and wellness tracking tools",
        slug: "health"
    },
    [ToolCategory.Finance]: {
        name: "Finance & Money Tools",
        description: "Financial planning and assessment calculators", 
        slug: "finance"
    }
};

export const Tools: Record<string, Tool[]> = {
    [ToolCategory.Jobs]: [
        {
            name: "Resume/Cover Letter Converter",
            description: "A tool to convert job descriptions into tailored resumes and cover letters.",
            link: "/tools/jobs/resume-cover-letter-convertor"
        }
    ],
    [ToolCategory.Health]: [
        {
            name: "BMI Calculator",
            description: "A tool to calculate your Body Mass Index (BMI) quickly and easily.",
            link: "/tools/health/bmi-calculator"
        }
    ],
    [ToolCategory.Finance]: [
        {
            name: "Debt-to-Income Ratio Calculator",
            description: "Assess your financial health by calculating your debt-to-income ratio and get lending guidance.",
            link: "/tools/finance/income-to-debt-ratio-calculator"
        }
    ]
};