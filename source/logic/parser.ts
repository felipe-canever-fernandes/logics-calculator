import { get_parser } from "../parser.js";
import { transformer } from "./transformer.js";

export const parser = get_parser({ transformer });
