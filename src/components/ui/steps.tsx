import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepsContextValue {
  currentStep: number;
  stepsCount: number;
  onStepClick?: (step: number) => void;
}

const StepsContext = createContext<StepsContextValue | undefined>(undefined);

export function Steps({
  currentStep,
  children,
  className,
  onStepClick,
}: {
  currentStep: number;
  children: React.ReactNode;
  className?: string;
  onStepClick?: (step: number) => void;
}) {
  const childrenArray = React.Children.toArray(children);
  const stepsCount = childrenArray.length;

  return (
    <StepsContext.Provider value={{ currentStep, stepsCount, onStepClick }}>
      <div className={cn('flex justify-between', className)}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { stepIndex: index });
          }
          return child;
        })}
      </div>
    </StepsContext.Provider>
  );
}

interface StepProps {
  title: string;
  description?: string;
  stepIndex?: number;
}

export function Step({
  title,
  stepIndex,
  description,
}: StepProps) {
  const context = useContext(StepsContext);
  
  if (!context) {
    throw new Error('Step must be used within a Steps component');
  }
  
  const { currentStep, stepsCount, onStepClick } = context;
  
  if (typeof stepIndex !== 'number') {
    return null;
  }
  
  const status = 
    stepIndex < currentStep ? 'completed' :
    stepIndex === currentStep ? 'current' : 'upcoming';
  
  const isLastStep = stepIndex === stepsCount - 1;
  
  const handleClick = () => {
    // Only allow clicking on completed steps or the current step
    if ((status === 'completed' || status === 'current') && onStepClick) {
      onStepClick(stepIndex);
    }
  };
  
  return (
    <div className={cn('flex flex-1 flex-col', !isLastStep && 'relative')}>
      <div className="flex items-center">
        <div
          className={cn(
            'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
            status === 'completed' ? 'bg-primary text-primary-foreground cursor-pointer' :
            status === 'current' ? 'border-2 border-primary text-primary' :
            'border border-muted-foreground text-muted-foreground',
            (status === 'completed' || status === 'current') && onStepClick && 'hover:ring-2 hover:ring-primary/50'
          )}
          onClick={handleClick}
          role={onStepClick ? "button" : undefined}
        >
          {status === 'completed' ? (
            <Check className="h-4 w-4" />
          ) : (
            <span>{stepIndex + 1}</span>
          )}
        </div>
        <div 
          className={cn(
            'ml-3',
            (status === 'completed' || status === 'current') && onStepClick && 'cursor-pointer'
          )}
          onClick={handleClick}
        >
          <div 
            className={cn(
              'text-sm font-medium',
              status === 'upcoming' && 'text-muted-foreground'
            )}
          >
            {title}
          </div>
          {description && (
            <div className="text-xs text-muted-foreground">
              {description}
            </div>
          )}
        </div>
        
        {!isLastStep && (
          <div 
            className={cn(
              'flex-1 ml-3 h-0.5', 
              status === 'completed' ? 'bg-primary' : 'bg-muted'
            )} 
          />
        )}
      </div>
    </div>
  );
}