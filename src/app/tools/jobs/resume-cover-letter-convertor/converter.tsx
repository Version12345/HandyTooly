"use client"
import React, { useState } from 'react';
import { Step1, Step2, Step3, Step4, Step5 } from '../../../../components/uploadSteps';
import ToolLayout from '../../toolLayout';

export default function ResumeCoverLetterConvertor() {
    const [currentStep, setCurrentStep] = useState(1);
    const [jobDescription, setJobDescription] = useState('');
    const [resume, setResume] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [finalResume, setFinalResume] = useState('');
    const [finalCoverLetter, setFinalCoverLetter] = useState('');

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