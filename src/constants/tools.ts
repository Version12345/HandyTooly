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
    Conversions = "Conversions & Units",
    Mathematics = "Mathematics"
}

export enum ToolCategorySlug {
    Jobs = "jobs-and-career",
    Health = "health-and-wellness",
    Finance = "finance-and-money",
    Conversions = "conversions-and-units",
    Mathematics = "mathematics"
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
    },
    [ToolCategory.Mathematics]: {
        name: "Mathematics Tools",
        description: "Mathematical calculators & statistical analysis tools", 
        slug: "mathematics"
    }
};

export enum ToolNameLists {
    BMICalculator = "BMI Calculator",
    CompoundInterestCalculator = "Compound Interest Calculator",
    DayConverterDateCalculator = "Day Converter & Date Calculator",
    HexToDecimalConverter = "Hex to Decimal Converter",
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
    TemperatureConverter = "Temperature Converter",
    CreditCardPaymentCalculator = "Credit Card Payment Calculator",
    BMRCalculator = "BMR Calculator",
    MeanMedianModeCalculator = "Mean Median Mode Calculator",
    WordCharacterCounter = "Word Character Counter",
    Base64Converter = "Base64 Converter",
    HtmlEncoder = "HTML Encoder/Decoder",
}

export const ToolDescription: Record<string, string> = {
    [ToolNameLists.BMICalculator]: "Calculate your Body Mass Index (BMI) for weight loss, maintenance, or gain. You can use kg & cm or lbs & inches conversions.",
    [ToolNameLists.BMRCalculator]: "Calculate your Basal Metabolic Rate (BMR) for weight loss, maintenance, or gain. You can use kg & cm or lbs & inches conversions.",
    [ToolNameLists.CompoundInterestCalculator]: "Calculate investment growth with compound interest & track continuous contributions in different currencies.",
    [ToolNameLists.DayConverterDateCalculator]: "Calculate dates, find weekdays, date differences, & perform various date-related calculations.",
    [ToolNameLists.HexToDecimalConverter]: "Convert hexadecimal (hex) numbers to decimal, binary, octal & more. Perfect for programming, web development & computer science calculations.",
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
    [ToolNameLists.TemperatureConverter]: "Convert Celsius (°C), Fahrenheit (°F), Kelvin (K), Rankine (°R), etc with our temperature converter. Perfect for cooking, science, & weather measurements.",
    [ToolNameLists.CreditCardPaymentCalculator]: "Calculate how long it takes to pay off credit card debt & total interest. Plan payments, compare strategies & get debt-free faster with multiple currencies.",
    [ToolNameLists.MeanMedianModeCalculator]: "Calculate mean, median, mode along with minimum, maximum, range, quartiles, and sum for a set of data. Perfect for statistics, data analysis, & mathematical calculations.",
    [ToolNameLists.WordCharacterCounter]: "Count words, characters, sentences, and paragraphs in your text. Analyze readability, reading time, and tone of voice. Perfect for writing, content creation, and text analysis.",
    [ToolNameLists.Base64Converter]: "Encode text to Base64 or decode Base64 to text. Convert images to Base64 format for web development, data storage, & API integration. Perfect for developers & data encoding needs.",
    [ToolNameLists.HtmlEncoder]: "Encode HTML to entities or decode HTML entities to text. Convert special characters like <, >, &, quotes for safe HTML display. Perfect for web development & content management.",
}

