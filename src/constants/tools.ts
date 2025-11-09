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
        description: "Professional job search & career development tools",
        slug: "jobs-and-career"
    },
    [ToolCategory.Health]: {
        name: "Health & Wellness Tools", 
        description: "Health calculators & wellness tracking tools",
        slug: "health-and-wellness"
    },
    [ToolCategory.Finance]: {
        name: "Finance & Money Tools",
        description: "Financial planning & assessment calculators", 
        slug: "finance-and-money"
    },
    [ToolCategory.Conversions]: {
        name: "Conversions & Units Tools",
        description: "Convert between different units & measurements", 
        slug: "conversions-and-units"
    }
};

export enum ToolNameLists {
    BMICalculator = "BMI Calculator",
    CompoundInterestCalculator = "Compound Interest Calculator",
    DayConverterDateCalculator = "Day Converter & Date Calculator",
    IncomeToDebtRatioCalculator = "Income-to-Debt Ratio Calculator",
    InflationCalculator = "Inflation Calculator",
    ResumeCoverLetterConverter = "Resume/Cover Letter Converter",
    RomanNumeralsConverter = "Roman Numerals Converter",
    SalaryCalculator = "Salary Calculator",
    StepsToDistanceCalculator = "Steps to Distance Calculator",
    TimeUnitConverter = "Time Unit Converter",
    UTCTimeZoneConverter = "UTC Time Zone Converter",
    WeightConverter = "Weight Converter",
    WeightLossCalculator = "Weight Loss Percentage Calculator",
    LengthConverter = "Length Converter",
    VolumeConverter = "Volume Converter",
    AreaConverter = "Area Converter",
}

export const ToolDescription: Record<string, string> = {
    [ToolNameLists.BMICalculator]: "Calculate your Body Mass Index (BMI). You can use kg & cm or lbs & inches conversions.",
    [ToolNameLists.CompoundInterestCalculator]: "Calculate investment growth with compound interest & track continuous contributions in different currencies.",
    [ToolNameLists.DayConverterDateCalculator]: "Calculate dates, find weekdays, date differences, & perform various date-related calculations.",
    [ToolNameLists.IncomeToDebtRatioCalculator]: "Assess your financial health by calculating your income-to-debt ratio & get lending guidance in different currencies.",
    [ToolNameLists.InflationCalculator]: "Calculate the impact of inflation on purchasing power, analyze future value, & understand real-world cost changes over time.",
    [ToolNameLists.ResumeCoverLetterConverter]: "Convert job descriptions into tailored resumes & cover letters using our AI tools.",
    [ToolNameLists.RomanNumeralsConverter]: "Convert between regular numbers & Roman numerals with explanations. Support traditional notation & vinculum (overline) for large numbers.",
    [ToolNameLists.SalaryCalculator]: "Calculate take-home pay, tax breakdowns, & detailed salary analysis in different currencies.",
    [ToolNameLists.StepsToDistanceCalculator]: "Convert daily steps to distance (miles or kilometers), calculate calories burned, & track your walking distance with personalized metrics.",
    [ToolNameLists.TimeUnitConverter]: "Convert between different time units like seconds, minutes, hours, days, etc.",
    [ToolNameLists.UTCTimeZoneConverter]: "Convert between UTC & local time zones with real-time conversion & multiple time zone support.",
    [ToolNameLists.WeightConverter]: "Convert pounds, kilograms (kg), ounces (oz), grams (g), etc with our weight converter. Perfect for cooking, fitness tracking, & scientific measurements.",
    [ToolNameLists.WeightLossCalculator]: "Track your weight loss progress, calculate BMI changes, & get personalized insights.",
    [ToolNameLists.LengthConverter]: "Convert meters (m), feet (ft), inches (in), kilometers (km), miles (mil), etc with our length converter. Perfect for construction, & scientific measurements.",
    [ToolNameLists.VolumeConverter]: "Convert liters (L), gallons (gal), cups (c), milliliters (mL), etc with our volume converter. Perfect for cooking, engineering, & everyday measurements.",
    [ToolNameLists.AreaConverter]: "Convert square meters (m²), square feet (ft²), acres, hectares, etc with our area converter. Perfect for real estate, gardening, & land measurements.",
}

