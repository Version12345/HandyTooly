import React from 'react';

interface Step1Props {
    jobDescription: string;
    setJobDescription: (value: string) => void;
    onNext: () => void;
}

export const Step1: React.FC<Step1Props> = ({ jobDescription, setJobDescription, onNext }) => {
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-6 text-center">
                Convert Job Description to Resume And Cover Letter
            </h2>
            
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Enter Job Description</h3>
                
                <div className="grid grid-cols-1 gap-6">
                    {/* Job Description Textarea */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Paste Description Here</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={8}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                            placeholder="Paste the job description here..."
                            autoFocus
                        />
                    </div>
                </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
                <button
                    onClick={onNext}
                    disabled={!jobDescription.trim()}
                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Next &gt;
                </button>
            </div>
        </div>
    );
};