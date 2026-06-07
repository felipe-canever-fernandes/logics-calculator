import { get_parser } from "./lark.js";
import { transformer } from "./transformer.js";
export const parser = get_parser({ transformer });
