"use client"
import React, { useState } from 'react';
import { Step1, Step2, Step3, Step4, Step5 } from '../../../../components/uploadSteps';
import ToolLayout from '../../toolLayout';

export default function ResumeCoverLetterConvertor() {
    const [currentStep, setCurrentStep] = useState(5);
    const [jobDescription, setJobDescription] = useState('');
    const [resume, setResume] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [finalResume, setFinalResume] = useState(resumet);
    const [finalCoverLetter, setFinalCoverLetter] = useState(coverLettert);

    const handleNext = async () => {
        if (currentStep === 1) {
            // Here you would typically process the job description
            // For now, we'll just simulate the results
            setResume('');
            setCoverLetter('');
            setCurrentStep(2);
        } else if (currentStep === 2) {
            // Move to cover letter step
            setCurrentStep(3);
        } else if (currentStep === 3) {
            // Move to loading step
            setCurrentStep(4);
        }
    };

    const handleBack = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
        } else if (currentStep === 3) {
            setCurrentStep(2);
        } else if (currentStep === 5) {
            setCurrentStep(3);
        }
    };

    const handleComplete = () => {
        // reset all states or perform any final actions upon completion
        setCurrentStep(1);
        setJobDescription('');
        setResume('');
        setCoverLetter('');
        setFinalResume('');
        setFinalCoverLetter('');
    }

    return (
        <ToolLayout
            pageTitle="Resume/Cover Letter Converter"
        >
            {/* Description */}
            <p className="text-sm">
                Job searching can be frustrating. You spend hours rewriting your resume and cover letter for each role. Our tool fixes that. It matches your resume and cover letter to the job description in minutes. No more guessing what to change or where to start. Save time, stay focused, and make your search less stressful.
            </p>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                {currentStep === 1 && (
                    <Step1 
                        jobDescription={jobDescription} 
                        setJobDescription={setJobDescription} 
                        onNext={handleNext} 
                    />
                )}
                {currentStep === 2 && (
                    <Step2 
                        resume={resume} 
                        setResume={setResume} 
                        onNext={handleNext} 
                        onBack={handleBack} 
                    />
                )}
                {currentStep === 3 && (
                    <Step3 
                        coverLetter={coverLetter} 
                        setCoverLetter={setCoverLetter} 
                        onNext={handleNext} 
                        onBack={handleBack} 
                    />
                )}
                {currentStep === 4 && (
                    <Step4 
                        jobDescription={jobDescription}
                        resume={resume}
                        coverLetter={coverLetter}
                        setFinalResume={setFinalResume}
                        setFinalCoverLetter={setFinalCoverLetter}
                        setIsLoading={setIsLoading}
                        onComplete={() => setCurrentStep(5)}
                    />
                )}
                {!isLoading && currentStep === 5 && (
                    <Step5 
                        finalResume={finalResume} 
                        finalCoverLetter={finalCoverLetter} 
                        onComplete={handleComplete} 
                    />
                )}
            </div>
        </ToolLayout>
    );
};

const resumet = `
# **DEVIN YU**

Phone: (206) 335-0903  Email: devinyu0903@gmail.com  LinkedIn: linkedin.com/in/devinyu

**Professional Profile** Senior Full Stack Engineer with 10+ years building web and service systems. Strong in TypeScript, React, Angular, C#, .NET Core, GraphQL, and Python. I modernize legacy apps and deliver scalable microservices.

**Specialized Skills**
- Languages and frameworks: C#, TypeScript, JavaScript, React.js, Angular, ASP.NET Core, Node.js, Python
- APIs and data: GraphQL, REST, SQL, DynamoDB
- Cloud and infra: Azure DevOps, AWS, Docker, YAML, CI/CD
- Front end: HTML5, CSS3, SASS, Vite, Jest, D3.js
- Tools: Git, DataDog, Express.js

**Experience**
- Senior Software Engineer, AdaptX — *12/2023 - 08/2025, Seattle, WA*
  - Developed and maintained Angular apps with TypeScript and SASS.
  - Built an MCP prototype to connect distributed microservices and AI agents using ChatGPT and Haystack.
  - Integrated AWS services and used DataDog to monitor application performance.
  - Implemented D3.js visualizations to surface clinical capacity and quality metrics.
  - Built Node.js microservices with DynamoDB and Express.js for robust system integration.

- Senior Software Engineer / Software Engineer, Unisys / Unify Square — *11/2018 - 12/2023, Bellevue, WA*
  - Implemented PowerSuite features using .NET Core, React.js, and SASS for enterprise customers.
  - Integrated ServiceNow, Teams, and ZOOM to surface call quality and usage data.
  - Migrated legacy AngularJS apps to React.js to improve maintainability and security.
  - Managed full development lifecycle and mentored junior engineers.
  - Delivered solutions for clients including Microsoft, Deloitte, and Lockheed Martin.

- Web Developer, Amazon — *08/2017 - 10/2018, Seattle, WA*
  - Supported internal tools for video metadata and encoding workflows using Ruby on Rails and AngularJS.
  - Built React.js and Java services to track metadata and regional licensing status.
  - Provided on-call support to reduce downtime and speed incident resolution.

- Web Developer, Bill4Time — *06/2016 - 08/2017, Bellevue, WA*
  - Developed a CMS using .NET, Node.js, Backbone.js, and modern HTML5/CSS.
  - Managed source control with Git and integrated SQL backends.

- .NET Web Developer, City of Seattle — *01/2016 - 05/2016, Seattle, WA*
  - Added features to the www.Seattle.gov CMS using C# MVC, JavaScript, and HTML5.

- .NET Web Developer, Lowe's Companies — *06/2014 - 12/2015, Kirkland, WA*
  - Built internal order and vendor management tools using .NET and AngularJS.
  - Implemented accounting, inventory, and fulfillment features for company-wide use.

**Education**
- Certificate in Web Development, Bellevue College — *Fall 2011 - Spring 2013, Bellevue, WA*
- BA in Interdisciplinary Visual Art, University of Washington — *Fall 2004 - Spring 2006, Seattle, WA*
`;

const coverLettert = `
Dear Applied Sciences Group Hiring Team,

I am applying for the Software Engineer II - Full Stack role on the Applied Sciences Group. I have 10+ years of full stack experience. I write production-grade code and ship features that users rely on.

At AdaptX I built front-end apps with Angular and TypeScript. I built Node.js microservices and integrated AWS services. I led a prototype that connected microservices and AI agents to analyze data and flag anomalies. That work required fast iteration and clear APIs.

At Unisys I delivered enterprise features using .NET Core and React. I integrated ServiceNow, Teams, and ZOOM to surface actionable data. I modernized legacy AngularJS apps to React. I worked across teams to meet customer goals.

I enjoy projects that span layers of the stack. I design APIs, build services, and craft user interfaces. I focus on performance, reliability, and clear user flows. I learn new tools quickly and adapt to changing priorities.

I am excited to help ASG build features like Semantic Index and voice and inking experiences. I want to work on software that reaches millions of users. I will bring ownership, steady execution, and strong engineering skills.

You can reach me at (206) 335-0903 or devinyu0903@gmail.com. Thank you for your time. I look forward to speaking with you.

Sincerely,

Devin Yu
`