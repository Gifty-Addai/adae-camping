import log from 'loglevel';

// Set the default log level based on environment
// You can customize this logic as needed
const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  log.setLevel('debug');
} else {
  log.setLevel('info');
}

// Optional: Add a timestamp to each log message
// by overriding the default methodFactory
const originalFactory = log.methodFactory;

// Override the methodFactory to prepend timestamps
log.methodFactory = (methodName, logLevel, loggerName) => {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);
  return (...args: any[]) => {
    const timestamp = new Date().toISOString();
    rawMethod(`[${timestamp}]`, ...args);
  };
};

// Apply the new methodFactory
log.setLevel(log.getLevel());

// Export the configured logger
export default log;
