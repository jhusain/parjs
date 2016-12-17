import { ParjsBasicAction } from "../../../base/action";
import { ParsingState } from "../../../abstract/basics/state";
/**
 * Created by User on 22-Nov-16.
 */
export declare class PrsResult extends ParjsBasicAction {
    private result;
    displayName: string;
    isLoud: boolean;
    expecting: string;
    constructor(result: any);
    _apply(ps: ParsingState): void;
}