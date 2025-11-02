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

const URL_BASE = "/tools";

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

export enum ToolNameLists {
    BMICalculator = "BMI Calculator",
    CompoundInterestCalculator = "Compound Interest Calculator",
    DayConverterDateCalculator = "Day Converter & Date Calculator",
    IncomeToDebtRatioCalculator = "Income-to-Debt Ratio Calculator",
    ResumeCoverLetterConverter = "Resume/Cover Letter Converter",
    TimeUnitConverter = "Time Unit Converter",
    WeightLossCalculator = "Weight Loss Percentage Calculator",
}

export const ToolDescription: Record<string, string> = {
    [ToolNameLists.BMICalculator]: "A tool to calculate your Body Mass Index (BMI) quickly and easily.",
    [ToolNameLists.CompoundInterestCalculator]: "Calculate investment growth with compound interest, track contributions, and visualize your financial future.",
    [ToolNameLists.DayConverterDateCalculator]: "Calculate dates, find weekdays, date differences, and perform various date-related calculations.",
    [ToolNameLists.IncomeToDebtRatioCalculator]: "Assess your financial health by calculating your income-to-debt ratio and get lending guidance.",
    [ToolNameLists.ResumeCoverLetterConverter]: "A tool to convert job descriptions into tailored resumes and cover letters.",
    [ToolNameLists.TimeUnitConverter]: "Convert between different time units like seconds, minutes, hours, days, and more.",
    [ToolNameLists.WeightLossCalculator]: "Track your weight loss progress, calculate BMI changes, and get personalized insights.",
}

export const Tools: Record<string, Tool[]> = {
    [ToolCategory.Jobs]: [
        {
            name: ToolNameLists.ResumeCoverLetterConverter,
            description: ToolDescription[ToolNameLists.ResumeCoverLetterConverter],
            link: `${URL_BASE}/${ToolCategorySlug.Jobs}/resume-cover-letter-converter`
        }
    ],
    [ToolCategory.Health]: [
        {
            name: ToolNameLists.BMICalculator,
            description: ToolDescription[ToolNameLists.BMICalculator],
            link: `${URL_BASE}/${ToolCategorySlug.Health}/bmi-calculator`
        },
        {
            name: ToolNameLists.WeightLossCalculator,
            description: ToolDescription[ToolNameLists.WeightLossCalculator],
            link: `${URL_BASE}/${ToolCategorySlug.Health}/weight-loss-calculator`
        }
    ],
    [ToolCategory.Finance]: [
        {
            name: ToolNameLists.CompoundInterestCalculator,
            description: ToolDescription[ToolNameLists.CompoundInterestCalculator],
            link: `${URL_BASE}/${ToolCategorySlug.Finance}/compound-interest-calculator`
        },
        {
            name: ToolNameLists.IncomeToDebtRatioCalculator,
            description: ToolDescription[ToolNameLists.IncomeToDebtRatioCalculator],
            link: `${URL_BASE}/${ToolCategorySlug.Finance}/income-to-debt-ratio-calculator`
        }
    ],
    [ToolCategory.Conversions]: [
        {
            name: ToolNameLists.TimeUnitConverter,
            description: ToolDescription[ToolNameLists.TimeUnitConverter],
            link: `${URL_BASE}/${ToolCategorySlug.Conversions}/time-unit-converter`
        },
        {
            name: ToolNameLists.DayConverterDateCalculator,
            description: ToolDescription[ToolNameLists.DayConverterDateCalculator],
            link: `${URL_BASE}/${ToolCategorySlug.Conversions}/day-converter`
        }
    ]
};