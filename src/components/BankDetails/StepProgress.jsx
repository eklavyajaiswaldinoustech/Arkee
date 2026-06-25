import React from 'react';

// ── Heroicons (inline SVG for zero-dependency) ──
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const STEPS = [
  { label: 'Account' },
  { label: 'Bank Info' },
  { label: 'Verify' },
  { label: 'Review' },
  { label: 'Save' }
];

const StepProgress = ({ currentStep, completedSteps = [] }) => {
  return (
    <div className="bd-progress-wrapper">
      <div className="bd-progress-steps">
        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = completedSteps.includes(stepNum) || stepNum < currentStep;

          return (
            <div
              key={idx}
              className={`bd-progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <div className="bd-progress-dot">
                {isCompleted ? <CheckIcon /> : stepNum}
              </div>
              <span className="bd-progress-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;