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
        }
    ],
    "Health": [
        {
            name: "BMI Calculator",
            description: "A tool to calculate your Body Mass Index (BMI) quickly and easily.",
            link: "/tools/health/bmi-calculator"
        }
    ],
    "Finance": [
        {
            name: "Debt-to-Income Ratio Calculator",
            description: "Assess your financial health by calculating your debt-to-income ratio and get lending guidance.",
            link: "/tools/finance/income-to-debt-ratio-calculator"
        }
    ]
};