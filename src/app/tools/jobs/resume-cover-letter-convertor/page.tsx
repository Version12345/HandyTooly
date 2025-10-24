import React from 'react';
import ResumeCoverLetterConvertor from './converter';

export const metadata = {
    title: 'Resume/Cover Letter Converter',
    description: 'Easily convert job descriptions into tailored resumes and cover letters with our Resume/Cover Letter Converter tool.',
};

export default function ResumeCoverLetterConvertorBase() {
    return (
        <ResumeCoverLetterConvertor />
    );
};