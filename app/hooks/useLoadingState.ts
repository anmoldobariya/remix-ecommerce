import { useNavigation, useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';

export function useLoadingState() {
  const navigation = useNavigation();
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

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

  // Handle navigation between different routes
  useEffect(() => {
    if (navigation.state === 'loading' && navigation.location) {
      // Check if we're navigating to a different route
      const isRouteDifferent =
        navigation.location.pathname !== location.pathname;
      setIsNavigating(isRouteDifferent);
    } else if (navigation.state === 'idle') {
      setIsNavigating(false);
    }
  }, [navigation.state, navigation.location, location.pathname]);

  return {
    isLoading: isLoading || isInitialLoad,
    isSubmitting,
    isIdle: navigation.state === 'idle' && !isInitialLoad,
    isNavigating,
    destinationPath: navigation.location?.pathname
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
