"use strict";
var instance_combinators_1 = require("./instance-combinators");
var parsers_1 = require("../implementation/parsers");
var combinators_1 = require("../implementation/combinators");
var char_indicators_1 = require("../functions/char-indicators");
var result_1 = require("../abstract/basics/result");
var int_1 = require("../implementation/parsers/numbers/int");
var float_1 = require("../implementation/parsers/numbers/float");
var _ = require("lodash");
/**
 * Created by lifeg on 24/11/2016.
 */
function wrap(action) {
    return new instance_combinators_1.ParjsParser(action);
}
var ParjsParsers = (function () {
    function ParjsParsers() {
    }
    ParjsParsers.prototype.any = function () {
        var parsers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parsers[_i] = arguments[_i];
        }
        return wrap(new combinators_1.PrsAlts(parsers.map(function (x) { return x.action; })));
    };
    ParjsParsers.prototype.seq = function () {
        var parsers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parsers[_i] = arguments[_i];
        }
        return wrap(new combinators_1.PrsSeq(parsers.map(function (x) { return x.action; })));
    };
    Object.defineProperty(ParjsParsers.prototype, "anyChar", {
        get: function () {
            return wrap(new parsers_1.PrsStringLen(1));
        },
        enumerable: true,
        configurable: true
    });
    ParjsParsers.prototype.charWhere = function (predicate) {
        return wrap(new parsers_1.PrsCharWhere(predicate));
    };
    ParjsParsers.prototype.anyCharOf = function (options) {
        return this.charWhere(function (x) { return options.includes(x); });
    };
    ParjsParsers.prototype.noCharOf = function (options) {
        return this.charWhere(function (x) { return !options.includes(x); });
    };
    Object.defineProperty(ParjsParsers.prototype, "digit", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isDigit);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParsers.prototype, "hex", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isHex);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParsers.prototype, "upper", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isUpper);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParsers.prototype, "lower", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isLower);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParsers.prototype, "asciiLower", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isAsciiLower);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParsers.prototype, "asciiUpper", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isAsciiUpper);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParsers.prototype, "newline", {
        get: function () {
            return wrap(new parsers_1.PrsNewline(false));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParsers.prototype, "unicodeNewline", {
        get: function () {
            return wrap(new parsers_1.PrsNewline(true));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParsers.prototype, "space", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isInlineSpace);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParsers.prototype, "unicodeSpace", {
        get: function () {
            return this.charWhere(char_indicators_1.Chars.isUnicodeInlineSpace);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParsers.prototype, "spaces", {
        get: function () {
            return this.space.many().str;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParsers.prototype, "unicodeSpaces", {
        get: function () {
            return this.unicodeSpaces.many().str;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParsers.prototype, "rest", {
        get: function () {
            return wrap(new parsers_1.PrsRest());
        },
        enumerable: true,
        configurable: true
    });
    ParjsParsers.prototype.string = function (str) {
        return wrap(new parsers_1.PrsString(str));
    };
    ParjsParsers.prototype.anyStringOf = function () {
        var strs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strs[_i] = arguments[_i];
        }
        return wrap(new parsers_1.AnyStringOf(strs));
    };
    ParjsParsers.prototype.stringLen = function (length) {
        return wrap(new parsers_1.PrsStringLen(length));
    };
    ParjsParsers.prototype.regexp = function (regex) {
        return wrap(new parsers_1.PrsRegexp(regex));
    };
    ParjsParsers.prototype.result = function (x) {
        return wrap(new parsers_1.PrsResult(x));
    };
    Object.defineProperty(ParjsParsers.prototype, "eof", {
        get: function () {
            return wrap(new parsers_1.PrsEof());
        },
        enumerable: true,
        configurable: true
    });
    ParjsParsers.prototype.fail = function (expecting, kind) {
        if (expecting === void 0) { expecting = ""; }
        if (kind === void 0) { kind = result_1.ResultKind.SoftFail; }
        return wrap(new parsers_1.PrsFail(kind, expecting));
    };
    Object.defineProperty(ParjsParsers.prototype, "position", {
        get: function () {
            return wrap(new parsers_1.PrsPosition());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParsers.prototype, "state", {
        get: function () {
            return wrap(new parsers_1.PrsState());
        },
        enumerable: true,
        configurable: true
    });
    ParjsParsers.prototype.int = function (options) {
        options = _.defaults({}, options, {
            base: 10,
            allowSign: true
        });
        return wrap(new int_1.PrsInt(options));
    };
    ParjsParsers.prototype.float = function (options) {
        options = _.defaults({}, options, {
            allowImplicitZero: true,
            allowExponent: true,
            allowSign: true,
            allowFloatingPoint: true
        });
        return wrap(new float_1.PrsFloat(options));
    };
    return ParjsParsers;
}());
exports.ParjsParsers = ParjsParsers;
exports.Parjs = new ParjsParsers();

//# sourceMappingURL=parsers.js.map