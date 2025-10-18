import React from 'react';

interface Step3Props {
    coverLetter: string;
    setCoverLetter: (value: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export const Step3: React.FC<Step3Props> = ({ coverLetter, setCoverLetter, onNext, onBack }) => {
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-6 text-center">
                Enter Your Cover Letter
            </h2>
            
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Your Cover Letter</h3>
                <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={15}
                    className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
                    placeholder="Enter your cover letter content here..."
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
                    disabled={!coverLetter.trim()}
                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Submit &gt;
                </button>
            </div>
        </div>
    );
};