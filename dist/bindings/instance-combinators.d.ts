import { BaseParjsParser } from "../base/parser";
import { LoudParser } from "../abstract/combinators/loud";
import { FailIndicator } from "../abstract/basics/result";
import { QuietParser } from "../abstract/combinators/quiet";
import { AnyParser } from "../abstract/combinators/any";
export declare class ParjsParser extends BaseParjsParser implements LoudParser<any>, QuietParser {
    between(preceding: AnyParser, proceeding?: AnyParser): any;
    readonly backtrack: ParjsParser;
    mustCapture(failType?: FailIndicator): ParjsParser;
    or(...others: AnyParser[]): any;
    map(f: (result: any) => any): ParjsParser;
    readonly q: ParjsParser;
    readonly soft: ParjsParser;
    then(...next: any[]): any;
    many(minSuccesses?: number, maxIters?: number): ParjsParser;
    manyTill(till: AnyParser, tillOptional?: boolean): ParjsParser;
    manySepBy(sep: AnyParser, maxIterations?: number): ParjsParser;
    exactly(count: number): ParjsParser;
    withState(reducer: ((state: any, result: any) => any) | Object): ParjsParser;
    result(r: any): ParjsParser;
    readonly not: ParjsParser;
    orVal(x: any): ParjsParser;
    cast(): this;
    readonly str: ParjsParser;
    must(condition: (result: any) => boolean, name?: string, fail?: FailIndicator): ParjsParser;
    mustNotBeOf(...options: any[]): ParjsParser;
    mustBeOf(...options: any[]): ParjsParser;
    readonly mustBeNonEmpty: ParjsParser;
}
