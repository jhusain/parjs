import { ParjsAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
import { AnyParserAction } from "../../../abstract/basics/action";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsBacktrack extends ParjsAction {
    private inner;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(inner: AnyParserAction);
    _apply(ps: ParsingState): void;
}