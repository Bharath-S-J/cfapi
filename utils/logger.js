import path from 'node:path';
import chalk from 'chalk';

const LOG_PREFIX = '[cfapi]'; 

// Extracts the calling file and line number
const getCallerLocation = () => {
  const stack = new Error().stack?.split('\n') || [];

  const callerLine = stack.find(line =>
    line.includes('at ') && !line.includes('logger.js')
  );

  if (!callerLine) return '';

  const match = callerLine.match(/\(?(.+):(\d+):(\d+)\)?/);
  if (!match) return '';

  const [, file, line] = match;
  return `${path.basename(file)}:${line}`;
};

// Formats the log line with prefix, level, timestamp, and caller info
const format = (level, msg) => {
  const ts = new Date().toISOString();
  const location = getCallerLocation();
  return `${LOG_PREFIX} [${level.toUpperCase()}] [${ts}] (${location}) → ${msg}`;
};

// General print handler for any level
const print = (level, colorFn = null) => (msg) => {
  const output = msg instanceof Error
    ? `${msg.message}\n${msg.stack}`
    : String(msg);

  const text = format(level, output);
  const final = colorFn ? colorFn(text) : text;

  const method = {
    error: console.error,
    warn: console.warn,
    debug: console.debug
  }[level] || console.log;

  method(final);
};

// Unified logger interface
const logger = {
  info:    print('info', chalk.cyan),
  warn:    print('warn', chalk.yellow),
  error:   print('error', chalk.red),
  debug:   print('debug', chalk.gray),
  success: print('success', chalk.green)
};

export default logger;
