"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var common_1 = require("../../common");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsMany = (function (_super) {
    __extends(PrsMany, _super);
    function PrsMany(inner, maxIterations, minSuccesses) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.maxIterations = maxIterations;
        _this.minSuccesses = minSuccesses;
        _this.displayName = "many";
        _this.isLoud = inner.isLoud;
        _this.expecting = inner.expecting;
        maxIterations >= minSuccesses || common_1.Issues.willAlwaysFail(_this);
        return _this;
    }
    PrsMany.prototype._apply = function (ps) {
        var _a = this, inner = _a.inner, maxIterations = _a.maxIterations, minSuccesses = _a.minSuccesses;
        var position = ps.position;
        var arr = [];
        var i = 0;
        while (true) {
            inner.apply(ps);
            if (!ps.isOk)
                break;
            if (i >= maxIterations)
                break;
            if (maxIterations === Infinity && ps.position === position) {
                common_1.Issues.guardAgainstInfiniteLoop(this);
            }
            position = ps.position;
            arr.maybePush(ps.value);
            i++;
        }
        if (ps.kind >= result_1.ResultKind.HardFail) {
            return;
        }
        if (i < minSuccesses) {
            ps.kind = i === 0 ? result_1.ResultKind.SoftFail : result_1.ResultKind.HardFail;
            return;
        }
        ps.value = arr;
        //recover from the last failure.
        ps.position = position;
        ps.kind = result_1.ResultKind.OK;
    };
    return PrsMany;
}(action_1.ParjsAction));
exports.PrsMany = PrsMany;

//# sourceMappingURL=many.js.map