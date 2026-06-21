import { get_parser } from "./lark.js";
import { LogicTransformer } from "./transformer.js";

const transformer = new LogicTransformer();
export const parser = get_parser({ transformer });
