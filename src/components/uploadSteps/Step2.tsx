import React from 'react';

interface Step2Props {
    resume: string;
    setResume: (value: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export const Step2: React.FC<Step2Props> = ({ resume, setResume, onNext, onBack }) => {
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-6 text-center">
                Enter Your Resume
            </h2>
            
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Your Resume</h3>
                <textarea
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    rows={15}
                    className="w-full shadow-sm p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
                    placeholder="Enter your resume content here..."
                    autoFocus
                />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={onBack}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                    &lt; Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!resume.trim()}
                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Next &gt;
                </button>
            </div>
        </div>
    );
};