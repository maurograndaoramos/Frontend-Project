import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepsContextValue {
  currentStep: number;
  stepsCount: number;
}

const StepsContext = createContext<StepsContextValue | undefined>(undefined);

export function Steps({
  currentStep,
  children,
  className,
}: {
  currentStep: number;
  children: React.ReactNode;
  className?: string;
}) {
  const childrenArray = React.Children.toArray(children);
  const stepsCount = childrenArray.length;

  return (
    <StepsContext.Provider value={{ currentStep, stepsCount }}>
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
  
  const { currentStep, stepsCount } = context;
  
  if (typeof stepIndex !== 'number') {
    return null;
  }
  
  const status = 
    stepIndex < currentStep ? 'completed' :
    stepIndex === currentStep ? 'current' : 'upcoming';
  
  const isLastStep = stepIndex === stepsCount - 1;
  
  return (
    <div className={cn('flex flex-1 flex-col', !isLastStep && 'relative')}>
      <div className="flex items-center">
        <div
          className={cn(
            'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
            status === 'completed' ? 'bg-primary text-primary-foreground' :
            status === 'current' ? 'border-2 border-primary text-primary' :
            'border border-muted-foreground text-muted-foreground'
          )}
        >
          {status === 'completed' ? (
            <Check className="h-4 w-4" />
          ) : (
            <span>{stepIndex + 1}</span>
          )}
        </div>
        <div className="ml-3">
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