'use client';

/**
 * Timer Context Provider
 * Manages global timer state to ensure only one timer is active at a time
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TimerState {
  taskId: string | null;
  startTime: number | null;
}

interface TimerContextValue {
  activeTimer: TimerState;
  startTimer: (taskId: string) => void;
  stopTimer: () => void;
  isTimerActive: (taskId: string) => boolean;
  getElapsedSeconds: () => number;
}

const TimerContext = createContext<TimerContextValue | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [activeTimer, setActiveTimer] = useState<TimerState>({
    taskId: null,
    startTime: null,
  });

  const startTimer = useCallback((taskId: string) => {
    setActiveTimer({
      taskId,
      startTime: Date.now(),
    });
  }, []);

  const stopTimer = useCallback(() => {
    setActiveTimer({
      taskId: null,
      startTime: null,
    });
  }, []);

  const isTimerActive = useCallback(
    (taskId: string) => {
      return activeTimer.taskId === taskId;
    },
    [activeTimer.taskId]
  );

  const getElapsedSeconds = useCallback(() => {
    if (!activeTimer.startTime) return 0;
    return Math.floor((Date.now() - activeTimer.startTime) / 1000);
  }, [activeTimer.startTime]);

  return (
    <TimerContext.Provider
      value={{
        activeTimer,
        startTimer,
        stopTimer,
        isTimerActive,
        getElapsedSeconds,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
}
