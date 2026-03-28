import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    
    // Fallback for document elements
    if (document.documentElement) {
        document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
    }
    if (document.body) {
        document.body.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
