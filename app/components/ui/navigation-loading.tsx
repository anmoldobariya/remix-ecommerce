import { useNavigation, useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { RouteAwareSkeleton } from './loading';

export function NavigationLoadingOverlay() {
  const navigation = useNavigation();
  const location = useLocation();
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (navigation.state === 'loading' && navigation.location) {
      // Only show overlay for route changes, not form submissions
      const isRouteDifferent = navigation.location.pathname !== location.pathname;

      if (isRouteDifferent) {
        // Small delay to prevent flash on fast navigation
        timeoutId = setTimeout(() => {
          setShowOverlay(true);
        }, 150);
      }
    } else {
      setShowOverlay(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigation.state, navigation.location, location.pathname]);

  if (!showOverlay || !navigation.location) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <RouteAwareSkeleton
        destinationPath={navigation.location.pathname}
        currentPath={location.pathname}
      />
    </div>
  );
}

export function NavigationLoadingIndicator() {
  const navigation = useNavigation();
  const location = useLocation();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (navigation.state === 'loading' && navigation.location) {
      const isRouteDifferent = navigation.location.pathname !== location.pathname;

      if (isRouteDifferent) {
        timeoutId = setTimeout(() => {
          setShowIndicator(true);
        }, 100);
      }
    } else {
      setShowIndicator(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigation.state, navigation.location, location.pathname]);

  if (!showIndicator) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
      <div className="h-full bg-blue-600 animate-pulse" style={{ width: '30%' }} />
    </div>
  );
}
