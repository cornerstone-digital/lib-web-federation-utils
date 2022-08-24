import require$$0 from "react";
import ReactDOM from "react-dom";
var ConsoleApiName$1 = {
  log: "log",
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error"
};
var display$1 = function(api) {
  var args = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  }
  if (!Object.prototype.hasOwnProperty.call(ConsoleApiName$1, api)) {
    api = ConsoleApiName$1.log;
  }
  display$1[api].apply(display$1, args);
};
display$1.debug = console.debug.bind(console);
display$1.log = console.log.bind(console);
display$1.info = console.info.bind(console);
display$1.warn = console.warn.bind(console);
display$1.error = console.error.bind(console);
var __spreadArray$1 = globalThis && globalThis.__spreadArray || function(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l2 = from.length, ar; i < l2; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var onMonitorErrorCollected$1;
var debugMode$1 = false;
function startMonitorErrorCollection$1(newOnMonitorErrorCollected) {
  onMonitorErrorCollected$1 = newOnMonitorErrorCollected;
}
function setDebugMode$1(newDebugMode) {
  debugMode$1 = newDebugMode;
}
function monitored$1(_, __, descriptor) {
  var originalMethod = descriptor.value;
  descriptor.value = function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var decorated = onMonitorErrorCollected$1 ? monitor$1(originalMethod) : originalMethod;
    return decorated.apply(this, args);
  };
}
function monitor$1(fn) {
  return function() {
    return callMonitored$1(fn, this, arguments);
  };
}
function callMonitored$1(fn, context, args) {
  try {
    return fn.apply(context, args);
  } catch (e) {
    displayIfDebugEnabled$1(ConsoleApiName$1.error, e);
    if (onMonitorErrorCollected$1) {
      try {
        onMonitorErrorCollected$1(e);
      } catch (e2) {
        displayIfDebugEnabled$1(ConsoleApiName$1.error, e2);
      }
    }
  }
}
function displayIfDebugEnabled$1(api) {
  var args = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  }
  if (debugMode$1) {
    display$1.apply(void 0, __spreadArray$1([api, "[MONITOR]"], args, false));
  }
}
var ONE_SECOND$1 = 1e3;
var ONE_MINUTE$1 = 60 * ONE_SECOND$1;
var ONE_HOUR$1 = 60 * ONE_MINUTE$1;
var ONE_KILO_BYTE$1 = 1024;
function throttle$1(fn, wait, options) {
  var needLeadingExecution = options && options.leading !== void 0 ? options.leading : true;
  var needTrailingExecution = options && options.trailing !== void 0 ? options.trailing : true;
  var inWaitPeriod = false;
  var pendingExecutionWithParameters;
  var pendingTimeoutId;
  return {
    throttled: function() {
      var parameters = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        parameters[_i] = arguments[_i];
      }
      if (inWaitPeriod) {
        pendingExecutionWithParameters = parameters;
        return;
      }
      if (needLeadingExecution) {
        fn.apply(void 0, parameters);
      } else {
        pendingExecutionWithParameters = parameters;
      }
      inWaitPeriod = true;
      pendingTimeoutId = setTimeout(function() {
        if (needTrailingExecution && pendingExecutionWithParameters) {
          fn.apply(void 0, pendingExecutionWithParameters);
        }
        inWaitPeriod = false;
        pendingExecutionWithParameters = void 0;
      }, wait);
    },
    cancel: function() {
      clearTimeout(pendingTimeoutId);
      inWaitPeriod = false;
      pendingExecutionWithParameters = void 0;
    }
  };
}
function assign$1(target) {
  var toAssign = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    toAssign[_i - 1] = arguments[_i];
  }
  toAssign.forEach(function(source) {
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  });
  return target;
}
function shallowClone$1(object) {
  return assign$1({}, object);
}
function generateUUID$1(placeholder) {
  return placeholder ? (parseInt(placeholder, 10) ^ Math.random() * 16 >> parseInt(placeholder, 10) / 4).toString(16) : "".concat(1e7, "-").concat(1e3, "-").concat(4e3, "-").concat(8e3, "-").concat(1e11).replace(/[018]/g, generateUUID$1);
}
function performDraw$1(threshold) {
  return threshold !== 0 && Math.random() * 100 <= threshold;
}
function noop$1() {
}
function jsonStringify$1(value, replacer, space) {
  if (typeof value !== "object" || value === null) {
    return JSON.stringify(value);
  }
  var restoreObjectPrototypeToJson = detachToJsonMethod$1(Object.prototype);
  var restoreArrayPrototypeToJson = detachToJsonMethod$1(Array.prototype);
  var restoreValuePrototypeToJson = detachToJsonMethod$1(Object.getPrototypeOf(value));
  var restoreValueToJson = detachToJsonMethod$1(value);
  try {
    return JSON.stringify(value, replacer, space);
  } catch (_a2) {
    return "<error: unable to serialize object>";
  } finally {
    restoreObjectPrototypeToJson();
    restoreArrayPrototypeToJson();
    restoreValuePrototypeToJson();
    restoreValueToJson();
  }
}
function detachToJsonMethod$1(value) {
  var object = value;
  var objectToJson = object.toJSON;
  if (objectToJson) {
    delete object.toJSON;
    return function() {
      object.toJSON = objectToJson;
    };
  }
  return noop$1;
}
function includes$1(candidate, search) {
  return candidate.indexOf(search) !== -1;
}
function arrayFrom$1(arrayLike) {
  if (Array.from) {
    return Array.from(arrayLike);
  }
  var array = [];
  if (arrayLike instanceof Set) {
    arrayLike.forEach(function(item) {
      return array.push(item);
    });
  } else {
    for (var i = 0; i < arrayLike.length; i++) {
      array.push(arrayLike[i]);
    }
  }
  return array;
}
function find$1(array, predicate) {
  for (var i = 0; i < array.length; i += 1) {
    var item = array[i];
    if (predicate(item, i)) {
      return item;
    }
  }
  return void 0;
}
function isPercentage$1(value) {
  return isNumber$1(value) && value >= 0 && value <= 100;
}
function isNumber$1(value) {
  return typeof value === "number";
}
function objectValues$1(object) {
  return Object.keys(object).map(function(key) {
    return object[key];
  });
}
function objectEntries$1(object) {
  return Object.keys(object).map(function(key) {
    return [key, object[key]];
  });
}
function isEmptyObject$1(object) {
  return Object.keys(object).length === 0;
}
function startsWith$1(candidate, search) {
  return candidate.slice(0, search.length) === search;
}
function endsWith$1(candidate, search) {
  return candidate.slice(-search.length) === search;
}
function getGlobalObject$1() {
  if (typeof globalThis === "object") {
    return globalThis;
  }
  Object.defineProperty(Object.prototype, "_dd_temp_", {
    get: function() {
      return this;
    },
    configurable: true
  });
  var globalObject = _dd_temp_;
  delete Object.prototype._dd_temp_;
  if (typeof globalObject !== "object") {
    if (typeof self === "object") {
      globalObject = self;
    } else if (typeof window === "object") {
      globalObject = window;
    } else {
      globalObject = {};
    }
  }
  return globalObject;
}
function getLocationOrigin$1() {
  return getLinkElementOrigin$1(window.location);
}
function getLinkElementOrigin$1(element) {
  if (element.origin) {
    return element.origin;
  }
  var sanitizedHost = element.host.replace(/(:80|:443)$/, "");
  return "".concat(element.protocol, "//").concat(sanitizedHost);
}
function findCommaSeparatedValue$1(rawString, name2) {
  var regex = new RegExp("(?:^|;)\\s*".concat(name2, "\\s*=\\s*([^;]+)"));
  var matches = regex.exec(rawString);
  return matches ? matches[1] : void 0;
}
function safeTruncate$1(candidate, length, suffix) {
  if (suffix === void 0) {
    suffix = "";
  }
  var lastChar = candidate.charCodeAt(length - 1);
  var isLastCharSurrogatePair = lastChar >= 55296 && lastChar <= 56319;
  var correctedLength = isLastCharSurrogatePair ? length + 1 : length;
  if (candidate.length <= correctedLength)
    return candidate;
  return "".concat(candidate.slice(0, correctedLength)).concat(suffix);
}
function addEventListener$1(emitter, event, listener, options) {
  return addEventListeners$1(emitter, [event], listener, options);
}
function addEventListeners$1(emitter, events, listener, _a2) {
  var _b = _a2 === void 0 ? {} : _a2, once = _b.once, capture = _b.capture, passive = _b.passive;
  var wrappedListener = monitor$1(once ? function(event) {
    stop();
    listener(event);
  } : listener);
  var options = passive ? { capture, passive } : capture;
  events.forEach(function(event) {
    return emitter.addEventListener(event, wrappedListener, options);
  });
  var stop = function() {
    return events.forEach(function(event) {
      return emitter.removeEventListener(event, wrappedListener, options);
    });
  };
  return {
    stop
  };
}
function getType$1(value) {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  return typeof value;
}
function createCircularReferenceChecker$1() {
  if (typeof WeakSet !== "undefined") {
    var set_1 = /* @__PURE__ */ new WeakSet();
    return {
      hasAlreadyBeenSeen: function(value) {
        var has = set_1.has(value);
        if (!has) {
          set_1.add(value);
        }
        return has;
      }
    };
  }
  var array = [];
  return {
    hasAlreadyBeenSeen: function(value) {
      var has = array.indexOf(value) >= 0;
      if (!has) {
        array.push(value);
      }
      return has;
    }
  };
}
function mergeInto$1(destination, source, circularReferenceChecker) {
  if (circularReferenceChecker === void 0) {
    circularReferenceChecker = createCircularReferenceChecker$1();
  }
  if (source === void 0) {
    return destination;
  }
  if (typeof source !== "object" || source === null) {
    return source;
  } else if (source instanceof Date) {
    return new Date(source.getTime());
  } else if (source instanceof RegExp) {
    var flags = source.flags || [
      source.global ? "g" : "",
      source.ignoreCase ? "i" : "",
      source.multiline ? "m" : "",
      source.sticky ? "y" : "",
      source.unicode ? "u" : ""
    ].join("");
    return new RegExp(source.source, flags);
  }
  if (circularReferenceChecker.hasAlreadyBeenSeen(source)) {
    return void 0;
  } else if (Array.isArray(source)) {
    var merged_1 = Array.isArray(destination) ? destination : [];
    for (var i = 0; i < source.length; ++i) {
      merged_1[i] = mergeInto$1(merged_1[i], source[i], circularReferenceChecker);
    }
    return merged_1;
  }
  var merged = getType$1(destination) === "object" ? destination : {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      merged[key] = mergeInto$1(merged[key], source[key], circularReferenceChecker);
    }
  }
  return merged;
}
function deepClone$1(value) {
  return mergeInto$1(void 0, value);
}
function combine$1() {
  var sources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }
  var destination;
  for (var _a2 = 0, sources_1 = sources; _a2 < sources_1.length; _a2++) {
    var source = sources_1[_a2];
    if (source === void 0 || source === null) {
      continue;
    }
    destination = mergeInto$1(destination, source);
  }
  return destination;
}
function removeDuplicates$1(array) {
  var set = /* @__PURE__ */ new Set();
  array.forEach(function(item) {
    return set.add(item);
  });
  return arrayFrom$1(set);
}
var COOKIE_ACCESS_DELAY$1 = ONE_SECOND$1;
function setCookie$1(name2, value, expireDelay, options) {
  var date = new Date();
  date.setTime(date.getTime() + expireDelay);
  var expires = "expires=".concat(date.toUTCString());
  var sameSite = options && options.crossSite ? "none" : "strict";
  var domain = options && options.domain ? ";domain=".concat(options.domain) : "";
  var secure = options && options.secure ? ";secure" : "";
  document.cookie = "".concat(name2, "=").concat(value, ";").concat(expires, ";path=/;samesite=").concat(sameSite).concat(domain).concat(secure);
}
function getCookie$1(name2) {
  return findCommaSeparatedValue$1(document.cookie, name2);
}
function deleteCookie$1(name2, options) {
  setCookie$1(name2, "", 0, options);
}
function areCookiesAuthorized$1(options) {
  if (document.cookie === void 0 || document.cookie === null) {
    return false;
  }
  try {
    var testCookieName = "dd_cookie_test_".concat(generateUUID$1());
    var testCookieValue = "test";
    setCookie$1(testCookieName, testCookieValue, ONE_SECOND$1, options);
    var isCookieCorrectlySet = getCookie$1(testCookieName) === testCookieValue;
    deleteCookie$1(testCookieName, options);
    return isCookieCorrectlySet;
  } catch (error) {
    display$1.error(error);
    return false;
  }
}
var getCurrentSiteCache$1;
function getCurrentSite$1() {
  if (getCurrentSiteCache$1 === void 0) {
    var testCookieName = "dd_site_test_".concat(generateUUID$1());
    var testCookieValue = "test";
    var domainLevels = window.location.hostname.split(".");
    var candidateDomain = domainLevels.pop();
    while (domainLevels.length && !getCookie$1(testCookieName)) {
      candidateDomain = "".concat(domainLevels.pop(), ".").concat(candidateDomain);
      setCookie$1(testCookieName, testCookieValue, ONE_SECOND$1, { domain: candidateDomain });
    }
    deleteCookie$1(testCookieName, { domain: candidateDomain });
    getCurrentSiteCache$1 = candidateDomain;
  }
  return getCurrentSiteCache$1;
}
function catchUserErrors$1(fn, errorMsg) {
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    try {
      return fn.apply(void 0, args);
    } catch (err) {
      display$1.error(errorMsg, err);
    }
  };
}
var enabledExperimentalFeatures$1;
function updateExperimentalFeatures$1(enabledFeatures) {
  if (!Array.isArray(enabledFeatures)) {
    return;
  }
  if (!enabledExperimentalFeatures$1) {
    enabledExperimentalFeatures$1 = new Set(enabledFeatures);
  }
  enabledFeatures.filter(function(flag) {
    return typeof flag === "string";
  }).forEach(function(flag) {
    enabledExperimentalFeatures$1.add(flag);
  });
}
function getExperimentalFeatures$1() {
  return enabledExperimentalFeatures$1 || /* @__PURE__ */ new Set();
}
function dateNow$1() {
  return new Date().getTime();
}
function timeStampNow$1() {
  return dateNow$1();
}
function relativeNow$1() {
  return performance.now();
}
function clocksNow$1() {
  return { relative: relativeNow$1(), timeStamp: timeStampNow$1() };
}
function clocksOrigin$1() {
  return { relative: 0, timeStamp: getNavigationStart$1() };
}
function elapsed$1(start, end) {
  return end - start;
}
function getRelativeTime$1(timestamp) {
  return timestamp - getNavigationStart$1();
}
var navigationStart$1;
function getNavigationStart$1() {
  if (navigationStart$1 === void 0) {
    navigationStart$1 = performance.timing.navigationStart;
  }
  return navigationStart$1;
}
function normalizeUrl$1(url) {
  return buildUrl$1(url, getLocationOrigin$1()).href;
}
function buildUrl$1(url, base) {
  if (checkURLSupported$1()) {
    return base !== void 0 ? new URL(url, base) : new URL(url);
  }
  if (base === void 0 && !/:/.test(url)) {
    throw new Error("Invalid URL: '".concat(url, "'"));
  }
  var doc = document;
  var anchorElement = doc.createElement("a");
  if (base !== void 0) {
    doc = document.implementation.createHTMLDocument("");
    var baseElement = doc.createElement("base");
    baseElement.href = base;
    doc.head.appendChild(baseElement);
    doc.body.appendChild(anchorElement);
  }
  anchorElement.href = url;
  return anchorElement;
}
var isURLSupported$1;
function checkURLSupported$1() {
  if (isURLSupported$1 !== void 0) {
    return isURLSupported$1;
  }
  try {
    var url = new URL("http://test/path");
    isURLSupported$1 = url.href === "http://test/path";
    return isURLSupported$1;
  } catch (_a2) {
    isURLSupported$1 = false;
  }
  return isURLSupported$1;
}
var INTAKE_SITE_STAGING$1 = "datad0g.com";
var INTAKE_SITE_US1$1 = "datadoghq.com";
var INTAKE_SITE_US1_FED$1 = "ddog-gov.com";
var ENDPOINTS$1 = {
  logs: "logs",
  rum: "rum",
  sessionReplay: "session-replay"
};
var INTAKE_TRACKS$1 = {
  logs: "logs",
  rum: "rum",
  sessionReplay: "replay"
};
function createEndpointBuilder$1(initConfiguration, endpointType, tags) {
  var _a2 = initConfiguration.site, site = _a2 === void 0 ? INTAKE_SITE_US1$1 : _a2, clientToken = initConfiguration.clientToken;
  var domainParts = site.split(".");
  var extension = domainParts.pop();
  var host = "".concat(ENDPOINTS$1[endpointType], ".browser-intake-").concat(domainParts.join("-"), ".").concat(extension);
  var baseUrl = "https://".concat(host, "/api/v2/").concat(INTAKE_TRACKS$1[endpointType]);
  var proxyUrl = initConfiguration.proxyUrl && normalizeUrl$1(initConfiguration.proxyUrl);
  return {
    build: function() {
      var parameters = "ddsource=browser" + "&ddtags=".concat(encodeURIComponent(["sdk_version:".concat("4.17.2")].concat(tags).join(","))) + "&dd-api-key=".concat(clientToken) + "&dd-evp-origin-version=".concat(encodeURIComponent("4.17.2")) + "&dd-evp-origin=browser" + "&dd-request-id=".concat(generateUUID$1());
      if (endpointType === "rum") {
        parameters += "&batch_time=".concat(timeStampNow$1());
      }
      var endpointUrl = "".concat(baseUrl, "?").concat(parameters);
      return proxyUrl ? "".concat(proxyUrl, "?ddforward=").concat(encodeURIComponent(endpointUrl)) : endpointUrl;
    },
    buildIntakeUrl: function() {
      return proxyUrl ? "".concat(proxyUrl, "?ddforward") : baseUrl;
    },
    endpointType
  };
}
var TAG_SIZE_LIMIT$1 = 200;
function buildTags$1(configuration) {
  var env = configuration.env, service = configuration.service, version = configuration.version, datacenter = configuration.datacenter;
  var tags = [];
  if (env) {
    tags.push(buildTag$1("env", env));
  }
  if (service) {
    tags.push(buildTag$1("service", service));
  }
  if (version) {
    tags.push(buildTag$1("version", version));
  }
  if (datacenter) {
    tags.push(buildTag$1("datacenter", datacenter));
  }
  return tags;
}
var FORBIDDEN_CHARACTERS$1 = /[^a-z0-9_:./-]/;
function buildTag$1(key, rawValue) {
  var valueSizeLimit = TAG_SIZE_LIMIT$1 - key.length - 1;
  if (rawValue.length > valueSizeLimit || FORBIDDEN_CHARACTERS$1.test(rawValue)) {
    display$1.warn("".concat(key, " value doesn't meet tag requirements and will be sanitized"));
  }
  var sanitizedValue = rawValue.replace(/,/g, "_");
  return "".concat(key, ":").concat(sanitizedValue);
}
function computeTransportConfiguration$1(initConfiguration) {
  var tags = buildTags$1(initConfiguration);
  var endpointBuilders = computeEndpointBuilders$1(initConfiguration, tags);
  var intakeEndpoints = objectValues$1(endpointBuilders).map(function(builder) {
    return builder.buildIntakeUrl();
  });
  var replicaConfiguration = computeReplicaConfiguration$1(initConfiguration, intakeEndpoints, tags);
  return assign$1({
    isIntakeUrl: function(url) {
      return intakeEndpoints.some(function(intakeEndpoint) {
        return url.indexOf(intakeEndpoint) === 0;
      });
    },
    replica: replicaConfiguration,
    site: initConfiguration.site || INTAKE_SITE_US1$1
  }, endpointBuilders);
}
function computeEndpointBuilders$1(initConfiguration, tags) {
  return {
    logsEndpointBuilder: createEndpointBuilder$1(initConfiguration, "logs", tags),
    rumEndpointBuilder: createEndpointBuilder$1(initConfiguration, "rum", tags),
    sessionReplayEndpointBuilder: createEndpointBuilder$1(initConfiguration, "sessionReplay", tags)
  };
}
function computeReplicaConfiguration$1(initConfiguration, intakeEndpoints, tags) {
  if (!initConfiguration.replica) {
    return;
  }
  var replicaConfiguration = assign$1({}, initConfiguration, {
    site: INTAKE_SITE_US1$1,
    clientToken: initConfiguration.replica.clientToken
  });
  var replicaEndpointBuilders = {
    logsEndpointBuilder: createEndpointBuilder$1(replicaConfiguration, "logs", tags),
    rumEndpointBuilder: createEndpointBuilder$1(replicaConfiguration, "rum", tags)
  };
  intakeEndpoints.push.apply(intakeEndpoints, objectValues$1(replicaEndpointBuilders).map(function(builder) {
    return builder.buildIntakeUrl();
  }));
  return assign$1({ applicationId: initConfiguration.replica.applicationId }, replicaEndpointBuilders);
}
function validateAndBuildConfiguration$1(initConfiguration) {
  var _a2, _b;
  if (!initConfiguration || !initConfiguration.clientToken) {
    display$1.error("Client Token is not configured, we will not send any data.");
    return;
  }
  if (initConfiguration.sampleRate !== void 0 && !isPercentage$1(initConfiguration.sampleRate)) {
    display$1.error("Sample Rate should be a number between 0 and 100");
    return;
  }
  if (initConfiguration.telemetrySampleRate !== void 0 && !isPercentage$1(initConfiguration.telemetrySampleRate)) {
    display$1.error("Telemetry Sample Rate should be a number between 0 and 100");
    return;
  }
  updateExperimentalFeatures$1(initConfiguration.enableExperimentalFeatures);
  return assign$1({
    beforeSend: initConfiguration.beforeSend && catchUserErrors$1(initConfiguration.beforeSend, "beforeSend threw an error:"),
    cookieOptions: buildCookieOptions$1(initConfiguration),
    sampleRate: (_a2 = initConfiguration.sampleRate) !== null && _a2 !== void 0 ? _a2 : 100,
    telemetrySampleRate: (_b = initConfiguration.telemetrySampleRate) !== null && _b !== void 0 ? _b : 20,
    service: initConfiguration.service,
    silentMultipleInit: !!initConfiguration.silentMultipleInit,
    batchBytesLimit: 16 * ONE_KILO_BYTE$1,
    eventRateLimiterThreshold: 3e3,
    maxTelemetryEventsPerPage: 15,
    flushTimeout: 30 * ONE_SECOND$1,
    batchMessagesLimit: 50,
    messageBytesLimit: 256 * ONE_KILO_BYTE$1
  }, computeTransportConfiguration$1(initConfiguration));
}
function buildCookieOptions$1(initConfiguration) {
  var cookieOptions = {};
  cookieOptions.secure = mustUseSecureCookie$1(initConfiguration);
  cookieOptions.crossSite = !!initConfiguration.useCrossSiteSessionCookie;
  if (initConfiguration.trackSessionAcrossSubdomains) {
    cookieOptions.domain = getCurrentSite$1();
  }
  return cookieOptions;
}
function mustUseSecureCookie$1(initConfiguration) {
  return !!initConfiguration.useSecureSessionCookie || !!initConfiguration.useCrossSiteSessionCookie;
}
var UNKNOWN_FUNCTION$1 = "?";
function computeStackTrace$1(ex) {
  var stack = [];
  var stackProperty = tryToGetString$1(ex, "stack");
  if (stackProperty) {
    stackProperty.split("\n").forEach(function(line) {
      var stackFrame = parseChromeLine$1(line) || parseChromeAnonymousLine$1(line) || parseWinLine$1(line) || parseGeckoLine$1(line);
      if (stackFrame) {
        if (!stackFrame.func && stackFrame.line) {
          stackFrame.func = UNKNOWN_FUNCTION$1;
        }
        stack.push(stackFrame);
      }
    });
  }
  return {
    message: tryToGetString$1(ex, "message"),
    name: tryToGetString$1(ex, "name"),
    stack
  };
}
var fileUrl$1 = "((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\\w+\\.|\\/).*?)";
var filePosition$1 = "(?::(\\d+))";
var CHROME_LINE_RE$1 = new RegExp("^\\s*at (.*?) ?\\(".concat(fileUrl$1).concat(filePosition$1, "?").concat(filePosition$1, "?\\)?\\s*$"), "i");
var CHROME_EVAL_RE$1 = new RegExp("\\((\\S*)".concat(filePosition$1).concat(filePosition$1, "\\)"));
function parseChromeLine$1(line) {
  var parts = CHROME_LINE_RE$1.exec(line);
  if (!parts) {
    return;
  }
  var isNative = parts[2] && parts[2].indexOf("native") === 0;
  var isEval = parts[2] && parts[2].indexOf("eval") === 0;
  var submatch = CHROME_EVAL_RE$1.exec(parts[2]);
  if (isEval && submatch) {
    parts[2] = submatch[1];
    parts[3] = submatch[2];
    parts[4] = submatch[3];
  }
  return {
    args: isNative ? [parts[2]] : [],
    column: parts[4] ? +parts[4] : void 0,
    func: parts[1] || UNKNOWN_FUNCTION$1,
    line: parts[3] ? +parts[3] : void 0,
    url: !isNative ? parts[2] : void 0
  };
}
var CHROME_ANONYMOUS_FUNCTION_RE$1 = new RegExp("^\\s*at ?".concat(fileUrl$1).concat(filePosition$1, "?").concat(filePosition$1, "??\\s*$"), "i");
function parseChromeAnonymousLine$1(line) {
  var parts = CHROME_ANONYMOUS_FUNCTION_RE$1.exec(line);
  if (!parts) {
    return;
  }
  return {
    args: [],
    column: parts[3] ? +parts[3] : void 0,
    func: UNKNOWN_FUNCTION$1,
    line: parts[2] ? +parts[2] : void 0,
    url: parts[1]
  };
}
var WINJS_LINE_RE$1 = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
function parseWinLine$1(line) {
  var parts = WINJS_LINE_RE$1.exec(line);
  if (!parts) {
    return;
  }
  return {
    args: [],
    column: parts[4] ? +parts[4] : void 0,
    func: parts[1] || UNKNOWN_FUNCTION$1,
    line: +parts[3],
    url: parts[2]
  };
}
var GECKO_LINE_RE$1 = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|capacitor|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
var GECKO_EVAL_RE$1 = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
function parseGeckoLine$1(line) {
  var parts = GECKO_LINE_RE$1.exec(line);
  if (!parts) {
    return;
  }
  var isEval = parts[3] && parts[3].indexOf(" > eval") > -1;
  var submatch = GECKO_EVAL_RE$1.exec(parts[3]);
  if (isEval && submatch) {
    parts[3] = submatch[1];
    parts[4] = submatch[2];
    parts[5] = void 0;
  }
  return {
    args: parts[2] ? parts[2].split(",") : [],
    column: parts[5] ? +parts[5] : void 0,
    func: parts[1] || UNKNOWN_FUNCTION$1,
    line: parts[4] ? +parts[4] : void 0,
    url: parts[3]
  };
}
function tryToGetString$1(candidate, property) {
  if (typeof candidate !== "object" || !candidate || !(property in candidate)) {
    return void 0;
  }
  var value = candidate[property];
  return typeof value === "string" ? value : void 0;
}
function instrumentMethod$1(object, method, instrumentationFactory) {
  var original = object[method];
  var instrumentation = instrumentationFactory(original);
  var instrumentationWrapper = function() {
    return instrumentation.apply(this, arguments);
  };
  object[method] = instrumentationWrapper;
  return {
    stop: function() {
      if (object[method] === instrumentationWrapper) {
        object[method] = original;
      } else {
        instrumentation = original;
      }
    }
  };
}
function instrumentMethodAndCallOriginal$1(object, method, _a2) {
  var before = _a2.before, after = _a2.after;
  return instrumentMethod$1(object, method, function(original) {
    return function() {
      var args = arguments;
      var result;
      if (before) {
        callMonitored$1(before, this, args);
      }
      if (typeof original === "function") {
        result = original.apply(this, args);
      }
      if (after) {
        callMonitored$1(after, this, args);
      }
      return result;
    };
  });
}
var ERROR_TYPES_RE$1 = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
function startUnhandledErrorCollection$1(callback) {
  var stopInstrumentingOnError = instrumentOnError$1(callback).stop;
  var stopInstrumentingOnUnhandledRejection = instrumentUnhandledRejection$1(callback).stop;
  return {
    stop: function() {
      stopInstrumentingOnError();
      stopInstrumentingOnUnhandledRejection();
    }
  };
}
function instrumentOnError$1(callback) {
  return instrumentMethodAndCallOriginal$1(window, "onerror", {
    before: function(message, url, lineNo, columnNo, errorObj) {
      var stack;
      if (errorObj) {
        stack = computeStackTrace$1(errorObj);
        callback(stack, errorObj);
      } else {
        var location_1 = {
          url,
          column: columnNo,
          line: lineNo
        };
        var name_1;
        var msg = message;
        if ({}.toString.call(message) === "[object String]") {
          var groups = ERROR_TYPES_RE$1.exec(msg);
          if (groups) {
            name_1 = groups[1];
            msg = groups[2];
          }
        }
        stack = {
          name: name_1,
          message: typeof msg === "string" ? msg : void 0,
          stack: [location_1]
        };
        callback(stack, message);
      }
    }
  });
}
function instrumentUnhandledRejection$1(callback) {
  return instrumentMethodAndCallOriginal$1(window, "onunhandledrejection", {
    before: function(e) {
      var reason = e.reason || "Empty reason";
      var stack = computeStackTrace$1(reason);
      callback(stack, reason);
    }
  });
}
var ErrorSource$1 = {
  AGENT: "agent",
  CONSOLE: "console",
  CUSTOM: "custom",
  LOGGER: "logger",
  NETWORK: "network",
  SOURCE: "source",
  REPORT: "report"
};
function formatUnknownError$1(stackTrace, errorObject, nonErrorPrefix, handlingStack) {
  if (!stackTrace || stackTrace.message === void 0 && !(errorObject instanceof Error)) {
    return {
      message: "".concat(nonErrorPrefix, " ").concat(jsonStringify$1(errorObject)),
      stack: "No stack, consider using an instance of Error",
      handlingStack,
      type: stackTrace && stackTrace.name
    };
  }
  return {
    message: stackTrace.message || "Empty message",
    stack: toStackTraceString$1(stackTrace),
    handlingStack,
    type: stackTrace.name
  };
}
function toStackTraceString$1(stack) {
  var result = formatErrorMessage$1(stack);
  stack.stack.forEach(function(frame) {
    var func = frame.func === "?" ? "<anonymous>" : frame.func;
    var args = frame.args && frame.args.length > 0 ? "(".concat(frame.args.join(", "), ")") : "";
    var line = frame.line ? ":".concat(frame.line) : "";
    var column = frame.line && frame.column ? ":".concat(frame.column) : "";
    result += "\n  at ".concat(func).concat(args, " @ ").concat(frame.url).concat(line).concat(column);
  });
  return result;
}
function getFileFromStackTraceString$1(stack) {
  var _a2;
  return (_a2 = /@ (.+)/.exec(stack)) === null || _a2 === void 0 ? void 0 : _a2[1];
}
function formatErrorMessage$1(stack) {
  return "".concat(stack.name || "Error", ": ").concat(stack.message);
}
function createHandlingStack$1() {
  var internalFramesToSkip = 2;
  var error = new Error();
  var formattedStack;
  if (!error.stack) {
    try {
      throw error;
    } catch (e) {
    }
  }
  callMonitored$1(function() {
    var stackTrace = computeStackTrace$1(error);
    stackTrace.stack = stackTrace.stack.slice(internalFramesToSkip);
    formattedStack = toStackTraceString$1(stackTrace);
  });
  return formattedStack;
}
function trackRuntimeError$1(errorObservable) {
  return startUnhandledErrorCollection$1(function(stackTrace, errorObject) {
    var _a2 = formatUnknownError$1(stackTrace, errorObject, "Uncaught"), stack = _a2.stack, message = _a2.message, type2 = _a2.type;
    errorObservable.notify({
      message,
      stack,
      type: type2,
      source: ErrorSource$1.SOURCE,
      startClocks: clocksNow$1(),
      originalError: errorObject,
      handling: "unhandled"
    });
  });
}
function makePublicApi$1(stub) {
  var publicApi = assign$1({
    version: "4.17.2",
    onReady: function(callback) {
      callback();
    }
  }, stub);
  Object.defineProperty(publicApi, "_setDebug", {
    get: function() {
      return setDebugMode$1;
    },
    enumerable: false
  });
  return publicApi;
}
function defineGlobal$1(global, name2, api) {
  var existingGlobalVariable = global[name2];
  global[name2] = api;
  if (existingGlobalVariable && existingGlobalVariable.q) {
    existingGlobalVariable.q.forEach(function(fn) {
      return catchUserErrors$1(fn, "onReady callback threw an error:")();
    });
  }
}
var Observable$1 = function() {
  function Observable2(onFirstSubscribe) {
    this.onFirstSubscribe = onFirstSubscribe;
    this.observers = [];
  }
  Observable2.prototype.subscribe = function(f2) {
    var _this = this;
    if (!this.observers.length && this.onFirstSubscribe) {
      this.onLastUnsubscribe = this.onFirstSubscribe() || void 0;
    }
    this.observers.push(f2);
    return {
      unsubscribe: function() {
        _this.observers = _this.observers.filter(function(other) {
          return f2 !== other;
        });
        if (!_this.observers.length && _this.onLastUnsubscribe) {
          _this.onLastUnsubscribe();
        }
      }
    };
  };
  Observable2.prototype.notify = function(data) {
    this.observers.forEach(function(observer) {
      return observer(data);
    });
  };
  return Observable2;
}();
function mergeObservables$1() {
  var observables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }
  var globalObservable = new Observable$1(function() {
    var subscriptions = observables.map(function(observable) {
      return observable.subscribe(function(data) {
        return globalObservable.notify(data);
      });
    });
    return function() {
      return subscriptions.forEach(function(subscription) {
        return subscription.unsubscribe();
      });
    };
  });
  return globalObservable;
}
var RawReportType$1 = {
  intervention: "intervention",
  deprecation: "deprecation",
  cspViolation: "csp_violation"
};
function initReportObservable$1(apis) {
  var observables = [];
  if (includes$1(apis, RawReportType$1.cspViolation)) {
    observables.push(createCspViolationReportObservable$1());
  }
  var reportTypes = apis.filter(function(api) {
    return api !== RawReportType$1.cspViolation;
  });
  if (reportTypes.length) {
    observables.push(createReportObservable$1(reportTypes));
  }
  return mergeObservables$1.apply(void 0, observables);
}
function createReportObservable$1(reportTypes) {
  var observable = new Observable$1(function() {
    if (!window.ReportingObserver) {
      return;
    }
    var handleReports = monitor$1(function(reports) {
      return reports.forEach(function(report) {
        observable.notify(buildRawReportFromReport$1(report));
      });
    });
    var observer = new window.ReportingObserver(handleReports, {
      types: reportTypes,
      buffered: true
    });
    observer.observe();
    return function() {
      observer.disconnect();
    };
  });
  return observable;
}
function createCspViolationReportObservable$1() {
  var observable = new Observable$1(function() {
    var handleCspViolation = monitor$1(function(event) {
      observable.notify(buildRawReportFromCspViolation$1(event));
    });
    var stop = addEventListener$1(document, "securitypolicyviolation", handleCspViolation).stop;
    return stop;
  });
  return observable;
}
function buildRawReportFromReport$1(_a2) {
  var type2 = _a2.type, body = _a2.body;
  return {
    type: type2,
    subtype: body.id,
    message: "".concat(type2, ": ").concat(body.message),
    stack: buildStack$1(body.id, body.message, body.sourceFile, body.lineNumber, body.columnNumber)
  };
}
function buildRawReportFromCspViolation$1(event) {
  var type2 = RawReportType$1.cspViolation;
  var message = "'".concat(event.blockedURI, "' blocked by '").concat(event.effectiveDirective, "' directive");
  return {
    type: RawReportType$1.cspViolation,
    subtype: event.effectiveDirective,
    message: "".concat(type2, ": ").concat(message),
    stack: buildStack$1(event.effectiveDirective, "".concat(message, ' of the policy "').concat(safeTruncate$1(event.originalPolicy, 100, "..."), '"'), event.sourceFile, event.lineNumber, event.columnNumber)
  };
}
function buildStack$1(name2, message, sourceFile, lineNumber, columnNumber) {
  return sourceFile && toStackTraceString$1({
    name: name2,
    message,
    stack: [
      {
        func: "?",
        url: sourceFile,
        line: lineNumber,
        column: columnNumber
      }
    ]
  });
}
var ALLOWED_FRAME_URLS$1 = [
  "https://www.datadoghq-browser-agent.com",
  "https://www.datad0g-browser-agent.com",
  "http://localhost",
  "<anonymous>"
];
var TELEMETRY_EXCLUDED_SITES$1 = [INTAKE_SITE_US1_FED$1];
var telemetryConfiguration$1 = { maxEventsPerPage: 0, sentEventCount: 0, telemetryEnabled: false };
var onRawTelemetryEventCollected$1;
function startTelemetry$1(configuration) {
  var contextProvider;
  var observable = new Observable$1();
  telemetryConfiguration$1.telemetryEnabled = performDraw$1(configuration.telemetrySampleRate);
  onRawTelemetryEventCollected$1 = function(event) {
    if (!includes$1(TELEMETRY_EXCLUDED_SITES$1, configuration.site) && telemetryConfiguration$1.telemetryEnabled) {
      observable.notify(toTelemetryEvent(event));
    }
  };
  startMonitorErrorCollection$1(addTelemetryError$1);
  assign$1(telemetryConfiguration$1, {
    maxEventsPerPage: configuration.maxTelemetryEventsPerPage,
    sentEventCount: 0
  });
  function toTelemetryEvent(event) {
    return combine$1({
      type: "telemetry",
      date: timeStampNow$1(),
      service: "browser-sdk",
      version: "4.17.2",
      source: "browser",
      _dd: {
        format_version: 2
      },
      telemetry: event,
      experimental_features: arrayFrom$1(getExperimentalFeatures$1())
    }, contextProvider !== void 0 ? contextProvider() : {});
  }
  return {
    setContextProvider: function(provider) {
      contextProvider = provider;
    },
    observable
  };
}
function isTelemetryReplicationAllowed$1(configuration) {
  return configuration.site === INTAKE_SITE_STAGING$1;
}
function addTelemetryDebug$1(message, context) {
  displayIfDebugEnabled$1(ConsoleApiName$1.debug, message, context);
  addTelemetry$1(assign$1({
    message,
    status: "debug"
  }, context));
}
function addTelemetryError$1(e) {
  addTelemetry$1(assign$1({
    status: "error"
  }, formatError$1(e)));
}
function addTelemetry$1(event) {
  if (onRawTelemetryEventCollected$1 && telemetryConfiguration$1.sentEventCount < telemetryConfiguration$1.maxEventsPerPage) {
    telemetryConfiguration$1.sentEventCount += 1;
    onRawTelemetryEventCollected$1(event);
  }
}
function formatError$1(e) {
  if (e instanceof Error) {
    var stackTrace = computeStackTrace$1(e);
    return {
      error: {
        kind: stackTrace.name,
        stack: toStackTraceString$1(scrubCustomerFrames$1(stackTrace))
      },
      message: stackTrace.message
    };
  }
  return {
    error: {
      stack: "Not an instance of error"
    },
    message: "Uncaught ".concat(jsonStringify$1(e))
  };
}
function scrubCustomerFrames$1(stackTrace) {
  stackTrace.stack = stackTrace.stack.filter(function(frame) {
    return !frame.url || ALLOWED_FRAME_URLS$1.some(function(allowedFrameUrl) {
      return startsWith$1(frame.url, allowedFrameUrl);
    });
  });
  return stackTrace;
}
var END_OF_TIMES$1 = Infinity;
var CLEAR_OLD_CONTEXTS_INTERVAL$1 = ONE_MINUTE$1;
var ContextHistory$1 = function() {
  function ContextHistory2(expireDelay) {
    var _this = this;
    this.expireDelay = expireDelay;
    this.entries = [];
    this.clearOldContextsInterval = setInterval(function() {
      return _this.clearOldContexts();
    }, CLEAR_OLD_CONTEXTS_INTERVAL$1);
  }
  ContextHistory2.prototype.add = function(context, startTime) {
    var _this = this;
    var entry = {
      context,
      startTime,
      endTime: END_OF_TIMES$1,
      remove: function() {
        var index2 = _this.entries.indexOf(entry);
        if (index2 >= 0) {
          _this.entries.splice(index2, 1);
        }
      },
      close: function(endTime) {
        entry.endTime = endTime;
      }
    };
    this.entries.unshift(entry);
    return entry;
  };
  ContextHistory2.prototype.find = function(startTime) {
    if (startTime === void 0) {
      startTime = END_OF_TIMES$1;
    }
    for (var _i = 0, _a2 = this.entries; _i < _a2.length; _i++) {
      var entry = _a2[_i];
      if (entry.startTime <= startTime) {
        if (startTime <= entry.endTime) {
          return entry.context;
        }
        break;
      }
    }
  };
  ContextHistory2.prototype.closeActive = function(endTime) {
    var latestEntry = this.entries[0];
    if (latestEntry && latestEntry.endTime === END_OF_TIMES$1) {
      latestEntry.close(endTime);
    }
  };
  ContextHistory2.prototype.findAll = function(startTime) {
    if (startTime === void 0) {
      startTime = END_OF_TIMES$1;
    }
    return this.entries.filter(function(entry) {
      return entry.startTime <= startTime && startTime <= entry.endTime;
    }).map(function(entry) {
      return entry.context;
    });
  };
  ContextHistory2.prototype.reset = function() {
    this.entries = [];
  };
  ContextHistory2.prototype.stop = function() {
    clearInterval(this.clearOldContextsInterval);
  };
  ContextHistory2.prototype.clearOldContexts = function() {
    var oldTimeThreshold = relativeNow$1() - this.expireDelay;
    while (this.entries.length > 0 && this.entries[this.entries.length - 1].endTime < oldTimeThreshold) {
      this.entries.pop();
    }
  };
  return ContextHistory2;
}();
function isChromium$1() {
  return !!window.chrome || /HeadlessChrome/.test(window.navigator.userAgent);
}
var SESSION_TIME_OUT_DELAY$1 = 4 * ONE_HOUR$1;
var SESSION_EXPIRATION_DELAY$1 = 15 * ONE_MINUTE$1;
var SESSION_ENTRY_REGEXP$1 = /^([a-z]+)=([a-z0-9-]+)$/;
var SESSION_ENTRY_SEPARATOR$1 = "&";
var SESSION_COOKIE_NAME$1 = "_dd_s";
var LOCK_RETRY_DELAY$1 = 10;
var MAX_NUMBER_OF_LOCK_RETRIES$1 = 100;
var bufferedOperations$1 = [];
var ongoingOperations$1;
function withCookieLockAccess$1(operations, numberOfRetries) {
  var _a2;
  if (numberOfRetries === void 0) {
    numberOfRetries = 0;
  }
  if (!ongoingOperations$1) {
    ongoingOperations$1 = operations;
  }
  if (operations !== ongoingOperations$1) {
    bufferedOperations$1.push(operations);
    return;
  }
  if (numberOfRetries >= MAX_NUMBER_OF_LOCK_RETRIES$1) {
    next$1();
    return;
  }
  var currentLock;
  var currentSession = retrieveSession$1();
  if (isCookieLockEnabled$1()) {
    if (currentSession.lock) {
      retryLater$1(operations, numberOfRetries);
      return;
    }
    currentLock = generateUUID$1();
    currentSession.lock = currentLock;
    setSession$1(currentSession, operations.options);
    currentSession = retrieveSession$1();
    if (currentSession.lock !== currentLock) {
      retryLater$1(operations, numberOfRetries);
      return;
    }
  }
  var processedSession = operations.process(currentSession);
  if (isCookieLockEnabled$1()) {
    currentSession = retrieveSession$1();
    if (currentSession.lock !== currentLock) {
      retryLater$1(operations, numberOfRetries);
      return;
    }
  }
  if (processedSession) {
    persistSession$1(processedSession, operations.options);
  }
  if (isCookieLockEnabled$1()) {
    if (!(processedSession && isExpiredState$1(processedSession))) {
      currentSession = retrieveSession$1();
      if (currentSession.lock !== currentLock) {
        retryLater$1(operations, numberOfRetries);
        return;
      }
      delete currentSession.lock;
      setSession$1(currentSession, operations.options);
      processedSession = currentSession;
    }
  }
  (_a2 = operations.after) === null || _a2 === void 0 ? void 0 : _a2.call(operations, processedSession || currentSession);
  next$1();
}
function isCookieLockEnabled$1() {
  return isChromium$1();
}
function retryLater$1(operations, currentNumberOfRetries) {
  setTimeout(monitor$1(function() {
    withCookieLockAccess$1(operations, currentNumberOfRetries + 1);
  }), LOCK_RETRY_DELAY$1);
}
function next$1() {
  ongoingOperations$1 = void 0;
  var nextOperations = bufferedOperations$1.shift();
  if (nextOperations) {
    withCookieLockAccess$1(nextOperations);
  }
}
function persistSession$1(session, options) {
  if (isExpiredState$1(session)) {
    clearSession$1(options);
    return;
  }
  session.expire = String(dateNow$1() + SESSION_EXPIRATION_DELAY$1);
  setSession$1(session, options);
}
function setSession$1(session, options) {
  setCookie$1(SESSION_COOKIE_NAME$1, toSessionString$1(session), SESSION_EXPIRATION_DELAY$1, options);
}
function toSessionString$1(session) {
  return objectEntries$1(session).map(function(_a2) {
    var key = _a2[0], value = _a2[1];
    return "".concat(key, "=").concat(value);
  }).join(SESSION_ENTRY_SEPARATOR$1);
}
function retrieveSession$1() {
  var sessionString = getCookie$1(SESSION_COOKIE_NAME$1);
  var session = {};
  if (isValidSessionString$1(sessionString)) {
    sessionString.split(SESSION_ENTRY_SEPARATOR$1).forEach(function(entry) {
      var matches = SESSION_ENTRY_REGEXP$1.exec(entry);
      if (matches !== null) {
        var key = matches[1], value = matches[2];
        session[key] = value;
      }
    });
  }
  return session;
}
function isValidSessionString$1(sessionString) {
  return sessionString !== void 0 && (sessionString.indexOf(SESSION_ENTRY_SEPARATOR$1) !== -1 || SESSION_ENTRY_REGEXP$1.test(sessionString));
}
function isExpiredState$1(session) {
  return isEmptyObject$1(session);
}
function clearSession$1(options) {
  setCookie$1(SESSION_COOKIE_NAME$1, "", 0, options);
}
var OLD_SESSION_COOKIE_NAME$1 = "_dd";
var OLD_RUM_COOKIE_NAME$1 = "_dd_r";
var OLD_LOGS_COOKIE_NAME$1 = "_dd_l";
var RUM_SESSION_KEY$1 = "rum";
var LOGS_SESSION_KEY$1$1 = "logs";
function tryOldCookiesMigration$1(options) {
  var sessionString = getCookie$1(SESSION_COOKIE_NAME$1);
  var oldSessionId = getCookie$1(OLD_SESSION_COOKIE_NAME$1);
  var oldRumType = getCookie$1(OLD_RUM_COOKIE_NAME$1);
  var oldLogsType = getCookie$1(OLD_LOGS_COOKIE_NAME$1);
  if (!sessionString) {
    var session = {};
    if (oldSessionId) {
      session.id = oldSessionId;
    }
    if (oldLogsType && /^[01]$/.test(oldLogsType)) {
      session[LOGS_SESSION_KEY$1$1] = oldLogsType;
    }
    if (oldRumType && /^[012]$/.test(oldRumType)) {
      session[RUM_SESSION_KEY$1] = oldRumType;
    }
    persistSession$1(session, options);
  }
}
function startSessionStore$1(options, productKey, computeSessionState2) {
  var renewObservable = new Observable$1();
  var expireObservable = new Observable$1();
  var watchSessionTimeoutId = setInterval(monitor$1(watchSession), COOKIE_ACCESS_DELAY$1);
  var sessionCache = retrieveActiveSession();
  function expandOrRenewSession() {
    var isTracked;
    withCookieLockAccess$1({
      options,
      process: function(cookieSession) {
        var synchronizedSession = synchronizeSession(cookieSession);
        isTracked = expandOrRenewCookie(synchronizedSession);
        return synchronizedSession;
      },
      after: function(cookieSession) {
        if (isTracked && !hasSessionInCache()) {
          renewSession(cookieSession);
        }
        sessionCache = cookieSession;
      }
    });
  }
  function expandSession() {
    withCookieLockAccess$1({
      options,
      process: function(cookieSession) {
        return hasSessionInCache() ? synchronizeSession(cookieSession) : void 0;
      }
    });
  }
  function watchSession() {
    withCookieLockAccess$1({
      options,
      process: function(cookieSession) {
        return !isActiveSession(cookieSession) ? {} : void 0;
      },
      after: synchronizeSession
    });
  }
  function synchronizeSession(cookieSession) {
    if (!isActiveSession(cookieSession)) {
      cookieSession = {};
    }
    if (hasSessionInCache()) {
      if (isSessionInCacheOutdated(cookieSession)) {
        expireSession();
      } else {
        sessionCache = cookieSession;
      }
    }
    return cookieSession;
  }
  function expandOrRenewCookie(cookieSession) {
    var _a2 = computeSessionState2(cookieSession[productKey]), trackingType = _a2.trackingType, isTracked = _a2.isTracked;
    cookieSession[productKey] = trackingType;
    if (isTracked && !cookieSession.id) {
      cookieSession.id = generateUUID$1();
      cookieSession.created = String(dateNow$1());
    }
    return isTracked;
  }
  function hasSessionInCache() {
    return sessionCache[productKey] !== void 0;
  }
  function isSessionInCacheOutdated(cookieSession) {
    return sessionCache.id !== cookieSession.id || sessionCache[productKey] !== cookieSession[productKey];
  }
  function expireSession() {
    sessionCache = {};
    expireObservable.notify();
  }
  function renewSession(cookieSession) {
    sessionCache = cookieSession;
    renewObservable.notify();
  }
  function retrieveActiveSession() {
    var session = retrieveSession$1();
    if (isActiveSession(session)) {
      return session;
    }
    return {};
  }
  function isActiveSession(session) {
    return (session.created === void 0 || dateNow$1() - Number(session.created) < SESSION_TIME_OUT_DELAY$1) && (session.expire === void 0 || dateNow$1() < Number(session.expire));
  }
  return {
    expandOrRenewSession: throttle$1(monitor$1(expandOrRenewSession), COOKIE_ACCESS_DELAY$1).throttled,
    expandSession,
    getSession: function() {
      return sessionCache;
    },
    renewObservable,
    expireObservable,
    stop: function() {
      clearInterval(watchSessionTimeoutId);
    }
  };
}
var VISIBILITY_CHECK_DELAY$1 = ONE_MINUTE$1;
var SESSION_CONTEXT_TIMEOUT_DELAY$1 = SESSION_TIME_OUT_DELAY$1;
function startSessionManager$1(options, productKey, computeSessionState2) {
  tryOldCookiesMigration$1(options);
  var sessionStore = startSessionStore$1(options, productKey, computeSessionState2);
  var sessionContextHistory = new ContextHistory$1(SESSION_CONTEXT_TIMEOUT_DELAY$1);
  sessionStore.renewObservable.subscribe(function() {
    sessionContextHistory.add(buildSessionContext(), relativeNow$1());
  });
  sessionStore.expireObservable.subscribe(function() {
    sessionContextHistory.closeActive(relativeNow$1());
  });
  sessionStore.expandOrRenewSession();
  sessionContextHistory.add(buildSessionContext(), clocksOrigin$1().relative);
  trackActivity$1(function() {
    return sessionStore.expandOrRenewSession();
  });
  trackVisibility$1(function() {
    return sessionStore.expandSession();
  });
  function buildSessionContext() {
    return {
      id: sessionStore.getSession().id,
      trackingType: sessionStore.getSession()[productKey]
    };
  }
  return {
    findActiveSession: function(startTime) {
      return sessionContextHistory.find(startTime);
    },
    renewObservable: sessionStore.renewObservable,
    expireObservable: sessionStore.expireObservable
  };
}
function trackActivity$1(expandOrRenewSession) {
  addEventListeners$1(window, ["click", "touchstart", "keydown", "scroll"], expandOrRenewSession, { capture: true, passive: true }).stop;
}
function trackVisibility$1(expandSession) {
  var expandSessionWhenVisible = monitor$1(function() {
    if (document.visibilityState === "visible") {
      expandSession();
    }
  });
  addEventListener$1(document, "visibilitychange", expandSessionWhenVisible).stop;
  setInterval(expandSessionWhenVisible, VISIBILITY_CHECK_DELAY$1);
}
var HttpRequest$1 = function() {
  function HttpRequest2(endpointBuilder, bytesLimit) {
    this.endpointBuilder = endpointBuilder;
    this.bytesLimit = bytesLimit;
  }
  HttpRequest2.prototype.send = function(data, bytesCount) {
    var url = this.endpointBuilder.build();
    var canUseBeacon = !!navigator.sendBeacon && bytesCount < this.bytesLimit;
    if (canUseBeacon) {
      try {
        var isQueued = navigator.sendBeacon(url, data);
        if (isQueued) {
          return;
        }
      } catch (e) {
        reportBeaconError$1(e);
      }
    }
    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.send(data);
  };
  return HttpRequest2;
}();
var hasReportedBeaconError$1 = false;
function reportBeaconError$1(e) {
  if (!hasReportedBeaconError$1) {
    hasReportedBeaconError$1 = true;
    addTelemetryError$1(e);
  }
}
var HAS_MULTI_BYTES_CHARACTERS$1 = /[^\u0000-\u007F]/;
var Batch$1 = function() {
  function Batch2(request, batchMessagesLimit, batchBytesLimit, messageBytesLimit, flushTimeout, beforeUnloadCallback) {
    if (beforeUnloadCallback === void 0) {
      beforeUnloadCallback = noop$1;
    }
    this.request = request;
    this.batchMessagesLimit = batchMessagesLimit;
    this.batchBytesLimit = batchBytesLimit;
    this.messageBytesLimit = messageBytesLimit;
    this.flushTimeout = flushTimeout;
    this.beforeUnloadCallback = beforeUnloadCallback;
    this.pushOnlyBuffer = [];
    this.upsertBuffer = {};
    this.bufferBytesCount = 0;
    this.bufferMessagesCount = 0;
    this.flushOnVisibilityHidden();
    this.flushPeriodically();
  }
  Batch2.prototype.add = function(message) {
    this.addOrUpdate(message);
  };
  Batch2.prototype.upsert = function(message, key) {
    this.addOrUpdate(message, key);
  };
  Batch2.prototype.flush = function() {
    if (this.bufferMessagesCount !== 0) {
      var messages = this.pushOnlyBuffer.concat(objectValues$1(this.upsertBuffer));
      var bytesCount = this.bufferBytesCount;
      this.pushOnlyBuffer = [];
      this.upsertBuffer = {};
      this.bufferBytesCount = 0;
      this.bufferMessagesCount = 0;
      this.request.send(messages.join("\n"), bytesCount);
    }
  };
  Batch2.prototype.computeBytesCount = function(candidate) {
    if (!HAS_MULTI_BYTES_CHARACTERS$1.test(candidate)) {
      return candidate.length;
    }
    if (window.TextEncoder !== void 0) {
      return new TextEncoder().encode(candidate).length;
    }
    return new Blob([candidate]).size;
  };
  Batch2.prototype.addOrUpdate = function(message, key) {
    var _a2 = this.process(message), processedMessage = _a2.processedMessage, messageBytesCount = _a2.messageBytesCount;
    if (messageBytesCount >= this.messageBytesLimit) {
      display$1.warn("Discarded a message whose size was bigger than the maximum allowed size ".concat(this.messageBytesLimit, "KB."));
      return;
    }
    if (this.hasMessageFor(key)) {
      this.remove(key);
    }
    if (this.willReachedBytesLimitWith(messageBytesCount)) {
      this.flush();
    }
    this.push(processedMessage, messageBytesCount, key);
    if (this.isFull()) {
      this.flush();
    }
  };
  Batch2.prototype.process = function(message) {
    var processedMessage = jsonStringify$1(message);
    var messageBytesCount = this.computeBytesCount(processedMessage);
    return { processedMessage, messageBytesCount };
  };
  Batch2.prototype.push = function(processedMessage, messageBytesCount, key) {
    if (this.bufferMessagesCount > 0) {
      this.bufferBytesCount += 1;
    }
    if (key !== void 0) {
      this.upsertBuffer[key] = processedMessage;
    } else {
      this.pushOnlyBuffer.push(processedMessage);
    }
    this.bufferBytesCount += messageBytesCount;
    this.bufferMessagesCount += 1;
  };
  Batch2.prototype.remove = function(key) {
    var removedMessage = this.upsertBuffer[key];
    delete this.upsertBuffer[key];
    var messageBytesCount = this.computeBytesCount(removedMessage);
    this.bufferBytesCount -= messageBytesCount;
    this.bufferMessagesCount -= 1;
    if (this.bufferMessagesCount > 0) {
      this.bufferBytesCount -= 1;
    }
  };
  Batch2.prototype.hasMessageFor = function(key) {
    return key !== void 0 && this.upsertBuffer[key] !== void 0;
  };
  Batch2.prototype.willReachedBytesLimitWith = function(messageBytesCount) {
    return this.bufferBytesCount + messageBytesCount + 1 >= this.batchBytesLimit;
  };
  Batch2.prototype.isFull = function() {
    return this.bufferMessagesCount === this.batchMessagesLimit || this.bufferBytesCount >= this.batchBytesLimit;
  };
  Batch2.prototype.flushPeriodically = function() {
    var _this = this;
    setTimeout(monitor$1(function() {
      _this.flush();
      _this.flushPeriodically();
    }), this.flushTimeout);
  };
  Batch2.prototype.flushOnVisibilityHidden = function() {
    var _this = this;
    if (navigator.sendBeacon) {
      addEventListener$1(window, "beforeunload", this.beforeUnloadCallback);
      addEventListener$1(document, "visibilitychange", function() {
        if (document.visibilityState === "hidden") {
          _this.flush();
        }
      });
      addEventListener$1(window, "beforeunload", function() {
        return _this.flush();
      });
    }
  };
  return Batch2;
}();
function getEventBridge$1() {
  var eventBridgeGlobal = getEventBridgeGlobal$1();
  if (!eventBridgeGlobal) {
    return;
  }
  return {
    getAllowedWebViewHosts: function() {
      return JSON.parse(eventBridgeGlobal.getAllowedWebViewHosts());
    },
    send: function(eventType, event) {
      eventBridgeGlobal.send(JSON.stringify({ eventType, event }));
    }
  };
}
function canUseEventBridge$1(currentHost) {
  var _a2;
  if (currentHost === void 0) {
    currentHost = (_a2 = getGlobalObject$1().location) === null || _a2 === void 0 ? void 0 : _a2.hostname;
  }
  var bridge = getEventBridge$1();
  return !!bridge && bridge.getAllowedWebViewHosts().some(function(allowedHost) {
    return currentHost === allowedHost || endsWith$1(currentHost, ".".concat(allowedHost));
  });
}
function getEventBridgeGlobal$1() {
  return getGlobalObject$1().DatadogEventBridge;
}
function startBatchWithReplica$1(configuration, endpoint, replicaEndpoint) {
  var primaryBatch = createBatch(endpoint);
  var replicaBatch;
  if (replicaEndpoint) {
    replicaBatch = createBatch(replicaEndpoint);
  }
  function createBatch(endpointBuilder) {
    return new Batch$1(new HttpRequest$1(endpointBuilder, configuration.batchBytesLimit), configuration.batchMessagesLimit, configuration.batchBytesLimit, configuration.messageBytesLimit, configuration.flushTimeout);
  }
  return {
    add: function(message, replicated) {
      if (replicated === void 0) {
        replicated = true;
      }
      primaryBatch.add(message);
      if (replicaBatch && replicated) {
        replicaBatch.add(message);
      }
    }
  };
}
function createEventRateLimiter$1(eventType, limit, onLimitReached) {
  var eventCount = 0;
  var allowNextEvent = false;
  return {
    isLimitReached: function() {
      if (eventCount === 0) {
        setTimeout(function() {
          eventCount = 0;
        }, ONE_MINUTE$1);
      }
      eventCount += 1;
      if (eventCount <= limit || allowNextEvent) {
        allowNextEvent = false;
        return false;
      }
      if (eventCount === limit + 1) {
        allowNextEvent = true;
        try {
          onLimitReached({
            message: "Reached max number of ".concat(eventType, "s by minute: ").concat(limit),
            source: ErrorSource$1.AGENT,
            startClocks: clocksNow$1()
          });
        } finally {
          allowNextEvent = false;
        }
      }
      return true;
    }
  };
}
var xhrObservable$1;
var xhrContexts$1 = /* @__PURE__ */ new WeakMap();
function initXhrObservable$1() {
  if (!xhrObservable$1) {
    xhrObservable$1 = createXhrObservable$1();
  }
  return xhrObservable$1;
}
function createXhrObservable$1() {
  var observable = new Observable$1(function() {
    var stopInstrumentingStart = instrumentMethodAndCallOriginal$1(XMLHttpRequest.prototype, "open", {
      before: openXhr$1
    }).stop;
    var stopInstrumentingSend = instrumentMethodAndCallOriginal$1(XMLHttpRequest.prototype, "send", {
      before: function() {
        sendXhr$1.call(this, observable);
      }
    }).stop;
    var stopInstrumentingAbort = instrumentMethodAndCallOriginal$1(XMLHttpRequest.prototype, "abort", {
      before: abortXhr$1
    }).stop;
    return function() {
      stopInstrumentingStart();
      stopInstrumentingSend();
      stopInstrumentingAbort();
    };
  });
  return observable;
}
function openXhr$1(method, url) {
  xhrContexts$1.set(this, {
    state: "open",
    method,
    url: normalizeUrl$1(String(url))
  });
}
function sendXhr$1(observable) {
  var _this = this;
  var context = xhrContexts$1.get(this);
  if (!context) {
    return;
  }
  var startContext = context;
  startContext.state = "start";
  startContext.startTime = relativeNow$1();
  startContext.startClocks = clocksNow$1();
  startContext.isAborted = false;
  startContext.xhr = this;
  var hasBeenReported = false;
  var stopInstrumentingOnReadyStateChange = instrumentMethodAndCallOriginal$1(this, "onreadystatechange", {
    before: function() {
      if (this.readyState === XMLHttpRequest.DONE) {
        onEnd();
      }
    }
  }).stop;
  var onEnd = monitor$1(function() {
    _this.removeEventListener("loadend", onEnd);
    stopInstrumentingOnReadyStateChange();
    if (hasBeenReported) {
      return;
    }
    hasBeenReported = true;
    var completeContext = context;
    completeContext.state = "complete";
    completeContext.duration = elapsed$1(startContext.startClocks.timeStamp, timeStampNow$1());
    completeContext.status = _this.status;
    observable.notify(shallowClone$1(completeContext));
  });
  this.addEventListener("loadend", onEnd);
  observable.notify(startContext);
}
function abortXhr$1() {
  var context = xhrContexts$1.get(this);
  if (context) {
    context.isAborted = true;
  }
}
var fetchObservable$1;
function initFetchObservable$1() {
  if (!fetchObservable$1) {
    fetchObservable$1 = createFetchObservable$1();
  }
  return fetchObservable$1;
}
function createFetchObservable$1() {
  var observable = new Observable$1(function() {
    if (!window.fetch) {
      return;
    }
    var stop = instrumentMethod$1(window, "fetch", function(originalFetch) {
      return function(input, init) {
        var responsePromise;
        var context = callMonitored$1(beforeSend$1, null, [observable, input, init]);
        if (context) {
          responsePromise = originalFetch.call(this, context.input, context.init);
          callMonitored$1(afterSend$1, null, [observable, responsePromise, context]);
        } else {
          responsePromise = originalFetch.call(this, input, init);
        }
        return responsePromise;
      };
    }).stop;
    return stop;
  });
  return observable;
}
function beforeSend$1(observable, input, init) {
  var method = init && init.method || typeof input === "object" && input.method || "GET";
  var url = normalizeUrl$1(typeof input === "object" && input.url || input);
  var startClocks = clocksNow$1();
  var context = {
    state: "start",
    init,
    input,
    method,
    startClocks,
    url
  };
  observable.notify(context);
  return context;
}
function afterSend$1(observable, responsePromise, startContext) {
  var reportFetch = function(response) {
    var context = startContext;
    context.state = "complete";
    context.duration = elapsed$1(context.startClocks.timeStamp, timeStampNow$1());
    if ("stack" in response || response instanceof Error) {
      context.status = 0;
      context.isAborted = response instanceof DOMException && response.code === DOMException.ABORT_ERR;
      context.error = response;
      observable.notify(context);
    } else if ("status" in response) {
      context.response = response;
      context.responseType = response.type;
      context.status = response.status;
      context.isAborted = false;
      observable.notify(context);
    }
  };
  responsePromise.then(monitor$1(reportFetch), monitor$1(reportFetch));
}
var consoleObservablesByApi$1 = {};
function initConsoleObservable$1(apis) {
  var consoleObservables = apis.map(function(api) {
    if (!consoleObservablesByApi$1[api]) {
      consoleObservablesByApi$1[api] = createConsoleObservable$1(api);
    }
    return consoleObservablesByApi$1[api];
  });
  return mergeObservables$1.apply(void 0, consoleObservables);
}
function createConsoleObservable$1(api) {
  var observable = new Observable$1(function() {
    var originalConsoleApi = console[api];
    console[api] = function() {
      var params = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
      }
      originalConsoleApi.apply(console, params);
      var handlingStack = createHandlingStack$1();
      callMonitored$1(function() {
        observable.notify(buildConsoleLog$1(params, api, handlingStack));
      });
    };
    return function() {
      console[api] = originalConsoleApi;
    };
  });
  return observable;
}
function buildConsoleLog$1(params, api, handlingStack) {
  var message = params.map(function(param) {
    return formatConsoleParameters$1(param);
  }).join(" ");
  var stack;
  if (api === ConsoleApiName$1.error) {
    var firstErrorParam = find$1(params, function(param) {
      return param instanceof Error;
    });
    stack = firstErrorParam ? toStackTraceString$1(computeStackTrace$1(firstErrorParam)) : void 0;
    message = "console error: ".concat(message);
  }
  return {
    api,
    message,
    stack,
    handlingStack
  };
}
function formatConsoleParameters$1(param) {
  if (typeof param === "string") {
    return param;
  }
  if (param instanceof Error) {
    return formatErrorMessage$1(computeStackTrace$1(param));
  }
  return jsonStringify$1(param, void 0, 2);
}
var BUFFER_LIMIT$1 = 500;
var BoundedBuffer$1 = function() {
  function BoundedBuffer2() {
    this.buffer = [];
  }
  BoundedBuffer2.prototype.add = function(callback) {
    var length = this.buffer.push(callback);
    if (length > BUFFER_LIMIT$1) {
      this.buffer.splice(0, 1);
    }
  };
  BoundedBuffer2.prototype.drain = function() {
    this.buffer.forEach(function(callback) {
      return callback();
    });
    this.buffer.length = 0;
  };
  return BoundedBuffer2;
}();
function createContextManager$1() {
  var context = {};
  return {
    get: function() {
      return context;
    },
    add: function(key, value) {
      context[key] = value;
    },
    remove: function(key) {
      delete context[key];
    },
    set: function(newContext) {
      context = newContext;
    },
    getContext: function() {
      return deepClone$1(context);
    },
    setContext: function(newContext) {
      context = deepClone$1(newContext);
    },
    setContextProperty: function(key, property) {
      context[key] = deepClone$1(property);
    },
    removeContextProperty: function(key) {
      delete context[key];
    },
    clearContext: function() {
      context = {};
    }
  };
}
var SYNTHETICS_TEST_ID_COOKIE_NAME$1 = "datadog-synthetics-public-id";
var SYNTHETICS_RESULT_ID_COOKIE_NAME$1 = "datadog-synthetics-result-id";
var SYNTHETICS_INJECTS_RUM_COOKIE_NAME$1 = "datadog-synthetics-injects-rum";
function willSyntheticsInjectRum$1() {
  return Boolean(window._DATADOG_SYNTHETICS_INJECTS_RUM || getCookie$1(SYNTHETICS_INJECTS_RUM_COOKIE_NAME$1));
}
function getSyntheticsTestId$1() {
  var value = window._DATADOG_SYNTHETICS_PUBLIC_ID || getCookie$1(SYNTHETICS_TEST_ID_COOKIE_NAME$1);
  return typeof value === "string" ? value : void 0;
}
function getSyntheticsResultId$1() {
  var value = window._DATADOG_SYNTHETICS_RESULT_ID || getCookie$1(SYNTHETICS_RESULT_ID_COOKIE_NAME$1);
  return typeof value === "string" ? value : void 0;
}
var DEFAULT_REQUEST_ERROR_RESPONSE_LENGTH_LIMIT$1 = 32 * ONE_KILO_BYTE$1;
function validateAndBuildLogsConfiguration$1(initConfiguration) {
  var baseConfiguration = validateAndBuildConfiguration$1(initConfiguration);
  var forwardConsoleLogs = validateAndBuildForwardOption$1(initConfiguration.forwardConsoleLogs, objectValues$1(ConsoleApiName$1), "Forward Console Logs");
  var forwardReports = validateAndBuildForwardOption$1(initConfiguration.forwardReports, objectValues$1(RawReportType$1), "Forward Reports");
  if (!baseConfiguration || !forwardConsoleLogs || !forwardReports) {
    return;
  }
  if (initConfiguration.forwardErrorsToLogs && !includes$1(forwardConsoleLogs, ConsoleApiName$1.error)) {
    forwardConsoleLogs.push(ConsoleApiName$1.error);
  }
  return assign$1({
    forwardErrorsToLogs: initConfiguration.forwardErrorsToLogs !== false,
    forwardConsoleLogs,
    forwardReports,
    requestErrorResponseLengthLimit: DEFAULT_REQUEST_ERROR_RESPONSE_LENGTH_LIMIT$1
  }, baseConfiguration);
}
function validateAndBuildForwardOption$1(option, allowedValues, label) {
  if (option === void 0) {
    return [];
  }
  if (!(option === "all" || Array.isArray(option) && option.every(function(api) {
    return includes$1(allowedValues, api);
  }))) {
    display$1.error("".concat(label, ' should be "all" or an array with allowed values "').concat(allowedValues.join('", "'), '"'));
    return;
  }
  return option === "all" ? allowedValues : removeDuplicates$1(option);
}
var __decorate$1 = globalThis && globalThis.__decorate || function(decorators, target, key, desc) {
  var c = arguments.length, r2 = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r2 = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r2 = (c < 3 ? d(r2) : c > 3 ? d(target, key, r2) : d(target, key)) || r2;
  return c > 3 && r2 && Object.defineProperty(target, key, r2), r2;
};
var StatusType$1 = {
  debug: "debug",
  error: "error",
  info: "info",
  warn: "warn"
};
var HandlerType$1 = {
  console: "console",
  http: "http",
  silent: "silent"
};
var STATUSES$1 = Object.keys(StatusType$1);
var Logger$1 = function() {
  function Logger2(handleLogStrategy, name2, handlerType, level, loggerContext) {
    if (handlerType === void 0) {
      handlerType = HandlerType$1.http;
    }
    if (level === void 0) {
      level = StatusType$1.debug;
    }
    if (loggerContext === void 0) {
      loggerContext = {};
    }
    this.handleLogStrategy = handleLogStrategy;
    this.handlerType = handlerType;
    this.level = level;
    this.contextManager = createContextManager$1();
    this.contextManager.set(assign$1({}, loggerContext, name2 ? { logger: { name: name2 } } : void 0));
  }
  Logger2.prototype.log = function(message, messageContext, status2) {
    if (status2 === void 0) {
      status2 = StatusType$1.info;
    }
    this.handleLogStrategy({ message, context: deepClone$1(messageContext), status: status2 }, this);
  };
  Logger2.prototype.debug = function(message, messageContext) {
    this.log(message, messageContext, StatusType$1.debug);
  };
  Logger2.prototype.info = function(message, messageContext) {
    this.log(message, messageContext, StatusType$1.info);
  };
  Logger2.prototype.warn = function(message, messageContext) {
    this.log(message, messageContext, StatusType$1.warn);
  };
  Logger2.prototype.error = function(message, messageContext) {
    var errorOrigin = {
      error: {
        origin: ErrorSource$1.LOGGER
      }
    };
    this.log(message, combine$1(errorOrigin, messageContext), StatusType$1.error);
  };
  Logger2.prototype.setContext = function(context) {
    this.contextManager.set(context);
  };
  Logger2.prototype.getContext = function() {
    return this.contextManager.get();
  };
  Logger2.prototype.addContext = function(key, value) {
    this.contextManager.add(key, value);
  };
  Logger2.prototype.removeContext = function(key) {
    this.contextManager.remove(key);
  };
  Logger2.prototype.setHandler = function(handler) {
    this.handlerType = handler;
  };
  Logger2.prototype.getHandler = function() {
    return this.handlerType;
  };
  Logger2.prototype.setLevel = function(level) {
    this.level = level;
  };
  Logger2.prototype.getLevel = function() {
    return this.level;
  };
  __decorate$1([
    monitored$1
  ], Logger2.prototype, "log", null);
  return Logger2;
}();
function makeLogsPublicApi$1(startLogsImpl) {
  var isAlreadyInitialized = false;
  var globalContextManager = createContextManager$1();
  var customLoggers = {};
  var getInternalContextStrategy = function() {
    return void 0;
  };
  var beforeInitLoggerLog = new BoundedBuffer$1();
  var handleLogStrategy = function(logsMessage, logger, savedCommonContext, date) {
    if (savedCommonContext === void 0) {
      savedCommonContext = deepClone$1(getCommonContext());
    }
    if (date === void 0) {
      date = timeStampNow$1();
    }
    beforeInitLoggerLog.add(function() {
      return handleLogStrategy(logsMessage, logger, savedCommonContext, date);
    });
  };
  var getInitConfigurationStrategy = function() {
    return void 0;
  };
  var mainLogger = new Logger$1(function() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      params[_i] = arguments[_i];
    }
    return handleLogStrategy.apply(void 0, params);
  });
  function getCommonContext() {
    return {
      view: {
        referrer: document.referrer,
        url: window.location.href
      },
      context: globalContextManager.get()
    };
  }
  return makePublicApi$1({
    logger: mainLogger,
    init: monitor$1(function(initConfiguration) {
      var _a2;
      if (canUseEventBridge$1()) {
        initConfiguration = overrideInitConfigurationForBridge(initConfiguration);
      }
      if (!canInitLogs(initConfiguration)) {
        return;
      }
      var configuration = validateAndBuildLogsConfiguration$1(initConfiguration);
      if (!configuration) {
        return;
      }
      _a2 = startLogsImpl(configuration, getCommonContext, mainLogger), handleLogStrategy = _a2.handleLog, getInternalContextStrategy = _a2.getInternalContext;
      getInitConfigurationStrategy = function() {
        return deepClone$1(initConfiguration);
      };
      beforeInitLoggerLog.drain();
      isAlreadyInitialized = true;
    }),
    getLoggerGlobalContext: monitor$1(globalContextManager.get),
    getGlobalContext: monitor$1(globalContextManager.getContext),
    setLoggerGlobalContext: monitor$1(globalContextManager.set),
    setGlobalContext: monitor$1(globalContextManager.setContext),
    addLoggerGlobalContext: monitor$1(globalContextManager.add),
    setGlobalContextProperty: monitor$1(globalContextManager.setContextProperty),
    removeLoggerGlobalContext: monitor$1(globalContextManager.remove),
    removeGlobalContextProperty: monitor$1(globalContextManager.removeContextProperty),
    clearGlobalContext: monitor$1(globalContextManager.clearContext),
    createLogger: monitor$1(function(name2, conf) {
      if (conf === void 0) {
        conf = {};
      }
      customLoggers[name2] = new Logger$1(function() {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          params[_i] = arguments[_i];
        }
        return handleLogStrategy.apply(void 0, params);
      }, name2, conf.handler, conf.level, conf.context);
      return customLoggers[name2];
    }),
    getLogger: monitor$1(function(name2) {
      return customLoggers[name2];
    }),
    getInitConfiguration: monitor$1(function() {
      return getInitConfigurationStrategy();
    }),
    getInternalContext: monitor$1(function(startTime) {
      return getInternalContextStrategy(startTime);
    })
  });
  function overrideInitConfigurationForBridge(initConfiguration) {
    return assign$1({}, initConfiguration, { clientToken: "empty" });
  }
  function canInitLogs(initConfiguration) {
    if (isAlreadyInitialized) {
      if (!initConfiguration.silentMultipleInit) {
        display$1.error("DD_LOGS is already initialized.");
      }
      return false;
    }
    return true;
  }
}
var LOGS_SESSION_KEY$2 = "logs";
function startLogsSessionManager$1(configuration) {
  var sessionManager = startSessionManager$1(configuration.cookieOptions, LOGS_SESSION_KEY$2, function(rawTrackingType) {
    return computeSessionState$1(configuration, rawTrackingType);
  });
  return {
    findTrackedSession: function(startTime) {
      var session = sessionManager.findActiveSession(startTime);
      return session && session.trackingType === "1" ? {
        id: session.id
      } : void 0;
    }
  };
}
function startLogsSessionManagerStub$1(configuration) {
  var isTracked = computeTrackingType$1(configuration) === "1";
  var session = isTracked ? {} : void 0;
  return {
    findTrackedSession: function() {
      return session;
    }
  };
}
function computeTrackingType$1(configuration) {
  if (!performDraw$1(configuration.sampleRate)) {
    return "0";
  }
  return "1";
}
function computeSessionState$1(configuration, rawSessionType) {
  var trackingType = hasValidLoggerSession$1(rawSessionType) ? rawSessionType : computeTrackingType$1(configuration);
  return {
    trackingType,
    isTracked: trackingType === "1"
  };
}
function hasValidLoggerSession$1(trackingType) {
  return trackingType === "0" || trackingType === "1";
}
var _a$2$1;
var STATUS_PRIORITIES$1 = (_a$2$1 = {}, _a$2$1[StatusType$1.debug] = 0, _a$2$1[StatusType$1.info] = 1, _a$2$1[StatusType$1.warn] = 2, _a$2$1[StatusType$1.error] = 3, _a$2$1);
function startLoggerCollection$1(lifeCycle) {
  function handleLog(logsMessage, logger, savedCommonContext, savedDate) {
    var messageContext = logsMessage.context;
    if (isAuthorized$1(logsMessage.status, HandlerType$1.console, logger)) {
      display$1(logsMessage.status, logsMessage.message, combine$1(logger.getContext(), messageContext));
    }
    lifeCycle.notify(0, {
      rawLogsEvent: {
        date: savedDate || timeStampNow$1(),
        message: logsMessage.message,
        status: logsMessage.status,
        origin: ErrorSource$1.LOGGER
      },
      messageContext,
      savedCommonContext,
      logger
    });
  }
  return {
    handleLog
  };
}
function isAuthorized$1(status2, handlerType, logger) {
  var loggerHandler = logger.getHandler();
  var sanitizedHandlerType = Array.isArray(loggerHandler) ? loggerHandler : [loggerHandler];
  return STATUS_PRIORITIES$1[status2] >= STATUS_PRIORITIES$1[logger.getLevel()] && includes$1(sanitizedHandlerType, handlerType);
}
function reportAgentError$1(error, lifeCycle) {
  lifeCycle.notify(0, {
    rawLogsEvent: {
      message: error.message,
      date: error.startClocks.timeStamp,
      error: {
        origin: ErrorSource$1.AGENT
      },
      origin: ErrorSource$1.AGENT,
      status: StatusType$1.error
    }
  });
}
function startLogsAssembly$1(sessionManager, configuration, lifeCycle, getCommonContext, mainLogger) {
  var statusWithCustom = STATUSES$1.concat(["custom"]);
  var logRateLimiters = {};
  statusWithCustom.forEach(function(status2) {
    logRateLimiters[status2] = createEventRateLimiter$1(status2, configuration.eventRateLimiterThreshold, function(error) {
      return reportAgentError$1(error, lifeCycle);
    });
  });
  lifeCycle.subscribe(0, function(_a2) {
    var _b, _c, _d;
    var rawLogsEvent = _a2.rawLogsEvent, _e = _a2.messageContext, messageContext = _e === void 0 ? void 0 : _e, _f = _a2.savedCommonContext, savedCommonContext = _f === void 0 ? void 0 : _f, _g = _a2.logger, logger = _g === void 0 ? mainLogger : _g;
    var startTime = getRelativeTime$1(rawLogsEvent.date);
    var session = sessionManager.findTrackedSession(startTime);
    if (!session) {
      return;
    }
    var commonContext = savedCommonContext || getCommonContext();
    var log = combine$1({ service: configuration.service, session_id: session.id, view: commonContext.view }, commonContext.context, getRUMInternalContext$1(startTime), rawLogsEvent, logger.getContext(), messageContext);
    if (!isAuthorized$1(rawLogsEvent.status, HandlerType$1.http, logger) || ((_b = configuration.beforeSend) === null || _b === void 0 ? void 0 : _b.call(configuration, log)) === false || ((_c = log.error) === null || _c === void 0 ? void 0 : _c.origin) !== ErrorSource$1.AGENT && ((_d = logRateLimiters[log.status]) !== null && _d !== void 0 ? _d : logRateLimiters["custom"]).isLimitReached()) {
      return;
    }
    lifeCycle.notify(1, log);
  });
}
var logsSentBeforeRumInjectionTelemetryAdded$1 = false;
function getRUMInternalContext$1(startTime) {
  var browserWindow = window;
  if (willSyntheticsInjectRum$1()) {
    var context = getInternalContextFromRumGlobal(browserWindow.DD_RUM_SYNTHETICS);
    if (!context && !logsSentBeforeRumInjectionTelemetryAdded$1) {
      logsSentBeforeRumInjectionTelemetryAdded$1 = true;
      addTelemetryDebug$1("Logs sent before RUM is injected by the synthetics worker", {
        testId: getSyntheticsTestId$1(),
        resultId: getSyntheticsResultId$1()
      });
    }
    return context;
  }
  return getInternalContextFromRumGlobal(browserWindow.DD_RUM);
  function getInternalContextFromRumGlobal(rumGlobal) {
    if (rumGlobal && rumGlobal.getInternalContext) {
      return rumGlobal.getInternalContext(startTime);
    }
  }
}
var _a$1$1;
var LogStatusForApi$1 = (_a$1$1 = {}, _a$1$1[ConsoleApiName$1.log] = StatusType$1.info, _a$1$1[ConsoleApiName$1.debug] = StatusType$1.debug, _a$1$1[ConsoleApiName$1.info] = StatusType$1.info, _a$1$1[ConsoleApiName$1.warn] = StatusType$1.warn, _a$1$1[ConsoleApiName$1.error] = StatusType$1.error, _a$1$1);
function startConsoleCollection$1(configuration, lifeCycle) {
  var consoleSubscription = initConsoleObservable$1(configuration.forwardConsoleLogs).subscribe(function(log) {
    lifeCycle.notify(0, {
      rawLogsEvent: {
        date: timeStampNow$1(),
        message: log.message,
        origin: ErrorSource$1.CONSOLE,
        error: log.api === ConsoleApiName$1.error ? {
          origin: ErrorSource$1.CONSOLE,
          stack: log.stack
        } : void 0,
        status: LogStatusForApi$1[log.api]
      }
    });
  });
  return {
    stop: function() {
      consoleSubscription.unsubscribe();
    }
  };
}
var _a$3;
var LogStatusForReport$1 = (_a$3 = {}, _a$3[RawReportType$1.cspViolation] = StatusType$1.error, _a$3[RawReportType$1.intervention] = StatusType$1.error, _a$3[RawReportType$1.deprecation] = StatusType$1.warn, _a$3);
function startReportCollection$1(configuration, lifeCycle) {
  var reportSubscription = initReportObservable$1(configuration.forwardReports).subscribe(function(report) {
    var message = report.message;
    var status2 = LogStatusForReport$1[report.type];
    var error;
    if (status2 === StatusType$1.error) {
      error = {
        kind: report.subtype,
        origin: ErrorSource$1.REPORT,
        stack: report.stack
      };
    } else if (report.stack) {
      message += " Found in ".concat(getFileFromStackTraceString$1(report.stack));
    }
    lifeCycle.notify(0, {
      rawLogsEvent: {
        date: timeStampNow$1(),
        message,
        origin: ErrorSource$1.REPORT,
        error,
        status: status2
      }
    });
  });
  return {
    stop: function() {
      reportSubscription.unsubscribe();
    }
  };
}
function startNetworkErrorCollection$1(configuration, lifeCycle) {
  if (!configuration.forwardErrorsToLogs) {
    return { stop: noop$1 };
  }
  var xhrSubscription = initXhrObservable$1().subscribe(function(context) {
    if (context.state === "complete") {
      handleCompleteRequest("xhr", context);
    }
  });
  var fetchSubscription = initFetchObservable$1().subscribe(function(context) {
    if (context.state === "complete") {
      handleCompleteRequest("fetch", context);
    }
  });
  function handleCompleteRequest(type2, request) {
    if (!configuration.isIntakeUrl(request.url) && (isRejected$1(request) || isServerError$1(request))) {
      if ("xhr" in request) {
        computeXhrResponseData$1(request.xhr, configuration, onResponseDataAvailable);
      } else if (request.response) {
        computeFetchResponseText$1(request.response, configuration, onResponseDataAvailable);
      } else if (request.error) {
        computeFetchErrorText$1(request.error, configuration, onResponseDataAvailable);
      }
    }
    function onResponseDataAvailable(responseData) {
      lifeCycle.notify(0, {
        rawLogsEvent: {
          message: "".concat(format$1(type2), " error ").concat(request.method, " ").concat(request.url),
          date: request.startClocks.timeStamp,
          error: {
            origin: ErrorSource$1.NETWORK,
            stack: responseData || "Failed to load"
          },
          http: {
            method: request.method,
            status_code: request.status,
            url: request.url
          },
          status: StatusType$1.error,
          origin: ErrorSource$1.NETWORK
        }
      });
    }
  }
  return {
    stop: function() {
      xhrSubscription.unsubscribe();
      fetchSubscription.unsubscribe();
    }
  };
}
function computeXhrResponseData$1(xhr, configuration, callback) {
  if (typeof xhr.response === "string") {
    callback(truncateResponseText$1(xhr.response, configuration));
  } else {
    callback(xhr.response);
  }
}
function computeFetchErrorText$1(error, configuration, callback) {
  callback(truncateResponseText$1(toStackTraceString$1(computeStackTrace$1(error)), configuration));
}
function computeFetchResponseText$1(response, configuration, callback) {
  if (!window.TextDecoder) {
    response.clone().text().then(monitor$1(function(text) {
      return callback(truncateResponseText$1(text, configuration));
    }), monitor$1(function(error) {
      return callback("Unable to retrieve response: ".concat(error));
    }));
  } else if (!response.body) {
    callback();
  } else {
    truncateResponseStream$1(response.clone().body, configuration.requestErrorResponseLengthLimit, function(error, responseText) {
      if (error) {
        callback("Unable to retrieve response: ".concat(error));
      } else {
        callback(responseText);
      }
    });
  }
}
function isRejected$1(request) {
  return request.status === 0 && request.responseType !== "opaque";
}
function isServerError$1(request) {
  return request.status >= 500;
}
function truncateResponseText$1(responseText, configuration) {
  if (responseText.length > configuration.requestErrorResponseLengthLimit) {
    return "".concat(responseText.substring(0, configuration.requestErrorResponseLengthLimit), "...");
  }
  return responseText;
}
function format$1(type2) {
  if ("xhr" === type2) {
    return "XHR";
  }
  return "Fetch";
}
function truncateResponseStream$1(stream, limit, callback) {
  readLimitedAmountOfBytes$1(stream, limit, function(error, bytes, limitExceeded) {
    if (error) {
      callback(error);
    } else {
      var responseText = new TextDecoder().decode(bytes);
      if (limitExceeded) {
        responseText += "...";
      }
      callback(void 0, responseText);
    }
  });
}
function readLimitedAmountOfBytes$1(stream, limit, callback) {
  var reader = stream.getReader();
  var chunks = [];
  var readBytesCount = 0;
  readMore();
  function readMore() {
    reader.read().then(monitor$1(function(result) {
      if (result.done) {
        onDone();
        return;
      }
      chunks.push(result.value);
      readBytesCount += result.value.length;
      if (readBytesCount > limit) {
        onDone();
      } else {
        readMore();
      }
    }), monitor$1(function(error) {
      return callback(error);
    }));
  }
  function onDone() {
    reader.cancel().catch(
      noop$1
    );
    var completeBuffer;
    if (chunks.length === 1) {
      completeBuffer = chunks[0];
    } else {
      completeBuffer = new Uint8Array(readBytesCount);
      var offset_1 = 0;
      chunks.forEach(function(chunk) {
        completeBuffer.set(chunk, offset_1);
        offset_1 += chunk.length;
      });
    }
    callback(void 0, completeBuffer.slice(0, limit), completeBuffer.length > limit);
  }
}
function startRuntimeErrorCollection$1(configuration, lifeCycle) {
  if (!configuration.forwardErrorsToLogs) {
    return { stop: noop$1 };
  }
  var rawErrorObservable = new Observable$1();
  var stopRuntimeErrorTracking = trackRuntimeError$1(rawErrorObservable).stop;
  var rawErrorSubscription = rawErrorObservable.subscribe(function(rawError) {
    lifeCycle.notify(0, {
      rawLogsEvent: {
        message: rawError.message,
        date: rawError.startClocks.timeStamp,
        error: {
          kind: rawError.type,
          origin: ErrorSource$1.SOURCE,
          stack: rawError.stack
        },
        origin: ErrorSource$1.SOURCE,
        status: StatusType$1.error
      }
    });
  });
  return {
    stop: function() {
      stopRuntimeErrorTracking();
      rawErrorSubscription.unsubscribe();
    }
  };
}
var LifeCycle$1 = function() {
  function LifeCycle2() {
    this.callbacks = {};
  }
  LifeCycle2.prototype.notify = function(eventType, data) {
    var eventCallbacks = this.callbacks[eventType];
    if (eventCallbacks) {
      eventCallbacks.forEach(function(callback) {
        return callback(data);
      });
    }
  };
  LifeCycle2.prototype.subscribe = function(eventType, callback) {
    var _this = this;
    if (!this.callbacks[eventType]) {
      this.callbacks[eventType] = [];
    }
    this.callbacks[eventType].push(callback);
    return {
      unsubscribe: function() {
        _this.callbacks[eventType] = _this.callbacks[eventType].filter(function(other) {
          return callback !== other;
        });
      }
    };
  };
  return LifeCycle2;
}();
function startLogsBatch$1(configuration, lifeCycle) {
  var _a2;
  var batch = startBatchWithReplica$1(configuration, configuration.logsEndpointBuilder, (_a2 = configuration.replica) === null || _a2 === void 0 ? void 0 : _a2.logsEndpointBuilder);
  lifeCycle.subscribe(1, function(serverLogsEvent) {
    batch.add(serverLogsEvent);
  });
}
function startLogsBridge$1(lifeCycle) {
  var bridge = getEventBridge$1();
  lifeCycle.subscribe(1, function(serverLogsEvent) {
    bridge.send("log", serverLogsEvent);
  });
}
function startInternalContext$1(sessionManager) {
  return {
    get: function(startTime) {
      var trackedSession = sessionManager.findTrackedSession(startTime);
      if (trackedSession) {
        return {
          session_id: trackedSession.id
        };
      }
    }
  };
}
function startLogs$1(configuration, getCommonContext, mainLogger) {
  var lifeCycle = new LifeCycle$1();
  var telemetry = startLogsTelemetry$1(configuration);
  telemetry.setContextProvider(function() {
    var _a2, _b, _c, _d, _e, _f;
    return {
      application: {
        id: (_a2 = getRUMInternalContext$1()) === null || _a2 === void 0 ? void 0 : _a2.application_id
      },
      session: {
        id: (_b = session.findTrackedSession()) === null || _b === void 0 ? void 0 : _b.id
      },
      view: {
        id: (_d = (_c = getRUMInternalContext$1()) === null || _c === void 0 ? void 0 : _c.view) === null || _d === void 0 ? void 0 : _d.id
      },
      action: {
        id: (_f = (_e = getRUMInternalContext$1()) === null || _e === void 0 ? void 0 : _e.user_action) === null || _f === void 0 ? void 0 : _f.id
      }
    };
  });
  startNetworkErrorCollection$1(configuration, lifeCycle);
  startRuntimeErrorCollection$1(configuration, lifeCycle);
  startConsoleCollection$1(configuration, lifeCycle);
  startReportCollection$1(configuration, lifeCycle);
  var handleLog = startLoggerCollection$1(lifeCycle).handleLog;
  var session = areCookiesAuthorized$1(configuration.cookieOptions) && !canUseEventBridge$1() && !willSyntheticsInjectRum$1() ? startLogsSessionManager$1(configuration) : startLogsSessionManagerStub$1(configuration);
  startLogsAssembly$1(session, configuration, lifeCycle, getCommonContext, mainLogger);
  if (!canUseEventBridge$1()) {
    startLogsBatch$1(configuration, lifeCycle);
  } else {
    startLogsBridge$1(lifeCycle);
  }
  var internalContext = startInternalContext$1(session);
  return {
    handleLog,
    getInternalContext: internalContext.get
  };
}
function startLogsTelemetry$1(configuration) {
  var _a2;
  var telemetry = startTelemetry$1(configuration);
  if (canUseEventBridge$1()) {
    var bridge_1 = getEventBridge$1();
    telemetry.observable.subscribe(function(event) {
      return bridge_1.send("internal_telemetry", event);
    });
  } else {
    var telemetryBatch_1 = startBatchWithReplica$1(configuration, configuration.rumEndpointBuilder, (_a2 = configuration.replica) === null || _a2 === void 0 ? void 0 : _a2.rumEndpointBuilder);
    telemetry.observable.subscribe(function(event) {
      return telemetryBatch_1.add(event, isTelemetryReplicationAllowed$1(configuration));
    });
  }
  return telemetry;
}
var datadogLogs$1 = makeLogsPublicApi$1(startLogs$1);
defineGlobal$1(getGlobalObject$1(), "DD_LOGS", datadogLogs$1);
class BrowserLogger$1 {
  constructor(service, logLevel, options) {
    this.logLevels = {
      debug: 4,
      error: 1,
      info: 3,
      off: 0,
      warn: 2
    };
    this.logLevel = "info";
    this.service = "federated-core";
    this.namespace = "browser";
    datadogLogs$1.init({ ...options.config, service });
    datadogLogs$1.logger.setLevel(logLevel);
    this.options = options;
    this.service = service;
    this.logLevel = logLevel;
    this.instance = datadogLogs$1.logger;
  }
  log(level, message, componentName = "unknown", logContext = {}) {
    var _a2;
    if (this.logLevel === "off")
      return;
    if ((_a2 = this.options.filteredLogs) == null ? void 0 : _a2.includes(message))
      return;
    const isObject = typeof message === "object";
    const messageToLog = isObject ? JSON.stringify({ data: message }) : message;
    if (this.isLevelEnabled(level)) {
      this.instance[level](`[${this.namespace}] - ${messageToLog}`, {
        logContext: { componentName, ...logContext }
      });
    }
  }
  isLevelEnabled(level) {
    return this.logLevels[this.logLevel] >= this.logLevels[level];
  }
  debug(message, componentName, logContext) {
    this.log("debug", message, componentName, logContext);
  }
  error(message, componentName, logContext) {
    this.log("error", message, componentName, logContext);
  }
  info(message, componentName, logContext) {
    this.log("info", message, componentName, logContext);
  }
  warn(message, componentName, logContext) {
    this.log("warn", message, componentName, logContext);
  }
  get level() {
    return this.logLevel;
  }
  set level(level) {
    this.logLevel = level;
  }
  get serviceName() {
    return this.service;
  }
  get loggerInstance() {
    return this.instance;
  }
}
const isBrowser$1 = () => typeof window !== "undefined";
var FederatedModuleStatuses$1 = /* @__PURE__ */ ((FederatedModuleStatuses2) => {
  FederatedModuleStatuses2["NOT_LOADED"] = "NOT_LOADED";
  FederatedModuleStatuses2["LOADED"] = "LOADED";
  FederatedModuleStatuses2["BOOTSTRAPPING"] = "BOOTSTRAPPING";
  FederatedModuleStatuses2["BOOTSTRAPPED"] = "BOOTSTRAPPED";
  FederatedModuleStatuses2["NOT_MOUNTED"] = "NOT_MOUNTED";
  FederatedModuleStatuses2["MOUNTING"] = "MOUNTING";
  FederatedModuleStatuses2["MOUNTED"] = "MOUNTED";
  FederatedModuleStatuses2["UPDATING"] = "UPDATING";
  FederatedModuleStatuses2["UNMOUNTING"] = "UNMOUNTING";
  FederatedModuleStatuses2["UNMOUNT_ERROR"] = "UNMOUNT_ERROR";
  FederatedModuleStatuses2["UNMOUNTED"] = "UNMOUNTED";
  FederatedModuleStatuses2["UNLOADING"] = "UNLOADING";
  FederatedModuleStatuses2["LOAD_ERROR"] = "LOAD_ERROR";
  FederatedModuleStatuses2["UPDATE_ERROR"] = "UPDATE_ERROR";
  return FederatedModuleStatuses2;
})(FederatedModuleStatuses$1 || {});
var FederatedEvents$1 = /* @__PURE__ */ ((FederatedEvents2) => {
  FederatedEvents2["RUNTIME_BEFORE_BOOTSTRAP"] = "federated-core:runtime:before-bootstrap";
  FederatedEvents2["RUNTIME_BOOTSTRAPPED"] = "federated-core:runtime:bootstrapped";
  FederatedEvents2["RUNTIME_BOOTSTRAP_ERROR"] = "federated-core:runtime:bootstrap:error";
  FederatedEvents2["RUNTIME_BEFORE_START"] = "federated-core:runtime:before-start";
  FederatedEvents2["RUNTIME_STARTED"] = "federated-core:runtime:started";
  FederatedEvents2["RUNTIME_START_ERROR"] = "federated-core:runtime:start:error";
  FederatedEvents2["RUNTIME_MODULES_PREFETCH_START"] = "federated-core:runtime:modules:pre-fetch:start";
  FederatedEvents2["RUNTIME_BEFORE_MODULE_PREFETCH"] = "federated-core:runtime:module:before-prefetch";
  FederatedEvents2["RUNTIME_MODULE_PREFETCHED"] = "federated-core:runtime:module:prefetched";
  FederatedEvents2["RUNTIME_MODULE_PREFETCH_ERROR"] = "federated-core:runtime:module:prefetch:error";
  FederatedEvents2["RUNTIME_MODULES_PREFETCHED"] = "federated-core:runtime:modules:pre-fetched";
  FederatedEvents2["RUNTIME_ROUTES_PREFETCH_START"] = "federated-core:runtime:routes:pre-fetch:start";
  FederatedEvents2["RUNTIME_BEFORE_ROUTE_PREFETCH"] = "federated-core:runtime:route:before-prefetch";
  FederatedEvents2["RUNTIME_ROUTE_PREFETCHED"] = "federated-core:runtime:route:prefetched";
  FederatedEvents2["RUNTIME_ROUTES_PREFETCH_ERROR"] = "federated-core:runtime:routes:prefetch:error";
  FederatedEvents2["RUNTIME_ROUTES_PREFETCHED"] = "federated-core:runtime:routes:pre-fetched";
  FederatedEvents2["IMPORT_MAP_OVERRIDES_LOADED"] = "federated-core:import-map-overrides:loaded";
  FederatedEvents2["IMPORT_MAP_OVERRIDES_LOAD_ERROR"] = "federated-core:import-map-overrides:load-error";
  FederatedEvents2["ROUTE_CHANGED"] = "federated-core:route:changed";
  FederatedEvents2["ROUTE_ERROR"] = "federated-core:route:error";
  FederatedEvents2["ROUTE_ALREADY_ACTIVE"] = "federated-core:route:already-active";
  FederatedEvents2["ROUTE_NAVIGATE_TO"] = "federated-core:route:navigate-to";
  FederatedEvents2["POPSTATE_EVENT_FIRED"] = "federated-core:popstate:event-fired";
  FederatedEvents2["POPSTATE_EVENT_ERROR"] = "federated-core:popstate:event-error";
  FederatedEvents2["NATIVE_MODULE_LOADING"] = "federated-core:native-module:loading";
  FederatedEvents2["NATIVE_MODULE_LOADED"] = "federated-core:native-module:loaded";
  FederatedEvents2["NATIVE_MODULE_LOAD_ERROR"] = "federated-core:native-module:load-error";
  FederatedEvents2["SYSTEMJS_LOADED"] = "federated-core:systemjs:loaded";
  FederatedEvents2["SYSTEMJS_LOAD_ERROR"] = "federated-core:systemjs:load-error";
  FederatedEvents2["SYSTEMJS_MODULE_LOADING"] = "federated-core:systemjs:module:loading";
  FederatedEvents2["SYSTEMJS_MODULE_LOADED"] = "federated-core:systemjs:module:loaded";
  FederatedEvents2["MODULE_BEFORE_REGISTER"] = "federated-core:module:%moduleKey%:before-register";
  FederatedEvents2["MODULE_REGISTERED"] = "federated-core:module:%moduleKey%:registered";
  FederatedEvents2["MODULE_ALREADY_REGISTERED"] = "federated-core:module:%moduleKey%:already-registered";
  FederatedEvents2["MODULE_REGISTER_ERROR"] = "federated-core:module:%moduleKey%:register:error";
  FederatedEvents2["MODULE_BEFORE_LOAD"] = "federated-core:module:%moduleKey%:before-load";
  FederatedEvents2["MODULE_LOADED"] = "federated-core:module:%moduleKey%:loaded";
  FederatedEvents2["MODULE_ALREADY_LOADED"] = "federated-core:module:%moduleKey%:already-loaded";
  FederatedEvents2["MODULE_LOAD_ERROR"] = "federated-core:module:%moduleKey%:load:error";
  FederatedEvents2["MODULE_VALIDATE_PROPS"] = "federated-core:module:%moduleKey%:validate-props";
  FederatedEvents2["MODULE_STATE_CHANGED"] = "federated-core:module:%moduleKey%:state-changed";
  FederatedEvents2["MODULE_BEFORE_BOOTSTRAP"] = "federated-core:module:%moduleKey%:before-bootstrap";
  FederatedEvents2["MODULE_BOOTSTRAPPED"] = "federated-core:module:%moduleKey%:bootstrapped";
  FederatedEvents2["MODULE_BOOTSTRAP_ERROR"] = "federated-core:module:%moduleKey%:bootstrap:error";
  FederatedEvents2["MODULE_BEFORE_MOUNT"] = "federated-core:module:%moduleKey%:before-mount";
  FederatedEvents2["MODULE_MOUNTED"] = "federated-core:module:%moduleKey%:mounted";
  FederatedEvents2["MODULE_MOUNT_ERROR"] = "federated-core:module:%moduleKey%:mount:error";
  FederatedEvents2["MODULE_ALREADY_MOUNTED"] = "federated-core:module:%moduleKey%:already-mounted";
  FederatedEvents2["MODULE_BEFORE_UNMOUNT"] = "federated-core:module:%moduleKey%:before-unmount";
  FederatedEvents2["MODULE_UNMOUNTED"] = "federated-core:module:%moduleKey%:unmounted";
  FederatedEvents2["MODULE_UNMOUNT_ERROR"] = "federated-core:module:%moduleKey%:unmount:error";
  FederatedEvents2["MODULE_NOT_MOUNTED"] = "federated-core:module:%moduleKey%:not-mounted";
  FederatedEvents2["MODULE_BEFORE_UPDATE"] = "federated-core:module:%moduleKey%:before-update";
  FederatedEvents2["MODULE_UPDATED"] = "federated-core:module:%moduleKey%:updated";
  FederatedEvents2["MODULE_UPDATE_ERROR"] = "federated-core:module:%moduleKey%:update:error";
  return FederatedEvents2;
})(FederatedEvents$1 || {});
const addHtmlElementWithAttrs$1 = (id, tagName, attrs) => {
  const element = document.createElement(tagName);
  element.id = id;
  Object.keys(attrs).forEach((key) => {
    element.setAttribute(key, attrs[key]);
  });
  document.body.appendChild(element);
};
const addLinkTag$1 = (id, rel, href) => {
  const link = document.createElement("link");
  link.id = id;
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};
const addMetaTag$1 = (id, name2, content) => {
  if (document.getElementById(id)) {
    return;
  }
  const meta = document.createElement("meta");
  meta.id = id;
  meta.content = content;
  meta.name = name2;
  document.head.appendChild(meta);
};
const addScriptTag$1 = (id, src, onload) => {
  if (document.getElementById(id)) {
    return;
  }
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.crossOrigin = "anonymous";
  if (onload)
    script.onload = onload;
  document.body.appendChild(script);
};
const getModuleKey$1 = (scope2, moduleName) => {
  return `${scope2}:${moduleName}`;
};
const pathToWildcard$1 = (path) => {
  return `^${path.replace(/\*/g, ".*")}$`;
};
const matchPathToUrlPaths$1 = (path, urlPaths) => {
  const matchFound = urlPaths.find((activePath) => {
    const wildcardRegex = new RegExp(pathToWildcard$1(activePath));
    return wildcardRegex.test(path);
  });
  return !!matchFound;
};
const shouldModuleBeMounted$1 = (path, module) => {
  if (!module.activeWhenPaths) {
    return false;
  }
  return matchPathToUrlPaths$1(path, module.activeWhenPaths) && !matchPathToUrlPaths$1(path, module.exceptWhenPaths || []);
};
const eventStore$1 = /* @__PURE__ */ new Map();
const unregister$1 = (id) => {
  const event = eventStore$1.has(id) ? eventStore$1.get(id) : null;
  if (event) {
    const { type: type2, fn } = event;
    window.removeEventListener(type2, fn);
    eventStore$1.delete(id);
  }
};
const register$1 = (type2, fn, module) => {
  const id = `${type2}__${Date.now()}__${Math.floor(Math.random() * 1e3)}`;
  let eventType = type2;
  if (module) {
    eventType = replaceModuleKey$1(eventType, module);
  }
  eventStore$1.set(id, { type: eventType, fn });
  window.addEventListener(eventType, fn);
  return () => unregister$1(id);
};
const replaceModuleKey$1 = (type2, module) => {
  return type2.replace(`%moduleKey%`, getModuleKey$1(module.scope, module.name));
};
const emit$1 = (event, module) => {
  let eventType = event.type;
  if (module == null ? void 0 : module.name) {
    eventType = replaceModuleKey$1(eventType, module);
  }
  if (window.__FEDERATED_CORE__.federatedRuntime.debugEnabled) {
    console.log(`[EventService] Emitted event: ${eventType}`, event.payload);
  }
  window.dispatchEvent(new CustomEvent(eventType, event.payload));
};
const unregisterAll$1 = () => {
  eventStore$1.forEach((_value, key) => {
    unregister$1(key);
  });
};
const clear$1 = () => {
  eventStore$1.clear();
};
const eventService$1 = {
  register: register$1,
  unregister: unregister$1,
  unregisterAll: unregisterAll$1,
  emit: emit$1,
  clear: clear$1,
  replaceModuleKey: replaceModuleKey$1,
  eventStore: eventStore$1
};
const loggers$1 = /* @__PURE__ */ new Map();
const hasLogger$1 = (loggerKey) => {
  return loggers$1.has(loggerKey);
};
const getLogger$1 = (service, logLevel, options, forceRecreate = false) => {
  const loggerKey = `${service}-logger`;
  if (hasLogger$1(loggerKey) && !forceRecreate) {
    return loggers$1.get(loggerKey);
  }
  const logger = new BrowserLogger$1(service, logLevel, options);
  loggers$1.set(loggerKey, logger);
  return logger;
};
const deleteLogger$1 = (loggerKey) => {
  if (hasLogger$1(loggerKey)) {
    loggers$1.delete(loggerKey);
  }
};
const loggerService$1 = {
  hasLogger: hasLogger$1,
  getLogger: getLogger$1,
  deleteLogger: deleteLogger$1
};
const ExposedServices$1 = {
  event: eventService$1,
  logger: loggerService$1
};
class FederatedRuntime$1 {
  constructor() {
    this._bootstrapped = false;
    this._started = false;
    this._useNativeModules = false;
    this._importMapOverridesEnabled = false;
    this._debugEnabled = false;
    this._sharedDependencyBaseUrl = "";
    this._cdnUrl = process.env["SHARED_CDN_DOMAIN"] || "";
    this._modules = /* @__PURE__ */ new Map();
    this._services = ExposedServices$1;
  }
  set bootstrapped(bootstrapped) {
    this._bootstrapped = bootstrapped;
  }
  get bootstrapped() {
    return this._bootstrapped;
  }
  set started(started) {
    this._started = started;
  }
  get started() {
    return this._started;
  }
  set debugEnabled(value) {
    this._debugEnabled = value;
  }
  get debugEnabled() {
    return this._debugEnabled;
  }
  set sharedDependencyBaseUrl(baseUrl) {
    this._sharedDependencyBaseUrl = baseUrl;
  }
  get sharedDependencyBaseUrl() {
    return this._sharedDependencyBaseUrl;
  }
  set useNativeModules(useNativeModules) {
    this._useNativeModules = useNativeModules;
  }
  get useNativeModules() {
    return this._useNativeModules;
  }
  set importMapOverridesEnabled(importMapOverridesEnabled) {
    this._importMapOverridesEnabled = importMapOverridesEnabled;
  }
  get importMapOverridesEnabled() {
    return this._importMapOverridesEnabled;
  }
  set cdnUrl(cdnUrl) {
    this._cdnUrl = cdnUrl;
  }
  get cdnUrl() {
    return this._cdnUrl;
  }
  set modules(modules) {
    this._modules = modules;
  }
  get modules() {
    return this._modules;
  }
  get services() {
    return this._services;
  }
  addImportMapOverridesUi() {
    const importMapOverridesKey = "import-map-overrides";
    if (this.importMapOverridesEnabled) {
      addHtmlElementWithAttrs$1(
        "import-map-overrides-ui",
        "import-map-overrides-full",
        {
          "show-when-local-storage": importMapOverridesKey
        }
      );
      localStorage.setItem(importMapOverridesKey, "true");
      addScriptTag$1(
        importMapOverridesKey,
        "https://cdn.jsdelivr.net/npm/import-map-overrides/dist/import-map-overrides.js"
      );
      this.services.event.emit({
        type: FederatedEvents$1.IMPORT_MAP_OVERRIDES_LOADED,
        payload: {
          loadedTime: Date.now()
        }
      });
    }
  }
  ensureSystemJs() {
    if (!this.useNativeModules) {
      addMetaTag$1("importmap-type", "importmap-type", "systemjs-importmap");
      addScriptTag$1(
        "systemjs",
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/system.min.js`
      );
      addScriptTag$1(
        "systemjs-named-exports",
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/extras/named-exports.min.js`
      );
      addScriptTag$1(
        "systemjs-amd",
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/extras/amd.min.js`
      );
      addScriptTag$1(
        "systemjs-dynamic-import-maps",
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/extras/dynamic-import-maps.min.js`
      );
      this.services.event.emit({
        type: FederatedEvents$1.SYSTEMJS_LOADED,
        payload: {
          loadedTime: Date.now()
        }
      });
    }
  }
  async fetchImportMapContent(basePath) {
    const importMapPath = `${basePath || this.cdnUrl}/entries-import-map.json`;
    const importMap = await fetch(importMapPath);
    return importMap.json();
  }
  setModuleState(module, state) {
    const { scope: scope2, name: name2 } = module;
    const moduleKey = getModuleKey$1(scope2, name2);
    const moduleInstance = {
      ...this.modules.get(moduleKey),
      status: state
    };
    this.modules.set(moduleKey, moduleInstance);
    eventService$1.emit(
      {
        type: FederatedEvents$1.MODULE_STATE_CHANGED,
        payload: {
          module
        }
      },
      module
    );
  }
  setModuleRootComponent(module, component) {
    const { scope: scope2, name: name2 } = module;
    const moduleKey = getModuleKey$1(scope2, name2);
    const savedModule = this.modules.get(moduleKey);
    if (savedModule) {
      savedModule.rootComponent = component;
      this.modules.set(moduleKey, savedModule);
    }
  }
  getModuleRootComponent(module) {
    const { scope: scope2, name: name2 } = module;
    const moduleKey = getModuleKey$1(scope2, name2);
    const savedModule = this.modules.get(moduleKey);
    if (savedModule) {
      return savedModule.rootComponent;
    }
  }
  async registerModule(module) {
    var _a2, _b;
    const { scope: scope2, name: name2 } = module;
    const moduleKey = getModuleKey$1(scope2, name2);
    if (this.modules.has(moduleKey) && ((_a2 = this.modules.get(moduleKey)) == null ? void 0 : _a2.status) === FederatedModuleStatuses$1.LOADED) {
      this.services.event.emit(
        {
          type: FederatedEvents$1.MODULE_ALREADY_REGISTERED,
          payload: {
            module
          }
        },
        module
      );
    } else if (this.modules.has(moduleKey) && ((_b = this.modules.get(moduleKey)) == null ? void 0 : _b.status) === FederatedModuleStatuses$1.MOUNTED) {
      this.services.event.emit(
        {
          type: FederatedEvents$1.MODULE_ALREADY_MOUNTED,
          payload: {
            module
          }
        },
        module
      );
    } else {
      this.services.event.emit(
        {
          type: FederatedEvents$1.MODULE_BEFORE_REGISTER,
          payload: {
            module
          }
        },
        module
      );
      this.setModuleState(
        { scope: module.scope, name: module.name },
        FederatedModuleStatuses$1.NOT_LOADED
      );
      this.modules.set(moduleKey, module);
      this.services.event.emit(
        {
          type: FederatedEvents$1.MODULE_REGISTERED,
          payload: {
            module
          }
        },
        module
      );
    }
    return this;
  }
  async getModuleUrl(module) {
    const { name: name2, basePath } = module;
    const importMap = await this.fetchImportMapContent(basePath);
    return importMap.imports[name2];
  }
  getModulesByPath(path) {
    const modules = [];
    this.modules.forEach((module) => {
      if (shouldModuleBeMounted$1(path, module)) {
        modules.push(module);
      }
    });
    return modules;
  }
  async loadModule(module) {
    var _a2, _b;
    const { scope: scope2, name: name2, basePath } = module;
    try {
      const moduleKey = getModuleKey$1(scope2, name2);
      if (this.modules.has(moduleKey)) {
        const storeModule = this.modules.get(moduleKey);
        if (storeModule && ["journey-module", "component"].includes(storeModule.type) && ((_a2 = this.modules.get(moduleKey)) == null ? void 0 : _a2.status) === FederatedModuleStatuses$1.MOUNTED) {
          this.services.event.emit(
            {
              type: FederatedEvents$1.MODULE_ALREADY_MOUNTED,
              payload: {
                module
              }
            },
            module
          );
          return this.modules.get(moduleKey);
        }
        if (storeModule && ((_b = this.modules.get(moduleKey)) == null ? void 0 : _b.status) === FederatedModuleStatuses$1.LOADED) {
          this.services.event.emit(
            {
              type: FederatedEvents$1.MODULE_ALREADY_LOADED,
              payload: {
                module
              }
            },
            module
          );
          return this.modules.get(moduleKey);
        }
      }
      this.services.event.emit(
        {
          type: FederatedEvents$1.MODULE_BEFORE_LOAD,
          payload: {
            module
          }
        },
        module
      );
      let resolvedModule;
      const importMap = await this.fetchImportMapContent(basePath);
      const moduleUrl = importMap.imports[`${name2}.css`];
      if (moduleUrl) {
        addLinkTag$1(`${name2}.css`, "stylesheet", moduleUrl);
      }
      if (this.useNativeModules) {
        this.services.event.emit(
          {
            type: FederatedEvents$1.NATIVE_MODULE_LOADING,
            payload: {
              module
            }
          },
          module
        );
        const moduleUrl2 = await this.getModuleUrl({ scope: scope2, name: name2 });
        resolvedModule = await import(
          /* @vite-ignore */
          moduleUrl2
        );
        this.services.event.emit(
          {
            type: FederatedEvents$1.NATIVE_MODULE_LOADED,
            payload: {
              loadedTime: new Date().getTime(),
              module: resolvedModule
            }
          },
          module
        );
      } else {
        this.services.event.emit(
          {
            type: FederatedEvents$1.SYSTEMJS_MODULE_LOADING,
            payload: {
              module
            }
          },
          module
        );
        resolvedModule = await System.import(name2);
        this.services.event.emit(
          {
            type: FederatedEvents$1.SYSTEMJS_MODULE_LOADED,
            payload: {
              module: resolvedModule
            }
          },
          module
        );
      }
      if (!this.modules.has(moduleKey) && !resolvedModule.status) {
        await this.registerModule(resolvedModule);
      }
      if (!resolvedModule.status || resolvedModule.status === FederatedModuleStatuses$1.NOT_LOADED) {
        this.setModuleState({ scope: scope2, name: name2 }, FederatedModuleStatuses$1.LOADED);
      }
      return resolvedModule;
    } catch (error) {
      this.services.event.emit(
        {
          type: FederatedEvents$1.MODULE_LOAD_ERROR,
          payload: {
            module,
            error
          }
        },
        module
      );
      return void 0;
    }
  }
  async mountModule(module, props, mountId) {
    const { scope: scope2, name: name2 } = module;
    const loadedModule = await this.loadModule({ scope: scope2, name: name2 });
    if (loadedModule == null ? void 0 : loadedModule.mount) {
      await loadedModule.mount(props, mountId);
    }
  }
  async unmountModule(module) {
    const { scope: scope2, name: name2 } = module;
    const loadedModule = await this.modules.get(getModuleKey$1(scope2, name2));
    if (loadedModule == null ? void 0 : loadedModule.unmount) {
      await loadedModule.unmount();
    }
  }
  validateProps(module, props) {
    const { scope: scope2, name: name2 } = module;
    const moduleKey = getModuleKey$1(scope2, name2);
    this.services.event.emit(
      {
        type: FederatedEvents$1.MODULE_VALIDATE_PROPS,
        payload: {
          module,
          props
        }
      },
      module
    );
    const loadedModule = this.modules.get(moduleKey);
    if (!(loadedModule == null ? void 0 : loadedModule.validateProps)) {
      return true;
    }
    return loadedModule.validateProps(props);
  }
  async preFetchModules(modules) {
    this.services.event.emit({
      type: FederatedEvents$1.RUNTIME_MODULES_PREFETCH_START,
      payload: {
        modules
      }
    });
    for (const module of modules) {
      const { name: name2, scope: scope2 } = module;
      const moduleKey = getModuleKey$1(scope2, name2);
      if (!this.modules.has(moduleKey)) {
        this.services.event.emit({
          type: FederatedEvents$1.RUNTIME_BEFORE_MODULE_PREFETCH,
          payload: {
            module
          }
        });
        await this.loadModule({ scope: scope2, name: name2 });
        this.services.event.emit({
          type: FederatedEvents$1.RUNTIME_MODULE_PREFETCHED,
          payload: {
            module
          }
        });
      }
    }
    this.services.event.emit({
      type: FederatedEvents$1.RUNTIME_MODULES_PREFETCHED,
      payload: {
        modules
      }
    });
    return this;
  }
  async applyModules() {
    const modulesToMount = [];
    const modulesToUnmount = [];
    this.modules.forEach((module) => {
      if (shouldModuleBeMounted$1(window.location.pathname, module)) {
        modulesToMount.push(module);
      } else {
        modulesToUnmount.push(module);
      }
    });
    for (const module of modulesToUnmount) {
      const moduleKey = getModuleKey$1(module.scope, module.name);
      const moduleInstance = this.modules.get(moduleKey);
      if (moduleInstance == null ? void 0 : moduleInstance.unmount) {
        this.services.event.emit(
          {
            type: FederatedEvents$1.MODULE_BEFORE_UNMOUNT,
            payload: {
              module
            }
          },
          module
        );
        await moduleInstance.unmount();
        this.services.event.emit(
          {
            type: FederatedEvents$1.MODULE_UNMOUNTED,
            payload: {
              module: moduleInstance
            }
          },
          module
        );
      } else if ((moduleInstance == null ? void 0 : moduleInstance.type) === "journey-module" || (moduleInstance == null ? void 0 : moduleInstance.type) === "component") {
        this.setModuleState(
          { scope: module.scope, name: module.name },
          FederatedModuleStatuses$1.NOT_LOADED
        );
      }
    }
    for (const module of modulesToMount) {
      try {
        const { scope: scope2, name: name2, props } = module;
        const loadedModule = await this.loadModule({ scope: scope2, name: name2 });
        if (loadedModule == null ? void 0 : loadedModule.mount) {
          this.services.event.emit(
            {
              type: FederatedEvents$1.MODULE_BEFORE_MOUNT,
              payload: {
                module: loadedModule
              }
            },
            module
          );
          await loadedModule.mount(props);
          this.services.event.emit(
            {
              type: FederatedEvents$1.MODULE_MOUNTED,
              payload: {
                module: loadedModule
              }
            },
            module
          );
        }
      } catch (error) {
        this.services.event.emit(
          {
            type: FederatedEvents$1.MODULE_MOUNT_ERROR,
            payload: {
              module,
              error
            }
          },
          module
        );
      }
    }
  }
  navigateTo(path) {
    if (window.location.pathname === path) {
      this.services.event.emit({
        type: FederatedEvents$1.ROUTE_ALREADY_ACTIVE,
        payload: {
          path
        }
      });
      return;
    }
    this.services.event.emit({
      type: FederatedEvents$1.ROUTE_NAVIGATE_TO,
      payload: {
        previousPath: window.location.pathname,
        path
      }
    });
    window.history.pushState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
  async reroute() {
    this.services.event.emit({
      type: FederatedEvents$1.ROUTE_CHANGED,
      payload: {
        path: window.location.pathname
      }
    });
    await this.applyModules();
  }
  async preFetchRoutes(routePaths) {
    try {
      this.services.event.emit({
        type: FederatedEvents$1.RUNTIME_ROUTES_PREFETCH_START,
        payload: {
          routes: routePaths
        }
      });
      for (const path of routePaths) {
        this.services.event.emit({
          type: FederatedEvents$1.RUNTIME_BEFORE_ROUTE_PREFETCH,
          payload: {
            path
          }
        });
        const modules = this.getModulesByPath(path);
        for (const module of modules) {
          const { name: name2, scope: scope2 } = module;
          if ((module == null ? void 0 : module.status) !== FederatedModuleStatuses$1.LOADED) {
            await this.loadModule({ scope: scope2, name: name2 });
          }
        }
        this.services.event.emit({
          type: FederatedEvents$1.RUNTIME_ROUTE_PREFETCHED,
          payload: {
            path
          }
        });
      }
      this.services.event.emit({
        type: FederatedEvents$1.RUNTIME_ROUTES_PREFETCHED,
        payload: {
          routes: routePaths
        }
      });
    } catch (error) {
      this.services.event.emit({
        type: FederatedEvents$1.RUNTIME_ROUTES_PREFETCH_ERROR,
        payload: {
          routes: routePaths,
          error
        }
      });
    }
    return this;
  }
  async bootstrap() {
    this.bootstrapped = false;
    const boostrapStartTime = Date.now();
    this.services.event.emit({
      type: FederatedEvents$1.RUNTIME_BEFORE_BOOTSTRAP,
      payload: {
        bootstrapTime: new Date().toDateString(),
        modules: this.modules,
        useNativeModules: this.useNativeModules,
        importMapOverridesEnabled: this.importMapOverridesEnabled
      }
    });
    window.addEventListener("popstate", async (popstateEvent) => {
      this.services.event.emit({
        type: FederatedEvents$1.POPSTATE_EVENT_FIRED,
        payload: {
          popstateEvent
        }
      });
      await this.reroute();
    });
    this.ensureSystemJs();
    this.addImportMapOverridesUi();
    for (const entry of this.modules) {
      const moduleData = entry[1];
      try {
        if (moduleData.bootstrap) {
          this.services.event.emit(
            {
              type: FederatedEvents$1.MODULE_BEFORE_BOOTSTRAP,
              payload: {
                module: moduleData
              }
            },
            moduleData
          );
          await moduleData.bootstrap();
          this.services.event.emit(
            {
              type: FederatedEvents$1.MODULE_BOOTSTRAPPED,
              payload: {
                module: moduleData
              }
            },
            moduleData
          );
        }
      } catch (error) {
        this.services.event.emit(
          {
            type: FederatedEvents$1.MODULE_BOOTSTRAP_ERROR,
            payload: {
              module: moduleData,
              error
            }
          },
          moduleData
        );
      }
    }
    const bootstrapEndTime = Date.now();
    const bootstrapDuration = bootstrapEndTime - boostrapStartTime;
    this.bootstrapped = true;
    this.services.event.emit({
      type: FederatedEvents$1.RUNTIME_BOOTSTRAPPED,
      payload: {
        bootstrapEndTime,
        bootstrapDuration
      }
    });
  }
  async start() {
    try {
      const startTime = Date.now();
      this.started = false;
      this.services.event.emit({
        type: FederatedEvents$1.RUNTIME_BEFORE_START,
        payload: {
          startTime: new Date(startTime).toDateString(),
          modules: this.modules
        }
      });
      await this.bootstrap();
      await this.reroute();
      const startEndTime = Date.now();
      const startDuration = startEndTime - startTime;
      this.services.event.emit({
        type: FederatedEvents$1.RUNTIME_STARTED,
        payload: {
          startTime,
          startEndTime,
          startDuration
        }
      });
      this.started = true;
    } catch (error) {
      this.services.event.emit({
        type: FederatedEvents$1.RUNTIME_START_ERROR,
        payload: {
          error
        }
      });
    }
  }
}
const initFederatedRuntime = (initConfig) => {
  if (isBrowser$1()) {
    if (!window.__FEDERATED_CORE__) {
      window.__FEDERATED_CORE__ = {
        federatedRuntime: new FederatedRuntime$1()
      };
    }
    if (!window.__FEDERATED_CORE__.federatedRuntime) {
      window.__FEDERATED_CORE__.federatedRuntime = new FederatedRuntime$1();
    }
    const runtime = window.__FEDERATED_CORE__.federatedRuntime;
    runtime.useNativeModules = (initConfig == null ? void 0 : initConfig.useNativeModules) || runtime.useNativeModules || false;
    if ((initConfig == null ? void 0 : initConfig.importMapOverridesEnabled) || runtime.importMapOverridesEnabled) {
      runtime.importMapOverridesEnabled = (initConfig == null ? void 0 : initConfig.importMapOverridesEnabled) || runtime.importMapOverridesEnabled || false;
      runtime.addImportMapOverridesUi();
    }
    runtime.debugEnabled = (initConfig == null ? void 0 : initConfig.debugEnabled) || false;
    runtime.sharedDependencyBaseUrl = (initConfig == null ? void 0 : initConfig.sharedDependencyBaseUrl) || "";
    runtime.cdnUrl = (initConfig == null ? void 0 : initConfig.cdnUrl) || runtime.cdnUrl || "";
    window.__FEDERATED_CORE__.federatedRuntime = runtime;
    return runtime;
  }
  return new FederatedRuntime$1();
};
if (isBrowser$1() && !window.__FEDERATED_CORE__) {
  window.__FEDERATED_CORE__ = {
    moduleBaseUrls: {},
    federatedRuntime: new FederatedRuntime$1()
  };
}
var ConsoleApiName = {
  log: "log",
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error"
};
var display = function(api) {
  var args = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  }
  if (!Object.prototype.hasOwnProperty.call(ConsoleApiName, api)) {
    api = ConsoleApiName.log;
  }
  display[api].apply(display, args);
};
display.debug = console.debug.bind(console);
display.log = console.log.bind(console);
display.info = console.info.bind(console);
display.warn = console.warn.bind(console);
display.error = console.error.bind(console);
var __spreadArray = globalThis && globalThis.__spreadArray || function(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l2 = from.length, ar; i < l2; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var onMonitorErrorCollected;
var debugMode = false;
function startMonitorErrorCollection(newOnMonitorErrorCollected) {
  onMonitorErrorCollected = newOnMonitorErrorCollected;
}
function setDebugMode(newDebugMode) {
  debugMode = newDebugMode;
}
function monitored(_, __, descriptor) {
  var originalMethod = descriptor.value;
  descriptor.value = function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var decorated = onMonitorErrorCollected ? monitor(originalMethod) : originalMethod;
    return decorated.apply(this, args);
  };
}
function monitor(fn) {
  return function() {
    return callMonitored(fn, this, arguments);
  };
}
function callMonitored(fn, context, args) {
  try {
    return fn.apply(context, args);
  } catch (e) {
    displayIfDebugEnabled(ConsoleApiName.error, e);
    if (onMonitorErrorCollected) {
      try {
        onMonitorErrorCollected(e);
      } catch (e2) {
        displayIfDebugEnabled(ConsoleApiName.error, e2);
      }
    }
  }
}
function displayIfDebugEnabled(api) {
  var args = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  }
  if (debugMode) {
    display.apply(void 0, __spreadArray([api, "[MONITOR]"], args, false));
  }
}
var ONE_SECOND = 1e3;
var ONE_MINUTE = 60 * ONE_SECOND;
var ONE_HOUR = 60 * ONE_MINUTE;
var ONE_KILO_BYTE = 1024;
function throttle(fn, wait, options) {
  var needLeadingExecution = options && options.leading !== void 0 ? options.leading : true;
  var needTrailingExecution = options && options.trailing !== void 0 ? options.trailing : true;
  var inWaitPeriod = false;
  var pendingExecutionWithParameters;
  var pendingTimeoutId;
  return {
    throttled: function() {
      var parameters = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        parameters[_i] = arguments[_i];
      }
      if (inWaitPeriod) {
        pendingExecutionWithParameters = parameters;
        return;
      }
      if (needLeadingExecution) {
        fn.apply(void 0, parameters);
      } else {
        pendingExecutionWithParameters = parameters;
      }
      inWaitPeriod = true;
      pendingTimeoutId = setTimeout(function() {
        if (needTrailingExecution && pendingExecutionWithParameters) {
          fn.apply(void 0, pendingExecutionWithParameters);
        }
        inWaitPeriod = false;
        pendingExecutionWithParameters = void 0;
      }, wait);
    },
    cancel: function() {
      clearTimeout(pendingTimeoutId);
      inWaitPeriod = false;
      pendingExecutionWithParameters = void 0;
    }
  };
}
function assign(target) {
  var toAssign = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    toAssign[_i - 1] = arguments[_i];
  }
  toAssign.forEach(function(source) {
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  });
  return target;
}
function shallowClone(object) {
  return assign({}, object);
}
function generateUUID(placeholder) {
  return placeholder ? (parseInt(placeholder, 10) ^ Math.random() * 16 >> parseInt(placeholder, 10) / 4).toString(16) : "".concat(1e7, "-").concat(1e3, "-").concat(4e3, "-").concat(8e3, "-").concat(1e11).replace(/[018]/g, generateUUID);
}
function performDraw(threshold) {
  return threshold !== 0 && Math.random() * 100 <= threshold;
}
function noop() {
}
function jsonStringify(value, replacer, space) {
  if (typeof value !== "object" || value === null) {
    return JSON.stringify(value);
  }
  var restoreObjectPrototypeToJson = detachToJsonMethod(Object.prototype);
  var restoreArrayPrototypeToJson = detachToJsonMethod(Array.prototype);
  var restoreValuePrototypeToJson = detachToJsonMethod(Object.getPrototypeOf(value));
  var restoreValueToJson = detachToJsonMethod(value);
  try {
    return JSON.stringify(value, replacer, space);
  } catch (_a2) {
    return "<error: unable to serialize object>";
  } finally {
    restoreObjectPrototypeToJson();
    restoreArrayPrototypeToJson();
    restoreValuePrototypeToJson();
    restoreValueToJson();
  }
}
function detachToJsonMethod(value) {
  var object = value;
  var objectToJson = object.toJSON;
  if (objectToJson) {
    delete object.toJSON;
    return function() {
      object.toJSON = objectToJson;
    };
  }
  return noop;
}
function includes(candidate, search) {
  return candidate.indexOf(search) !== -1;
}
function arrayFrom(arrayLike) {
  if (Array.from) {
    return Array.from(arrayLike);
  }
  var array = [];
  if (arrayLike instanceof Set) {
    arrayLike.forEach(function(item) {
      return array.push(item);
    });
  } else {
    for (var i = 0; i < arrayLike.length; i++) {
      array.push(arrayLike[i]);
    }
  }
  return array;
}
function find(array, predicate) {
  for (var i = 0; i < array.length; i += 1) {
    var item = array[i];
    if (predicate(item, i)) {
      return item;
    }
  }
  return void 0;
}
function isPercentage(value) {
  return isNumber(value) && value >= 0 && value <= 100;
}
function isNumber(value) {
  return typeof value === "number";
}
function objectValues(object) {
  return Object.keys(object).map(function(key) {
    return object[key];
  });
}
function objectEntries(object) {
  return Object.keys(object).map(function(key) {
    return [key, object[key]];
  });
}
function isEmptyObject(object) {
  return Object.keys(object).length === 0;
}
function startsWith(candidate, search) {
  return candidate.slice(0, search.length) === search;
}
function endsWith(candidate, search) {
  return candidate.slice(-search.length) === search;
}
function getGlobalObject() {
  if (typeof globalThis === "object") {
    return globalThis;
  }
  Object.defineProperty(Object.prototype, "_dd_temp_", {
    get: function() {
      return this;
    },
    configurable: true
  });
  var globalObject = _dd_temp_;
  delete Object.prototype._dd_temp_;
  if (typeof globalObject !== "object") {
    if (typeof self === "object") {
      globalObject = self;
    } else if (typeof window === "object") {
      globalObject = window;
    } else {
      globalObject = {};
    }
  }
  return globalObject;
}
function getLocationOrigin() {
  return getLinkElementOrigin(window.location);
}
function getLinkElementOrigin(element) {
  if (element.origin) {
    return element.origin;
  }
  var sanitizedHost = element.host.replace(/(:80|:443)$/, "");
  return "".concat(element.protocol, "//").concat(sanitizedHost);
}
function findCommaSeparatedValue(rawString, name2) {
  var regex = new RegExp("(?:^|;)\\s*".concat(name2, "\\s*=\\s*([^;]+)"));
  var matches = regex.exec(rawString);
  return matches ? matches[1] : void 0;
}
function safeTruncate(candidate, length, suffix) {
  if (suffix === void 0) {
    suffix = "";
  }
  var lastChar = candidate.charCodeAt(length - 1);
  var isLastCharSurrogatePair = lastChar >= 55296 && lastChar <= 56319;
  var correctedLength = isLastCharSurrogatePair ? length + 1 : length;
  if (candidate.length <= correctedLength)
    return candidate;
  return "".concat(candidate.slice(0, correctedLength)).concat(suffix);
}
function addEventListener(emitter, event, listener, options) {
  return addEventListeners(emitter, [event], listener, options);
}
function addEventListeners(emitter, events, listener, _a2) {
  var _b = _a2 === void 0 ? {} : _a2, once = _b.once, capture = _b.capture, passive = _b.passive;
  var wrappedListener = monitor(once ? function(event) {
    stop();
    listener(event);
  } : listener);
  var options = passive ? { capture, passive } : capture;
  events.forEach(function(event) {
    return emitter.addEventListener(event, wrappedListener, options);
  });
  var stop = function() {
    return events.forEach(function(event) {
      return emitter.removeEventListener(event, wrappedListener, options);
    });
  };
  return {
    stop
  };
}
function getType(value) {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  return typeof value;
}
function createCircularReferenceChecker() {
  if (typeof WeakSet !== "undefined") {
    var set_1 = /* @__PURE__ */ new WeakSet();
    return {
      hasAlreadyBeenSeen: function(value) {
        var has = set_1.has(value);
        if (!has) {
          set_1.add(value);
        }
        return has;
      }
    };
  }
  var array = [];
  return {
    hasAlreadyBeenSeen: function(value) {
      var has = array.indexOf(value) >= 0;
      if (!has) {
        array.push(value);
      }
      return has;
    }
  };
}
function mergeInto(destination, source, circularReferenceChecker) {
  if (circularReferenceChecker === void 0) {
    circularReferenceChecker = createCircularReferenceChecker();
  }
  if (source === void 0) {
    return destination;
  }
  if (typeof source !== "object" || source === null) {
    return source;
  } else if (source instanceof Date) {
    return new Date(source.getTime());
  } else if (source instanceof RegExp) {
    var flags = source.flags || [
      source.global ? "g" : "",
      source.ignoreCase ? "i" : "",
      source.multiline ? "m" : "",
      source.sticky ? "y" : "",
      source.unicode ? "u" : ""
    ].join("");
    return new RegExp(source.source, flags);
  }
  if (circularReferenceChecker.hasAlreadyBeenSeen(source)) {
    return void 0;
  } else if (Array.isArray(source)) {
    var merged_1 = Array.isArray(destination) ? destination : [];
    for (var i = 0; i < source.length; ++i) {
      merged_1[i] = mergeInto(merged_1[i], source[i], circularReferenceChecker);
    }
    return merged_1;
  }
  var merged = getType(destination) === "object" ? destination : {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      merged[key] = mergeInto(merged[key], source[key], circularReferenceChecker);
    }
  }
  return merged;
}
function deepClone(value) {
  return mergeInto(void 0, value);
}
function combine() {
  var sources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }
  var destination;
  for (var _a2 = 0, sources_1 = sources; _a2 < sources_1.length; _a2++) {
    var source = sources_1[_a2];
    if (source === void 0 || source === null) {
      continue;
    }
    destination = mergeInto(destination, source);
  }
  return destination;
}
function removeDuplicates(array) {
  var set = /* @__PURE__ */ new Set();
  array.forEach(function(item) {
    return set.add(item);
  });
  return arrayFrom(set);
}
var COOKIE_ACCESS_DELAY = ONE_SECOND;
function setCookie(name2, value, expireDelay, options) {
  var date = new Date();
  date.setTime(date.getTime() + expireDelay);
  var expires = "expires=".concat(date.toUTCString());
  var sameSite = options && options.crossSite ? "none" : "strict";
  var domain = options && options.domain ? ";domain=".concat(options.domain) : "";
  var secure = options && options.secure ? ";secure" : "";
  document.cookie = "".concat(name2, "=").concat(value, ";").concat(expires, ";path=/;samesite=").concat(sameSite).concat(domain).concat(secure);
}
function getCookie(name2) {
  return findCommaSeparatedValue(document.cookie, name2);
}
function deleteCookie(name2, options) {
  setCookie(name2, "", 0, options);
}
function areCookiesAuthorized(options) {
  if (document.cookie === void 0 || document.cookie === null) {
    return false;
  }
  try {
    var testCookieName = "dd_cookie_test_".concat(generateUUID());
    var testCookieValue = "test";
    setCookie(testCookieName, testCookieValue, ONE_SECOND, options);
    var isCookieCorrectlySet = getCookie(testCookieName) === testCookieValue;
    deleteCookie(testCookieName, options);
    return isCookieCorrectlySet;
  } catch (error) {
    display.error(error);
    return false;
  }
}
var getCurrentSiteCache;
function getCurrentSite() {
  if (getCurrentSiteCache === void 0) {
    var testCookieName = "dd_site_test_".concat(generateUUID());
    var testCookieValue = "test";
    var domainLevels = window.location.hostname.split(".");
    var candidateDomain = domainLevels.pop();
    while (domainLevels.length && !getCookie(testCookieName)) {
      candidateDomain = "".concat(domainLevels.pop(), ".").concat(candidateDomain);
      setCookie(testCookieName, testCookieValue, ONE_SECOND, { domain: candidateDomain });
    }
    deleteCookie(testCookieName, { domain: candidateDomain });
    getCurrentSiteCache = candidateDomain;
  }
  return getCurrentSiteCache;
}
function catchUserErrors(fn, errorMsg) {
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    try {
      return fn.apply(void 0, args);
    } catch (err) {
      display.error(errorMsg, err);
    }
  };
}
var enabledExperimentalFeatures;
function updateExperimentalFeatures(enabledFeatures) {
  if (!Array.isArray(enabledFeatures)) {
    return;
  }
  if (!enabledExperimentalFeatures) {
    enabledExperimentalFeatures = new Set(enabledFeatures);
  }
  enabledFeatures.filter(function(flag) {
    return typeof flag === "string";
  }).forEach(function(flag) {
    enabledExperimentalFeatures.add(flag);
  });
}
function getExperimentalFeatures() {
  return enabledExperimentalFeatures || /* @__PURE__ */ new Set();
}
function dateNow() {
  return new Date().getTime();
}
function timeStampNow() {
  return dateNow();
}
function relativeNow() {
  return performance.now();
}
function clocksNow() {
  return { relative: relativeNow(), timeStamp: timeStampNow() };
}
function clocksOrigin() {
  return { relative: 0, timeStamp: getNavigationStart() };
}
function elapsed(start, end) {
  return end - start;
}
function getRelativeTime(timestamp) {
  return timestamp - getNavigationStart();
}
var navigationStart;
function getNavigationStart() {
  if (navigationStart === void 0) {
    navigationStart = performance.timing.navigationStart;
  }
  return navigationStart;
}
function normalizeUrl(url) {
  return buildUrl(url, getLocationOrigin()).href;
}
function buildUrl(url, base) {
  if (checkURLSupported()) {
    return base !== void 0 ? new URL(url, base) : new URL(url);
  }
  if (base === void 0 && !/:/.test(url)) {
    throw new Error("Invalid URL: '".concat(url, "'"));
  }
  var doc = document;
  var anchorElement = doc.createElement("a");
  if (base !== void 0) {
    doc = document.implementation.createHTMLDocument("");
    var baseElement = doc.createElement("base");
    baseElement.href = base;
    doc.head.appendChild(baseElement);
    doc.body.appendChild(anchorElement);
  }
  anchorElement.href = url;
  return anchorElement;
}
var isURLSupported;
function checkURLSupported() {
  if (isURLSupported !== void 0) {
    return isURLSupported;
  }
  try {
    var url = new URL("http://test/path");
    isURLSupported = url.href === "http://test/path";
    return isURLSupported;
  } catch (_a2) {
    isURLSupported = false;
  }
  return isURLSupported;
}
var INTAKE_SITE_STAGING = "datad0g.com";
var INTAKE_SITE_US1 = "datadoghq.com";
var INTAKE_SITE_US1_FED = "ddog-gov.com";
var ENDPOINTS = {
  logs: "logs",
  rum: "rum",
  sessionReplay: "session-replay"
};
var INTAKE_TRACKS = {
  logs: "logs",
  rum: "rum",
  sessionReplay: "replay"
};
function createEndpointBuilder(initConfiguration, endpointType, tags) {
  var _a2 = initConfiguration.site, site = _a2 === void 0 ? INTAKE_SITE_US1 : _a2, clientToken = initConfiguration.clientToken;
  var domainParts = site.split(".");
  var extension = domainParts.pop();
  var host = "".concat(ENDPOINTS[endpointType], ".browser-intake-").concat(domainParts.join("-"), ".").concat(extension);
  var baseUrl = "https://".concat(host, "/api/v2/").concat(INTAKE_TRACKS[endpointType]);
  var proxyUrl = initConfiguration.proxyUrl && normalizeUrl(initConfiguration.proxyUrl);
  return {
    build: function() {
      var parameters = "ddsource=browser" + "&ddtags=".concat(encodeURIComponent(["sdk_version:".concat("4.17.2")].concat(tags).join(","))) + "&dd-api-key=".concat(clientToken) + "&dd-evp-origin-version=".concat(encodeURIComponent("4.17.2")) + "&dd-evp-origin=browser" + "&dd-request-id=".concat(generateUUID());
      if (endpointType === "rum") {
        parameters += "&batch_time=".concat(timeStampNow());
      }
      var endpointUrl = "".concat(baseUrl, "?").concat(parameters);
      return proxyUrl ? "".concat(proxyUrl, "?ddforward=").concat(encodeURIComponent(endpointUrl)) : endpointUrl;
    },
    buildIntakeUrl: function() {
      return proxyUrl ? "".concat(proxyUrl, "?ddforward") : baseUrl;
    },
    endpointType
  };
}
var TAG_SIZE_LIMIT = 200;
function buildTags(configuration) {
  var env = configuration.env, service = configuration.service, version = configuration.version, datacenter = configuration.datacenter;
  var tags = [];
  if (env) {
    tags.push(buildTag("env", env));
  }
  if (service) {
    tags.push(buildTag("service", service));
  }
  if (version) {
    tags.push(buildTag("version", version));
  }
  if (datacenter) {
    tags.push(buildTag("datacenter", datacenter));
  }
  return tags;
}
var FORBIDDEN_CHARACTERS = /[^a-z0-9_:./-]/;
function buildTag(key, rawValue) {
  var valueSizeLimit = TAG_SIZE_LIMIT - key.length - 1;
  if (rawValue.length > valueSizeLimit || FORBIDDEN_CHARACTERS.test(rawValue)) {
    display.warn("".concat(key, " value doesn't meet tag requirements and will be sanitized"));
  }
  var sanitizedValue = rawValue.replace(/,/g, "_");
  return "".concat(key, ":").concat(sanitizedValue);
}
function computeTransportConfiguration(initConfiguration) {
  var tags = buildTags(initConfiguration);
  var endpointBuilders = computeEndpointBuilders(initConfiguration, tags);
  var intakeEndpoints = objectValues(endpointBuilders).map(function(builder) {
    return builder.buildIntakeUrl();
  });
  var replicaConfiguration = computeReplicaConfiguration(initConfiguration, intakeEndpoints, tags);
  return assign({
    isIntakeUrl: function(url) {
      return intakeEndpoints.some(function(intakeEndpoint) {
        return url.indexOf(intakeEndpoint) === 0;
      });
    },
    replica: replicaConfiguration,
    site: initConfiguration.site || INTAKE_SITE_US1
  }, endpointBuilders);
}
function computeEndpointBuilders(initConfiguration, tags) {
  return {
    logsEndpointBuilder: createEndpointBuilder(initConfiguration, "logs", tags),
    rumEndpointBuilder: createEndpointBuilder(initConfiguration, "rum", tags),
    sessionReplayEndpointBuilder: createEndpointBuilder(initConfiguration, "sessionReplay", tags)
  };
}
function computeReplicaConfiguration(initConfiguration, intakeEndpoints, tags) {
  if (!initConfiguration.replica) {
    return;
  }
  var replicaConfiguration = assign({}, initConfiguration, {
    site: INTAKE_SITE_US1,
    clientToken: initConfiguration.replica.clientToken
  });
  var replicaEndpointBuilders = {
    logsEndpointBuilder: createEndpointBuilder(replicaConfiguration, "logs", tags),
    rumEndpointBuilder: createEndpointBuilder(replicaConfiguration, "rum", tags)
  };
  intakeEndpoints.push.apply(intakeEndpoints, objectValues(replicaEndpointBuilders).map(function(builder) {
    return builder.buildIntakeUrl();
  }));
  return assign({ applicationId: initConfiguration.replica.applicationId }, replicaEndpointBuilders);
}
function validateAndBuildConfiguration(initConfiguration) {
  var _a2, _b;
  if (!initConfiguration || !initConfiguration.clientToken) {
    display.error("Client Token is not configured, we will not send any data.");
    return;
  }
  if (initConfiguration.sampleRate !== void 0 && !isPercentage(initConfiguration.sampleRate)) {
    display.error("Sample Rate should be a number between 0 and 100");
    return;
  }
  if (initConfiguration.telemetrySampleRate !== void 0 && !isPercentage(initConfiguration.telemetrySampleRate)) {
    display.error("Telemetry Sample Rate should be a number between 0 and 100");
    return;
  }
  updateExperimentalFeatures(initConfiguration.enableExperimentalFeatures);
  return assign({
    beforeSend: initConfiguration.beforeSend && catchUserErrors(initConfiguration.beforeSend, "beforeSend threw an error:"),
    cookieOptions: buildCookieOptions(initConfiguration),
    sampleRate: (_a2 = initConfiguration.sampleRate) !== null && _a2 !== void 0 ? _a2 : 100,
    telemetrySampleRate: (_b = initConfiguration.telemetrySampleRate) !== null && _b !== void 0 ? _b : 20,
    service: initConfiguration.service,
    silentMultipleInit: !!initConfiguration.silentMultipleInit,
    batchBytesLimit: 16 * ONE_KILO_BYTE,
    eventRateLimiterThreshold: 3e3,
    maxTelemetryEventsPerPage: 15,
    flushTimeout: 30 * ONE_SECOND,
    batchMessagesLimit: 50,
    messageBytesLimit: 256 * ONE_KILO_BYTE
  }, computeTransportConfiguration(initConfiguration));
}
function buildCookieOptions(initConfiguration) {
  var cookieOptions = {};
  cookieOptions.secure = mustUseSecureCookie(initConfiguration);
  cookieOptions.crossSite = !!initConfiguration.useCrossSiteSessionCookie;
  if (initConfiguration.trackSessionAcrossSubdomains) {
    cookieOptions.domain = getCurrentSite();
  }
  return cookieOptions;
}
function mustUseSecureCookie(initConfiguration) {
  return !!initConfiguration.useSecureSessionCookie || !!initConfiguration.useCrossSiteSessionCookie;
}
var UNKNOWN_FUNCTION = "?";
function computeStackTrace(ex) {
  var stack = [];
  var stackProperty = tryToGetString(ex, "stack");
  if (stackProperty) {
    stackProperty.split("\n").forEach(function(line) {
      var stackFrame = parseChromeLine(line) || parseChromeAnonymousLine(line) || parseWinLine(line) || parseGeckoLine(line);
      if (stackFrame) {
        if (!stackFrame.func && stackFrame.line) {
          stackFrame.func = UNKNOWN_FUNCTION;
        }
        stack.push(stackFrame);
      }
    });
  }
  return {
    message: tryToGetString(ex, "message"),
    name: tryToGetString(ex, "name"),
    stack
  };
}
var fileUrl = "((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\\w+\\.|\\/).*?)";
var filePosition = "(?::(\\d+))";
var CHROME_LINE_RE = new RegExp("^\\s*at (.*?) ?\\(".concat(fileUrl).concat(filePosition, "?").concat(filePosition, "?\\)?\\s*$"), "i");
var CHROME_EVAL_RE = new RegExp("\\((\\S*)".concat(filePosition).concat(filePosition, "\\)"));
function parseChromeLine(line) {
  var parts = CHROME_LINE_RE.exec(line);
  if (!parts) {
    return;
  }
  var isNative = parts[2] && parts[2].indexOf("native") === 0;
  var isEval = parts[2] && parts[2].indexOf("eval") === 0;
  var submatch = CHROME_EVAL_RE.exec(parts[2]);
  if (isEval && submatch) {
    parts[2] = submatch[1];
    parts[3] = submatch[2];
    parts[4] = submatch[3];
  }
  return {
    args: isNative ? [parts[2]] : [],
    column: parts[4] ? +parts[4] : void 0,
    func: parts[1] || UNKNOWN_FUNCTION,
    line: parts[3] ? +parts[3] : void 0,
    url: !isNative ? parts[2] : void 0
  };
}
var CHROME_ANONYMOUS_FUNCTION_RE = new RegExp("^\\s*at ?".concat(fileUrl).concat(filePosition, "?").concat(filePosition, "??\\s*$"), "i");
function parseChromeAnonymousLine(line) {
  var parts = CHROME_ANONYMOUS_FUNCTION_RE.exec(line);
  if (!parts) {
    return;
  }
  return {
    args: [],
    column: parts[3] ? +parts[3] : void 0,
    func: UNKNOWN_FUNCTION,
    line: parts[2] ? +parts[2] : void 0,
    url: parts[1]
  };
}
var WINJS_LINE_RE = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
function parseWinLine(line) {
  var parts = WINJS_LINE_RE.exec(line);
  if (!parts) {
    return;
  }
  return {
    args: [],
    column: parts[4] ? +parts[4] : void 0,
    func: parts[1] || UNKNOWN_FUNCTION,
    line: +parts[3],
    url: parts[2]
  };
}
var GECKO_LINE_RE = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|capacitor|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
var GECKO_EVAL_RE = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
function parseGeckoLine(line) {
  var parts = GECKO_LINE_RE.exec(line);
  if (!parts) {
    return;
  }
  var isEval = parts[3] && parts[3].indexOf(" > eval") > -1;
  var submatch = GECKO_EVAL_RE.exec(parts[3]);
  if (isEval && submatch) {
    parts[3] = submatch[1];
    parts[4] = submatch[2];
    parts[5] = void 0;
  }
  return {
    args: parts[2] ? parts[2].split(",") : [],
    column: parts[5] ? +parts[5] : void 0,
    func: parts[1] || UNKNOWN_FUNCTION,
    line: parts[4] ? +parts[4] : void 0,
    url: parts[3]
  };
}
function tryToGetString(candidate, property) {
  if (typeof candidate !== "object" || !candidate || !(property in candidate)) {
    return void 0;
  }
  var value = candidate[property];
  return typeof value === "string" ? value : void 0;
}
function instrumentMethod(object, method, instrumentationFactory) {
  var original = object[method];
  var instrumentation = instrumentationFactory(original);
  var instrumentationWrapper = function() {
    return instrumentation.apply(this, arguments);
  };
  object[method] = instrumentationWrapper;
  return {
    stop: function() {
      if (object[method] === instrumentationWrapper) {
        object[method] = original;
      } else {
        instrumentation = original;
      }
    }
  };
}
function instrumentMethodAndCallOriginal(object, method, _a2) {
  var before = _a2.before, after = _a2.after;
  return instrumentMethod(object, method, function(original) {
    return function() {
      var args = arguments;
      var result;
      if (before) {
        callMonitored(before, this, args);
      }
      if (typeof original === "function") {
        result = original.apply(this, args);
      }
      if (after) {
        callMonitored(after, this, args);
      }
      return result;
    };
  });
}
var ERROR_TYPES_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
function startUnhandledErrorCollection(callback) {
  var stopInstrumentingOnError = instrumentOnError(callback).stop;
  var stopInstrumentingOnUnhandledRejection = instrumentUnhandledRejection(callback).stop;
  return {
    stop: function() {
      stopInstrumentingOnError();
      stopInstrumentingOnUnhandledRejection();
    }
  };
}
function instrumentOnError(callback) {
  return instrumentMethodAndCallOriginal(window, "onerror", {
    before: function(message, url, lineNo, columnNo, errorObj) {
      var stack;
      if (errorObj) {
        stack = computeStackTrace(errorObj);
        callback(stack, errorObj);
      } else {
        var location_1 = {
          url,
          column: columnNo,
          line: lineNo
        };
        var name_1;
        var msg = message;
        if ({}.toString.call(message) === "[object String]") {
          var groups = ERROR_TYPES_RE.exec(msg);
          if (groups) {
            name_1 = groups[1];
            msg = groups[2];
          }
        }
        stack = {
          name: name_1,
          message: typeof msg === "string" ? msg : void 0,
          stack: [location_1]
        };
        callback(stack, message);
      }
    }
  });
}
function instrumentUnhandledRejection(callback) {
  return instrumentMethodAndCallOriginal(window, "onunhandledrejection", {
    before: function(e) {
      var reason = e.reason || "Empty reason";
      var stack = computeStackTrace(reason);
      callback(stack, reason);
    }
  });
}
var ErrorSource = {
  AGENT: "agent",
  CONSOLE: "console",
  CUSTOM: "custom",
  LOGGER: "logger",
  NETWORK: "network",
  SOURCE: "source",
  REPORT: "report"
};
function formatUnknownError(stackTrace, errorObject, nonErrorPrefix, handlingStack) {
  if (!stackTrace || stackTrace.message === void 0 && !(errorObject instanceof Error)) {
    return {
      message: "".concat(nonErrorPrefix, " ").concat(jsonStringify(errorObject)),
      stack: "No stack, consider using an instance of Error",
      handlingStack,
      type: stackTrace && stackTrace.name
    };
  }
  return {
    message: stackTrace.message || "Empty message",
    stack: toStackTraceString(stackTrace),
    handlingStack,
    type: stackTrace.name
  };
}
function toStackTraceString(stack) {
  var result = formatErrorMessage(stack);
  stack.stack.forEach(function(frame) {
    var func = frame.func === "?" ? "<anonymous>" : frame.func;
    var args = frame.args && frame.args.length > 0 ? "(".concat(frame.args.join(", "), ")") : "";
    var line = frame.line ? ":".concat(frame.line) : "";
    var column = frame.line && frame.column ? ":".concat(frame.column) : "";
    result += "\n  at ".concat(func).concat(args, " @ ").concat(frame.url).concat(line).concat(column);
  });
  return result;
}
function getFileFromStackTraceString(stack) {
  var _a2;
  return (_a2 = /@ (.+)/.exec(stack)) === null || _a2 === void 0 ? void 0 : _a2[1];
}
function formatErrorMessage(stack) {
  return "".concat(stack.name || "Error", ": ").concat(stack.message);
}
function createHandlingStack() {
  var internalFramesToSkip = 2;
  var error = new Error();
  var formattedStack;
  if (!error.stack) {
    try {
      throw error;
    } catch (e) {
    }
  }
  callMonitored(function() {
    var stackTrace = computeStackTrace(error);
    stackTrace.stack = stackTrace.stack.slice(internalFramesToSkip);
    formattedStack = toStackTraceString(stackTrace);
  });
  return formattedStack;
}
function trackRuntimeError(errorObservable) {
  return startUnhandledErrorCollection(function(stackTrace, errorObject) {
    var _a2 = formatUnknownError(stackTrace, errorObject, "Uncaught"), stack = _a2.stack, message = _a2.message, type2 = _a2.type;
    errorObservable.notify({
      message,
      stack,
      type: type2,
      source: ErrorSource.SOURCE,
      startClocks: clocksNow(),
      originalError: errorObject,
      handling: "unhandled"
    });
  });
}
function makePublicApi(stub) {
  var publicApi = assign({
    version: "4.17.2",
    onReady: function(callback) {
      callback();
    }
  }, stub);
  Object.defineProperty(publicApi, "_setDebug", {
    get: function() {
      return setDebugMode;
    },
    enumerable: false
  });
  return publicApi;
}
function defineGlobal(global, name2, api) {
  var existingGlobalVariable = global[name2];
  global[name2] = api;
  if (existingGlobalVariable && existingGlobalVariable.q) {
    existingGlobalVariable.q.forEach(function(fn) {
      return catchUserErrors(fn, "onReady callback threw an error:")();
    });
  }
}
var Observable = function() {
  function Observable2(onFirstSubscribe) {
    this.onFirstSubscribe = onFirstSubscribe;
    this.observers = [];
  }
  Observable2.prototype.subscribe = function(f2) {
    var _this = this;
    if (!this.observers.length && this.onFirstSubscribe) {
      this.onLastUnsubscribe = this.onFirstSubscribe() || void 0;
    }
    this.observers.push(f2);
    return {
      unsubscribe: function() {
        _this.observers = _this.observers.filter(function(other) {
          return f2 !== other;
        });
        if (!_this.observers.length && _this.onLastUnsubscribe) {
          _this.onLastUnsubscribe();
        }
      }
    };
  };
  Observable2.prototype.notify = function(data) {
    this.observers.forEach(function(observer) {
      return observer(data);
    });
  };
  return Observable2;
}();
function mergeObservables() {
  var observables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }
  var globalObservable = new Observable(function() {
    var subscriptions = observables.map(function(observable) {
      return observable.subscribe(function(data) {
        return globalObservable.notify(data);
      });
    });
    return function() {
      return subscriptions.forEach(function(subscription) {
        return subscription.unsubscribe();
      });
    };
  });
  return globalObservable;
}
var RawReportType = {
  intervention: "intervention",
  deprecation: "deprecation",
  cspViolation: "csp_violation"
};
function initReportObservable(apis) {
  var observables = [];
  if (includes(apis, RawReportType.cspViolation)) {
    observables.push(createCspViolationReportObservable());
  }
  var reportTypes = apis.filter(function(api) {
    return api !== RawReportType.cspViolation;
  });
  if (reportTypes.length) {
    observables.push(createReportObservable(reportTypes));
  }
  return mergeObservables.apply(void 0, observables);
}
function createReportObservable(reportTypes) {
  var observable = new Observable(function() {
    if (!window.ReportingObserver) {
      return;
    }
    var handleReports = monitor(function(reports) {
      return reports.forEach(function(report) {
        observable.notify(buildRawReportFromReport(report));
      });
    });
    var observer = new window.ReportingObserver(handleReports, {
      types: reportTypes,
      buffered: true
    });
    observer.observe();
    return function() {
      observer.disconnect();
    };
  });
  return observable;
}
function createCspViolationReportObservable() {
  var observable = new Observable(function() {
    var handleCspViolation = monitor(function(event) {
      observable.notify(buildRawReportFromCspViolation(event));
    });
    var stop = addEventListener(document, "securitypolicyviolation", handleCspViolation).stop;
    return stop;
  });
  return observable;
}
function buildRawReportFromReport(_a2) {
  var type2 = _a2.type, body = _a2.body;
  return {
    type: type2,
    subtype: body.id,
    message: "".concat(type2, ": ").concat(body.message),
    stack: buildStack(body.id, body.message, body.sourceFile, body.lineNumber, body.columnNumber)
  };
}
function buildRawReportFromCspViolation(event) {
  var type2 = RawReportType.cspViolation;
  var message = "'".concat(event.blockedURI, "' blocked by '").concat(event.effectiveDirective, "' directive");
  return {
    type: RawReportType.cspViolation,
    subtype: event.effectiveDirective,
    message: "".concat(type2, ": ").concat(message),
    stack: buildStack(event.effectiveDirective, "".concat(message, ' of the policy "').concat(safeTruncate(event.originalPolicy, 100, "..."), '"'), event.sourceFile, event.lineNumber, event.columnNumber)
  };
}
function buildStack(name2, message, sourceFile, lineNumber, columnNumber) {
  return sourceFile && toStackTraceString({
    name: name2,
    message,
    stack: [
      {
        func: "?",
        url: sourceFile,
        line: lineNumber,
        column: columnNumber
      }
    ]
  });
}
var ALLOWED_FRAME_URLS = [
  "https://www.datadoghq-browser-agent.com",
  "https://www.datad0g-browser-agent.com",
  "http://localhost",
  "<anonymous>"
];
var TELEMETRY_EXCLUDED_SITES = [INTAKE_SITE_US1_FED];
var telemetryConfiguration = { maxEventsPerPage: 0, sentEventCount: 0, telemetryEnabled: false };
var onRawTelemetryEventCollected;
function startTelemetry(configuration) {
  var contextProvider;
  var observable = new Observable();
  telemetryConfiguration.telemetryEnabled = performDraw(configuration.telemetrySampleRate);
  onRawTelemetryEventCollected = function(event) {
    if (!includes(TELEMETRY_EXCLUDED_SITES, configuration.site) && telemetryConfiguration.telemetryEnabled) {
      observable.notify(toTelemetryEvent(event));
    }
  };
  startMonitorErrorCollection(addTelemetryError);
  assign(telemetryConfiguration, {
    maxEventsPerPage: configuration.maxTelemetryEventsPerPage,
    sentEventCount: 0
  });
  function toTelemetryEvent(event) {
    return combine({
      type: "telemetry",
      date: timeStampNow(),
      service: "browser-sdk",
      version: "4.17.2",
      source: "browser",
      _dd: {
        format_version: 2
      },
      telemetry: event,
      experimental_features: arrayFrom(getExperimentalFeatures())
    }, contextProvider !== void 0 ? contextProvider() : {});
  }
  return {
    setContextProvider: function(provider) {
      contextProvider = provider;
    },
    observable
  };
}
function isTelemetryReplicationAllowed(configuration) {
  return configuration.site === INTAKE_SITE_STAGING;
}
function addTelemetryDebug(message, context) {
  displayIfDebugEnabled(ConsoleApiName.debug, message, context);
  addTelemetry(assign({
    message,
    status: "debug"
  }, context));
}
function addTelemetryError(e) {
  addTelemetry(assign({
    status: "error"
  }, formatError(e)));
}
function addTelemetry(event) {
  if (onRawTelemetryEventCollected && telemetryConfiguration.sentEventCount < telemetryConfiguration.maxEventsPerPage) {
    telemetryConfiguration.sentEventCount += 1;
    onRawTelemetryEventCollected(event);
  }
}
function formatError(e) {
  if (e instanceof Error) {
    var stackTrace = computeStackTrace(e);
    return {
      error: {
        kind: stackTrace.name,
        stack: toStackTraceString(scrubCustomerFrames(stackTrace))
      },
      message: stackTrace.message
    };
  }
  return {
    error: {
      stack: "Not an instance of error"
    },
    message: "Uncaught ".concat(jsonStringify(e))
  };
}
function scrubCustomerFrames(stackTrace) {
  stackTrace.stack = stackTrace.stack.filter(function(frame) {
    return !frame.url || ALLOWED_FRAME_URLS.some(function(allowedFrameUrl) {
      return startsWith(frame.url, allowedFrameUrl);
    });
  });
  return stackTrace;
}
var END_OF_TIMES = Infinity;
var CLEAR_OLD_CONTEXTS_INTERVAL = ONE_MINUTE;
var ContextHistory = function() {
  function ContextHistory2(expireDelay) {
    var _this = this;
    this.expireDelay = expireDelay;
    this.entries = [];
    this.clearOldContextsInterval = setInterval(function() {
      return _this.clearOldContexts();
    }, CLEAR_OLD_CONTEXTS_INTERVAL);
  }
  ContextHistory2.prototype.add = function(context, startTime) {
    var _this = this;
    var entry = {
      context,
      startTime,
      endTime: END_OF_TIMES,
      remove: function() {
        var index2 = _this.entries.indexOf(entry);
        if (index2 >= 0) {
          _this.entries.splice(index2, 1);
        }
      },
      close: function(endTime) {
        entry.endTime = endTime;
      }
    };
    this.entries.unshift(entry);
    return entry;
  };
  ContextHistory2.prototype.find = function(startTime) {
    if (startTime === void 0) {
      startTime = END_OF_TIMES;
    }
    for (var _i = 0, _a2 = this.entries; _i < _a2.length; _i++) {
      var entry = _a2[_i];
      if (entry.startTime <= startTime) {
        if (startTime <= entry.endTime) {
          return entry.context;
        }
        break;
      }
    }
  };
  ContextHistory2.prototype.closeActive = function(endTime) {
    var latestEntry = this.entries[0];
    if (latestEntry && latestEntry.endTime === END_OF_TIMES) {
      latestEntry.close(endTime);
    }
  };
  ContextHistory2.prototype.findAll = function(startTime) {
    if (startTime === void 0) {
      startTime = END_OF_TIMES;
    }
    return this.entries.filter(function(entry) {
      return entry.startTime <= startTime && startTime <= entry.endTime;
    }).map(function(entry) {
      return entry.context;
    });
  };
  ContextHistory2.prototype.reset = function() {
    this.entries = [];
  };
  ContextHistory2.prototype.stop = function() {
    clearInterval(this.clearOldContextsInterval);
  };
  ContextHistory2.prototype.clearOldContexts = function() {
    var oldTimeThreshold = relativeNow() - this.expireDelay;
    while (this.entries.length > 0 && this.entries[this.entries.length - 1].endTime < oldTimeThreshold) {
      this.entries.pop();
    }
  };
  return ContextHistory2;
}();
function isChromium() {
  return !!window.chrome || /HeadlessChrome/.test(window.navigator.userAgent);
}
var SESSION_TIME_OUT_DELAY = 4 * ONE_HOUR;
var SESSION_EXPIRATION_DELAY = 15 * ONE_MINUTE;
var SESSION_ENTRY_REGEXP = /^([a-z]+)=([a-z0-9-]+)$/;
var SESSION_ENTRY_SEPARATOR = "&";
var SESSION_COOKIE_NAME = "_dd_s";
var LOCK_RETRY_DELAY = 10;
var MAX_NUMBER_OF_LOCK_RETRIES = 100;
var bufferedOperations = [];
var ongoingOperations;
function withCookieLockAccess(operations, numberOfRetries) {
  var _a2;
  if (numberOfRetries === void 0) {
    numberOfRetries = 0;
  }
  if (!ongoingOperations) {
    ongoingOperations = operations;
  }
  if (operations !== ongoingOperations) {
    bufferedOperations.push(operations);
    return;
  }
  if (numberOfRetries >= MAX_NUMBER_OF_LOCK_RETRIES) {
    next();
    return;
  }
  var currentLock;
  var currentSession = retrieveSession();
  if (isCookieLockEnabled()) {
    if (currentSession.lock) {
      retryLater(operations, numberOfRetries);
      return;
    }
    currentLock = generateUUID();
    currentSession.lock = currentLock;
    setSession(currentSession, operations.options);
    currentSession = retrieveSession();
    if (currentSession.lock !== currentLock) {
      retryLater(operations, numberOfRetries);
      return;
    }
  }
  var processedSession = operations.process(currentSession);
  if (isCookieLockEnabled()) {
    currentSession = retrieveSession();
    if (currentSession.lock !== currentLock) {
      retryLater(operations, numberOfRetries);
      return;
    }
  }
  if (processedSession) {
    persistSession(processedSession, operations.options);
  }
  if (isCookieLockEnabled()) {
    if (!(processedSession && isExpiredState(processedSession))) {
      currentSession = retrieveSession();
      if (currentSession.lock !== currentLock) {
        retryLater(operations, numberOfRetries);
        return;
      }
      delete currentSession.lock;
      setSession(currentSession, operations.options);
      processedSession = currentSession;
    }
  }
  (_a2 = operations.after) === null || _a2 === void 0 ? void 0 : _a2.call(operations, processedSession || currentSession);
  next();
}
function isCookieLockEnabled() {
  return isChromium();
}
function retryLater(operations, currentNumberOfRetries) {
  setTimeout(monitor(function() {
    withCookieLockAccess(operations, currentNumberOfRetries + 1);
  }), LOCK_RETRY_DELAY);
}
function next() {
  ongoingOperations = void 0;
  var nextOperations = bufferedOperations.shift();
  if (nextOperations) {
    withCookieLockAccess(nextOperations);
  }
}
function persistSession(session, options) {
  if (isExpiredState(session)) {
    clearSession(options);
    return;
  }
  session.expire = String(dateNow() + SESSION_EXPIRATION_DELAY);
  setSession(session, options);
}
function setSession(session, options) {
  setCookie(SESSION_COOKIE_NAME, toSessionString(session), SESSION_EXPIRATION_DELAY, options);
}
function toSessionString(session) {
  return objectEntries(session).map(function(_a2) {
    var key = _a2[0], value = _a2[1];
    return "".concat(key, "=").concat(value);
  }).join(SESSION_ENTRY_SEPARATOR);
}
function retrieveSession() {
  var sessionString = getCookie(SESSION_COOKIE_NAME);
  var session = {};
  if (isValidSessionString(sessionString)) {
    sessionString.split(SESSION_ENTRY_SEPARATOR).forEach(function(entry) {
      var matches = SESSION_ENTRY_REGEXP.exec(entry);
      if (matches !== null) {
        var key = matches[1], value = matches[2];
        session[key] = value;
      }
    });
  }
  return session;
}
function isValidSessionString(sessionString) {
  return sessionString !== void 0 && (sessionString.indexOf(SESSION_ENTRY_SEPARATOR) !== -1 || SESSION_ENTRY_REGEXP.test(sessionString));
}
function isExpiredState(session) {
  return isEmptyObject(session);
}
function clearSession(options) {
  setCookie(SESSION_COOKIE_NAME, "", 0, options);
}
var OLD_SESSION_COOKIE_NAME = "_dd";
var OLD_RUM_COOKIE_NAME = "_dd_r";
var OLD_LOGS_COOKIE_NAME = "_dd_l";
var RUM_SESSION_KEY = "rum";
var LOGS_SESSION_KEY$1 = "logs";
function tryOldCookiesMigration(options) {
  var sessionString = getCookie(SESSION_COOKIE_NAME);
  var oldSessionId = getCookie(OLD_SESSION_COOKIE_NAME);
  var oldRumType = getCookie(OLD_RUM_COOKIE_NAME);
  var oldLogsType = getCookie(OLD_LOGS_COOKIE_NAME);
  if (!sessionString) {
    var session = {};
    if (oldSessionId) {
      session.id = oldSessionId;
    }
    if (oldLogsType && /^[01]$/.test(oldLogsType)) {
      session[LOGS_SESSION_KEY$1] = oldLogsType;
    }
    if (oldRumType && /^[012]$/.test(oldRumType)) {
      session[RUM_SESSION_KEY] = oldRumType;
    }
    persistSession(session, options);
  }
}
function startSessionStore(options, productKey, computeSessionState2) {
  var renewObservable = new Observable();
  var expireObservable = new Observable();
  var watchSessionTimeoutId = setInterval(monitor(watchSession), COOKIE_ACCESS_DELAY);
  var sessionCache = retrieveActiveSession();
  function expandOrRenewSession() {
    var isTracked;
    withCookieLockAccess({
      options,
      process: function(cookieSession) {
        var synchronizedSession = synchronizeSession(cookieSession);
        isTracked = expandOrRenewCookie(synchronizedSession);
        return synchronizedSession;
      },
      after: function(cookieSession) {
        if (isTracked && !hasSessionInCache()) {
          renewSession(cookieSession);
        }
        sessionCache = cookieSession;
      }
    });
  }
  function expandSession() {
    withCookieLockAccess({
      options,
      process: function(cookieSession) {
        return hasSessionInCache() ? synchronizeSession(cookieSession) : void 0;
      }
    });
  }
  function watchSession() {
    withCookieLockAccess({
      options,
      process: function(cookieSession) {
        return !isActiveSession(cookieSession) ? {} : void 0;
      },
      after: synchronizeSession
    });
  }
  function synchronizeSession(cookieSession) {
    if (!isActiveSession(cookieSession)) {
      cookieSession = {};
    }
    if (hasSessionInCache()) {
      if (isSessionInCacheOutdated(cookieSession)) {
        expireSession();
      } else {
        sessionCache = cookieSession;
      }
    }
    return cookieSession;
  }
  function expandOrRenewCookie(cookieSession) {
    var _a2 = computeSessionState2(cookieSession[productKey]), trackingType = _a2.trackingType, isTracked = _a2.isTracked;
    cookieSession[productKey] = trackingType;
    if (isTracked && !cookieSession.id) {
      cookieSession.id = generateUUID();
      cookieSession.created = String(dateNow());
    }
    return isTracked;
  }
  function hasSessionInCache() {
    return sessionCache[productKey] !== void 0;
  }
  function isSessionInCacheOutdated(cookieSession) {
    return sessionCache.id !== cookieSession.id || sessionCache[productKey] !== cookieSession[productKey];
  }
  function expireSession() {
    sessionCache = {};
    expireObservable.notify();
  }
  function renewSession(cookieSession) {
    sessionCache = cookieSession;
    renewObservable.notify();
  }
  function retrieveActiveSession() {
    var session = retrieveSession();
    if (isActiveSession(session)) {
      return session;
    }
    return {};
  }
  function isActiveSession(session) {
    return (session.created === void 0 || dateNow() - Number(session.created) < SESSION_TIME_OUT_DELAY) && (session.expire === void 0 || dateNow() < Number(session.expire));
  }
  return {
    expandOrRenewSession: throttle(monitor(expandOrRenewSession), COOKIE_ACCESS_DELAY).throttled,
    expandSession,
    getSession: function() {
      return sessionCache;
    },
    renewObservable,
    expireObservable,
    stop: function() {
      clearInterval(watchSessionTimeoutId);
    }
  };
}
var VISIBILITY_CHECK_DELAY = ONE_MINUTE;
var SESSION_CONTEXT_TIMEOUT_DELAY = SESSION_TIME_OUT_DELAY;
function startSessionManager(options, productKey, computeSessionState2) {
  tryOldCookiesMigration(options);
  var sessionStore = startSessionStore(options, productKey, computeSessionState2);
  var sessionContextHistory = new ContextHistory(SESSION_CONTEXT_TIMEOUT_DELAY);
  sessionStore.renewObservable.subscribe(function() {
    sessionContextHistory.add(buildSessionContext(), relativeNow());
  });
  sessionStore.expireObservable.subscribe(function() {
    sessionContextHistory.closeActive(relativeNow());
  });
  sessionStore.expandOrRenewSession();
  sessionContextHistory.add(buildSessionContext(), clocksOrigin().relative);
  trackActivity(function() {
    return sessionStore.expandOrRenewSession();
  });
  trackVisibility(function() {
    return sessionStore.expandSession();
  });
  function buildSessionContext() {
    return {
      id: sessionStore.getSession().id,
      trackingType: sessionStore.getSession()[productKey]
    };
  }
  return {
    findActiveSession: function(startTime) {
      return sessionContextHistory.find(startTime);
    },
    renewObservable: sessionStore.renewObservable,
    expireObservable: sessionStore.expireObservable
  };
}
function trackActivity(expandOrRenewSession) {
  addEventListeners(window, ["click", "touchstart", "keydown", "scroll"], expandOrRenewSession, { capture: true, passive: true }).stop;
}
function trackVisibility(expandSession) {
  var expandSessionWhenVisible = monitor(function() {
    if (document.visibilityState === "visible") {
      expandSession();
    }
  });
  addEventListener(document, "visibilitychange", expandSessionWhenVisible).stop;
  setInterval(expandSessionWhenVisible, VISIBILITY_CHECK_DELAY);
}
var HttpRequest = function() {
  function HttpRequest2(endpointBuilder, bytesLimit) {
    this.endpointBuilder = endpointBuilder;
    this.bytesLimit = bytesLimit;
  }
  HttpRequest2.prototype.send = function(data, bytesCount) {
    var url = this.endpointBuilder.build();
    var canUseBeacon = !!navigator.sendBeacon && bytesCount < this.bytesLimit;
    if (canUseBeacon) {
      try {
        var isQueued = navigator.sendBeacon(url, data);
        if (isQueued) {
          return;
        }
      } catch (e) {
        reportBeaconError(e);
      }
    }
    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.send(data);
  };
  return HttpRequest2;
}();
var hasReportedBeaconError = false;
function reportBeaconError(e) {
  if (!hasReportedBeaconError) {
    hasReportedBeaconError = true;
    addTelemetryError(e);
  }
}
var HAS_MULTI_BYTES_CHARACTERS = /[^\u0000-\u007F]/;
var Batch = function() {
  function Batch2(request, batchMessagesLimit, batchBytesLimit, messageBytesLimit, flushTimeout, beforeUnloadCallback) {
    if (beforeUnloadCallback === void 0) {
      beforeUnloadCallback = noop;
    }
    this.request = request;
    this.batchMessagesLimit = batchMessagesLimit;
    this.batchBytesLimit = batchBytesLimit;
    this.messageBytesLimit = messageBytesLimit;
    this.flushTimeout = flushTimeout;
    this.beforeUnloadCallback = beforeUnloadCallback;
    this.pushOnlyBuffer = [];
    this.upsertBuffer = {};
    this.bufferBytesCount = 0;
    this.bufferMessagesCount = 0;
    this.flushOnVisibilityHidden();
    this.flushPeriodically();
  }
  Batch2.prototype.add = function(message) {
    this.addOrUpdate(message);
  };
  Batch2.prototype.upsert = function(message, key) {
    this.addOrUpdate(message, key);
  };
  Batch2.prototype.flush = function() {
    if (this.bufferMessagesCount !== 0) {
      var messages = this.pushOnlyBuffer.concat(objectValues(this.upsertBuffer));
      var bytesCount = this.bufferBytesCount;
      this.pushOnlyBuffer = [];
      this.upsertBuffer = {};
      this.bufferBytesCount = 0;
      this.bufferMessagesCount = 0;
      this.request.send(messages.join("\n"), bytesCount);
    }
  };
  Batch2.prototype.computeBytesCount = function(candidate) {
    if (!HAS_MULTI_BYTES_CHARACTERS.test(candidate)) {
      return candidate.length;
    }
    if (window.TextEncoder !== void 0) {
      return new TextEncoder().encode(candidate).length;
    }
    return new Blob([candidate]).size;
  };
  Batch2.prototype.addOrUpdate = function(message, key) {
    var _a2 = this.process(message), processedMessage = _a2.processedMessage, messageBytesCount = _a2.messageBytesCount;
    if (messageBytesCount >= this.messageBytesLimit) {
      display.warn("Discarded a message whose size was bigger than the maximum allowed size ".concat(this.messageBytesLimit, "KB."));
      return;
    }
    if (this.hasMessageFor(key)) {
      this.remove(key);
    }
    if (this.willReachedBytesLimitWith(messageBytesCount)) {
      this.flush();
    }
    this.push(processedMessage, messageBytesCount, key);
    if (this.isFull()) {
      this.flush();
    }
  };
  Batch2.prototype.process = function(message) {
    var processedMessage = jsonStringify(message);
    var messageBytesCount = this.computeBytesCount(processedMessage);
    return { processedMessage, messageBytesCount };
  };
  Batch2.prototype.push = function(processedMessage, messageBytesCount, key) {
    if (this.bufferMessagesCount > 0) {
      this.bufferBytesCount += 1;
    }
    if (key !== void 0) {
      this.upsertBuffer[key] = processedMessage;
    } else {
      this.pushOnlyBuffer.push(processedMessage);
    }
    this.bufferBytesCount += messageBytesCount;
    this.bufferMessagesCount += 1;
  };
  Batch2.prototype.remove = function(key) {
    var removedMessage = this.upsertBuffer[key];
    delete this.upsertBuffer[key];
    var messageBytesCount = this.computeBytesCount(removedMessage);
    this.bufferBytesCount -= messageBytesCount;
    this.bufferMessagesCount -= 1;
    if (this.bufferMessagesCount > 0) {
      this.bufferBytesCount -= 1;
    }
  };
  Batch2.prototype.hasMessageFor = function(key) {
    return key !== void 0 && this.upsertBuffer[key] !== void 0;
  };
  Batch2.prototype.willReachedBytesLimitWith = function(messageBytesCount) {
    return this.bufferBytesCount + messageBytesCount + 1 >= this.batchBytesLimit;
  };
  Batch2.prototype.isFull = function() {
    return this.bufferMessagesCount === this.batchMessagesLimit || this.bufferBytesCount >= this.batchBytesLimit;
  };
  Batch2.prototype.flushPeriodically = function() {
    var _this = this;
    setTimeout(monitor(function() {
      _this.flush();
      _this.flushPeriodically();
    }), this.flushTimeout);
  };
  Batch2.prototype.flushOnVisibilityHidden = function() {
    var _this = this;
    if (navigator.sendBeacon) {
      addEventListener(window, "beforeunload", this.beforeUnloadCallback);
      addEventListener(document, "visibilitychange", function() {
        if (document.visibilityState === "hidden") {
          _this.flush();
        }
      });
      addEventListener(window, "beforeunload", function() {
        return _this.flush();
      });
    }
  };
  return Batch2;
}();
function getEventBridge() {
  var eventBridgeGlobal = getEventBridgeGlobal();
  if (!eventBridgeGlobal) {
    return;
  }
  return {
    getAllowedWebViewHosts: function() {
      return JSON.parse(eventBridgeGlobal.getAllowedWebViewHosts());
    },
    send: function(eventType, event) {
      eventBridgeGlobal.send(JSON.stringify({ eventType, event }));
    }
  };
}
function canUseEventBridge(currentHost) {
  var _a2;
  if (currentHost === void 0) {
    currentHost = (_a2 = getGlobalObject().location) === null || _a2 === void 0 ? void 0 : _a2.hostname;
  }
  var bridge = getEventBridge();
  return !!bridge && bridge.getAllowedWebViewHosts().some(function(allowedHost) {
    return currentHost === allowedHost || endsWith(currentHost, ".".concat(allowedHost));
  });
}
function getEventBridgeGlobal() {
  return getGlobalObject().DatadogEventBridge;
}
function startBatchWithReplica(configuration, endpoint, replicaEndpoint) {
  var primaryBatch = createBatch(endpoint);
  var replicaBatch;
  if (replicaEndpoint) {
    replicaBatch = createBatch(replicaEndpoint);
  }
  function createBatch(endpointBuilder) {
    return new Batch(new HttpRequest(endpointBuilder, configuration.batchBytesLimit), configuration.batchMessagesLimit, configuration.batchBytesLimit, configuration.messageBytesLimit, configuration.flushTimeout);
  }
  return {
    add: function(message, replicated) {
      if (replicated === void 0) {
        replicated = true;
      }
      primaryBatch.add(message);
      if (replicaBatch && replicated) {
        replicaBatch.add(message);
      }
    }
  };
}
function createEventRateLimiter(eventType, limit, onLimitReached) {
  var eventCount = 0;
  var allowNextEvent = false;
  return {
    isLimitReached: function() {
      if (eventCount === 0) {
        setTimeout(function() {
          eventCount = 0;
        }, ONE_MINUTE);
      }
      eventCount += 1;
      if (eventCount <= limit || allowNextEvent) {
        allowNextEvent = false;
        return false;
      }
      if (eventCount === limit + 1) {
        allowNextEvent = true;
        try {
          onLimitReached({
            message: "Reached max number of ".concat(eventType, "s by minute: ").concat(limit),
            source: ErrorSource.AGENT,
            startClocks: clocksNow()
          });
        } finally {
          allowNextEvent = false;
        }
      }
      return true;
    }
  };
}
var xhrObservable;
var xhrContexts = /* @__PURE__ */ new WeakMap();
function initXhrObservable() {
  if (!xhrObservable) {
    xhrObservable = createXhrObservable();
  }
  return xhrObservable;
}
function createXhrObservable() {
  var observable = new Observable(function() {
    var stopInstrumentingStart = instrumentMethodAndCallOriginal(XMLHttpRequest.prototype, "open", {
      before: openXhr
    }).stop;
    var stopInstrumentingSend = instrumentMethodAndCallOriginal(XMLHttpRequest.prototype, "send", {
      before: function() {
        sendXhr.call(this, observable);
      }
    }).stop;
    var stopInstrumentingAbort = instrumentMethodAndCallOriginal(XMLHttpRequest.prototype, "abort", {
      before: abortXhr
    }).stop;
    return function() {
      stopInstrumentingStart();
      stopInstrumentingSend();
      stopInstrumentingAbort();
    };
  });
  return observable;
}
function openXhr(method, url) {
  xhrContexts.set(this, {
    state: "open",
    method,
    url: normalizeUrl(String(url))
  });
}
function sendXhr(observable) {
  var _this = this;
  var context = xhrContexts.get(this);
  if (!context) {
    return;
  }
  var startContext = context;
  startContext.state = "start";
  startContext.startTime = relativeNow();
  startContext.startClocks = clocksNow();
  startContext.isAborted = false;
  startContext.xhr = this;
  var hasBeenReported = false;
  var stopInstrumentingOnReadyStateChange = instrumentMethodAndCallOriginal(this, "onreadystatechange", {
    before: function() {
      if (this.readyState === XMLHttpRequest.DONE) {
        onEnd();
      }
    }
  }).stop;
  var onEnd = monitor(function() {
    _this.removeEventListener("loadend", onEnd);
    stopInstrumentingOnReadyStateChange();
    if (hasBeenReported) {
      return;
    }
    hasBeenReported = true;
    var completeContext = context;
    completeContext.state = "complete";
    completeContext.duration = elapsed(startContext.startClocks.timeStamp, timeStampNow());
    completeContext.status = _this.status;
    observable.notify(shallowClone(completeContext));
  });
  this.addEventListener("loadend", onEnd);
  observable.notify(startContext);
}
function abortXhr() {
  var context = xhrContexts.get(this);
  if (context) {
    context.isAborted = true;
  }
}
var fetchObservable;
function initFetchObservable() {
  if (!fetchObservable) {
    fetchObservable = createFetchObservable();
  }
  return fetchObservable;
}
function createFetchObservable() {
  var observable = new Observable(function() {
    if (!window.fetch) {
      return;
    }
    var stop = instrumentMethod(window, "fetch", function(originalFetch) {
      return function(input, init) {
        var responsePromise;
        var context = callMonitored(beforeSend, null, [observable, input, init]);
        if (context) {
          responsePromise = originalFetch.call(this, context.input, context.init);
          callMonitored(afterSend, null, [observable, responsePromise, context]);
        } else {
          responsePromise = originalFetch.call(this, input, init);
        }
        return responsePromise;
      };
    }).stop;
    return stop;
  });
  return observable;
}
function beforeSend(observable, input, init) {
  var method = init && init.method || typeof input === "object" && input.method || "GET";
  var url = normalizeUrl(typeof input === "object" && input.url || input);
  var startClocks = clocksNow();
  var context = {
    state: "start",
    init,
    input,
    method,
    startClocks,
    url
  };
  observable.notify(context);
  return context;
}
function afterSend(observable, responsePromise, startContext) {
  var reportFetch = function(response) {
    var context = startContext;
    context.state = "complete";
    context.duration = elapsed(context.startClocks.timeStamp, timeStampNow());
    if ("stack" in response || response instanceof Error) {
      context.status = 0;
      context.isAborted = response instanceof DOMException && response.code === DOMException.ABORT_ERR;
      context.error = response;
      observable.notify(context);
    } else if ("status" in response) {
      context.response = response;
      context.responseType = response.type;
      context.status = response.status;
      context.isAborted = false;
      observable.notify(context);
    }
  };
  responsePromise.then(monitor(reportFetch), monitor(reportFetch));
}
var consoleObservablesByApi = {};
function initConsoleObservable(apis) {
  var consoleObservables = apis.map(function(api) {
    if (!consoleObservablesByApi[api]) {
      consoleObservablesByApi[api] = createConsoleObservable(api);
    }
    return consoleObservablesByApi[api];
  });
  return mergeObservables.apply(void 0, consoleObservables);
}
function createConsoleObservable(api) {
  var observable = new Observable(function() {
    var originalConsoleApi = console[api];
    console[api] = function() {
      var params = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
      }
      originalConsoleApi.apply(console, params);
      var handlingStack = createHandlingStack();
      callMonitored(function() {
        observable.notify(buildConsoleLog(params, api, handlingStack));
      });
    };
    return function() {
      console[api] = originalConsoleApi;
    };
  });
  return observable;
}
function buildConsoleLog(params, api, handlingStack) {
  var message = params.map(function(param) {
    return formatConsoleParameters(param);
  }).join(" ");
  var stack;
  if (api === ConsoleApiName.error) {
    var firstErrorParam = find(params, function(param) {
      return param instanceof Error;
    });
    stack = firstErrorParam ? toStackTraceString(computeStackTrace(firstErrorParam)) : void 0;
    message = "console error: ".concat(message);
  }
  return {
    api,
    message,
    stack,
    handlingStack
  };
}
function formatConsoleParameters(param) {
  if (typeof param === "string") {
    return param;
  }
  if (param instanceof Error) {
    return formatErrorMessage(computeStackTrace(param));
  }
  return jsonStringify(param, void 0, 2);
}
var BUFFER_LIMIT = 500;
var BoundedBuffer = function() {
  function BoundedBuffer2() {
    this.buffer = [];
  }
  BoundedBuffer2.prototype.add = function(callback) {
    var length = this.buffer.push(callback);
    if (length > BUFFER_LIMIT) {
      this.buffer.splice(0, 1);
    }
  };
  BoundedBuffer2.prototype.drain = function() {
    this.buffer.forEach(function(callback) {
      return callback();
    });
    this.buffer.length = 0;
  };
  return BoundedBuffer2;
}();
function createContextManager() {
  var context = {};
  return {
    get: function() {
      return context;
    },
    add: function(key, value) {
      context[key] = value;
    },
    remove: function(key) {
      delete context[key];
    },
    set: function(newContext) {
      context = newContext;
    },
    getContext: function() {
      return deepClone(context);
    },
    setContext: function(newContext) {
      context = deepClone(newContext);
    },
    setContextProperty: function(key, property) {
      context[key] = deepClone(property);
    },
    removeContextProperty: function(key) {
      delete context[key];
    },
    clearContext: function() {
      context = {};
    }
  };
}
var SYNTHETICS_TEST_ID_COOKIE_NAME = "datadog-synthetics-public-id";
var SYNTHETICS_RESULT_ID_COOKIE_NAME = "datadog-synthetics-result-id";
var SYNTHETICS_INJECTS_RUM_COOKIE_NAME = "datadog-synthetics-injects-rum";
function willSyntheticsInjectRum() {
  return Boolean(window._DATADOG_SYNTHETICS_INJECTS_RUM || getCookie(SYNTHETICS_INJECTS_RUM_COOKIE_NAME));
}
function getSyntheticsTestId() {
  var value = window._DATADOG_SYNTHETICS_PUBLIC_ID || getCookie(SYNTHETICS_TEST_ID_COOKIE_NAME);
  return typeof value === "string" ? value : void 0;
}
function getSyntheticsResultId() {
  var value = window._DATADOG_SYNTHETICS_RESULT_ID || getCookie(SYNTHETICS_RESULT_ID_COOKIE_NAME);
  return typeof value === "string" ? value : void 0;
}
var DEFAULT_REQUEST_ERROR_RESPONSE_LENGTH_LIMIT = 32 * ONE_KILO_BYTE;
function validateAndBuildLogsConfiguration(initConfiguration) {
  var baseConfiguration = validateAndBuildConfiguration(initConfiguration);
  var forwardConsoleLogs = validateAndBuildForwardOption(initConfiguration.forwardConsoleLogs, objectValues(ConsoleApiName), "Forward Console Logs");
  var forwardReports = validateAndBuildForwardOption(initConfiguration.forwardReports, objectValues(RawReportType), "Forward Reports");
  if (!baseConfiguration || !forwardConsoleLogs || !forwardReports) {
    return;
  }
  if (initConfiguration.forwardErrorsToLogs && !includes(forwardConsoleLogs, ConsoleApiName.error)) {
    forwardConsoleLogs.push(ConsoleApiName.error);
  }
  return assign({
    forwardErrorsToLogs: initConfiguration.forwardErrorsToLogs !== false,
    forwardConsoleLogs,
    forwardReports,
    requestErrorResponseLengthLimit: DEFAULT_REQUEST_ERROR_RESPONSE_LENGTH_LIMIT
  }, baseConfiguration);
}
function validateAndBuildForwardOption(option, allowedValues, label) {
  if (option === void 0) {
    return [];
  }
  if (!(option === "all" || Array.isArray(option) && option.every(function(api) {
    return includes(allowedValues, api);
  }))) {
    display.error("".concat(label, ' should be "all" or an array with allowed values "').concat(allowedValues.join('", "'), '"'));
    return;
  }
  return option === "all" ? allowedValues : removeDuplicates(option);
}
var __decorate = globalThis && globalThis.__decorate || function(decorators, target, key, desc) {
  var c = arguments.length, r2 = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r2 = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r2 = (c < 3 ? d(r2) : c > 3 ? d(target, key, r2) : d(target, key)) || r2;
  return c > 3 && r2 && Object.defineProperty(target, key, r2), r2;
};
var StatusType = {
  debug: "debug",
  error: "error",
  info: "info",
  warn: "warn"
};
var HandlerType = {
  console: "console",
  http: "http",
  silent: "silent"
};
var STATUSES = Object.keys(StatusType);
var Logger = function() {
  function Logger2(handleLogStrategy, name2, handlerType, level, loggerContext) {
    if (handlerType === void 0) {
      handlerType = HandlerType.http;
    }
    if (level === void 0) {
      level = StatusType.debug;
    }
    if (loggerContext === void 0) {
      loggerContext = {};
    }
    this.handleLogStrategy = handleLogStrategy;
    this.handlerType = handlerType;
    this.level = level;
    this.contextManager = createContextManager();
    this.contextManager.set(assign({}, loggerContext, name2 ? { logger: { name: name2 } } : void 0));
  }
  Logger2.prototype.log = function(message, messageContext, status2) {
    if (status2 === void 0) {
      status2 = StatusType.info;
    }
    this.handleLogStrategy({ message, context: deepClone(messageContext), status: status2 }, this);
  };
  Logger2.prototype.debug = function(message, messageContext) {
    this.log(message, messageContext, StatusType.debug);
  };
  Logger2.prototype.info = function(message, messageContext) {
    this.log(message, messageContext, StatusType.info);
  };
  Logger2.prototype.warn = function(message, messageContext) {
    this.log(message, messageContext, StatusType.warn);
  };
  Logger2.prototype.error = function(message, messageContext) {
    var errorOrigin = {
      error: {
        origin: ErrorSource.LOGGER
      }
    };
    this.log(message, combine(errorOrigin, messageContext), StatusType.error);
  };
  Logger2.prototype.setContext = function(context) {
    this.contextManager.set(context);
  };
  Logger2.prototype.getContext = function() {
    return this.contextManager.get();
  };
  Logger2.prototype.addContext = function(key, value) {
    this.contextManager.add(key, value);
  };
  Logger2.prototype.removeContext = function(key) {
    this.contextManager.remove(key);
  };
  Logger2.prototype.setHandler = function(handler) {
    this.handlerType = handler;
  };
  Logger2.prototype.getHandler = function() {
    return this.handlerType;
  };
  Logger2.prototype.setLevel = function(level) {
    this.level = level;
  };
  Logger2.prototype.getLevel = function() {
    return this.level;
  };
  __decorate([
    monitored
  ], Logger2.prototype, "log", null);
  return Logger2;
}();
function makeLogsPublicApi(startLogsImpl) {
  var isAlreadyInitialized = false;
  var globalContextManager = createContextManager();
  var customLoggers = {};
  var getInternalContextStrategy = function() {
    return void 0;
  };
  var beforeInitLoggerLog = new BoundedBuffer();
  var handleLogStrategy = function(logsMessage, logger, savedCommonContext, date) {
    if (savedCommonContext === void 0) {
      savedCommonContext = deepClone(getCommonContext());
    }
    if (date === void 0) {
      date = timeStampNow();
    }
    beforeInitLoggerLog.add(function() {
      return handleLogStrategy(logsMessage, logger, savedCommonContext, date);
    });
  };
  var getInitConfigurationStrategy = function() {
    return void 0;
  };
  var mainLogger = new Logger(function() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      params[_i] = arguments[_i];
    }
    return handleLogStrategy.apply(void 0, params);
  });
  function getCommonContext() {
    return {
      view: {
        referrer: document.referrer,
        url: window.location.href
      },
      context: globalContextManager.get()
    };
  }
  return makePublicApi({
    logger: mainLogger,
    init: monitor(function(initConfiguration) {
      var _a2;
      if (canUseEventBridge()) {
        initConfiguration = overrideInitConfigurationForBridge(initConfiguration);
      }
      if (!canInitLogs(initConfiguration)) {
        return;
      }
      var configuration = validateAndBuildLogsConfiguration(initConfiguration);
      if (!configuration) {
        return;
      }
      _a2 = startLogsImpl(configuration, getCommonContext, mainLogger), handleLogStrategy = _a2.handleLog, getInternalContextStrategy = _a2.getInternalContext;
      getInitConfigurationStrategy = function() {
        return deepClone(initConfiguration);
      };
      beforeInitLoggerLog.drain();
      isAlreadyInitialized = true;
    }),
    getLoggerGlobalContext: monitor(globalContextManager.get),
    getGlobalContext: monitor(globalContextManager.getContext),
    setLoggerGlobalContext: monitor(globalContextManager.set),
    setGlobalContext: monitor(globalContextManager.setContext),
    addLoggerGlobalContext: monitor(globalContextManager.add),
    setGlobalContextProperty: monitor(globalContextManager.setContextProperty),
    removeLoggerGlobalContext: monitor(globalContextManager.remove),
    removeGlobalContextProperty: monitor(globalContextManager.removeContextProperty),
    clearGlobalContext: monitor(globalContextManager.clearContext),
    createLogger: monitor(function(name2, conf) {
      if (conf === void 0) {
        conf = {};
      }
      customLoggers[name2] = new Logger(function() {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          params[_i] = arguments[_i];
        }
        return handleLogStrategy.apply(void 0, params);
      }, name2, conf.handler, conf.level, conf.context);
      return customLoggers[name2];
    }),
    getLogger: monitor(function(name2) {
      return customLoggers[name2];
    }),
    getInitConfiguration: monitor(function() {
      return getInitConfigurationStrategy();
    }),
    getInternalContext: monitor(function(startTime) {
      return getInternalContextStrategy(startTime);
    })
  });
  function overrideInitConfigurationForBridge(initConfiguration) {
    return assign({}, initConfiguration, { clientToken: "empty" });
  }
  function canInitLogs(initConfiguration) {
    if (isAlreadyInitialized) {
      if (!initConfiguration.silentMultipleInit) {
        display.error("DD_LOGS is already initialized.");
      }
      return false;
    }
    return true;
  }
}
var LOGS_SESSION_KEY = "logs";
function startLogsSessionManager(configuration) {
  var sessionManager = startSessionManager(configuration.cookieOptions, LOGS_SESSION_KEY, function(rawTrackingType) {
    return computeSessionState(configuration, rawTrackingType);
  });
  return {
    findTrackedSession: function(startTime) {
      var session = sessionManager.findActiveSession(startTime);
      return session && session.trackingType === "1" ? {
        id: session.id
      } : void 0;
    }
  };
}
function startLogsSessionManagerStub(configuration) {
  var isTracked = computeTrackingType(configuration) === "1";
  var session = isTracked ? {} : void 0;
  return {
    findTrackedSession: function() {
      return session;
    }
  };
}
function computeTrackingType(configuration) {
  if (!performDraw(configuration.sampleRate)) {
    return "0";
  }
  return "1";
}
function computeSessionState(configuration, rawSessionType) {
  var trackingType = hasValidLoggerSession(rawSessionType) ? rawSessionType : computeTrackingType(configuration);
  return {
    trackingType,
    isTracked: trackingType === "1"
  };
}
function hasValidLoggerSession(trackingType) {
  return trackingType === "0" || trackingType === "1";
}
var _a$2;
var STATUS_PRIORITIES = (_a$2 = {}, _a$2[StatusType.debug] = 0, _a$2[StatusType.info] = 1, _a$2[StatusType.warn] = 2, _a$2[StatusType.error] = 3, _a$2);
function startLoggerCollection(lifeCycle) {
  function handleLog(logsMessage, logger, savedCommonContext, savedDate) {
    var messageContext = logsMessage.context;
    if (isAuthorized(logsMessage.status, HandlerType.console, logger)) {
      display(logsMessage.status, logsMessage.message, combine(logger.getContext(), messageContext));
    }
    lifeCycle.notify(0, {
      rawLogsEvent: {
        date: savedDate || timeStampNow(),
        message: logsMessage.message,
        status: logsMessage.status,
        origin: ErrorSource.LOGGER
      },
      messageContext,
      savedCommonContext,
      logger
    });
  }
  return {
    handleLog
  };
}
function isAuthorized(status2, handlerType, logger) {
  var loggerHandler = logger.getHandler();
  var sanitizedHandlerType = Array.isArray(loggerHandler) ? loggerHandler : [loggerHandler];
  return STATUS_PRIORITIES[status2] >= STATUS_PRIORITIES[logger.getLevel()] && includes(sanitizedHandlerType, handlerType);
}
function reportAgentError(error, lifeCycle) {
  lifeCycle.notify(0, {
    rawLogsEvent: {
      message: error.message,
      date: error.startClocks.timeStamp,
      error: {
        origin: ErrorSource.AGENT
      },
      origin: ErrorSource.AGENT,
      status: StatusType.error
    }
  });
}
function startLogsAssembly(sessionManager, configuration, lifeCycle, getCommonContext, mainLogger) {
  var statusWithCustom = STATUSES.concat(["custom"]);
  var logRateLimiters = {};
  statusWithCustom.forEach(function(status2) {
    logRateLimiters[status2] = createEventRateLimiter(status2, configuration.eventRateLimiterThreshold, function(error) {
      return reportAgentError(error, lifeCycle);
    });
  });
  lifeCycle.subscribe(0, function(_a2) {
    var _b, _c, _d;
    var rawLogsEvent = _a2.rawLogsEvent, _e = _a2.messageContext, messageContext = _e === void 0 ? void 0 : _e, _f = _a2.savedCommonContext, savedCommonContext = _f === void 0 ? void 0 : _f, _g = _a2.logger, logger = _g === void 0 ? mainLogger : _g;
    var startTime = getRelativeTime(rawLogsEvent.date);
    var session = sessionManager.findTrackedSession(startTime);
    if (!session) {
      return;
    }
    var commonContext = savedCommonContext || getCommonContext();
    var log = combine({ service: configuration.service, session_id: session.id, view: commonContext.view }, commonContext.context, getRUMInternalContext(startTime), rawLogsEvent, logger.getContext(), messageContext);
    if (!isAuthorized(rawLogsEvent.status, HandlerType.http, logger) || ((_b = configuration.beforeSend) === null || _b === void 0 ? void 0 : _b.call(configuration, log)) === false || ((_c = log.error) === null || _c === void 0 ? void 0 : _c.origin) !== ErrorSource.AGENT && ((_d = logRateLimiters[log.status]) !== null && _d !== void 0 ? _d : logRateLimiters["custom"]).isLimitReached()) {
      return;
    }
    lifeCycle.notify(1, log);
  });
}
var logsSentBeforeRumInjectionTelemetryAdded = false;
function getRUMInternalContext(startTime) {
  var browserWindow = window;
  if (willSyntheticsInjectRum()) {
    var context = getInternalContextFromRumGlobal(browserWindow.DD_RUM_SYNTHETICS);
    if (!context && !logsSentBeforeRumInjectionTelemetryAdded) {
      logsSentBeforeRumInjectionTelemetryAdded = true;
      addTelemetryDebug("Logs sent before RUM is injected by the synthetics worker", {
        testId: getSyntheticsTestId(),
        resultId: getSyntheticsResultId()
      });
    }
    return context;
  }
  return getInternalContextFromRumGlobal(browserWindow.DD_RUM);
  function getInternalContextFromRumGlobal(rumGlobal) {
    if (rumGlobal && rumGlobal.getInternalContext) {
      return rumGlobal.getInternalContext(startTime);
    }
  }
}
var _a$1;
var LogStatusForApi = (_a$1 = {}, _a$1[ConsoleApiName.log] = StatusType.info, _a$1[ConsoleApiName.debug] = StatusType.debug, _a$1[ConsoleApiName.info] = StatusType.info, _a$1[ConsoleApiName.warn] = StatusType.warn, _a$1[ConsoleApiName.error] = StatusType.error, _a$1);
function startConsoleCollection(configuration, lifeCycle) {
  var consoleSubscription = initConsoleObservable(configuration.forwardConsoleLogs).subscribe(function(log) {
    lifeCycle.notify(0, {
      rawLogsEvent: {
        date: timeStampNow(),
        message: log.message,
        origin: ErrorSource.CONSOLE,
        error: log.api === ConsoleApiName.error ? {
          origin: ErrorSource.CONSOLE,
          stack: log.stack
        } : void 0,
        status: LogStatusForApi[log.api]
      }
    });
  });
  return {
    stop: function() {
      consoleSubscription.unsubscribe();
    }
  };
}
var _a;
var LogStatusForReport = (_a = {}, _a[RawReportType.cspViolation] = StatusType.error, _a[RawReportType.intervention] = StatusType.error, _a[RawReportType.deprecation] = StatusType.warn, _a);
function startReportCollection(configuration, lifeCycle) {
  var reportSubscription = initReportObservable(configuration.forwardReports).subscribe(function(report) {
    var message = report.message;
    var status2 = LogStatusForReport[report.type];
    var error;
    if (status2 === StatusType.error) {
      error = {
        kind: report.subtype,
        origin: ErrorSource.REPORT,
        stack: report.stack
      };
    } else if (report.stack) {
      message += " Found in ".concat(getFileFromStackTraceString(report.stack));
    }
    lifeCycle.notify(0, {
      rawLogsEvent: {
        date: timeStampNow(),
        message,
        origin: ErrorSource.REPORT,
        error,
        status: status2
      }
    });
  });
  return {
    stop: function() {
      reportSubscription.unsubscribe();
    }
  };
}
function startNetworkErrorCollection(configuration, lifeCycle) {
  if (!configuration.forwardErrorsToLogs) {
    return { stop: noop };
  }
  var xhrSubscription = initXhrObservable().subscribe(function(context) {
    if (context.state === "complete") {
      handleCompleteRequest("xhr", context);
    }
  });
  var fetchSubscription = initFetchObservable().subscribe(function(context) {
    if (context.state === "complete") {
      handleCompleteRequest("fetch", context);
    }
  });
  function handleCompleteRequest(type2, request) {
    if (!configuration.isIntakeUrl(request.url) && (isRejected(request) || isServerError(request))) {
      if ("xhr" in request) {
        computeXhrResponseData(request.xhr, configuration, onResponseDataAvailable);
      } else if (request.response) {
        computeFetchResponseText(request.response, configuration, onResponseDataAvailable);
      } else if (request.error) {
        computeFetchErrorText(request.error, configuration, onResponseDataAvailable);
      }
    }
    function onResponseDataAvailable(responseData) {
      lifeCycle.notify(0, {
        rawLogsEvent: {
          message: "".concat(format(type2), " error ").concat(request.method, " ").concat(request.url),
          date: request.startClocks.timeStamp,
          error: {
            origin: ErrorSource.NETWORK,
            stack: responseData || "Failed to load"
          },
          http: {
            method: request.method,
            status_code: request.status,
            url: request.url
          },
          status: StatusType.error,
          origin: ErrorSource.NETWORK
        }
      });
    }
  }
  return {
    stop: function() {
      xhrSubscription.unsubscribe();
      fetchSubscription.unsubscribe();
    }
  };
}
function computeXhrResponseData(xhr, configuration, callback) {
  if (typeof xhr.response === "string") {
    callback(truncateResponseText(xhr.response, configuration));
  } else {
    callback(xhr.response);
  }
}
function computeFetchErrorText(error, configuration, callback) {
  callback(truncateResponseText(toStackTraceString(computeStackTrace(error)), configuration));
}
function computeFetchResponseText(response, configuration, callback) {
  if (!window.TextDecoder) {
    response.clone().text().then(monitor(function(text) {
      return callback(truncateResponseText(text, configuration));
    }), monitor(function(error) {
      return callback("Unable to retrieve response: ".concat(error));
    }));
  } else if (!response.body) {
    callback();
  } else {
    truncateResponseStream(response.clone().body, configuration.requestErrorResponseLengthLimit, function(error, responseText) {
      if (error) {
        callback("Unable to retrieve response: ".concat(error));
      } else {
        callback(responseText);
      }
    });
  }
}
function isRejected(request) {
  return request.status === 0 && request.responseType !== "opaque";
}
function isServerError(request) {
  return request.status >= 500;
}
function truncateResponseText(responseText, configuration) {
  if (responseText.length > configuration.requestErrorResponseLengthLimit) {
    return "".concat(responseText.substring(0, configuration.requestErrorResponseLengthLimit), "...");
  }
  return responseText;
}
function format(type2) {
  if ("xhr" === type2) {
    return "XHR";
  }
  return "Fetch";
}
function truncateResponseStream(stream, limit, callback) {
  readLimitedAmountOfBytes(stream, limit, function(error, bytes, limitExceeded) {
    if (error) {
      callback(error);
    } else {
      var responseText = new TextDecoder().decode(bytes);
      if (limitExceeded) {
        responseText += "...";
      }
      callback(void 0, responseText);
    }
  });
}
function readLimitedAmountOfBytes(stream, limit, callback) {
  var reader = stream.getReader();
  var chunks = [];
  var readBytesCount = 0;
  readMore();
  function readMore() {
    reader.read().then(monitor(function(result) {
      if (result.done) {
        onDone();
        return;
      }
      chunks.push(result.value);
      readBytesCount += result.value.length;
      if (readBytesCount > limit) {
        onDone();
      } else {
        readMore();
      }
    }), monitor(function(error) {
      return callback(error);
    }));
  }
  function onDone() {
    reader.cancel().catch(
      noop
    );
    var completeBuffer;
    if (chunks.length === 1) {
      completeBuffer = chunks[0];
    } else {
      completeBuffer = new Uint8Array(readBytesCount);
      var offset_1 = 0;
      chunks.forEach(function(chunk) {
        completeBuffer.set(chunk, offset_1);
        offset_1 += chunk.length;
      });
    }
    callback(void 0, completeBuffer.slice(0, limit), completeBuffer.length > limit);
  }
}
function startRuntimeErrorCollection(configuration, lifeCycle) {
  if (!configuration.forwardErrorsToLogs) {
    return { stop: noop };
  }
  var rawErrorObservable = new Observable();
  var stopRuntimeErrorTracking = trackRuntimeError(rawErrorObservable).stop;
  var rawErrorSubscription = rawErrorObservable.subscribe(function(rawError) {
    lifeCycle.notify(0, {
      rawLogsEvent: {
        message: rawError.message,
        date: rawError.startClocks.timeStamp,
        error: {
          kind: rawError.type,
          origin: ErrorSource.SOURCE,
          stack: rawError.stack
        },
        origin: ErrorSource.SOURCE,
        status: StatusType.error
      }
    });
  });
  return {
    stop: function() {
      stopRuntimeErrorTracking();
      rawErrorSubscription.unsubscribe();
    }
  };
}
var LifeCycle = function() {
  function LifeCycle2() {
    this.callbacks = {};
  }
  LifeCycle2.prototype.notify = function(eventType, data) {
    var eventCallbacks = this.callbacks[eventType];
    if (eventCallbacks) {
      eventCallbacks.forEach(function(callback) {
        return callback(data);
      });
    }
  };
  LifeCycle2.prototype.subscribe = function(eventType, callback) {
    var _this = this;
    if (!this.callbacks[eventType]) {
      this.callbacks[eventType] = [];
    }
    this.callbacks[eventType].push(callback);
    return {
      unsubscribe: function() {
        _this.callbacks[eventType] = _this.callbacks[eventType].filter(function(other) {
          return callback !== other;
        });
      }
    };
  };
  return LifeCycle2;
}();
function startLogsBatch(configuration, lifeCycle) {
  var _a2;
  var batch = startBatchWithReplica(configuration, configuration.logsEndpointBuilder, (_a2 = configuration.replica) === null || _a2 === void 0 ? void 0 : _a2.logsEndpointBuilder);
  lifeCycle.subscribe(1, function(serverLogsEvent) {
    batch.add(serverLogsEvent);
  });
}
function startLogsBridge(lifeCycle) {
  var bridge = getEventBridge();
  lifeCycle.subscribe(1, function(serverLogsEvent) {
    bridge.send("log", serverLogsEvent);
  });
}
function startInternalContext(sessionManager) {
  return {
    get: function(startTime) {
      var trackedSession = sessionManager.findTrackedSession(startTime);
      if (trackedSession) {
        return {
          session_id: trackedSession.id
        };
      }
    }
  };
}
function startLogs(configuration, getCommonContext, mainLogger) {
  var lifeCycle = new LifeCycle();
  var telemetry = startLogsTelemetry(configuration);
  telemetry.setContextProvider(function() {
    var _a2, _b, _c, _d, _e, _f;
    return {
      application: {
        id: (_a2 = getRUMInternalContext()) === null || _a2 === void 0 ? void 0 : _a2.application_id
      },
      session: {
        id: (_b = session.findTrackedSession()) === null || _b === void 0 ? void 0 : _b.id
      },
      view: {
        id: (_d = (_c = getRUMInternalContext()) === null || _c === void 0 ? void 0 : _c.view) === null || _d === void 0 ? void 0 : _d.id
      },
      action: {
        id: (_f = (_e = getRUMInternalContext()) === null || _e === void 0 ? void 0 : _e.user_action) === null || _f === void 0 ? void 0 : _f.id
      }
    };
  });
  startNetworkErrorCollection(configuration, lifeCycle);
  startRuntimeErrorCollection(configuration, lifeCycle);
  startConsoleCollection(configuration, lifeCycle);
  startReportCollection(configuration, lifeCycle);
  var handleLog = startLoggerCollection(lifeCycle).handleLog;
  var session = areCookiesAuthorized(configuration.cookieOptions) && !canUseEventBridge() && !willSyntheticsInjectRum() ? startLogsSessionManager(configuration) : startLogsSessionManagerStub(configuration);
  startLogsAssembly(session, configuration, lifeCycle, getCommonContext, mainLogger);
  if (!canUseEventBridge()) {
    startLogsBatch(configuration, lifeCycle);
  } else {
    startLogsBridge(lifeCycle);
  }
  var internalContext = startInternalContext(session);
  return {
    handleLog,
    getInternalContext: internalContext.get
  };
}
function startLogsTelemetry(configuration) {
  var _a2;
  var telemetry = startTelemetry(configuration);
  if (canUseEventBridge()) {
    var bridge_1 = getEventBridge();
    telemetry.observable.subscribe(function(event) {
      return bridge_1.send("internal_telemetry", event);
    });
  } else {
    var telemetryBatch_1 = startBatchWithReplica(configuration, configuration.rumEndpointBuilder, (_a2 = configuration.replica) === null || _a2 === void 0 ? void 0 : _a2.rumEndpointBuilder);
    telemetry.observable.subscribe(function(event) {
      return telemetryBatch_1.add(event, isTelemetryReplicationAllowed(configuration));
    });
  }
  return telemetry;
}
var datadogLogs = makeLogsPublicApi(startLogs);
defineGlobal(getGlobalObject(), "DD_LOGS", datadogLogs);
class BrowserLogger {
  constructor(service, logLevel, options) {
    this.logLevels = {
      debug: 4,
      error: 1,
      info: 3,
      off: 0,
      warn: 2
    };
    this.logLevel = "info";
    this.service = "federated-core";
    this.namespace = "browser";
    datadogLogs.init({ ...options.config, service });
    datadogLogs.logger.setLevel(logLevel);
    this.options = options;
    this.service = service;
    this.logLevel = logLevel;
    this.instance = datadogLogs.logger;
  }
  log(level, message, componentName = "unknown", logContext = {}) {
    var _a2;
    if (this.logLevel === "off")
      return;
    if ((_a2 = this.options.filteredLogs) == null ? void 0 : _a2.includes(message))
      return;
    const isObject = typeof message === "object";
    const messageToLog = isObject ? JSON.stringify({ data: message }) : message;
    if (this.isLevelEnabled(level)) {
      this.instance[level](`[${this.namespace}] - ${messageToLog}`, {
        logContext: { componentName, ...logContext }
      });
    }
  }
  isLevelEnabled(level) {
    return this.logLevels[this.logLevel] >= this.logLevels[level];
  }
  debug(message, componentName, logContext) {
    this.log("debug", message, componentName, logContext);
  }
  error(message, componentName, logContext) {
    this.log("error", message, componentName, logContext);
  }
  info(message, componentName, logContext) {
    this.log("info", message, componentName, logContext);
  }
  warn(message, componentName, logContext) {
    this.log("warn", message, componentName, logContext);
  }
  get level() {
    return this.logLevel;
  }
  set level(level) {
    this.logLevel = level;
  }
  get serviceName() {
    return this.service;
  }
  get loggerInstance() {
    return this.instance;
  }
}
const isBrowser = () => typeof window !== "undefined";
const pascalise = (str) => {
  const hyphenated = str.replace(/\s/g, "-");
  const words = hyphenated.split("-");
  const pascalCased = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return pascalCased.join("");
};
var index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  pascalise
}, Symbol.toStringTag, { value: "Module" }));
var FederatedModuleStatuses = /* @__PURE__ */ ((FederatedModuleStatuses2) => {
  FederatedModuleStatuses2["NOT_LOADED"] = "NOT_LOADED";
  FederatedModuleStatuses2["LOADED"] = "LOADED";
  FederatedModuleStatuses2["BOOTSTRAPPING"] = "BOOTSTRAPPING";
  FederatedModuleStatuses2["BOOTSTRAPPED"] = "BOOTSTRAPPED";
  FederatedModuleStatuses2["NOT_MOUNTED"] = "NOT_MOUNTED";
  FederatedModuleStatuses2["MOUNTING"] = "MOUNTING";
  FederatedModuleStatuses2["MOUNTED"] = "MOUNTED";
  FederatedModuleStatuses2["UPDATING"] = "UPDATING";
  FederatedModuleStatuses2["UNMOUNTING"] = "UNMOUNTING";
  FederatedModuleStatuses2["UNMOUNT_ERROR"] = "UNMOUNT_ERROR";
  FederatedModuleStatuses2["UNMOUNTED"] = "UNMOUNTED";
  FederatedModuleStatuses2["UNLOADING"] = "UNLOADING";
  FederatedModuleStatuses2["LOAD_ERROR"] = "LOAD_ERROR";
  FederatedModuleStatuses2["UPDATE_ERROR"] = "UPDATE_ERROR";
  return FederatedModuleStatuses2;
})(FederatedModuleStatuses || {});
var FederatedEvents = /* @__PURE__ */ ((FederatedEvents2) => {
  FederatedEvents2["RUNTIME_BEFORE_BOOTSTRAP"] = "federated-core:runtime:before-bootstrap";
  FederatedEvents2["RUNTIME_BOOTSTRAPPED"] = "federated-core:runtime:bootstrapped";
  FederatedEvents2["RUNTIME_BOOTSTRAP_ERROR"] = "federated-core:runtime:bootstrap:error";
  FederatedEvents2["RUNTIME_BEFORE_START"] = "federated-core:runtime:before-start";
  FederatedEvents2["RUNTIME_STARTED"] = "federated-core:runtime:started";
  FederatedEvents2["RUNTIME_START_ERROR"] = "federated-core:runtime:start:error";
  FederatedEvents2["RUNTIME_MODULES_PREFETCH_START"] = "federated-core:runtime:modules:pre-fetch:start";
  FederatedEvents2["RUNTIME_BEFORE_MODULE_PREFETCH"] = "federated-core:runtime:module:before-prefetch";
  FederatedEvents2["RUNTIME_MODULE_PREFETCHED"] = "federated-core:runtime:module:prefetched";
  FederatedEvents2["RUNTIME_MODULE_PREFETCH_ERROR"] = "federated-core:runtime:module:prefetch:error";
  FederatedEvents2["RUNTIME_MODULES_PREFETCHED"] = "federated-core:runtime:modules:pre-fetched";
  FederatedEvents2["RUNTIME_ROUTES_PREFETCH_START"] = "federated-core:runtime:routes:pre-fetch:start";
  FederatedEvents2["RUNTIME_BEFORE_ROUTE_PREFETCH"] = "federated-core:runtime:route:before-prefetch";
  FederatedEvents2["RUNTIME_ROUTE_PREFETCHED"] = "federated-core:runtime:route:prefetched";
  FederatedEvents2["RUNTIME_ROUTES_PREFETCH_ERROR"] = "federated-core:runtime:routes:prefetch:error";
  FederatedEvents2["RUNTIME_ROUTES_PREFETCHED"] = "federated-core:runtime:routes:pre-fetched";
  FederatedEvents2["IMPORT_MAP_OVERRIDES_LOADED"] = "federated-core:import-map-overrides:loaded";
  FederatedEvents2["IMPORT_MAP_OVERRIDES_LOAD_ERROR"] = "federated-core:import-map-overrides:load-error";
  FederatedEvents2["ROUTE_CHANGED"] = "federated-core:route:changed";
  FederatedEvents2["ROUTE_ERROR"] = "federated-core:route:error";
  FederatedEvents2["ROUTE_ALREADY_ACTIVE"] = "federated-core:route:already-active";
  FederatedEvents2["ROUTE_NAVIGATE_TO"] = "federated-core:route:navigate-to";
  FederatedEvents2["POPSTATE_EVENT_FIRED"] = "federated-core:popstate:event-fired";
  FederatedEvents2["POPSTATE_EVENT_ERROR"] = "federated-core:popstate:event-error";
  FederatedEvents2["NATIVE_MODULE_LOADING"] = "federated-core:native-module:loading";
  FederatedEvents2["NATIVE_MODULE_LOADED"] = "federated-core:native-module:loaded";
  FederatedEvents2["NATIVE_MODULE_LOAD_ERROR"] = "federated-core:native-module:load-error";
  FederatedEvents2["SYSTEMJS_LOADED"] = "federated-core:systemjs:loaded";
  FederatedEvents2["SYSTEMJS_LOAD_ERROR"] = "federated-core:systemjs:load-error";
  FederatedEvents2["SYSTEMJS_MODULE_LOADING"] = "federated-core:systemjs:module:loading";
  FederatedEvents2["SYSTEMJS_MODULE_LOADED"] = "federated-core:systemjs:module:loaded";
  FederatedEvents2["MODULE_BEFORE_REGISTER"] = "federated-core:module:%moduleKey%:before-register";
  FederatedEvents2["MODULE_REGISTERED"] = "federated-core:module:%moduleKey%:registered";
  FederatedEvents2["MODULE_ALREADY_REGISTERED"] = "federated-core:module:%moduleKey%:already-registered";
  FederatedEvents2["MODULE_REGISTER_ERROR"] = "federated-core:module:%moduleKey%:register:error";
  FederatedEvents2["MODULE_BEFORE_LOAD"] = "federated-core:module:%moduleKey%:before-load";
  FederatedEvents2["MODULE_LOADED"] = "federated-core:module:%moduleKey%:loaded";
  FederatedEvents2["MODULE_ALREADY_LOADED"] = "federated-core:module:%moduleKey%:already-loaded";
  FederatedEvents2["MODULE_LOAD_ERROR"] = "federated-core:module:%moduleKey%:load:error";
  FederatedEvents2["MODULE_VALIDATE_PROPS"] = "federated-core:module:%moduleKey%:validate-props";
  FederatedEvents2["MODULE_STATE_CHANGED"] = "federated-core:module:%moduleKey%:state-changed";
  FederatedEvents2["MODULE_BEFORE_BOOTSTRAP"] = "federated-core:module:%moduleKey%:before-bootstrap";
  FederatedEvents2["MODULE_BOOTSTRAPPED"] = "federated-core:module:%moduleKey%:bootstrapped";
  FederatedEvents2["MODULE_BOOTSTRAP_ERROR"] = "federated-core:module:%moduleKey%:bootstrap:error";
  FederatedEvents2["MODULE_BEFORE_MOUNT"] = "federated-core:module:%moduleKey%:before-mount";
  FederatedEvents2["MODULE_MOUNTED"] = "federated-core:module:%moduleKey%:mounted";
  FederatedEvents2["MODULE_MOUNT_ERROR"] = "federated-core:module:%moduleKey%:mount:error";
  FederatedEvents2["MODULE_ALREADY_MOUNTED"] = "federated-core:module:%moduleKey%:already-mounted";
  FederatedEvents2["MODULE_BEFORE_UNMOUNT"] = "federated-core:module:%moduleKey%:before-unmount";
  FederatedEvents2["MODULE_UNMOUNTED"] = "federated-core:module:%moduleKey%:unmounted";
  FederatedEvents2["MODULE_UNMOUNT_ERROR"] = "federated-core:module:%moduleKey%:unmount:error";
  FederatedEvents2["MODULE_NOT_MOUNTED"] = "federated-core:module:%moduleKey%:not-mounted";
  FederatedEvents2["MODULE_BEFORE_UPDATE"] = "federated-core:module:%moduleKey%:before-update";
  FederatedEvents2["MODULE_UPDATED"] = "federated-core:module:%moduleKey%:updated";
  FederatedEvents2["MODULE_UPDATE_ERROR"] = "federated-core:module:%moduleKey%:update:error";
  return FederatedEvents2;
})(FederatedEvents || {});
const addHtmlElementWithAttrs = (id, tagName, attrs) => {
  const element = document.createElement(tagName);
  element.id = id;
  Object.keys(attrs).forEach((key) => {
    element.setAttribute(key, attrs[key]);
  });
  document.body.appendChild(element);
};
const addLinkTag = (id, rel, href) => {
  const link = document.createElement("link");
  link.id = id;
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};
const addMetaTag = (id, name2, content) => {
  if (document.getElementById(id)) {
    return;
  }
  const meta = document.createElement("meta");
  meta.id = id;
  meta.content = content;
  meta.name = name2;
  document.head.appendChild(meta);
};
const addScriptTag = (id, src, onload) => {
  if (document.getElementById(id)) {
    return;
  }
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.crossOrigin = "anonymous";
  if (onload)
    script.onload = onload;
  document.body.appendChild(script);
};
const getModuleKey = (scope2, moduleName) => {
  return `${scope2}:${moduleName}`;
};
const pathToWildcard = (path) => {
  return `^${path.replace(/\*/g, ".*")}$`;
};
const matchPathToUrlPaths = (path, urlPaths) => {
  const matchFound = urlPaths.find((activePath) => {
    const wildcardRegex = new RegExp(pathToWildcard(activePath));
    return wildcardRegex.test(path);
  });
  return !!matchFound;
};
const shouldModuleBeMounted = (path, module) => {
  if (!module.activeWhenPaths) {
    return false;
  }
  return matchPathToUrlPaths(path, module.activeWhenPaths) && !matchPathToUrlPaths(path, module.exceptWhenPaths || []);
};
const eventStore = /* @__PURE__ */ new Map();
const unregister = (id) => {
  const event = eventStore.has(id) ? eventStore.get(id) : null;
  if (event) {
    const { type: type2, fn } = event;
    window.removeEventListener(type2, fn);
    eventStore.delete(id);
  }
};
const register = (type2, fn, module) => {
  const id = `${type2}__${Date.now()}__${Math.floor(Math.random() * 1e3)}`;
  let eventType = type2;
  if (module) {
    eventType = replaceModuleKey(eventType, module);
  }
  eventStore.set(id, { type: eventType, fn });
  window.addEventListener(eventType, fn);
  return () => unregister(id);
};
const replaceModuleKey = (type2, module) => {
  return type2.replace(`%moduleKey%`, getModuleKey(module.scope, module.name));
};
const emit = (event, module) => {
  let eventType = event.type;
  if (module == null ? void 0 : module.name) {
    eventType = replaceModuleKey(eventType, module);
  }
  if (window.__FEDERATED_CORE__.federatedRuntime.debugEnabled) {
    console.log(`[EventService] Emitted event: ${eventType}`, event.payload);
  }
  window.dispatchEvent(new CustomEvent(eventType, event.payload));
};
const unregisterAll = () => {
  eventStore.forEach((_value, key) => {
    unregister(key);
  });
};
const clear = () => {
  eventStore.clear();
};
const eventService = {
  register,
  unregister,
  unregisterAll,
  emit,
  clear,
  replaceModuleKey,
  eventStore
};
const loggers = /* @__PURE__ */ new Map();
const hasLogger = (loggerKey) => {
  return loggers.has(loggerKey);
};
const getLogger = (service, logLevel, options, forceRecreate = false) => {
  const loggerKey = `${service}-logger`;
  if (hasLogger(loggerKey) && !forceRecreate) {
    return loggers.get(loggerKey);
  }
  const logger = new BrowserLogger(service, logLevel, options);
  loggers.set(loggerKey, logger);
  return logger;
};
const deleteLogger = (loggerKey) => {
  if (hasLogger(loggerKey)) {
    loggers.delete(loggerKey);
  }
};
const loggerService = {
  hasLogger,
  getLogger,
  deleteLogger
};
const ExposedServices = {
  event: eventService,
  logger: loggerService
};
class FederatedRuntime {
  constructor() {
    this._bootstrapped = false;
    this._started = false;
    this._useNativeModules = false;
    this._importMapOverridesEnabled = false;
    this._debugEnabled = false;
    this._sharedDependencyBaseUrl = "";
    this._cdnUrl = process.env["SHARED_CDN_DOMAIN"] || "";
    this._modules = /* @__PURE__ */ new Map();
    this._services = ExposedServices;
  }
  set bootstrapped(bootstrapped) {
    this._bootstrapped = bootstrapped;
  }
  get bootstrapped() {
    return this._bootstrapped;
  }
  set started(started) {
    this._started = started;
  }
  get started() {
    return this._started;
  }
  set debugEnabled(value) {
    this._debugEnabled = value;
  }
  get debugEnabled() {
    return this._debugEnabled;
  }
  set sharedDependencyBaseUrl(baseUrl) {
    this._sharedDependencyBaseUrl = baseUrl;
  }
  get sharedDependencyBaseUrl() {
    return this._sharedDependencyBaseUrl;
  }
  set useNativeModules(useNativeModules) {
    this._useNativeModules = useNativeModules;
  }
  get useNativeModules() {
    return this._useNativeModules;
  }
  set importMapOverridesEnabled(importMapOverridesEnabled) {
    this._importMapOverridesEnabled = importMapOverridesEnabled;
  }
  get importMapOverridesEnabled() {
    return this._importMapOverridesEnabled;
  }
  set cdnUrl(cdnUrl) {
    this._cdnUrl = cdnUrl;
  }
  get cdnUrl() {
    return this._cdnUrl;
  }
  set modules(modules) {
    this._modules = modules;
  }
  get modules() {
    return this._modules;
  }
  get services() {
    return this._services;
  }
  addImportMapOverridesUi() {
    const importMapOverridesKey = "import-map-overrides";
    if (this.importMapOverridesEnabled) {
      addHtmlElementWithAttrs(
        "import-map-overrides-ui",
        "import-map-overrides-full",
        {
          "show-when-local-storage": importMapOverridesKey
        }
      );
      localStorage.setItem(importMapOverridesKey, "true");
      addScriptTag(
        importMapOverridesKey,
        "https://cdn.jsdelivr.net/npm/import-map-overrides/dist/import-map-overrides.js"
      );
      this.services.event.emit({
        type: FederatedEvents.IMPORT_MAP_OVERRIDES_LOADED,
        payload: {
          loadedTime: Date.now()
        }
      });
    }
  }
  ensureSystemJs() {
    if (!this.useNativeModules) {
      addMetaTag("importmap-type", "importmap-type", "systemjs-importmap");
      addScriptTag(
        "systemjs",
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/system.min.js`
      );
      addScriptTag(
        "systemjs-named-exports",
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/extras/named-exports.min.js`
      );
      addScriptTag(
        "systemjs-amd",
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/extras/amd.min.js`
      );
      addScriptTag(
        "systemjs-dynamic-import-maps",
        `${this.sharedDependencyBaseUrl}/systemjs/6.12.1/extras/dynamic-import-maps.min.js`
      );
      this.services.event.emit({
        type: FederatedEvents.SYSTEMJS_LOADED,
        payload: {
          loadedTime: Date.now()
        }
      });
    }
  }
  async fetchImportMapContent(basePath) {
    const importMapPath = `${basePath || this.cdnUrl}/entries-import-map.json`;
    const importMap = await fetch(importMapPath);
    return importMap.json();
  }
  setModuleState(module, state) {
    const { scope: scope2, name: name2 } = module;
    const moduleKey = getModuleKey(scope2, name2);
    const moduleInstance = {
      ...this.modules.get(moduleKey),
      status: state
    };
    this.modules.set(moduleKey, moduleInstance);
    eventService.emit(
      {
        type: FederatedEvents.MODULE_STATE_CHANGED,
        payload: {
          module
        }
      },
      module
    );
  }
  setModuleRootComponent(module, component) {
    const { scope: scope2, name: name2 } = module;
    const moduleKey = getModuleKey(scope2, name2);
    const savedModule = this.modules.get(moduleKey);
    if (savedModule) {
      savedModule.rootComponent = component;
      this.modules.set(moduleKey, savedModule);
    }
  }
  getModuleRootComponent(module) {
    const { scope: scope2, name: name2 } = module;
    const moduleKey = getModuleKey(scope2, name2);
    const savedModule = this.modules.get(moduleKey);
    if (savedModule) {
      return savedModule.rootComponent;
    }
  }
  async registerModule(module) {
    var _a2, _b;
    const { scope: scope2, name: name2 } = module;
    const moduleKey = getModuleKey(scope2, name2);
    if (this.modules.has(moduleKey) && ((_a2 = this.modules.get(moduleKey)) == null ? void 0 : _a2.status) === FederatedModuleStatuses.LOADED) {
      this.services.event.emit(
        {
          type: FederatedEvents.MODULE_ALREADY_REGISTERED,
          payload: {
            module
          }
        },
        module
      );
    } else if (this.modules.has(moduleKey) && ((_b = this.modules.get(moduleKey)) == null ? void 0 : _b.status) === FederatedModuleStatuses.MOUNTED) {
      this.services.event.emit(
        {
          type: FederatedEvents.MODULE_ALREADY_MOUNTED,
          payload: {
            module
          }
        },
        module
      );
    } else {
      this.services.event.emit(
        {
          type: FederatedEvents.MODULE_BEFORE_REGISTER,
          payload: {
            module
          }
        },
        module
      );
      this.setModuleState(
        { scope: module.scope, name: module.name },
        FederatedModuleStatuses.NOT_LOADED
      );
      this.modules.set(moduleKey, module);
      this.services.event.emit(
        {
          type: FederatedEvents.MODULE_REGISTERED,
          payload: {
            module
          }
        },
        module
      );
    }
    return this;
  }
  async getModuleUrl(module) {
    const { name: name2, basePath } = module;
    const importMap = await this.fetchImportMapContent(basePath);
    return importMap.imports[name2];
  }
  getModulesByPath(path) {
    const modules = [];
    this.modules.forEach((module) => {
      if (shouldModuleBeMounted(path, module)) {
        modules.push(module);
      }
    });
    return modules;
  }
  async loadModule(module) {
    var _a2, _b;
    const { scope: scope2, name: name2, basePath } = module;
    try {
      const moduleKey = getModuleKey(scope2, name2);
      if (this.modules.has(moduleKey)) {
        const storeModule = this.modules.get(moduleKey);
        if (storeModule && ["journey-module", "component"].includes(storeModule.type) && ((_a2 = this.modules.get(moduleKey)) == null ? void 0 : _a2.status) === FederatedModuleStatuses.MOUNTED) {
          this.services.event.emit(
            {
              type: FederatedEvents.MODULE_ALREADY_MOUNTED,
              payload: {
                module
              }
            },
            module
          );
          return this.modules.get(moduleKey);
        }
        if (storeModule && ((_b = this.modules.get(moduleKey)) == null ? void 0 : _b.status) === FederatedModuleStatuses.LOADED) {
          this.services.event.emit(
            {
              type: FederatedEvents.MODULE_ALREADY_LOADED,
              payload: {
                module
              }
            },
            module
          );
          return this.modules.get(moduleKey);
        }
      }
      this.services.event.emit(
        {
          type: FederatedEvents.MODULE_BEFORE_LOAD,
          payload: {
            module
          }
        },
        module
      );
      let resolvedModule;
      const importMap = await this.fetchImportMapContent(basePath);
      const moduleUrl = importMap.imports[`${name2}.css`];
      if (moduleUrl) {
        addLinkTag(`${name2}.css`, "stylesheet", moduleUrl);
      }
      if (this.useNativeModules) {
        this.services.event.emit(
          {
            type: FederatedEvents.NATIVE_MODULE_LOADING,
            payload: {
              module
            }
          },
          module
        );
        const moduleUrl2 = await this.getModuleUrl({ scope: scope2, name: name2 });
        resolvedModule = await import(
          /* @vite-ignore */
          moduleUrl2
        );
        this.services.event.emit(
          {
            type: FederatedEvents.NATIVE_MODULE_LOADED,
            payload: {
              loadedTime: new Date().getTime(),
              module: resolvedModule
            }
          },
          module
        );
      } else {
        this.services.event.emit(
          {
            type: FederatedEvents.SYSTEMJS_MODULE_LOADING,
            payload: {
              module
            }
          },
          module
        );
        resolvedModule = await System.import(name2);
        this.services.event.emit(
          {
            type: FederatedEvents.SYSTEMJS_MODULE_LOADED,
            payload: {
              module: resolvedModule
            }
          },
          module
        );
      }
      if (!this.modules.has(moduleKey) && !resolvedModule.status) {
        await this.registerModule(resolvedModule);
      }
      if (!resolvedModule.status || resolvedModule.status === FederatedModuleStatuses.NOT_LOADED) {
        this.setModuleState({ scope: scope2, name: name2 }, FederatedModuleStatuses.LOADED);
      }
      return resolvedModule;
    } catch (error) {
      this.services.event.emit(
        {
          type: FederatedEvents.MODULE_LOAD_ERROR,
          payload: {
            module,
            error
          }
        },
        module
      );
      return void 0;
    }
  }
  async mountModule(module, props, mountId) {
    const { scope: scope2, name: name2 } = module;
    const loadedModule = await this.loadModule({ scope: scope2, name: name2 });
    if (loadedModule == null ? void 0 : loadedModule.mount) {
      await loadedModule.mount(props, mountId);
    }
  }
  async unmountModule(module) {
    const { scope: scope2, name: name2 } = module;
    const loadedModule = await this.modules.get(getModuleKey(scope2, name2));
    if (loadedModule == null ? void 0 : loadedModule.unmount) {
      await loadedModule.unmount();
    }
  }
  validateProps(module, props) {
    const { scope: scope2, name: name2 } = module;
    const moduleKey = getModuleKey(scope2, name2);
    this.services.event.emit(
      {
        type: FederatedEvents.MODULE_VALIDATE_PROPS,
        payload: {
          module,
          props
        }
      },
      module
    );
    const loadedModule = this.modules.get(moduleKey);
    if (!(loadedModule == null ? void 0 : loadedModule.validateProps)) {
      return true;
    }
    return loadedModule.validateProps(props);
  }
  async preFetchModules(modules) {
    this.services.event.emit({
      type: FederatedEvents.RUNTIME_MODULES_PREFETCH_START,
      payload: {
        modules
      }
    });
    for (const module of modules) {
      const { name: name2, scope: scope2 } = module;
      const moduleKey = getModuleKey(scope2, name2);
      if (!this.modules.has(moduleKey)) {
        this.services.event.emit({
          type: FederatedEvents.RUNTIME_BEFORE_MODULE_PREFETCH,
          payload: {
            module
          }
        });
        await this.loadModule({ scope: scope2, name: name2 });
        this.services.event.emit({
          type: FederatedEvents.RUNTIME_MODULE_PREFETCHED,
          payload: {
            module
          }
        });
      }
    }
    this.services.event.emit({
      type: FederatedEvents.RUNTIME_MODULES_PREFETCHED,
      payload: {
        modules
      }
    });
    return this;
  }
  async applyModules() {
    const modulesToMount = [];
    const modulesToUnmount = [];
    this.modules.forEach((module) => {
      if (shouldModuleBeMounted(window.location.pathname, module)) {
        modulesToMount.push(module);
      } else {
        modulesToUnmount.push(module);
      }
    });
    for (const module of modulesToUnmount) {
      const moduleKey = getModuleKey(module.scope, module.name);
      const moduleInstance = this.modules.get(moduleKey);
      if (moduleInstance == null ? void 0 : moduleInstance.unmount) {
        this.services.event.emit(
          {
            type: FederatedEvents.MODULE_BEFORE_UNMOUNT,
            payload: {
              module
            }
          },
          module
        );
        await moduleInstance.unmount();
        this.services.event.emit(
          {
            type: FederatedEvents.MODULE_UNMOUNTED,
            payload: {
              module: moduleInstance
            }
          },
          module
        );
      } else if ((moduleInstance == null ? void 0 : moduleInstance.type) === "journey-module" || (moduleInstance == null ? void 0 : moduleInstance.type) === "component") {
        this.setModuleState(
          { scope: module.scope, name: module.name },
          FederatedModuleStatuses.NOT_LOADED
        );
      }
    }
    for (const module of modulesToMount) {
      try {
        const { scope: scope2, name: name2, props } = module;
        const loadedModule = await this.loadModule({ scope: scope2, name: name2 });
        if (loadedModule == null ? void 0 : loadedModule.mount) {
          this.services.event.emit(
            {
              type: FederatedEvents.MODULE_BEFORE_MOUNT,
              payload: {
                module: loadedModule
              }
            },
            module
          );
          await loadedModule.mount(props);
          this.services.event.emit(
            {
              type: FederatedEvents.MODULE_MOUNTED,
              payload: {
                module: loadedModule
              }
            },
            module
          );
        }
      } catch (error) {
        this.services.event.emit(
          {
            type: FederatedEvents.MODULE_MOUNT_ERROR,
            payload: {
              module,
              error
            }
          },
          module
        );
      }
    }
  }
  navigateTo(path) {
    if (window.location.pathname === path) {
      this.services.event.emit({
        type: FederatedEvents.ROUTE_ALREADY_ACTIVE,
        payload: {
          path
        }
      });
      return;
    }
    this.services.event.emit({
      type: FederatedEvents.ROUTE_NAVIGATE_TO,
      payload: {
        previousPath: window.location.pathname,
        path
      }
    });
    window.history.pushState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
  async reroute() {
    this.services.event.emit({
      type: FederatedEvents.ROUTE_CHANGED,
      payload: {
        path: window.location.pathname
      }
    });
    await this.applyModules();
  }
  async preFetchRoutes(routePaths) {
    try {
      this.services.event.emit({
        type: FederatedEvents.RUNTIME_ROUTES_PREFETCH_START,
        payload: {
          routes: routePaths
        }
      });
      for (const path of routePaths) {
        this.services.event.emit({
          type: FederatedEvents.RUNTIME_BEFORE_ROUTE_PREFETCH,
          payload: {
            path
          }
        });
        const modules = this.getModulesByPath(path);
        for (const module of modules) {
          const { name: name2, scope: scope2 } = module;
          if ((module == null ? void 0 : module.status) !== FederatedModuleStatuses.LOADED) {
            await this.loadModule({ scope: scope2, name: name2 });
          }
        }
        this.services.event.emit({
          type: FederatedEvents.RUNTIME_ROUTE_PREFETCHED,
          payload: {
            path
          }
        });
      }
      this.services.event.emit({
        type: FederatedEvents.RUNTIME_ROUTES_PREFETCHED,
        payload: {
          routes: routePaths
        }
      });
    } catch (error) {
      this.services.event.emit({
        type: FederatedEvents.RUNTIME_ROUTES_PREFETCH_ERROR,
        payload: {
          routes: routePaths,
          error
        }
      });
    }
    return this;
  }
  async bootstrap() {
    this.bootstrapped = false;
    const boostrapStartTime = Date.now();
    this.services.event.emit({
      type: FederatedEvents.RUNTIME_BEFORE_BOOTSTRAP,
      payload: {
        bootstrapTime: new Date().toDateString(),
        modules: this.modules,
        useNativeModules: this.useNativeModules,
        importMapOverridesEnabled: this.importMapOverridesEnabled
      }
    });
    window.addEventListener("popstate", async (popstateEvent) => {
      this.services.event.emit({
        type: FederatedEvents.POPSTATE_EVENT_FIRED,
        payload: {
          popstateEvent
        }
      });
      await this.reroute();
    });
    this.ensureSystemJs();
    this.addImportMapOverridesUi();
    for (const entry of this.modules) {
      const moduleData = entry[1];
      try {
        if (moduleData.bootstrap) {
          this.services.event.emit(
            {
              type: FederatedEvents.MODULE_BEFORE_BOOTSTRAP,
              payload: {
                module: moduleData
              }
            },
            moduleData
          );
          await moduleData.bootstrap();
          this.services.event.emit(
            {
              type: FederatedEvents.MODULE_BOOTSTRAPPED,
              payload: {
                module: moduleData
              }
            },
            moduleData
          );
        }
      } catch (error) {
        this.services.event.emit(
          {
            type: FederatedEvents.MODULE_BOOTSTRAP_ERROR,
            payload: {
              module: moduleData,
              error
            }
          },
          moduleData
        );
      }
    }
    const bootstrapEndTime = Date.now();
    const bootstrapDuration = bootstrapEndTime - boostrapStartTime;
    this.bootstrapped = true;
    this.services.event.emit({
      type: FederatedEvents.RUNTIME_BOOTSTRAPPED,
      payload: {
        bootstrapEndTime,
        bootstrapDuration
      }
    });
  }
  async start() {
    try {
      const startTime = Date.now();
      this.started = false;
      this.services.event.emit({
        type: FederatedEvents.RUNTIME_BEFORE_START,
        payload: {
          startTime: new Date(startTime).toDateString(),
          modules: this.modules
        }
      });
      await this.bootstrap();
      await this.reroute();
      const startEndTime = Date.now();
      const startDuration = startEndTime - startTime;
      this.services.event.emit({
        type: FederatedEvents.RUNTIME_STARTED,
        payload: {
          startTime,
          startEndTime,
          startDuration
        }
      });
      this.started = true;
    } catch (error) {
      this.services.event.emit({
        type: FederatedEvents.RUNTIME_START_ERROR,
        payload: {
          error
        }
      });
    }
  }
}
if (isBrowser() && !window.__FEDERATED_CORE__) {
  window.__FEDERATED_CORE__ = {
    moduleBaseUrls: {},
    federatedRuntime: new FederatedRuntime()
  };
}
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).substr(1));
}
var jsxRuntime$1 = { exports: {} };
var reactJsxRuntime_production_min$1 = {};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var getOwnPropertySymbols$1 = Object.getOwnPropertySymbols;
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var propIsEnumerable$1 = Object.prototype.propertyIsEnumerable;
function toObject$1(val) {
  if (val === null || val === void 0) {
    throw new TypeError("Object.assign cannot be called with null or undefined");
  }
  return Object(val);
}
function shouldUseNative$1() {
  try {
    if (!Object.assign) {
      return false;
    }
    var test1 = new String("abc");
    test1[5] = "de";
    if (Object.getOwnPropertyNames(test1)[0] === "5") {
      return false;
    }
    var test2 = {};
    for (var i = 0; i < 10; i++) {
      test2["_" + String.fromCharCode(i)] = i;
    }
    var order2 = Object.getOwnPropertyNames(test2).map(function(n2) {
      return test2[n2];
    });
    if (order2.join("") !== "0123456789") {
      return false;
    }
    var test3 = {};
    "abcdefghijklmnopqrst".split("").forEach(function(letter) {
      test3[letter] = letter;
    });
    if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}
var objectAssign = shouldUseNative$1() ? Object.assign : function(target, source) {
  var from;
  var to = toObject$1(target);
  var symbols;
  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);
    for (var key in from) {
      if (hasOwnProperty$1.call(from, key)) {
        to[key] = from[key];
      }
    }
    if (getOwnPropertySymbols$1) {
      symbols = getOwnPropertySymbols$1(from);
      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable$1.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }
  return to;
};
var react = { exports: {} };
var react_production_min = {};
/** @license React v17.0.2
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l = objectAssign, n$1 = 60103, p$1 = 60106;
react_production_min.Fragment = 60107;
react_production_min.StrictMode = 60108;
react_production_min.Profiler = 60114;
var q$1 = 60109, r = 60110, t = 60112;
react_production_min.Suspense = 60113;
var u = 60115, v = 60116;
if ("function" === typeof Symbol && Symbol.for) {
  var w = Symbol.for;
  n$1 = w("react.element");
  p$1 = w("react.portal");
  react_production_min.Fragment = w("react.fragment");
  react_production_min.StrictMode = w("react.strict_mode");
  react_production_min.Profiler = w("react.profiler");
  q$1 = w("react.provider");
  r = w("react.context");
  t = w("react.forward_ref");
  react_production_min.Suspense = w("react.suspense");
  u = w("react.memo");
  v = w("react.lazy");
}
var x = "function" === typeof Symbol && Symbol.iterator;
function y(a) {
  if (null === a || "object" !== typeof a)
    return null;
  a = x && a[x] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
function z(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++)
    b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var A = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, B = {};
function C(a, b, c) {
  this.props = a;
  this.context = b;
  this.refs = B;
  this.updater = c || A;
}
C.prototype.isReactComponent = {};
C.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a)
    throw Error(z(85));
  this.updater.enqueueSetState(this, a, b, "setState");
};
C.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function D() {
}
D.prototype = C.prototype;
function E(a, b, c) {
  this.props = a;
  this.context = b;
  this.refs = B;
  this.updater = c || A;
}
var F = E.prototype = new D();
F.constructor = E;
l(F, C.prototype);
F.isPureReactComponent = true;
var G = { current: null }, H = Object.prototype.hasOwnProperty, I = { key: true, ref: true, __self: true, __source: true };
function J(a, b, c) {
  var e, d = {}, k = null, h = null;
  if (null != b)
    for (e in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b)
      H.call(b, e) && !I.hasOwnProperty(e) && (d[e] = b[e]);
  var g2 = arguments.length - 2;
  if (1 === g2)
    d.children = c;
  else if (1 < g2) {
    for (var f2 = Array(g2), m2 = 0; m2 < g2; m2++)
      f2[m2] = arguments[m2 + 2];
    d.children = f2;
  }
  if (a && a.defaultProps)
    for (e in g2 = a.defaultProps, g2)
      void 0 === d[e] && (d[e] = g2[e]);
  return { $$typeof: n$1, type: a, key: k, ref: h, props: d, _owner: G.current };
}
function K(a, b) {
  return { $$typeof: n$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function L(a) {
  return "object" === typeof a && null !== a && a.$$typeof === n$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var M = /\/+/g;
function N(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function O(a, b, c, e, d) {
  var k = typeof a;
  if ("undefined" === k || "boolean" === k)
    a = null;
  var h = false;
  if (null === a)
    h = true;
  else
    switch (k) {
      case "string":
      case "number":
        h = true;
        break;
      case "object":
        switch (a.$$typeof) {
          case n$1:
          case p$1:
            h = true;
        }
    }
  if (h)
    return h = a, d = d(h), a = "" === e ? "." + N(h, 0) : e, Array.isArray(d) ? (c = "", null != a && (c = a.replace(M, "$&/") + "/"), O(d, b, c, "", function(a2) {
      return a2;
    })) : null != d && (L(d) && (d = K(d, c + (!d.key || h && h.key === d.key ? "" : ("" + d.key).replace(M, "$&/") + "/") + a)), b.push(d)), 1;
  h = 0;
  e = "" === e ? "." : e + ":";
  if (Array.isArray(a))
    for (var g2 = 0; g2 < a.length; g2++) {
      k = a[g2];
      var f2 = e + N(k, g2);
      h += O(k, b, c, f2, d);
    }
  else if (f2 = y(a), "function" === typeof f2)
    for (a = f2.call(a), g2 = 0; !(k = a.next()).done; )
      k = k.value, f2 = e + N(k, g2++), h += O(k, b, c, f2, d);
  else if ("object" === k)
    throw b = "" + a, Error(z(31, "[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b));
  return h;
}
function P(a, b, c) {
  if (null == a)
    return a;
  var e = [], d = 0;
  O(a, e, "", "", function(a2) {
    return b.call(c, a2, d++);
  });
  return e;
}
function Q(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    a._status = 0;
    a._result = b;
    b.then(function(b2) {
      0 === a._status && (b2 = b2.default, a._status = 1, a._result = b2);
    }, function(b2) {
      0 === a._status && (a._status = 2, a._result = b2);
    });
  }
  if (1 === a._status)
    return a._result;
  throw a._result;
}
var R = { current: null };
function S() {
  var a = R.current;
  if (null === a)
    throw Error(z(321));
  return a;
}
var T = { ReactCurrentDispatcher: R, ReactCurrentBatchConfig: { transition: 0 }, ReactCurrentOwner: G, IsSomeRendererActing: { current: false }, assign: l };
react_production_min.Children = { map: P, forEach: function(a, b, c) {
  P(a, function() {
    b.apply(this, arguments);
  }, c);
}, count: function(a) {
  var b = 0;
  P(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return P(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!L(a))
    throw Error(z(143));
  return a;
} };
react_production_min.Component = C;
react_production_min.PureComponent = E;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = T;
react_production_min.cloneElement = function(a, b, c) {
  if (null === a || void 0 === a)
    throw Error(z(267, a));
  var e = l({}, a.props), d = a.key, k = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k = b.ref, h = G.current);
    void 0 !== b.key && (d = "" + b.key);
    if (a.type && a.type.defaultProps)
      var g2 = a.type.defaultProps;
    for (f2 in b)
      H.call(b, f2) && !I.hasOwnProperty(f2) && (e[f2] = void 0 === b[f2] && void 0 !== g2 ? g2[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2)
    e.children = c;
  else if (1 < f2) {
    g2 = Array(f2);
    for (var m2 = 0; m2 < f2; m2++)
      g2[m2] = arguments[m2 + 2];
    e.children = g2;
  }
  return {
    $$typeof: n$1,
    type: a.type,
    key: d,
    ref: k,
    props: e,
    _owner: h
  };
};
react_production_min.createContext = function(a, b) {
  void 0 === b && (b = null);
  a = { $$typeof: r, _calculateChangedBits: b, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null };
  a.Provider = { $$typeof: q$1, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = J;
react_production_min.createFactory = function(a) {
  var b = J.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: t, render: a };
};
react_production_min.isValidElement = L;
react_production_min.lazy = function(a) {
  return { $$typeof: v, _payload: { _status: -1, _result: a }, _init: Q };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: u, type: a, compare: void 0 === b ? null : b };
};
react_production_min.useCallback = function(a, b) {
  return S().useCallback(a, b);
};
react_production_min.useContext = function(a, b) {
  return S().useContext(a, b);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useEffect = function(a, b) {
  return S().useEffect(a, b);
};
react_production_min.useImperativeHandle = function(a, b, c) {
  return S().useImperativeHandle(a, b, c);
};
react_production_min.useLayoutEffect = function(a, b) {
  return S().useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return S().useMemo(a, b);
};
react_production_min.useReducer = function(a, b, c) {
  return S().useReducer(a, b, c);
};
react_production_min.useRef = function(a) {
  return S().useRef(a);
};
react_production_min.useState = function(a) {
  return S().useState(a);
};
react_production_min.version = "17.0.2";
{
  react.exports = react_production_min;
}
/** @license React v17.0.2
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f$1 = react.exports, g$1 = 60103;
reactJsxRuntime_production_min$1.Fragment = 60107;
if ("function" === typeof Symbol && Symbol.for) {
  var h$1 = Symbol.for;
  g$1 = h$1("react.element");
  reactJsxRuntime_production_min$1.Fragment = h$1("react.fragment");
}
var m$1 = f$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n$2 = Object.prototype.hasOwnProperty, p$2 = { key: true, ref: true, __self: true, __source: true };
function q$2(c, a, k) {
  var b, d = {}, e = null, l2 = null;
  void 0 !== k && (e = "" + k);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (l2 = a.ref);
  for (b in a)
    n$2.call(a, b) && !p$2.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps)
    for (b in a = c.defaultProps, a)
      void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: g$1, type: c, key: e, ref: l2, props: d, _owner: m$1.current };
}
reactJsxRuntime_production_min$1.jsx = q$2;
reactJsxRuntime_production_min$1.jsxs = q$2;
{
  jsxRuntime$1.exports = reactJsxRuntime_production_min$1;
}
const jsx$1 = jsxRuntime$1.exports.jsx;
const jsxs = jsxRuntime$1.exports.jsxs;
const bootstrapLifecycle = async (module, federatedRuntime) => {
  try {
    eventService.emit(
      {
        type: FederatedEvents.MODULE_BEFORE_BOOTSTRAP,
        payload: {
          module
        }
      },
      module
    );
    federatedRuntime == null ? void 0 : federatedRuntime.setModuleState(
      module,
      FederatedModuleStatuses.BOOTSTRAPPING
    );
    eventService.emit(
      {
        type: FederatedEvents.MODULE_BOOTSTRAPPED,
        payload: {
          module
        }
      },
      module
    );
    federatedRuntime == null ? void 0 : federatedRuntime.setModuleState(
      module,
      FederatedModuleStatuses.BOOTSTRAPPED
    );
  } catch (error) {
    eventService.emit(
      {
        type: FederatedEvents.MODULE_BOOTSTRAP_ERROR,
        payload: {
          module,
          error
        }
      },
      module
    );
  }
};
function _setPrototypeOf(o, p2) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p3) {
    o2.__proto__ = p3;
    return o2;
  };
  return _setPrototypeOf(o, p2);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
var changedArray = function changedArray2(a, b) {
  if (a === void 0) {
    a = [];
  }
  if (b === void 0) {
    b = [];
  }
  return a.length !== b.length || a.some(function(item, index2) {
    return !Object.is(item, b[index2]);
  });
};
var initialState = {
  error: null
};
var ErrorBoundary = /* @__PURE__ */ function(_React$Component) {
  _inheritsLoose(ErrorBoundary2, _React$Component);
  function ErrorBoundary2() {
    var _this;
    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(_args)) || this;
    _this.state = initialState;
    _this.resetErrorBoundary = function() {
      var _this$props;
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      _this.props.onReset == null ? void 0 : (_this$props = _this.props).onReset.apply(_this$props, args);
      _this.reset();
    };
    return _this;
  }
  ErrorBoundary2.getDerivedStateFromError = function getDerivedStateFromError(error) {
    return {
      error
    };
  };
  var _proto = ErrorBoundary2.prototype;
  _proto.reset = function reset() {
    this.setState(initialState);
  };
  _proto.componentDidCatch = function componentDidCatch(error, info) {
    var _this$props$onError, _this$props2;
    (_this$props$onError = (_this$props2 = this.props).onError) == null ? void 0 : _this$props$onError.call(_this$props2, error, info);
  };
  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    var error = this.state.error;
    var resetKeys = this.props.resetKeys;
    if (error !== null && prevState.error !== null && changedArray(prevProps.resetKeys, resetKeys)) {
      var _this$props$onResetKe, _this$props3;
      (_this$props$onResetKe = (_this$props3 = this.props).onResetKeysChange) == null ? void 0 : _this$props$onResetKe.call(_this$props3, prevProps.resetKeys, resetKeys);
      this.reset();
    }
  };
  _proto.render = function render() {
    var error = this.state.error;
    var _this$props4 = this.props, fallbackRender = _this$props4.fallbackRender, FallbackComponent = _this$props4.FallbackComponent, fallback = _this$props4.fallback;
    if (error !== null) {
      var _props = {
        error,
        resetErrorBoundary: this.resetErrorBoundary
      };
      if (/* @__PURE__ */ react.exports.isValidElement(fallback)) {
        return fallback;
      } else if (typeof fallbackRender === "function") {
        return fallbackRender(_props);
      } else if (FallbackComponent) {
        return /* @__PURE__ */ react.exports.createElement(FallbackComponent, _props);
      } else {
        throw new Error("react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop");
      }
    }
    return this.props.children;
  };
  return ErrorBoundary2;
}(react.exports.Component);
function createErrorBoundary(opts) {
  const WithErrorBoundary = (props) => {
    return /* @__PURE__ */ jsx$1(ErrorBoundary, {
      fallbackRender: ({
        error
      }) => {
        if (opts.config.errorBoundary) {
          return opts.config.errorBoundary(error);
        }
        return /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx$1("h1", {
            children: "Something went wrong"
          }), /* @__PURE__ */ jsx$1("p", {
            children: error.message
          })]
        });
      },
      children: props.children
    });
  };
  WithErrorBoundary.displayName = `WithErrorBoundary${index.pascalise(opts.config.name)}`;
  return WithErrorBoundary;
}
const reactDomRender = (opts, elementToRender, domElement) => {
  const renderType = typeof opts.renderType === "function" ? opts.renderType() : opts.renderType || "render";
  const hasInnerHtml = domElement.innerHTML !== "";
  if (renderType === "hydrate" || hasInnerHtml) {
    opts.ReactDOM.hydrate(elementToRender, domElement);
  } else {
    opts.ReactDOM.render(elementToRender, domElement);
  }
  return null;
};
const mountLifecycle = (module, federatedRuntime, opts, defaultProps) => {
  const defaultMountId = `${module.scope}-${module.name}`;
  return async (props = defaultProps, mountId) => {
    const {
      React,
      config: { scope: scope2, name: name2, domElementId: domElementId2 }
    } = opts;
    let { rootComponent: rootComponent2 } = opts.config;
    const moduleKey = getModuleKey(scope2, name2);
    const savedModule = federatedRuntime.modules.get(moduleKey);
    const elementId = mountId || domElementId2 || defaultMountId;
    const domContainer = document.getElementById(elementId);
    if (!domContainer) {
      eventService.emit(
        {
          type: FederatedEvents.MODULE_MOUNT_ERROR,
          payload: {
            module,
            error: new Error(
              `Could not find dom container with id ${domElementId2}`
            )
          }
        },
        module
      );
    }
    if (savedModule == null ? void 0 : savedModule.bootstrap) {
      await savedModule.bootstrap();
    }
    rootComponent2 = rootComponent2 || federatedRuntime.getModuleRootComponent(
      module
    );
    try {
      federatedRuntime == null ? void 0 : federatedRuntime.setModuleState(module, FederatedModuleStatuses.MOUNTING);
      const propsToUse = props || defaultProps;
      federatedRuntime == null ? void 0 : federatedRuntime.validateProps(module, propsToUse);
      let loadedRootComponent;
      let useSuspense = false;
      if (opts.config.loadRootComponent) {
        loadedRootComponent = await opts.config.loadRootComponent();
        rootComponent2 = loadedRootComponent;
        federatedRuntime.setModuleRootComponent(
          module,
          rootComponent2
        );
        useSuspense = true;
      }
      if (rootComponent2) {
        const rootComponentElement = React.createElement(
          rootComponent2,
          propsToUse
        );
        const errorBoundary = createErrorBoundary(opts);
        let elementToRender = React.createElement(
          errorBoundary,
          {},
          rootComponentElement
        );
        if (useSuspense) {
          elementToRender = React.createElement(
            react.exports.Suspense,
            { fallback: React.createElement("div", null, "Loading...") },
            elementToRender
          );
        }
        eventService.emit(
          {
            type: FederatedEvents.MODULE_BEFORE_MOUNT,
            payload: {
              module
            }
          },
          module
        );
        if (domContainer) {
          reactDomRender(opts, elementToRender, domContainer);
        }
        eventService.emit(
          {
            type: FederatedEvents.MODULE_MOUNTED,
            payload: {
              module
            }
          },
          module
        );
        federatedRuntime == null ? void 0 : federatedRuntime.setModuleState(
          { scope: scope2, name: name2 },
          FederatedModuleStatuses.MOUNTED
        );
      }
    } catch (error) {
      eventService.emit(
        {
          type: FederatedEvents.MODULE_MOUNT_ERROR,
          payload: {
            module,
            error
          }
        },
        module
      );
      federatedRuntime == null ? void 0 : federatedRuntime.setModuleState(
        { scope: scope2, name: name2 },
        FederatedModuleStatuses.LOAD_ERROR
      );
    }
  };
};
const unmountLifecycle = (module, federatedRuntime, opts) => {
  try {
    const { ReactDOM: ReactDOM2 } = opts;
    federatedRuntime == null ? void 0 : federatedRuntime.setModuleState(module, FederatedModuleStatuses.UNMOUNTING);
    const domElementId2 = opts.config.domElementId || `${module.scope}-${module.name}`;
    const domContainer = document.getElementById(domElementId2);
    if (domContainer) {
      ReactDOM2.unmountComponentAtNode(domContainer);
      eventService.emit(
        {
          type: FederatedEvents.MODULE_UNMOUNTED,
          payload: {
            module
          }
        },
        module
      );
      federatedRuntime == null ? void 0 : federatedRuntime.setModuleState(
        module,
        FederatedModuleStatuses.UNMOUNTED
      );
    }
  } catch (error) {
    eventService.emit(
      {
        type: FederatedEvents.MODULE_UNMOUNT_ERROR,
        payload: {
          module,
          error
        }
      },
      module
    );
    federatedRuntime == null ? void 0 : federatedRuntime.setModuleState(
      module,
      FederatedModuleStatuses.UNMOUNT_ERROR
    );
  }
};
const updateLifecycle = (module, federatedRuntime, opts) => {
  return async (props) => {
    try {
      federatedRuntime == null ? void 0 : federatedRuntime.setModuleState(module, FederatedModuleStatuses.UPDATING);
      const propsToUse = props || opts.config.defaultProps;
      const moduleKey = getModuleKey(module.scope, module.name);
      const loadedModule = federatedRuntime.modules.get(moduleKey);
      eventService.emit(
        {
          type: FederatedEvents.MODULE_BEFORE_UPDATE,
          payload: {
            module
          }
        },
        module
      );
      if (!loadedModule) {
        eventService.emit(
          {
            type: FederatedEvents.MODULE_UPDATE_ERROR,
            payload: {
              module,
              error: new Error(`Could not find module with key ${moduleKey}`)
            }
          },
          module
        );
        return;
      }
      if (loadedModule == null ? void 0 : loadedModule.unmount) {
        await loadedModule.unmount();
      }
      if (loadedModule == null ? void 0 : loadedModule.mount) {
        await loadedModule.mount(propsToUse);
      }
      eventService.emit(
        {
          type: FederatedEvents.MODULE_UPDATED,
          payload: {
            module
          }
        },
        module
      );
    } catch (error) {
      eventService.emit(
        {
          type: FederatedEvents.MODULE_UPDATE_ERROR,
          payload: {
            module,
            error
          }
        },
        module
      );
      federatedRuntime == null ? void 0 : federatedRuntime.setModuleState(
        module,
        FederatedModuleStatuses.UPDATE_ERROR
      );
    }
  };
};
function validateModuleOptions(options) {
  if (!options.config) {
    throw new Error("Missing config");
  }
  if (!options.React) {
    throw new Error("Missing React");
  }
  if (!options.ReactDOM) {
    throw new Error("Missing ReactDOM");
  }
  if (!options.config.name) {
    throw new Error("Missing name");
  }
  if (!options.config.scope) {
    throw new Error("Missing scope");
  }
  if (!options.config.rootComponent && !options.config.loadRootComponent) {
    throw new Error("Missing rootComponent or loadRootComponent");
  }
  if (options.config.rootComponent && options.config.loadRootComponent) {
    throw new Error("Cannot have both rootComponent and loadRootComponent");
  }
}
function createFederatedReact(options) {
  validateModuleOptions(options);
  const {
    federatedRuntime,
    config
  } = options;
  const {
    rootComponent: rootComponent2
  } = config;
  const {
    domElementId: domElementId2 = `${config.scope}-${config.name}`,
    loadRootComponent,
    defaultProps,
    name: name2,
    scope: scope2,
    type: type2,
    description,
    propValidationFunction,
    activeWhenPaths: activeWhenPaths2,
    exceptWhenPaths: exceptWhenPaths2
  } = config;
  const moduleData = {
    scope: scope2,
    name: name2
  };
  const lifecycles = {
    bootstrap: () => bootstrapLifecycle(moduleData, federatedRuntime),
    mount: (props, mountId) => mountLifecycle(moduleData, federatedRuntime, options, defaultProps)(props, mountId),
    unmount: async () => unmountLifecycle(moduleData, federatedRuntime, options),
    update: async (props) => updateLifecycle(moduleData, federatedRuntime, options)(props)
  };
  return {
    domElementId: domElementId2,
    rootComponent: rootComponent2,
    loadRootComponent,
    activeWhenPaths: activeWhenPaths2 || [],
    exceptWhenPaths: exceptWhenPaths2 || [],
    status: FederatedModuleStatuses.NOT_LOADED,
    description,
    name: name2,
    scope: scope2,
    type: type2,
    validateProps: (props) => {
      if (propValidationFunction) {
        return propValidationFunction(props);
      }
      return true;
    },
    ...lifecycles
  };
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(val) {
  if (val === null || val === void 0) {
    throw new TypeError("Object.assign cannot be called with null or undefined");
  }
  return Object(val);
}
function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    }
    var test1 = new String("abc");
    test1[5] = "de";
    if (Object.getOwnPropertyNames(test1)[0] === "5") {
      return false;
    }
    var test2 = {};
    for (var i = 0; i < 10; i++) {
      test2["_" + String.fromCharCode(i)] = i;
    }
    var order2 = Object.getOwnPropertyNames(test2).map(function(n2) {
      return test2[n2];
    });
    if (order2.join("") !== "0123456789") {
      return false;
    }
    var test3 = {};
    "abcdefghijklmnopqrst".split("").forEach(function(letter) {
      test3[letter] = letter;
    });
    if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}
shouldUseNative() ? Object.assign : function(target, source) {
  var from;
  var to = toObject(target);
  var symbols;
  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);
    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);
      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }
  return to;
};
/** @license React v17.0.2
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = require$$0, g = 60103;
reactJsxRuntime_production_min.Fragment = 60107;
if ("function" === typeof Symbol && Symbol.for) {
  var h = Symbol.for;
  g = h("react.element");
  reactJsxRuntime_production_min.Fragment = h("react.fragment");
}
var m = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n = Object.prototype.hasOwnProperty, p = { key: true, ref: true, __self: true, __source: true };
function q(c, a, k) {
  var b, d = {}, e = null, l2 = null;
  void 0 !== k && (e = "" + k);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (l2 = a.ref);
  for (b in a)
    n.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps)
    for (b in a = c.defaultProps, a)
      void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: g, type: c, key: e, ref: l2, props: d, _owner: m.current };
}
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
const jsx = jsxRuntime.exports.jsx;
const Fragment = jsxRuntime.exports.Fragment;
const App = () => {
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx("h1", {
      children: "Hello"
    })
  });
};
const {
  name,
  scope,
  mount,
  unmount,
  bootstrap,
  update,
  exceptWhenPaths,
  activeWhenPaths,
  type,
  domElementId,
  status,
  rootComponent
} = createFederatedReact({
  React: require$$0,
  ReactDOM,
  federatedRuntime: initFederatedRuntime(),
  config: {
    scope: "vfuk-federated-journey-example",
    name: "ReactFederatedJourney",
    type: "journey-module",
    activeWhenPaths: ["/", "/mixed"],
    exceptWhenPaths: ["/asasd"],
    domElementId: "root",
    rootComponent: App
  }
});
export { activeWhenPaths, bootstrap, domElementId, exceptWhenPaths, mount, name, rootComponent, scope, status, type, unmount, update };
