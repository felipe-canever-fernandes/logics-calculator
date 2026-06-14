import { get_parser } from "./lark.js";
import { printer } from "./printer.js";
export const parser = get_parser({ transformer: printer });
