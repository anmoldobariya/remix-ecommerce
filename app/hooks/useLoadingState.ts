import { useNavigation } from '@remix-run/react';
import { useEffect, useState } from 'react';

export function useLoadingState() {
  const navigation = useNavigation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const isLoading = navigation.state === 'loading';
  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (navigation.state === 'idle' && isInitialLoad) {
      // Add a small delay to show skeleton for initial loads
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [navigation.state, isInitialLoad]);

  return {
    isLoading: isLoading || isInitialLoad,
    isSubmitting,
    isIdle: navigation.state === 'idle' && !isInitialLoad
  };
}

export function useDelayedLoading(delay = 200) {
  const navigation = useNavigation();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (navigation.state === 'loading') {
      timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, delay);
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigation.state, delay]);

  return {
    isLoading: navigation.state === 'loading',
    showLoading,
    isSubmitting: navigation.state === 'submitting'
  };
}
