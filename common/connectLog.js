/**
 * Module dependencies.
 */
var Counter = require('passthrough-counter');
var bytes = require('bytes');
var log = require('./logger').conectLog()

/**
 * TTY check for dev format.
 */

var isatty = process.stdout.isTTY;

/**
 * Expose logger.
 */

module.exports = dev;

/**
 * Color map.
 */

var colorCodes = {
  5: 'red',
  4: 'yellow',
  3: 'cyan',
  2: 'green',
  1: 'green',
  0: 'yellow'
};

/**
 * Development logger.
 */

function dev(opts) {
  return function *logger(next) {
    // request
    var start = new Date;
    log.info('  <-- %s %s', this.method, this.originalUrl);

    try {
      yield next;
    } catch (err) {
      // log uncaught downstream errors
      logFn(this, start, null, err);
      throw err;
    }

    // calculate the length of a streaming response
    // by intercepting the stream with a counter.
    // only necessary if a content-length header is currently not set.
    var length = this.response.length;
    var body = this.body;
    var counter;
    if (null == length && body && body.readable) {
      this.body = body
        .pipe(counter = Counter())
        .on('error', this.onerror);
    }

    // log when the response is finished or closed,
    // whichever happens first.
    var ctx = this;
    var res = this.res;

    var onfinish = done.bind(null, 'finish');
    var onclose = done.bind(null, 'close');

    res.once('finish', onfinish);
    res.once('close', onclose);

    function done(event){
      res.removeListener('finish', onfinish);
      res.removeListener('close', onclose);
      logFn(ctx, start, counter ? counter.length : length, null, event);
    }
  }
}

/**
 * Log helper.
 */

function logFn(ctx, start, len, err, event) {
  // get the status code of the response
  var status = err
    ? (err.status || 500)
    : (ctx.status || 404);

  // set the color of the status code;
  var s = status / 100 | 0;
  var color = colorCodes[s];

  // get the human readable response length
  var length;
  if (~[204, 205, 304].indexOf(status)) {
    length = '';
  } else if (null == len) {
    length = '-';
  } else {
    length = bytes(len);
  }

  var upstream = err ? 'xxx': event === 'close' ? '-x-': '-->';

  log.info('  %s %s %s %s %s %s',
      upstream,
      ctx.method,
      ctx.originalUrl,
      status,
      time(start),
      length);
}

/**
 * Show the response time in a human readable format.
 * In milliseconds if less than 10 seconds,
 * in seconds otherwise.
 */

function time(start) {
  var delta = new Date - start;
  delta = delta < 10000
    ? delta + 'ms'
    : Math.round(delta / 1000) + 's';
  return humanize(delta);
}

function humanize(n, options){
  options = options || {};
  var d = options.delimiter || ',';
  var s = options.separator || '.';
  n = n.toString().split('.');
  n[0] = n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + d);
  return n.join(s);
};