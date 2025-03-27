import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Check, User, Truck, CreditCard, ClipboardCheck, ChevronLeft } from 'lucide-react';

interface StepsContextValue {
  currentStep: number;
  stepsCount: number;
  onStepClick?: (step: number) => void;
}

const StepsContext = createContext<StepsContextValue | undefined>(undefined);

// Map step titles to their respective icons
const stepIcons: { [key: string]: React.ElementType } = {
  'Recipient': User,
  'Shipping': Truck,
  'Payment': CreditCard,
  'Review': ClipboardCheck,
};

interface StepElement extends React.ReactElement {
  props: StepProps;
}

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
      {/* Desktop View */}
      <div className={cn('hidden md:flex justify-between', className)}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { 
              stepIndex: index,
              showConnector: true 
            });
          }
          return child;
        })}
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col space-y-4">
        <div className="flex items-center">
          {currentStep > 0 && (
            <button
              onClick={() => onStepClick?.(currentStep - 1)}
              className="absolute left-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child) && index === currentStep) {
              return React.cloneElement(child as React.ReactElement<any>, { 
                stepIndex: index,
                showConnector: false,
                isMobile: true 
              });
            }
            return null;
          })}
        </div>
        <div className="flex justify-center items-center space-x-3">
          {React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) return null;
            const stepChild = child as StepElement;
            
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <button
                key={index}
                onClick={() => index < currentStep && onStepClick?.(index)}
                disabled={index > currentStep}
                className={cn(
                  'flex items-center space-x-1 py-1 px-2 rounded-full transition-all duration-200',
                  index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50'
                )}
                aria-label={`Go to ${stepChild.props.title} step`}
              >
                <div
                  className={cn(
                    'h-2 w-2 rounded-full transition-colors duration-200',
                    isCompleted ? 'bg-primary' :
                    isCurrent ? 'bg-primary' : 'bg-muted'
                  )}
                />
                <span className={cn(
                  'text-xs',
                  isCompleted ? 'text-primary font-medium' :
                  isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'
                )}>
                  {stepChild.props.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </StepsContext.Provider>
  );
}

interface StepProps {
  title: string;
  description?: string;
  stepIndex?: number;
  showConnector?: boolean;
  isMobile?: boolean;
}

export function Step({
  title,
  stepIndex,
  description,
  showConnector = true,
  isMobile = false,
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
    if ((status === 'completed' || status === 'current') && onStepClick) {
      onStepClick(stepIndex);
    }
  };

  const Icon = stepIcons[title] || null;
  
  if (isMobile) {
    return (
      <div className="flex items-center justify-center space-x-3 py-2">
        <div
          className={cn(
            'h-10 w-10 rounded-full flex items-center justify-center text-base font-medium transition-all duration-200',
            status === 'completed' ? 'bg-primary text-primary-foreground cursor-pointer' :
            status === 'current' ? 'border-2 border-primary text-primary' :
            'border border-muted-foreground text-muted-foreground',
            (status === 'completed' || status === 'current') && 'hover:ring-2 hover:ring-primary/50'
          )}
          onClick={handleClick}
          role={onStepClick ? "button" : undefined}
        >
          {status === 'completed' ? (
            <Check className="h-5 w-5" />
          ) : Icon ? (
            <Icon className="h-5 w-5" />
          ) : (
            <span>{stepIndex + 1}</span>
          )}
        </div>
        <div>
          <div className="font-medium">{title}</div>
          {description && (
            <div className="text-sm text-muted-foreground">
              {description}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn('flex flex-1 items-center', !isLastStep && showConnector && 'relative')}>
      <div className="flex items-center space-x-3">
        <div
          className={cn(
            'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
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
          ) : Icon ? (
            <Icon className="h-4 w-4" />
          ) : (
            <span>{stepIndex + 1}</span>
          )}
        </div>
        <div 
          className={cn(
            'transition-opacity duration-200',
            (status === 'completed' || status === 'current') && onStepClick && 'cursor-pointer'
          )}
          onClick={handleClick}
        >
          <div 
            className={cn(
              'text-sm font-medium transition-colors duration-200',
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
      </div>
      
      {!isLastStep && showConnector && (
        <div 
          className={cn(
            'flex-1 h-0.5 mx-3 transition-colors duration-200', 
            status === 'completed' ? 'bg-primary' : 'bg-muted'
          )} 
        />
      )}
    </div>
  );
}