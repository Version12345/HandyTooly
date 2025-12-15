import React, { useState } from 'react';
import Markdown from 'markdown-to-jsx'

import { copyToClipboard } from '../../utils/copyToClipboard';
import { downloadAsDocx } from '../../utils/markdownToDocx';

interface Step5Props {
    finalResume: string;
    finalCoverLetter: string;
    onComplete: () => void;
}

export const Step5: React.FC<Step5Props> = ({ finalResume, finalCoverLetter, onComplete }) => {
    const POPUP_DURATION = 3000; // Duration to show the popup in milliseconds

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [isCopying, setIsCopying] = useState(false);

    const handleDownloadDocx = async (markdown: string, documentType: string) => {
        if (isCopying) return; // Prevent multiple concurrent operations
        
        setIsCopying(true);
        try {
            await downloadAsDocx(markdown, documentType);
            setPopupMessage('Document downloaded!');
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), POPUP_DURATION);
        } catch (err) {
            console.error(`Failed to convert ${documentType} to DOCX:`, err);
        } finally {
            setIsCopying(false);
        }
    };

    const handleCopyToClipboard = async (text: string, documentType: string) => {
        if (isCopying) return; // Prevent multiple concurrent copies
        
        setIsCopying(true);
        try {
            await copyToClipboard(text);
            setPopupMessage('Copied to clipboard!');
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), POPUP_DURATION);
        } catch (err) {
            console.error(`Failed to copy ${documentType}:`, err);
        } finally {
            setIsCopying(false);
        }
    };

    return (
        <div className="w-full relative">
            {/* Floating Success Popup */}
            {showSuccessPopup && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">{popupMessage}</span>
                </div>
            )}

            <h2 className="text-xl font-bold mb-6 text-center">
                Your Final Documents Are Ready!
            </h2>
            
            <div className="space-y-8 mb-6">
                {/* Final Resume Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Final Resume</h3>
                    <div className="border border-gray-300 rounded-md p-4 h-64 bg-gray-50 overflow-y-auto">
                        <pre className="text-sm text-gray-700">
                            <Markdown>{finalResume}</Markdown>
                        </pre>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button 
                            onClick={() => handleCopyToClipboard(finalResume, 'resume')}
                            disabled={isCopying}
                            className={`px-4 py-2 rounded-md transition-colors text-sm flex items-center gap-2 ${
                                isCopying 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-sky-500 hover:bg-sky-600'
                            } text-white`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                        </button>
                        <button 
                            onClick={() => handleDownloadDocx(finalResume, 'resume')}
                            disabled={isCopying}
                            className={`px-4 py-2 rounded-md transition-colors text-sm flex items-center gap-2 ${
                                isCopying 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-500 hover:bg-green-600'
                            } text-white`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download DOCX
                        </button>
                    </div>
                </div>

                {/* Final Cover Letter Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Final Cover Letter</h3>
                    <div className="border border-gray-300 rounded-md p-4 h-64 bg-gray-50 overflow-y-auto">
                        <pre className="text-sm text-gray-700">
                            <Markdown>{finalCoverLetter}</Markdown>
                        </pre>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button 
                            onClick={() => handleCopyToClipboard(finalCoverLetter, 'cover letter')}
                            disabled={isCopying}
                            className={`px-4 py-2 rounded-md transition-colors text-sm flex items-center gap-2 ${
                                isCopying 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-sky-500 hover:bg-sky-600'
                            } text-white`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                        </button>
                        <button 
                            onClick={() => handleDownloadDocx(finalCoverLetter, 'cover_letter')}
                            disabled={isCopying}
                            className={`px-4 py-2 rounded-md transition-colors text-sm flex items-center gap-2 ${
                                isCopying 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-500 hover:bg-green-600'
                            } text-white`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download DOCX
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={onComplete}
                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                    Complete
                </button>
            </div>
        </div>
    );
};