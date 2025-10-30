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
    Finance = "Finance & Money",
    Conversions = "Conversions & Units"
}

export enum ToolCategorySlug {
    Jobs = "jobs-and-career",
    Health = "health-and-wellness",
    Finance = "finance-and-money",
    Conversions = "conversions-and-units"
}

export const Categories: Record<string, Category> = {
    [ToolCategory.Jobs]: {
        name: "Jobs & Career Tools",
        description: "Professional job search and career development tools",
        slug: "jobs-and-career"
    },
    [ToolCategory.Health]: {
        name: "Health & Wellness Tools", 
        description: "Health calculators and wellness tracking tools",
        slug: "health-and-wellness"
    },
    [ToolCategory.Finance]: {
        name: "Finance & Money Tools",
        description: "Financial planning and assessment calculators", 
        slug: "finance-and-money"
    },
    [ToolCategory.Conversions]: {
        name: "Conversions & Units Tools",
        description: "Convert between different units and measurements", 
        slug: "conversions-and-units"
    }
};

export const Tools: Record<string, Tool[]> = {
    [ToolCategory.Jobs]: [
        {
            name: "Resume/Cover Letter Converter",
            description: "A tool to convert job descriptions into tailored resumes and cover letters.",
            link: `/tools/${ToolCategorySlug.Jobs}/resume-cover-letter-convertor`
        }
    ],
    [ToolCategory.Health]: [
        {
            name: "BMI Calculator",
            description: "A tool to calculate your Body Mass Index (BMI) quickly and easily.",
            link: `/tools/${ToolCategorySlug.Health}/bmi-calculator`
        },
        {
            name: "Weight Loss Percentage Calculator",
            description: "Track your weight loss progress, calculate BMI changes, and get personalized insights.",
            link: `/tools/${ToolCategorySlug.Health}/weight-loss-calculator`
        }
    ],
    [ToolCategory.Finance]: [
        {
            name: "Income-to-Debt Ratio Calculator",
            description: "Assess your financial health by calculating your income-to-debt ratio and get lending guidance.",
            link: `/tools/${ToolCategorySlug.Finance}/income-to-debt-ratio-calculator`
        }
    ],
    [ToolCategory.Conversions]: [
        {
            name: "Time Unit Converter",
            description: "Convert between different time units like seconds, minutes, hours, days, and more.",
            link: `/tools/${ToolCategorySlug.Conversions}/time-unit-converter`
        },
        {
            name: "Day Converter & Date Calculator",
            description: "Calculate dates, find weekdays, date differences, and perform various date-related calculations.",
            link: `/tools/${ToolCategorySlug.Conversions}/day-converter`
        }
    ]
};