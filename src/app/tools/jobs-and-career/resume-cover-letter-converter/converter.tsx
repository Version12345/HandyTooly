"use client"
import React, { useState } from 'react';
import { Step1, Step2, Step3, Step4, Step5 } from '../../../../components/uploadSteps';
import ToolLayout from '../../toolLayout';
import JobDisclaimer from '../../../../components/disclaimers/jobDisclaimer';
import { ToolNameLists } from '@/constants/tools';

export default function ResumeCoverLetterConverter() {
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
        toolCategory={ToolNameLists.ResumeCoverLetterConverter}
        disclaimer={<JobDisclaimer />}
      >
        <p className="text-red-500 text-sm"><strong>NOTE:</strong> Our AI tool may take 3&ndash;5 minutes to process your information. Do not close the browser or refresh the page.</p>
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
      <div className="mt-8">
        <h2>Why Use Our Tool?</h2>
        <p>
          It is important to update your resume and cover letter to match each job description. Every role asks for different skills and experience, so your documents should show how you fit those needs. Employers look for clear connections between what they want and what you offer. When you tailor your resume and cover letter, you show that you read the posting carefully and care about the job. This simple step helps you stand out and increases your chance of getting an interview. Our tool makes this easy by quickly adjusting your documents to fit the job, saving you time and effort. 
        </p>
        <h2>What is a resume?</h2>
        <p>
          A resume is a short document that shows your skills, experience, and education. It tells employers who you are and what you can do. A good resume highlights your strengths and matches them to the job you want. It includes clear sections for work history, education, and special abilities. The goal is to help employers see why you are a strong fit for the role. A simple, well-organized resume can make a strong first impression and open the door to new opportunities.
        </p>
        <h2>What is a cover letter?</h2>
        <p>
          A cover letter is a short letter you send with your resume when applying for a job. It lets you speak directly to the employer and explain why you want the position. A good cover letter connects your skills and experience to what the job needs. It also shows your interest in the company and your excitement to contribute. Writing in a clear and friendly tone helps you stand out and makes your application feel more personal. The goal of a cover letter is to make a strong case for why you should be considered for an interview.
        </p>
      </div>
    </ToolLayout>
  );
};