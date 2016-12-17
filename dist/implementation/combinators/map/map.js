"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var common_1 = require("../../common");
/**
 * Created by User on 21-Nov-16.
 */
var MapParser = (function (_super) {
    __extends(MapParser, _super);
    function MapParser(inner, map) {
        var _this = _super.call(this) || this;
        _this.inner = inner;
        _this.map = map;
        _this.displayName = "map";
        _this.isLoud = true;
        inner.isLoud || common_1.Issues.quietParserNotPermitted(_this);
        _this.expecting = inner.expecting;
        return _this;
    }
    MapParser.prototype._apply = function (ps) {
        var _a = this, inner = _a.inner, map = _a.map;
        inner.apply(ps);
        if (!ps.isOk) {
            return;
        }
        ps.value = map(ps.value);
    };
    return MapParser;
}(action_1.ParjsAction));
exports.MapParser = MapParser;

//# sourceMappingURL=map.js.map