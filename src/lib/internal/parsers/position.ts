/**
 * @module parjs/internal/implementation/parsers
 */
/** */

import {ParsingState} from "../state";
import {ResultKind} from "../reply";
import {Parjser} from "../../parjser";
import {ParjserBase} from "../parser";

/**
 * Returns a parser that succeeds without consuming input and yields the
 * current position as an integer.
 */
export function position(): Parjser<number> {
    return new class Position extends ParjserBase {
        expecting = "anything";
        type = "position";
        _apply(ps: ParsingState) {
            ps.value = ps.position;
            ps.kind = ResultKind.Ok;
        }
    }();
}
