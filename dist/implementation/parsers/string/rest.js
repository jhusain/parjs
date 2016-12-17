"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
var PrsRest = (function (_super) {
    __extends(PrsRest, _super);
    function PrsRest() {
        var _this = _super.apply(this, arguments) || this;
        _this.displayName = "rest";
        _this.isLoud = true;
        _this.expecting = "zero or more characters";
        return _this;
    }
    PrsRest.prototype._apply = function (pr) {
        var position = pr.position, input = pr.input;
        var text = input.substr(Math.min(position, input.length));
        pr.position = input.length;
        pr.value = text;
        pr.kind = result_1.ResultKind.OK;
    };
    return PrsRest;
}(action_1.ParjsBasicAction));
exports.PrsRest = PrsRest;

//# sourceMappingURL=rest.js.map