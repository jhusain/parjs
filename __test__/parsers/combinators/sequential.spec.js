"use strict";
/**
 * Created by lifeg on 10/12/2016.
 */
/**
 * Created by lifeg on 10/12/2016.
 */
var custom_matchers_1 = require("../../custom-matchers");
var parsers_1 = require("../../../src/bindings/parsers");
var result_1 = require("../../../src/abstract/basics/result");
var _ = require("lodash");
var goodInput = "abcd";
var softBadInput = "a";
var hardBadInput = "ab";
var excessInput = "abcde";
var uState = {};
var fstLoud = parsers_1.Parjs.string("ab");
var sndLoud = parsers_1.Parjs.string("cd");
describe("sequential combinators", function () {
    describe("then combinators", function () {
        describe("loud then loud", function () {
            var parser = fstLoud.then(sndLoud);
            it("succeeds", function () {
                custom_matchers_1.expectSuccess(parser.parse(goodInput), ["ab", "cd"]);
            });
            it("fails softly on first fail", function () {
                custom_matchers_1.expectFailure(parser.parse(softBadInput), result_1.ResultKind.SoftFail);
            });
            it("fails hard on 2nd fail", function () {
                custom_matchers_1.expectFailure(parser.parse(hardBadInput), result_1.ResultKind.HardFail);
            });
            it("fails on excess input", function () {
                custom_matchers_1.expectFailure(parser.parse(excessInput), result_1.ResultKind.SoftFail);
            });
            it("fails hard on first hard fail", function () {
                var parser2 = parsers_1.Parjs.seq(parsers_1.Parjs.fail("", "HardFail"), parsers_1.Parjs.string("hi"));
                custom_matchers_1.expectFailure(parser2.parse("hi"), "HardFail");
            });
            it("fails fatally on 2nd fatal fail", function () {
                var parser2 = parsers_1.Parjs.string("hi").then(parsers_1.Parjs.fail("", "FatalFail"));
                custom_matchers_1.expectFailure(parser2.parse("hi"), "FatalFail");
            });
            it("chain zero-matching parsers", function () {
                var parser2 = parsers_1.Parjs.string("hi").then(parsers_1.Parjs.rest, parsers_1.Parjs.rest);
                custom_matchers_1.expectSuccess(parser2.parse("hi"), ["hi", "", ""]);
            });
        });
        describe("loud then quiet", function () {
            var parser = fstLoud.then(sndLoud.quiet);
            it("succeeds", function () {
                custom_matchers_1.expectSuccess(parser.parse(goodInput), "ab");
            });
        });
        describe("quiet then loud", function () {
            var parser = fstLoud.quiet.then(sndLoud);
            it("succeeds", function () {
                custom_matchers_1.expectSuccess(parser.parse(goodInput), "cd");
            });
        });
        describe("quiet then quiet", function () {
            var parser = fstLoud.quiet.then(sndLoud.quiet);
            it("succeeds", function () {
                custom_matchers_1.expectSuccess(parser.parse(goodInput), undefined);
            });
        });
        describe("loud then loud then zero-consuming quiet", function () {
            var parser = fstLoud.then(sndLoud).then(parsers_1.Parjs.eof);
            it("succeeds", function () {
                custom_matchers_1.expectSuccess(parser.parse(goodInput), ["ab", "cd"]);
            });
            it("fails hard when 3rd fails", function () {
                custom_matchers_1.expectFailure(parser.parse(excessInput), result_1.ResultKind.HardFail);
            });
        });
        describe("1 quiet using seq combinator", function () {
            var parser = parsers_1.Parjs.seq(fstLoud.quiet);
            it("succeeds with empty array value", function () {
                custom_matchers_1.expectSuccess(parser.parse("ab"), []);
            });
        });
        describe("empty seq combinator same as no match, return []", function () {
            var parser = parsers_1.Parjs.seq();
            it("succeeds on empty input", function () {
                custom_matchers_1.expectSuccess(parser.parse(""), []);
            });
            it("fails on excess input", function () {
                custom_matchers_1.expectFailure(parser.parse("a"), result_1.ResultKind.SoftFail);
            });
        });
    });
    describe("many combinators", function () {
        describe("regular many", function () {
            var parser = fstLoud.many();
            it("success on empty input", function () {
                custom_matchers_1.expectSuccess(parser.parse(""), []);
            });
            it("failure on non-empty input without any matches", function () {
                custom_matchers_1.expectFailure(parser.parse("12"), result_1.ResultKind.SoftFail);
            });
            it("success on single match", function () {
                custom_matchers_1.expectSuccess(parser.parse("ab"), ["ab"]);
            });
            it("success on N matches", function () {
                custom_matchers_1.expectSuccess(parser.parse("ababab"), ["ab", "ab", "ab"]);
            });
            it("chains to EOF correctly", function () {
                var endEof = parser.then(parsers_1.Parjs.eof);
                custom_matchers_1.expectSuccess(endEof.parse("abab"), ["ab", "ab"]);
            });
            it("fails hard when many fails hard", function () {
                var parser2 = parsers_1.Parjs.fail("", "HardFail").many();
                custom_matchers_1.expectFailure(parser2.parse(""), "HardFail");
            });
        });
        describe("many with zero-length match", function () {
            var parser = parsers_1.Parjs.result(0).many();
            it("guards against zero match in inner parser", function () {
                expect(function () { return parser.parse(""); }).toThrow();
            });
            it("ignores guard when given max iterations", function () {
                var parser = parsers_1.Parjs.result(0).many(undefined, 10);
                custom_matchers_1.expectSuccess(parser.parse(""), _.range(0, 10).map(function (x) { return 0; }));
            });
        });
        describe("many with min successes", function () {
            var parser = fstLoud.many(2);
            it("succeeds when number of successes >= minimum", function () {
                custom_matchers_1.expectSuccess(parser.parse("abab"), ["ab", "ab"]);
            });
            it("fails when number of successses < minimum", function () {
                custom_matchers_1.expectFailure(parser.parse("ab"), result_1.ResultKind.HardFail);
            });
        });
        describe("many with bounded iterations, min successes", function () {
            it("guards against impossible requirements", function () {
                expect(function () { return fstLoud.many(2, 1); }).toThrow();
            });
            var parser = fstLoud.many(1, 2);
            it("succeeds when appropriate", function () {
                custom_matchers_1.expectSuccess(parser.parse("abab"), ["ab", "ab"]);
            });
            it("fails when there is excess input", function () {
                custom_matchers_1.expectFailure(parser.parse("ababab"), result_1.ResultKind.SoftFail);
            });
        });
        describe("many on quiet parser", function () {
            var parser = fstLoud.quiet.many();
            it("succeeds without a value", function () {
                custom_matchers_1.expectSuccess(parser.parse("abab"), undefined);
            });
        });
    });
    describe("exactly combinator", function () {
        var parser = fstLoud.exactly(2);
        it("succeeds with exact matches", function () {
            custom_matchers_1.expectSuccess(parser.parse("abab"), ["ab", "ab"]);
        });
        it("quiet exactly succeeds without value", function () {
            var parser = fstLoud.quiet.exactly(2);
            custom_matchers_1.expectSuccess(parser.parse("abab"), undefined);
        });
        it("hard fails with 0 < matches <= N", function () {
            custom_matchers_1.expectFailure(parser.parse("ab"), result_1.ResultKind.HardFail);
        });
        it("soft fails with matches == 0", function () {
            custom_matchers_1.expectFailure(parser.parse("a"), result_1.ResultKind.SoftFail);
        });
    });
    describe("manySepBy combinator", function () {
        var parser = fstLoud.manySepBy(parsers_1.Parjs.string(", "));
        it("works with max iterations", function () {
            var parser2 = fstLoud.manySepBy(parsers_1.Parjs.string(", "), 2);
            var parser3 = parser2.then(parsers_1.Parjs.string(", ab").quiet);
            custom_matchers_1.expectSuccess(parser3.parse("ab, ab, ab"));
        });
        it("succeeds with empty input", function () {
            custom_matchers_1.expectSuccess(parser.parse(""), []);
        });
        it("many fails hard on 1st application", function () {
            var parser2 = parsers_1.Parjs.fail("", "HardFail").manySepBy(parsers_1.Parjs.result(""));
            custom_matchers_1.expectFailure(parser2.parse(""), "HardFail");
        });
        it("sep fails hard", function () {
            var parser2 = fstLoud.manySepBy(parsers_1.Parjs.fail("", "HardFail"));
            custom_matchers_1.expectFailure(parser2.parse("ab, ab"), "HardFail");
        });
        it("sep+many that don't consume throw without max iterations", function () {
            var parser2 = parsers_1.Parjs.string("").manySepBy(parsers_1.Parjs.string(""));
            expect(function () { return parser2.parse(""); }).toThrow();
        });
        it("sep+many that don't consume succeed with max iterations", function () {
            var parser2 = parsers_1.Parjs.string("").manySepBy(parsers_1.Parjs.string(""), 2);
            custom_matchers_1.expectSuccess(parser2.parse(""), ["", ""]);
        });
        it("many that fails hard on 2nd iteration", function () {
            var many = parsers_1.Parjs.string("a").then(parsers_1.Parjs.string("b")).str.manySepBy(parsers_1.Parjs.string(", "));
            custom_matchers_1.expectFailure(many.parse("ab, ac"), "HardFail");
        });
        it("succeeds with non-empty input", function () {
            custom_matchers_1.expectSuccess(parser.parse("ab, ab"), ["ab", "ab"]);
        });
        it("chains into terminating separator", function () {
            var parser2 = parser.then(parsers_1.Parjs.string(", ").quiet);
            custom_matchers_1.expectSuccess(parser2.parse("ab, ab, "), ["ab", "ab"]);
        });
        it("fails soft if first many fails", function () {
            custom_matchers_1.expectFailure(parser.parse("xa"), result_1.ResultKind.SoftFail);
        });
    });
    describe("manyTill combinator", function () {
        var parser = fstLoud.manyTill(sndLoud);
        it("succeeds matching 1 then till", function () {
            custom_matchers_1.expectSuccess(parser.parse("abcd"), ["ab"]);
        });
        it("succeeds matching 1 then till, chains", function () {
            var parser2 = parser.then(fstLoud.quiet);
            custom_matchers_1.expectSuccess(parser2.parse("abcdab"), ["ab"]);
        });
        it("fails hard when till fails hard", function () {
            var parser2 = parsers_1.Parjs.string("a").manyTill(parsers_1.Parjs.fail("", "HardFail"));
            custom_matchers_1.expectFailure(parser2.parse("a"), "HardFail");
        });
        it("fails hard when many failed hard", function () {
            var parser2 = parsers_1.Parjs.fail("", "HardFail").manyTill(parsers_1.Parjs.string("a"));
            custom_matchers_1.expectFailure(parser2.parse(""), "HardFail");
        });
        it("guards against zero-match in many", function () {
            var parser2 = parsers_1.Parjs.result("").manyTill(parsers_1.Parjs.string("a"));
            expect(function () { return parser2.parse(" a"); }).toThrow();
        });
        it("till optional mode", function () {
            var parser2 = parsers_1.Parjs.string("a").manyTill(parsers_1.Parjs.string("b"), true);
            custom_matchers_1.expectSuccess(parser2.parse("a"), ["a"]);
        });
        it("fails soft when many fails 1st time without till", function () {
            custom_matchers_1.expectFailure(parser.parse("1"), result_1.ResultKind.SoftFail);
        });
        it("fails hard when many fails 2nd time without till", function () {
            custom_matchers_1.expectFailure(parser.parse("ab1"), result_1.ResultKind.HardFail);
        });
    });
});
//# sourceMappingURL=sequential.spec.js.map