export const ToolUrls: Record<string, string> = {
    [ToolNameLists.BMICalculator]: `${URL_BASE}/${ToolCategorySlug.Health}/bmi-calculator`,
    [ToolNameLists.CompoundInterestCalculator]: `${URL_BASE}/${ToolCategorySlug.Finance}/compound-interest-calculator`,
    [ToolNameLists.DayConverterDateCalculator]: `${URL_BASE}/${ToolCategorySlug.Conversions}/day-converter`,
    [ToolNameLists.HexToDecimalConverter]: `${URL_BASE}/${ToolCategorySlug.Conversions}/hex-to-decimal-converter`,
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
    [ToolNameLists.TemperatureConverter]: `${URL_BASE}/${ToolCategorySlug.Conversions}/temperature-converter`,
    [ToolNameLists.CreditCardPaymentCalculator]: `${URL_BASE}/${ToolCategorySlug.Finance}/credit-card-payment-calculator`,
    [ToolNameLists.BMRCalculator]: `${URL_BASE}/${ToolCategorySlug.Health}/bmr-calculator`,
    [ToolNameLists.MeanMedianModeCalculator]: `${URL_BASE}/${ToolCategorySlug.Mathematics}/mean-median-mode-calculator`,
    [ToolNameLists.WordCharacterCounter]: `${URL_BASE}/${ToolCategorySlug.Conversions}/word-character-counter`,
    [ToolNameLists.Base64Converter]: `${URL_BASE}/${ToolCategorySlug.Conversions}/base64-converter`,
    [ToolNameLists.HtmlEncoder]: `${URL_BASE}/${ToolCategorySlug.Conversions}/html-encoder`,
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
            name: ToolNameLists.BMRCalculator,
            description: ToolDescription[ToolNameLists.BMRCalculator],
            link: ToolUrls[ToolNameLists.BMRCalculator]
        },
        {
            name: ToolNameLists.StepsToDistanceCalculator,
            description: ToolDescription[ToolNameLists.StepsToDistanceCalculator],
            link: ToolUrls[ToolNameLists.StepsToDistanceCalculator]
        },
        {
            name: ToolNameLists.WeightLossCalculator,
            description: ToolDescription[ToolNameLists.WeightLossCalculator],
            link: ToolUrls[ToolNameLists.WeightLossCalculator]
        },
    ],
    [ToolCategory.Finance]: [
        {
            name: ToolNameLists.CompoundInterestCalculator,
            description: ToolDescription[ToolNameLists.CompoundInterestCalculator],
            link: ToolUrls[ToolNameLists.CompoundInterestCalculator]
        },
        {
            name: ToolNameLists.CreditCardPaymentCalculator,
            description: ToolDescription[ToolNameLists.CreditCardPaymentCalculator],
            link: ToolUrls[ToolNameLists.CreditCardPaymentCalculator]
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
        },
    ],
    [ToolCategory.Conversions]: [
        {
            name: ToolNameLists.AreaConverter,
            description: ToolDescription[ToolNameLists.AreaConverter],
            link: ToolUrls[ToolNameLists.AreaConverter]
        },
        {
            name: ToolNameLists.Base64Converter,
            description: ToolDescription[ToolNameLists.Base64Converter],
            link: ToolUrls[ToolNameLists.Base64Converter]
        },
        {
            name: ToolNameLists.DayConverterDateCalculator,
            description: ToolDescription[ToolNameLists.DayConverterDateCalculator],
            link: ToolUrls[ToolNameLists.DayConverterDateCalculator]
        },
        {
            name: ToolNameLists.HexToDecimalConverter,
            description: ToolDescription[ToolNameLists.HexToDecimalConverter],
            link: ToolUrls[ToolNameLists.HexToDecimalConverter]
        },
        {
            name: ToolNameLists.HtmlEncoder,
            description: ToolDescription[ToolNameLists.HtmlEncoder],
            link: ToolUrls[ToolNameLists.HtmlEncoder]
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
            name: ToolNameLists.TemperatureConverter,
            description: ToolDescription[ToolNameLists.TemperatureConverter],
            link: ToolUrls[ToolNameLists.TemperatureConverter]
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
            name: ToolNameLists.WordCharacterCounter,
            description: ToolDescription[ToolNameLists.WordCharacterCounter],
            link: ToolUrls[ToolNameLists.WordCharacterCounter]
        },
        {
            name: ToolNameLists.VolumeConverter,
            description: ToolDescription[ToolNameLists.VolumeConverter],
            link: ToolUrls[ToolNameLists.VolumeConverter]
        },
    ],
    [ToolCategory.Mathematics]: [
        {
            name: ToolNameLists.MeanMedianModeCalculator,
            description: ToolDescription[ToolNameLists.MeanMedianModeCalculator],
            link: ToolUrls[ToolNameLists.MeanMedianModeCalculator]
        }
    ]
};