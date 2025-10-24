import React from 'react';
import BMICalculator from './bmi-caculator';

export const metadata = {
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index (BMI) quickly and easily with our free BMI calculator. Determine if your weight is in a healthy range.',
};

export default function BMICalculatorPage() {
    return (
        <BMICalculator />
    );
};