export const ToolUrls: Record<string, string> = {
    [ToolNameLists.BMICalculator]: `${URL_BASE}/${ToolCategorySlug.Health}/bmi-calculator`,
    [ToolNameLists.CompoundInterestCalculator]: `${URL_BASE}/${ToolCategorySlug.Finance}/compound-interest-calculator`,
    [ToolNameLists.DayConverterDateCalculator]: `${URL_BASE}/${ToolCategorySlug.Conversions}/day-converter`,
    [ToolNameLists.IncomeToDebtRatioCalculator]: `${URL_BASE}/${ToolCategorySlug.Finance}/income-to-debt-ratio-calculator`,
    [ToolNameLists.InflationCalculator]: `${URL_BASE}/${ToolCategorySlug.Finance}/inflation-calculator`,
    [ToolNameLists.ResumeCoverLetterConverter]: `${URL_BASE}/${ToolCategorySlug.Jobs}/resume-cover-letter-converter`,
    [ToolNameLists.RomanNumeralsConverter]: `${URL_BASE}/${ToolCategorySlug.Conversions}/roman-numerals-converter`,
    [ToolNameLists.SalaryCalculator]: `${URL_BASE}/${ToolCategorySlug.Finance}/salary-calculator`,
    [ToolNameLists.StepsToDistanceCalculator]: `${URL_BASE}/${ToolCategorySlug.Conversions}/steps-to-distance-calculator`,
    [ToolNameLists.TimeUnitConverter]: `${URL_BASE}/${ToolCategorySlug.Conversions}/time-unit-converter`,
    [ToolNameLists.UTCTimeZoneConverter]: `${URL_BASE}/${ToolCategorySlug.Conversions}/utc-time-zone-converter`,
    [ToolNameLists.WeightConverter]: `${URL_BASE}/${ToolCategorySlug.Conversions}/weight-converter`,
    [ToolNameLists.WeightLossCalculator]: `${URL_BASE}/${ToolCategorySlug.Health}/weight-loss-calculator`,
    [ToolNameLists.LengthConverter]: `${URL_BASE}/${ToolCategorySlug.Conversions}/length-converter`,
    [ToolNameLists.VolumeConverter]: `${URL_BASE}/${ToolCategorySlug.Conversions}/volume-converter`,
    [ToolNameLists.AreaConverter]: `${URL_BASE}/${ToolCategorySlug.Conversions}/area-converter`,
}

export const Tools: Record<string, Tool[]> = {
    [ToolCategory.Jobs]: [
        {
            name: ToolNameLists.ResumeCoverLetterConverter,
            description: ToolDescription[ToolNameLists.ResumeCoverLetterConverter],
            link: ToolUrls[ToolNameLists.ResumeCoverLetterConverter]
        }
    ],
    [ToolCategory.Health]: [
        {
            name: ToolNameLists.BMICalculator,
            description: ToolDescription[ToolNameLists.BMICalculator],
            link: ToolUrls[ToolNameLists.BMICalculator]
        },
        {
            name: ToolNameLists.WeightLossCalculator,
            description: ToolDescription[ToolNameLists.WeightLossCalculator],
            link: ToolUrls[ToolNameLists.WeightLossCalculator]
        }
    ],
    [ToolCategory.Finance]: [
        {
            name: ToolNameLists.CompoundInterestCalculator,
            description: ToolDescription[ToolNameLists.CompoundInterestCalculator],
            link: ToolUrls[ToolNameLists.CompoundInterestCalculator]
        },
        {
            name: ToolNameLists.IncomeToDebtRatioCalculator,
            description: ToolDescription[ToolNameLists.IncomeToDebtRatioCalculator],
            link: ToolUrls[ToolNameLists.IncomeToDebtRatioCalculator]
        },
        {
            name: ToolNameLists.InflationCalculator,
            description: ToolDescription[ToolNameLists.InflationCalculator],
            link: ToolUrls[ToolNameLists.InflationCalculator]
        },
        {
            name: ToolNameLists.SalaryCalculator,
            description: ToolDescription[ToolNameLists.SalaryCalculator],
            link: ToolUrls[ToolNameLists.SalaryCalculator]
        }
    ],
    [ToolCategory.Conversions]: [
        {
            name: ToolNameLists.AreaConverter,
            description: ToolDescription[ToolNameLists.AreaConverter],
            link: ToolUrls[ToolNameLists.AreaConverter]
        },
        {
            name: ToolNameLists.DayConverterDateCalculator,
            description: ToolDescription[ToolNameLists.DayConverterDateCalculator],
            link: ToolUrls[ToolNameLists.DayConverterDateCalculator]
        },
        {
            name: ToolNameLists.LengthConverter,
            description: ToolDescription[ToolNameLists.LengthConverter],
            link: ToolUrls[ToolNameLists.LengthConverter]
        },
        {
            name: ToolNameLists.RomanNumeralsConverter,
            description: ToolDescription[ToolNameLists.RomanNumeralsConverter],
            link: ToolUrls[ToolNameLists.RomanNumeralsConverter]
        },
        {
            name: ToolNameLists.StepsToDistanceCalculator,
            description: ToolDescription[ToolNameLists.StepsToDistanceCalculator],
            link: ToolUrls[ToolNameLists.StepsToDistanceCalculator]
        },
        {
            name: ToolNameLists.TimeUnitConverter,
            description: ToolDescription[ToolNameLists.TimeUnitConverter],
            link: ToolUrls[ToolNameLists.TimeUnitConverter]
        },
        {
            name: ToolNameLists.UTCTimeZoneConverter,
            description: ToolDescription[ToolNameLists.UTCTimeZoneConverter],
            link: ToolUrls[ToolNameLists.UTCTimeZoneConverter]
        },
        {
            name: ToolNameLists.WeightConverter,
            description: ToolDescription[ToolNameLists.WeightConverter],
            link: ToolUrls[ToolNameLists.WeightConverter]
        },
        {
            name: ToolNameLists.VolumeConverter,
            description: ToolDescription[ToolNameLists.VolumeConverter],
            link: ToolUrls[ToolNameLists.VolumeConverter]
        },
    ]
};