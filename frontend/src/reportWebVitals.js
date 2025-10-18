const reportWebVitals = (onPerfEntry) => {
  // Simplified version without web-vitals dependency
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // You can add custom performance tracking here if needed
  if (process.env.NODE_ENV === 'development') console.log('Performance monitoring is available');
  }
};

export default reportWebVitals;