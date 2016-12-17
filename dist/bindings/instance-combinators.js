"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by User on 22-Nov-16.
 */
var combinators_1 = require("../implementation/combinators");
var parser_1 = require("../base/parser");
var _ = require("lodash");
var predicates_1 = require("../functions/predicates");
var result_1 = require("../abstract/basics/result");
var soft_1 = require("../implementation/combinators/alternatives/soft");
function wrap(action) {
    return new ParjsParser(action);
}
var ParjsParser = (function (_super) {
    __extends(ParjsParser, _super);
    function ParjsParser() {
        return _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ParjsParser.prototype, "backtrack", {
        get: function () {
            return wrap(new combinators_1.PrsBacktrack(this.action));
        },
        enumerable: true,
        configurable: true
    });
    ParjsParser.prototype.mustCapture = function (failType) {
        if (failType === void 0) { failType = result_1.ResultKind.HardFail; }
        return wrap(new combinators_1.PrsMustCapture(this.action, failType));
    };
    ParjsParser.prototype.or = function () {
        var others = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            others[_i] = arguments[_i];
        }
        return wrap(new combinators_1.PrsAlts([this].concat(others).map(function (x) { return x.action; })));
    };
    ParjsParser.prototype.map = function (f) {
        return wrap(new combinators_1.MapParser(this.action, f));
    };
    Object.defineProperty(ParjsParser.prototype, "quiet", {
        get: function () {
            return wrap(new combinators_1.PrsQuiet(this.action));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParjsParser.prototype, "soft", {
        get: function () {
            return wrap(new soft_1.PrsSoft(this.action));
        },
        enumerable: true,
        configurable: true
    });
    ParjsParser.prototype.then = function (next) {
        if (_.isFunction(next)) {
            return wrap(new combinators_1.PrsSeqFunc(this.action, [next]));
        }
        else {
            var seqParse = wrap(new combinators_1.PrsSeq([this.action, next.action]));
            if (this.isLoud !== next.isLoud) {
                return seqParse.map(function (x) { return x[0]; });
            }
            else if (!this.isLoud) {
                return seqParse.quiet;
            }
            return seqParse;
        }
    };
    ParjsParser.prototype.many = function (minSuccesses, maxIters) {
        if (minSuccesses === void 0) { minSuccesses = 0; }
        if (maxIters === void 0) { maxIters = Infinity; }
        return wrap(new combinators_1.PrsMany(this.action, maxIters, minSuccesses));
    };
    ParjsParser.prototype.manyTill = function (till, tillOptional) {
        if (tillOptional === void 0) { tillOptional = false; }
        return wrap(new combinators_1.PrsManyTill(this.action, till.action, tillOptional));
    };
    ParjsParser.prototype.manySepBy = function (sep, maxIterations) {
        if (maxIterations === void 0) { maxIterations = Infinity; }
        return wrap(new combinators_1.PrsManySepBy(this.action, sep.action, maxIterations));
    };
    ParjsParser.prototype.exactly = function (count) {
        return wrap(new combinators_1.PrsExactly(this.action, count));
    };
    ParjsParser.prototype.withState = function (reducer) {
        return wrap(new combinators_1.PrsWithState(this.action, reducer));
    };
    ParjsParser.prototype.result = function (r) {
        return wrap(new combinators_1.PrsMapResult(this.action, r));
    };
    Object.defineProperty(ParjsParser.prototype, "not", {
        get: function () {
            return wrap(new combinators_1.PrsNot(this.action));
        },
        enumerable: true,
        configurable: true
    });
    ParjsParser.prototype.orVal = function (x) {
        return wrap(new combinators_1.PrsAltVal(this.action, x));
    };
    ParjsParser.prototype.cast = function () {
        return this;
    };
    Object.defineProperty(ParjsParser.prototype, "str", {
        get: function () {
            return wrap(new combinators_1.PrsStr(this.action));
        },
        enumerable: true,
        configurable: true
    });
    ParjsParser.prototype.must = function (condition, name, fail) {
        if (name === void 0) { name = "(unnamed condition)"; }
        if (fail === void 0) { fail = result_1.ResultKind.HardFail; }
        return wrap(new combinators_1.PrsMust(this.action, condition, fail, name));
    };
    ParjsParser.prototype.mustNotBeOf = function () {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        return this.must(function (x) { return !options.includes(x); }, "none of: " + options.join(", "));
    };
    ParjsParser.prototype.mustBeOf = function () {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        return this.must(function (x) { return options.includes(x); }, "one of: " + options.join(", "));
    };
    Object.defineProperty(ParjsParser.prototype, "mustBeNonEmpty", {
        get: function () {
            return this.must(function (x) {
                return predicates_1.Predicates.nonEmpty(x);
            }, "be non-empty", result_1.ResultKind.HardFail);
        },
        enumerable: true,
        configurable: true
    });
    ParjsParser.prototype.alts = function () {
        var others = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            others[_i] = arguments[_i];
        }
        return wrap(new combinators_1.PrsAlts(others.map(function (x) { return x.action; })));
    };
    return ParjsParser;
}(parser_1.BaseParjsParser));
exports.ParjsParser = ParjsParser;

//# sourceMappingURL=instance-combinators.js.map