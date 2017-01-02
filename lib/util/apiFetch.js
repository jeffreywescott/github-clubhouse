'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.apiFetch = apiFetch;
exports.apiFetchAllPages = apiFetchAllPages;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _parseLinkHeader = require('parse-link-header');

var _parseLinkHeader2 = _interopRequireDefault(_parseLinkHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_HEADERS = {
  Accept: 'application/json'
};

var APIError = function (_Error) {
  (0, _inherits3.default)(APIError, _Error);

  function APIError(status, statusText, url) {
    (0, _classCallCheck3.default)(this, APIError);

    var message = 'API Error ' + status + ' (' + statusText + ') trying to invoke API (url = \'' + url + '\')';

    var _this = (0, _possibleConstructorReturn3.default)(this, (APIError.__proto__ || (0, _getPrototypeOf2.default)(APIError)).call(this, message));

    _this.name = 'APIError';
    _this.status = status;
    _this.statusText = statusText;
    _this.url = url;
    return _this;
  }

  return APIError;
}(Error);

function apiFetchRaw(url) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var headers = (0, _assign2.default)({}, DEFAULT_HEADERS, opts.headers);
  var options = (0, _assign2.default)({}, opts, { headers: headers });
  return (0, _nodeFetch2.default)(url, options);
}

function apiFetch(url) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return apiFetchRaw(url, opts).then(function (resp) {
    if (!resp.ok) {
      throw new APIError(resp.status, resp.statusText, url);
    }
    return resp.json();
  });
}

function apiFetchAllPages(url) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var prevResults = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  return apiFetchRaw(url, opts).then(function (resp) {
    if (!resp.ok) {
      throw new APIError(resp.status, resp.statusText, url);
    }
    var link = (0, _parseLinkHeader2.default)(resp.headers.get('Link'));
    var next = null;
    if (link && link.next) {
      next = link.next.results && !eval(link.next.results) ? null : link.next.url; // eslint-disable-line no-eval
    }
    return resp.json().then(function (results) {
      if (next) {
        return apiFetchAllPages(next, opts, prevResults.concat(results));
      }
      return prevResults.concat(results);
    });
  });
}