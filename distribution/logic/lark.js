//
//  Lark.js stand-alone parser
//===============================
"use strict";
/**
    This is the main entrypoint into the generated Lark parser.

  @param {object} options An object with the following optional properties:

      - transformer: an object of {rule: callback}, or an instance of Transformer
      - propagate_positions (bool): should all tree nodes calculate line/column info?
      - tree_class (Tree): a class that extends Tree, to be used for creating the parse tree.
      - debug (bool): in case of error, should the parser output debug info to the console?

  @returns {Lark} an object which provides the following methods:

    - parse
    - parse_interactive
    - lex

*/
function get_parser(options = {}) {
    if (options.transformer &&
        options.transformer.constructor.name === "object") {
        options.transformer = Transformer.fromObj(options.transformer);
    }
    return Lark._load_from_dict({ data: DATA, memo: MEMO, ...options });
}
const NO_VALUE = {};
class _Decoratable {
}
const Discard = {};
//
//   Implementation of Scanner + module emulation for Python's stdlib re
// -------------------------------------------------------------------------
const re = {
    escape(string) {
        // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    },
    compile(regex, flags) {
        // May throw re.error
        return new RegExp(regex, flags);
    },
    error: SyntaxError,
};
function _get_match(re_, regexp, s, flags) {
    const m = re_.compile(regexp, flags).exec(s);
    if (m != null)
        return m[0];
}
class Scanner {
    constructor(terminals, g_regex_flags, re_, use_bytes, match_whole = false) {
        this.terminals = terminals;
        this.g_regex_flags = g_regex_flags;
        this.re_ = re_;
        this.use_bytes = use_bytes;
        this.match_whole = match_whole;
        this.allowed_types = new Set(this.terminals.map((t) => t.name));
        this._regexps = this._build_mres(terminals);
    }
    _build_mres(terminals) {
        // TODO deal with priorities!
        let postfix = this.match_whole ? "$" : "";
        let patterns_by_flags = segment_by_key(terminals, (t) => t.pattern.flags.join(""));
        let regexps = [];
        for (let [flags, patterns] of patterns_by_flags) {
            const pattern = patterns
                .map((t) => `(?<${t.name}>${t.pattern.to_regexp() + postfix})`)
                .join("|");
            regexps.push(new RegExp(pattern, this.g_regex_flags + flags + "y"));
        }
        return regexps;
    }
    match(text, pos) {
        for (const re of this._regexps) {
            re.lastIndex = pos;
            let m = re.exec(text);
            if (m) {
                // Find group. Ugly hack, but javascript is forcing my hand.
                let group = null;
                for (let [k, v] of Object.entries(m.groups)) {
                    if (v) {
                        group = k;
                        break;
                    }
                }
                return [m[0], group];
            }
        }
    }
}
//
//  Start of library code
// --------------------------
const util = typeof require !== "undefined" && require("util");
class ABC {
}
const NotImplemented = {};
function dict_items(d) {
    return Object.entries(d);
}
function dict_keys(d) {
    return Object.keys(d);
}
function dict_values(d) {
    return Object.values(d);
}
function dict_pop(d, key) {
    if (key === undefined) {
        key = Object.keys(d)[0];
    }
    let value = d[key];
    delete d[key];
    return value;
}
function dict_get(d, key, otherwise = null) {
    return d[key] || otherwise;
}
function dict_update(self, other) {
    if (self.constructor.name === "Map") {
        for (const [k, v] of dict_items(other)) {
            self.set(k, v);
        }
    }
    else {
        for (const [k, v] of dict_items(other)) {
            self[k] = v;
        }
    }
}
function make_constructor(cls) {
    return function () {
        return new cls(...arguments);
    };
}
function range(start, end) {
    if (end === undefined) {
        end = start;
        start = 0;
    }
    const res = [];
    for (let i = start; i < end; i++)
        res.push(i);
    return res;
}
function format(s) {
    let counter = 0;
    let args = [...arguments].slice(1);
    return s.replace(/%([sr])/g, function () {
        const t = arguments[1];
        const item = args[counter++];
        if (t === "r") {
            return util
                ? util.inspect(item, false, null, true)
                : JSON.stringify(item, null, 0);
        }
        else {
            return item;
        }
    });
}
function union(setA, setB) {
    let _union = new Set(setA);
    for (const elem of setB) {
        _union.add(elem);
    }
    return _union;
}
function intersection(setA, setB) {
    let _intersection = new Set();
    for (const elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}
function set_subtract(a, b) {
    return [...a].filter((e) => !b.has(e));
}
function dict(d) {
    return { ...d };
}
function bool(x) {
    return !!x;
}
function new_object(cls) {
    return Object.create(cls.prototype);
}
function copy(obj) {
    if (typeof obj == "object") {
        let empty_clone = Object.create(Object.getPrototypeOf(obj));
        return Object.assign(empty_clone, obj);
    }
    return obj;
}
function map_pop(key) {
    let value = this.get(key);
    this.delete(key);
    return value;
}
function hash(x) {
    return x;
}
function tuple(x) {
    return x;
}
function frozenset(x) {
    return new Set(x);
}
function is_dict(x) {
    return x && x.constructor.name === "Object";
}
function is_array(x) {
    return x && x.constructor.name === "Array";
}
function callable(x) {
    return typeof x === "function";
}
function* enumerate(it, start = 0) {
    // Taken from: https://stackoverflow.com/questions/34336960/what-is-the-es6-equivalent-of-python-enumerate-for-a-sequence
    let i = start;
    for (const x of it) {
        yield [i++, x];
    }
}
function any(lst) {
    for (const item of lst) {
        if (item) {
            return true;
        }
    }
    return false;
}
function all(lst) {
    for (const item of lst) {
        if (!item) {
            return false;
        }
    }
    return true;
}
function filter(pred, lst) {
    return lst.filter(pred || bool);
}
function partial(f) {
    let args = [...arguments].slice(1);
    return function () {
        return f(...args, ...arguments);
    };
}
class EOFError extends Error {
}
function last_item(a) {
    return a[a.length - 1];
}
function callable_class(cls) {
    return function () {
        let inst = new cls(...arguments);
        return inst.__call__.bind(inst);
    };
}
function list_repeat(list, count) {
    return Array.from({ length: count }, () => list).flat();
}
function isupper(a) {
    return /^[A-Z_$]*$/.test(a);
}
function rsplit(s, delimiter, limit) {
    const arr = s.split(delimiter);
    return limit ? arr.splice(-limit - 1) : arr;
}
function str_count(s, substr) {
    let re = new RegExp(substr, "g");
    return (s.match(re) || []).length;
}
function list_count(list, elem) {
    let count = 0;
    for (const e of list) {
        if (e === elem) {
            count++;
        }
    }
    return count;
}
function isSubset(subset, set) {
    for (let elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}
function* segment_by_key(a, key) {
    let buffer = [];
    let last_k = null;
    for (const item of a) {
        const k = key(item);
        if (last_k && k != last_k) {
            yield [last_k, buffer];
            buffer = [];
        }
        buffer.push(item);
        last_k = k;
    }
    yield [last_k, buffer];
}
// --------------------------
//  End of library code
//
//
// Exceptions
//
class LarkError extends Error {
}
class ConfigurationError extends LarkError {
}
function assert_config(value, options, msg = "Got %r, expected one of %s") {
    if (!(options.includes(value))) {
        throw new ConfigurationError(format(msg, value, options));
    }
}
class GrammarError extends LarkError {
}
class ParseError extends LarkError {
}
class LexError extends LarkError {
}
/**
  UnexpectedInput Error.

    Used as a base class for the following exceptions:

    - ``UnexpectedCharacters``: The lexer encountered an unexpected string
    - ``UnexpectedToken``: The parser received an unexpected token
    - ``UnexpectedEOF``: The parser expected a token, but the input ended

    After catching one of these exceptions, you may call the following helper methods to create a nicer error message.

*/
class UnexpectedInput extends LarkError {
    constructor() {
        super(...arguments);
        this.pos_in_stream = null;
        this._terminals_by_name = null;
    }
    /**
      Returns a pretty string pinpointing the error in the text,
          with span amount of context characters around it.
  
          Note:
              The parser doesn't hold a copy of the text it has to parse,
              so you have to provide it again
  
    */
    get_context(text, span = 40) {
        let after, before;
        let pos = this.pos_in_stream;
        let start = max(pos - span, 0);
        let end = pos + span;
        if (!(text instanceof bytes)) {
            before = last_item(rsplit(text.slice(start, pos), "\n", 1));
            after = text.slice(pos, end).split("\n", 1)[0];
            return before + after + "\n" + " " * before.expandtabs().length + "^\n";
        }
        else {
            before = last_item(rsplit(text.slice(start, pos), "\n", 1));
            after = text.slice(pos, end).split("\n", 1)[0];
            return (before +
                after +
                "\n" +
                " " * before.expandtabs().length +
                "^\n").decode("ascii", "backslashreplace");
        }
    }
    /**
      Allows you to detect what's wrong in the input text by matching
          against example errors.
  
          Given a parser instance and a dictionary mapping some label with
          some malformed syntax examples, it'll return the label for the
          example that bests matches the current error. The function will
          iterate the dictionary until it finds a matching error, and
          return the corresponding value.
  
          For an example usage, see `examples/error_reporting_lalr.py`
  
          Parameters:
              parse_fn: parse function (usually ``lark_instance.parse``)
              examples: dictionary of ``{'example_string': value}``.
              use_accepts: Recommended to keep this as ``use_accepts=True``.
  
    */
    match_examples(parse_fn, examples, token_type_match_fallback = false) {
        if (is_dict(examples)) {
            examples = dict_items(examples);
        }
        let candidate = [null, false];
        for (const [i, [label, example]] of enumerate(examples)) {
            for (const [j, malformed] of enumerate(example)) {
                try {
                    parse_fn(malformed);
                }
                catch (ut) {
                    if (ut instanceof UnexpectedInput) {
                        if (ut.state.eq(this.state)) {
                            if (ut.token === this.token) {
                                return label;
                            }
                            if (token_type_match_fallback) {
                                // Fallback to token types match
                                if (ut.token.type === this.token.type &&
                                    !last_item(candidate)) {
                                    candidate = [label, true];
                                }
                            }
                            if (candidate[0] === null) {
                                candidate = [label, false];
                            }
                        }
                    }
                    else {
                        throw ut;
                    }
                }
            }
        }
        return candidate[0];
    }
    _format_expected(expected) {
        let d;
        if (this._terminals_by_name) {
            d = this._terminals_by_name;
            expected = expected.map((t_name) => t_name in d ? d[t_name].user_repr() : t_name);
        }
        return format("Expected one of: \n\t* %s\n", expected.join("\n\t* "));
    }
}
/**
  An exception that is raised by the parser, when the input ends while it still expects a token.

*/
class UnexpectedEOF extends UnexpectedInput {
    constructor(expected, state = null, terminals_by_name = null) {
        super();
        this.expected = expected;
        this.state = state;
        this.token = new Token("<EOF>", "");
        // , line=-1, column=-1, pos_in_stream=-1)
        this.pos_in_stream = -1;
        this.line = -1;
        this.column = -1;
        this._terminals_by_name = terminals_by_name;
    }
}
/**
  An exception that is raised by the lexer, when it cannot match the next
    string of characters to any of its terminals.

*/
class UnexpectedCharacters extends UnexpectedInput {
    constructor({ seq, lex_pos, line, column, allowed = null, considered_tokens = null, state = null, token_history = null, terminals_by_name = null, considered_rules = null, } = {}) {
        super();
        // TODO considered_tokens and allowed can be figured out using state
        this.line = line;
        this.column = column;
        this.pos_in_stream = lex_pos;
        this.state = state;
        this._terminals_by_name = terminals_by_name;
        this.allowed = allowed;
        this.considered_tokens = considered_tokens;
        this.considered_rules = considered_rules;
        this.token_history = token_history;
        this.char = seq[lex_pos];
        // this._context = this.get_context(seq);
    }
}
/**
  An exception that is raised by the parser, when the token it received
    doesn't match any valid step forward.

    Parameters:
        token: The mismatched token
        expected: The set of expected tokens
        considered_rules: Which rules were considered, to deduce the expected tokens
        state: A value representing the parser state. Do not rely on its value or type.
        interactive_parser: An instance of ``InteractiveParser``, that is initialized to the point of failture,
                            and can be used for debugging and error handling.

    Note: These parameters are available as attributes of the instance.

*/
class UnexpectedToken extends UnexpectedInput {
    constructor({ token, expected, considered_rules = null, state = null, interactive_parser = null, terminals_by_name = null, token_history = null, } = {}) {
        super();
        // TODO considered_rules and expected can be figured out using state
        this.line = (token && token["line"]) || "?";
        this.column = (token && token["column"]) || "?";
        this.pos_in_stream = (token && token["start_pos"]) || null;
        this.state = state;
        this.token = token;
        this.expected = expected;
        // XXX deprecate? `accepts` is better
        this._accepts = NO_VALUE;
        this.considered_rules = considered_rules;
        this.interactive_parser = interactive_parser;
        this._terminals_by_name = terminals_by_name;
        this.token_history = token_history;
    }
    get accepts() {
        if (this._accepts === NO_VALUE) {
            this._accepts =
                this.interactive_parser && this.interactive_parser.accepts();
        }
        return this._accepts;
    }
}
/**
  VisitError is raised when visitors are interrupted by an exception

    It provides the following attributes for inspection:

    Parameters:
        rule: the name of the visit rule that failed
        obj: the tree-node or token that was being processed
        orig_exc: the exception that cause it to fail

    Note: These parameters are available as attributes

*/
class VisitError extends LarkError {
    constructor(rule, obj, orig_exc) {
        let message = format('Error trying to process rule "%s":\n\n%s', rule, orig_exc);
        super(message);
        this.rule = rule;
        this.obj = obj;
        this.orig_exc = orig_exc;
    }
}
//
// Utils
//
function classify(seq, key = null, value = null) {
    let k, v;
    let d = new Map();
    for (const item of seq) {
        k = key !== null ? key(item) : item;
        v = value !== null ? value(item) : item;
        if (d.has(k)) {
            d.get(k).push(v);
        }
        else {
            d.set(k, [v]);
        }
    }
    return d;
}
function _deserialize(data, namespace, memo) {
    let class_;
    if (is_dict(data)) {
        if ("__type__" in data) {
            // Object
            class_ = namespace[data["__type__"]];
            return class_.deserialize(data, memo);
        }
        else if ("@" in data) {
            return memo[data["@"]];
        }
        return Object.fromEntries(dict_items(data).map(([key, value]) => [
            key,
            _deserialize(value, namespace, memo),
        ]));
    }
    else if (is_array(data)) {
        return data.map((value) => _deserialize(value, namespace, memo));
    }
    return data;
}
/**
  Safe-ish serialization interface that doesn't rely on Pickle

    Attributes:
        __serialize_fields__ (List[str]): Fields (aka attributes) to serialize.
        __serialize_namespace__ (list): List of classes that deserialization is allowed to instantiate.
                                        Should include all field types that aren't builtin types.

*/
class Serialize {
    static deserialize(data, memo) {
        const cls = this;
        let fields = cls && cls["__serialize_fields__"];
        if ("@" in data) {
            return memo[data["@"]];
        }
        let inst = new_object(cls);
        for (const f of fields) {
            if (data && f in data) {
                inst[f] = _deserialize(data[f], NAMESPACE, memo);
            }
            else {
                throw new KeyError("Cannot find key for class", cls, e);
            }
        }
        if ("_deserialize" in inst) {
            inst._deserialize();
        }
        return inst;
    }
}
/**
  A version of serialize that memoizes objects to reduce space
*/
class SerializeMemoizer extends Serialize {
    static get __serialize_fields__() {
        return ["memoized"];
    }
    constructor(types_to_memoize) {
        super();
        this.types_to_memoize = tuple(types_to_memoize);
        this.memoized = new Enumerator();
    }
    in_types(value) {
        return value instanceof this.types_to_memoize;
    }
    serialize() {
        return _serialize(this.memoized.reversed(), null);
    }
    static deserialize(data, namespace, memo) {
        const cls = this;
        return _deserialize(data, namespace, memo);
    }
}
//
// Tree
//
class Meta {
    constructor() {
        this.empty = true;
    }
}
/**
  The main tree class.

    Creates a new tree, and stores "data" and "children" in attributes of the same name.
    Trees can be hashed and compared.

    Parameters:
        data: The name of the rule or alias
        children: List of matched sub-rules and terminals
        meta: Line & Column numbers (if ``propagate_positions`` is enabled).
            meta attributes: line, column, start_pos, end_line, end_column, end_pos

*/
class Tree {
    constructor(data, children, meta = null) {
        this.data = data;
        this.children = children;
        this._meta = meta;
    }
    get meta() {
        if (this._meta === null) {
            this._meta = new Meta();
        }
        return this._meta;
    }
    repr() {
        return format("Tree(%r, %r)", this.data, this.children);
    }
    _pretty_label() {
        return this.data;
    }
    _pretty(level, indent_str) {
        if (this.children.length === 1 && !(this.children[0] instanceof Tree)) {
            return [
                list_repeat(indent_str, level).join(''),
                this._pretty_label(),
                "\t",
                format("%s", this.children[0].value),
                "\n",
            ];
        }
        let l = [list_repeat(indent_str, level).join(''), this._pretty_label(), "\n"];
        for (const n of this.children) {
            if (n instanceof Tree) {
                l.push(...n._pretty(level + 1, indent_str));
            }
            else {
                l.push(...[list_repeat(indent_str, level + 1).join(''), format("%s", n.value), "\n"]);
            }
        }
        return l;
    }
    /**
      Returns an indented string representation of the tree.
  
          Great for debugging.
  
    */
    pretty(indent_str = "  ") {
        return this._pretty(0, indent_str).join("");
    }
    eq(other) {
        if (other &&
            this &&
            other &&
            this &&
            other.children &&
            this.children &&
            other.data &&
            this.data) {
            return this.data === other.data && this.children === other.children;
        }
        else {
            return false;
        }
    }
    /**
      Depth-first iteration.
  
          Iterates over all the subtrees, never returning to the same node twice (Lark's parse-tree is actually a DAG).
  
    */
    iter_subtrees() {
        let queue = [this];
        let subtrees = new Map();
        for (const subtree of queue) {
            subtrees.set(subtree, subtree);
            queue.push(...[...subtree.children]
                .reverse()
                .filter((c) => c instanceof Tree && !subtrees.has(c))
                .map((c) => c));
        }
        queue = undefined;
        return [...subtrees.values()].reverse();
    }
    /**
      Returns all nodes of the tree that evaluate pred(node) as true.
    */
    find_pred(pred) {
        return filter(pred, this.iter_subtrees());
    }
    /**
      Returns all nodes of the tree whose data equals the given data.
    */
    find_data(data) {
        return this.find_pred((t) => t.data === data);
    }
    /**
      Return all values in the tree that evaluate pred(value) as true.
  
          This can be used to find all the tokens in the tree.
  
          Example:
              >>> all_tokens = tree.scan_values(lambda v: isinstance(v, Token))
  
    */
    *scan_values(pred) {
        for (const c of this.children) {
            if (c instanceof Tree) {
                for (const t of c.scan_values(pred)) {
                    yield t;
                }
            }
            else {
                if (pred(c)) {
                    yield c;
                }
            }
        }
    }
    /**
      Breadth-first iteration.
  
          Iterates over all the subtrees, return nodes in order like pretty() does.
  
    */
    *iter_subtrees_topdown() {
        let node;
        let stack = [this];
        while (stack.length) {
            node = stack.pop();
            if (!(node instanceof Tree)) {
                continue;
            }
            yield node;
            for (const child of [...node.children].reverse()) {
                stack.push(child);
            }
        }
    }
    copy() {
        return type(this)(this.data, this.children);
    }
    set(data, children) {
        this.data = data;
        this.children = children;
    }
}
//
// Visitors
//
/**
  Transformers work bottom-up (or depth-first), starting with visiting the leaves and working
    their way up until ending at the root of the tree.

    For each node visited, the transformer will call the appropriate method (callbacks), according to the
    node's ``data``, and use the returned value to replace the node, thereby creating a new tree structure.

    Transformers can be used to implement map & reduce patterns. Because nodes are reduced from leaf to root,
    at any point the callbacks may assume the children have already been transformed (if applicable).

    If the transformer cannot find a method with the right name, it will instead call ``__default__``, which by
    default creates a copy of the node.

    To discard a node, return Discard (``lark.visitors.Discard``).

    ``Transformer`` can do anything ``Visitor`` can do, but because it reconstructs the tree,
    it is slightly less efficient.

    A transformer without methods essentially performs a non-memoized partial deepcopy.

    All these classes implement the transformer interface:

    - ``Transformer`` - Recursively transforms the tree. This is the one you probably want.
    - ``Transformer_InPlace`` - Non-recursive. Changes the tree in-place instead of returning new instances
    - ``Transformer_InPlaceRecursive`` - Recursive. Changes the tree in-place instead of returning new instances

    Parameters:
        visit_tokens (bool, optional): Should the transformer visit tokens in addition to rules.
                                       Setting this to ``False`` is slightly faster. Defaults to ``True``.
                                       (For processing ignored tokens, use the ``lexer_callbacks`` options)


*/
class Transformer extends _Decoratable {
    static get __visit_tokens__() {
        return true;
    }
    // For backwards compatibility
    constructor(visit_tokens = true) {
        super();
        this.__visit_tokens__ = visit_tokens;
    }
    static fromObj(obj, ...args) {
        class _T extends this {
        }
        for (let [k, v] of Object.entries(obj)) {
            _T.prototype[k] = v;
        }
        return new _T(...args);
    }
    _call_userfunc(tree, new_children = null) {
        let f, wrapper;
        // Assumes tree is already transformed
        let children = new_children !== null ? new_children : tree.children;
        if (tree && tree.data && this && this[tree.data]) {
            f = this && this[tree.data];
            try {
                wrapper = (f && f["visit_wrapper"]) || null;
                if (wrapper !== null) {
                    return f.visit_wrapper(f, tree.data, children, tree.meta);
                }
                else {
                    return f(children);
                }
            }
            catch (e) {
                if (e instanceof GrammarError) {
                    throw e;
                }
                else if (e instanceof Error) {
                    throw new VisitError(tree.data, tree, e);
                }
                else {
                    throw e;
                }
            }
        }
        else {
            return this.__default__(tree.data, children, tree.meta);
        }
    }
    _call_userfunc_token(token) {
        let f;
        if (token && token.type && this && this[token.type]) {
            f = this && this[token.type];
            try {
                return f(token);
            }
            catch (e) {
                if (e instanceof GrammarError) {
                    throw e;
                }
                else if (e instanceof Error) {
                    throw new VisitError(token.type, token, e);
                }
                else {
                    throw e;
                }
            }
        }
        else {
            return this.__default_token__(token);
        }
    }
    *_transform_children(children) {
        let res;
        for (const c of children) {
            if (c instanceof Tree) {
                res = this._transform_tree(c);
            }
            else if (this.__visit_tokens__ && c instanceof Token) {
                res = this._call_userfunc_token(c);
            }
            else {
                res = c;
            }
            if (res !== Discard) {
                yield res;
            }
        }
    }
    _transform_tree(tree) {
        let children = [...this._transform_children(tree.children)];
        return this._call_userfunc(tree, children);
    }
    /**
      Transform the given tree, and return the final result
    */
    transform(tree) {
        return this._transform_tree(tree);
    }
    /**
      Default function that is called if there is no attribute matching ``data``
  
          Can be overridden. Defaults to creating a new copy of the tree node (i.e. ``return Tree(data, children, meta)``)
  
    */
    __default__(data, children, meta) {
        return new Tree(data, children, meta);
    }
    /**
      Default function that is called if there is no attribute matching ``token.type``
  
          Can be overridden. Defaults to returning the token as-is.
  
    */
    __default_token__(token) {
        return token;
    }
}
/**
  Same as Transformer, but non-recursive, and changes the tree in-place instead of returning new instances

    Useful for huge trees. Conservative in memory.

*/
class Transformer_InPlace extends Transformer {
    _transform_tree(tree) {
        // Cancel recursion
        return this._call_userfunc(tree);
    }
    transform(tree) {
        for (const subtree of tree.iter_subtrees()) {
            subtree.children = [...this._transform_children(subtree.children)];
        }
        return this._transform_tree(tree);
    }
}
/**
  Same as Transformer but non-recursive.

    Like Transformer, it doesn't change the original tree.

    Useful for huge trees.

*/
class Transformer_NonRecursive extends Transformer {
    transform(tree) {
        let args, res, size;
        // Tree to postfix
        let rev_postfix = [];
        let q = [tree];
        while (q.length) {
            const t = q.pop();
            rev_postfix.push(t);
            if (t instanceof Tree) {
                q.push(...t.children);
            }
        }
        // Postfix to tree
        let stack = [];
        for (const x of [...rev_postfix].reverse()) {
            if (x instanceof Tree) {
                size = x.children.length;
                if (size) {
                    args = stack.slice(-size);
                    stack.splice(-size);
                }
                else {
                    args = [];
                }
                res = this._call_userfunc(x, args);
                if (res !== Discard) {
                    stack.push(res);
                }
            }
            else if (this.__visit_tokens__ && x instanceof Token) {
                res = this._call_userfunc_token(x);
                if (res !== Discard) {
                    stack.push(res);
                }
            }
            else {
                stack.push(x);
            }
        }
        let [t] = stack;
        // We should have only one tree remaining
        return t;
    }
}
/**
  Same as Transformer, recursive, but changes the tree in-place instead of returning new instances
*/
class Transformer_InPlaceRecursive extends Transformer {
    _transform_tree(tree) {
        tree.children = [...this._transform_children(tree.children)];
        return this._call_userfunc(tree);
    }
}
// Visitors
class VisitorBase {
    _call_userfunc(tree) {
        const callback = this[tree.data];
        if (callback) {
            return callback(tree);
        }
        else {
            return this.__default__(tree);
        }
    }
    /**
      Default function that is called if there is no attribute matching ``tree.data``
  
          Can be overridden. Defaults to doing nothing.
  
    */
    __default__(tree) {
        return tree;
    }
    __class_getitem__(_) {
        return cls;
    }
}
/**
  Tree visitor, non-recursive (can handle huge trees).

    Visiting a node calls its methods (provided by the user via inheritance) according to ``tree.data``

*/
class Visitor extends VisitorBase {
    /**
      Visits the tree, starting with the leaves and finally the root (bottom-up)
    */
    visit(tree) {
        for (const subtree of tree.iter_subtrees()) {
            this._call_userfunc(subtree);
        }
        return tree;
    }
    /**
      Visit the tree, starting at the root, and ending at the leaves (top-down)
    */
    visit_topdown(tree) {
        for (const subtree of tree.iter_subtrees_topdown()) {
            this._call_userfunc(subtree);
        }
        return tree;
    }
}
/**
  Bottom-up visitor, recursive.

    Visiting a node calls its methods (provided by the user via inheritance) according to ``tree.data``

    Slightly faster than the non-recursive version.

*/
class Visitor_Recursive extends VisitorBase {
    /**
      Visits the tree, starting with the leaves and finally the root (bottom-up)
    */
    visit(tree) {
        for (const child of tree.children) {
            if (child instanceof Tree) {
                this.visit(child);
            }
        }
        this._call_userfunc(tree);
        return tree;
    }
    /**
      Visit the tree, starting at the root, and ending at the leaves (top-down)
    */
    visit_topdown(tree) {
        this._call_userfunc(tree);
        for (const child of tree.children) {
            if (child instanceof Tree) {
                this.visit_topdown(child);
            }
        }
        return tree;
    }
}
/**
  Interpreter walks the tree starting at the root.

    Visits the tree, starting with the root and finally the leaves (top-down)

    For each tree node, it calls its methods (provided by user via inheritance) according to ``tree.data``.

    Unlike ``Transformer`` and ``Visitor``, the Interpreter doesn't automatically visit its sub-branches.
    The user has to explicitly call ``visit``, ``visit_children``, or use the ``@visit_children_decor``.
    This allows the user to implement branching and loops.

*/
class Interpreter extends _Decoratable {
    visit(tree) {
        if (tree.data in this) {
            return this[tree.data](tree);
        }
        else {
            return this.__default__(tree);
        }
    }
    visit_children(tree) {
        return tree.children.map((child) => child instanceof Tree ? this.visit(child) : child);
    }
    __default__(tree) {
        return this.visit_children(tree);
    }
}
//
// Grammar
//
var TOKEN_DEFAULT_PRIORITY = 0;
class Symbol extends Serialize {
    constructor(name) {
        super();
        this.is_term = NotImplemented;
        this.name = name;
    }
    eq(other) {
        return this.is_term === other.is_term && this.name === other.name;
    }
    repr() {
        return format("%s(%r)", type(this).name, this.name);
    }
    static get fullrepr() {
        return property(__repr__);
    }
    get fullrepr() {
        return this.constructor.fullrepr;
    }
    renamed(f) {
        return type(this)(f(this.name));
    }
}
class Terminal extends Symbol {
    static get __serialize_fields__() {
        return ["name", "filter_out"];
    }
    get is_term() {
        return true;
    }
    constructor(name, filter_out = false) {
        super();
        this.name = name;
        this.filter_out = filter_out;
    }
    get fullrepr() {
        return format("%s(%r, %r)", type(this).name, this.name, this.filter_out);
    }
    renamed(f) {
        return type(this)(f(this.name), this.filter_out);
    }
}
class NonTerminal extends Symbol {
    static get __serialize_fields__() {
        return ["name"];
    }
    get is_term() {
        return false;
    }
}
class RuleOptions extends Serialize {
    static get __serialize_fields__() {
        return [
            "keep_all_tokens",
            "expand1",
            "priority",
            "template_source",
            "empty_indices",
        ];
    }
    constructor(keep_all_tokens = false, expand1 = false, priority = null, template_source = null, empty_indices = []) {
        super();
        this.keep_all_tokens = keep_all_tokens;
        this.expand1 = expand1;
        this.priority = priority;
        this.template_source = template_source;
        this.empty_indices = empty_indices;
    }
    repr() {
        return format("RuleOptions(%r, %r, %r, %r)", this.keep_all_tokens, this.expand1, this.priority, this.template_source);
    }
}
/**

        origin : a symbol
        expansion : a list of symbols
        order : index of this expansion amongst all rules of the same name

*/
class Rule extends Serialize {
    static get __serialize_fields__() {
        return ["origin", "expansion", "order", "alias", "options"];
    }
    static get __serialize_namespace__() {
        return [Terminal, NonTerminal, RuleOptions];
    }
    constructor(origin, expansion, order = 0, alias = null, options = null) {
        super();
        this.origin = origin;
        this.expansion = expansion;
        this.alias = alias;
        this.order = order;
        this.options = options || new RuleOptions();
        this._hash = hash([this.origin, tuple(this.expansion)]);
    }
    _deserialize() {
        this._hash = hash([this.origin, tuple(this.expansion)]);
    }
    repr() {
        return format("Rule(%r, %r, %r, %r)", this.origin, this.expansion, this.alias, this.options);
    }
    eq(other) {
        if (!(other instanceof Rule)) {
            return false;
        }
        return this.origin === other.origin && this.expansion === other.expansion;
    }
}
//
// Lexer
//
// Lexer Implementation
class Pattern extends Serialize {
    constructor(value, flags = [], raw = null) {
        super();
        this.value = value;
        this.flags = frozenset(flags);
        this.raw = raw;
    }
    repr() {
        return repr(this.to_regexp());
    }
    eq(other) {
        return (type(this) === type(other) &&
            this.value === other.value &&
            this.flags === other.flags);
    }
    to_regexp() {
        throw new NotImplementedError();
    }
    get min_width() {
        throw new NotImplementedError();
    }
    get max_width() {
        throw new NotImplementedError();
    }
    _get_flags(value) {
        return value;
    }
}
class PatternStr extends Pattern {
    static get __serialize_fields__() {
        return ["value", "flags"];
    }
    static get type() { return "str"; }
    to_regexp() {
        return this._get_flags(re.escape(this.value));
    }
    get min_width() {
        return this.value.length;
    }
    get max_width() {
        return this.value.length;
    }
}
class PatternRE extends Pattern {
    static get __serialize_fields__() {
        return ["value", "flags", "_width"];
    }
    static get type() { return "re"; }
    to_regexp() {
        return this._get_flags(this.value);
    }
    _get_width() {
        if (this._width === null) {
            this._width = get_regexp_width(this.to_regexp());
        }
        return this._width;
    }
    get min_width() {
        return this._get_width()[0];
    }
    get max_width() {
        return this._get_width()[1];
    }
}
class TerminalDef extends Serialize {
    static get __serialize_fields__() {
        return ["name", "pattern", "priority"];
    }
    static get __serialize_namespace__() {
        return [PatternStr, PatternRE];
    }
    constructor(name, pattern, priority = TOKEN_DEFAULT_PRIORITY) {
        super();
        this.name = name;
        this.pattern = pattern;
        this.priority = priority;
    }
    repr() {
        return format("%s(%r, %r)", type(this).name, this.name, this.pattern);
    }
    user_repr() {
        if (this.name.startsWith("__")) {
            // We represent a generated terminal
            return this.pattern.raw || this.name;
        }
        else {
            return this.name;
        }
    }
}
/**
  A string with meta-information, that is produced by the lexer.

    When parsing text, the resulting chunks of the input that haven't been discarded,
    will end up in the tree as Token instances. The Token class inherits from Python's ``str``,
    so normal string comparisons and operations will work as expected.

    Attributes:
        type: Name of the token (as specified in grammar)
        value: Value of the token (redundant, as ``token.value == token`` will always be true)
        start_pos: The index of the token in the text
        line: The line of the token in the text (starting with 1)
        column: The column of the token in the text (starting with 1)
        end_line: The line where the token ends
        end_column: The next column after the end of the token. For example,
            if the token is a single character with a column value of 4,
            end_column will be 5.
        end_pos: the index where the token ends (basically ``start_pos + len(token)``)

*/
class Token {
    constructor(type_, value, start_pos = null, line = null, column = null, end_line = null, end_column = null, end_pos = null) {
        this.type = type_;
        this.start_pos = start_pos;
        this.value = value;
        this.line = line;
        this.column = column;
        this.end_line = end_line;
        this.end_column = end_column;
        this.end_pos = end_pos;
    }
    update(type_ = null, value = null) {
        return Token.new_borrow_pos(type_ !== null ? type_ : this.type, value !== null ? value : this.value, this);
    }
    static new_borrow_pos(type_, value, borrow_t) {
        const cls = this;
        return new cls(type_, value, borrow_t.start_pos, borrow_t.line, borrow_t.column, borrow_t.end_line, borrow_t.end_column, borrow_t.end_pos);
    }
    repr() {
        return format("Token(%r, %r)", this.type, this.value);
    }
    eq(other) {
        if (other instanceof Token && this.type !== other.type) {
            return false;
        }
        return str.__eq__(this, other);
    }
    static get __hash__() {
        return str.__hash__;
    }
}
class LineCounter {
    constructor(newline_char) {
        this.newline_char = newline_char;
        this.char_pos = 0;
        this.line = 1;
        this.column = 1;
        this.line_start_pos = 0;
    }
    eq(other) {
        if (!(other instanceof LineCounter)) {
            return NotImplemented;
        }
        return (this.char_pos === other.char_pos &&
            this.newline_char === other.newline_char);
    }
    /**
      Consume a token and calculate the new line & column.
  
          As an optional optimization, set test_newline=False if token doesn't contain a newline.
  
    */
    feed(token, test_newline = true) {
        let newlines;
        if (test_newline) {
            newlines = str_count(token, this.newline_char);
            if (newlines) {
                this.line += newlines;
                this.line_start_pos =
                    this.char_pos + token.lastIndexOf(this.newline_char) + 1;
            }
        }
        this.char_pos += token.length;
        this.column = this.char_pos - this.line_start_pos + 1;
    }
}
class _UnlessCallback {
    constructor(scanner) {
        this.scanner = scanner;
    }
    __call__(t) {
        let _value;
        let res = this.scanner.match(t.value, 0);
        if (res) {
            [_value, t.type] = res;
        }
        return t;
    }
}
const UnlessCallback = callable_class(_UnlessCallback);
class _CallChain {
    constructor(callback1, callback2, cond) {
        this.callback1 = callback1;
        this.callback2 = callback2;
        this.cond = cond;
    }
    __call__(t) {
        let t2 = this.callback1(t);
        return this.cond(t2) ? this.callback2(t) : t2;
    }
}
const CallChain = callable_class(_CallChain);
function _create_unless(terminals, g_regex_flags, re_, use_bytes) {
    let s, unless;
    let tokens_by_type = classify(terminals, (t) => t.pattern.constructor.type);
    let embedded_strs = new Set();
    let callback = {};
    for (const retok of tokens_by_type.get('re') || []) {
        unless = [];
        for (const strtok of tokens_by_type.get('str') || []) {
            if (strtok.priority !== retok.priority) {
                continue;
            }
            s = strtok.pattern.value;
            if (s === _get_match(re_, retok.pattern.to_regexp(), s, g_regex_flags)) {
                unless.push(strtok);
                if (isSubset(new Set(strtok.pattern.flags), new Set(retok.pattern.flags))) {
                    embedded_strs.add(strtok);
                }
            }
        }
        if (unless.length) {
            callback[retok.name] = new UnlessCallback(new Scanner(unless, g_regex_flags, re_, use_bytes, true));
        }
    }
    let new_terminals = terminals
        .filter((t) => !embedded_strs.has(t))
        .map((t) => t);
    return [new_terminals, callback];
}
/**
    Expressions that may indicate newlines in a regexp:
        - newlines (\n)
        - escaped newline (\\n)
        - anything but ([^...])
        - any-char (.) when the flag (?s) exists
        - spaces (\s)

  */
function _regexp_has_newline(r) {
    return (r.includes("\n") ||
        r.includes("\\n") ||
        r.includes("\\s") ||
        r.includes("[^") ||
        (r.includes("(?s") && r.includes(".")));
}
/**
  Represents the current state of the lexer as it scans the text
    (Lexer objects are only instanciated per grammar, not per text)

*/
class LexerState {
    constructor(text, line_ctr = null, last_token = null) {
        this.text = text;
        this.line_ctr = line_ctr || new LineCounter("\n");
        this.last_token = last_token;
    }
    eq(other) {
        if (!(other instanceof LexerState)) {
            return NotImplemented;
        }
        return (this.text === other.text &&
            this.line_ctr === other.line_ctr &&
            this.last_token === other.last_token);
    }
}
/**
  A thread that ties a lexer instance and a lexer state, to be used by the parser

*/
class LexerThread {
    constructor(lexer, lexer_state) {
        this.lexer = lexer;
        this.state = lexer_state;
    }
    static from_text(lexer, text) {
        return new this(lexer, new LexerState(text));
    }
    lex(parser_state) {
        return this.lexer.lex(this.state, parser_state);
    }
}
/**
  Lexer interface

    Method Signatures:
        lex(self, lexer_state, parser_state) -> Iterator[Token]

*/
class Lexer extends ABC {
    lex(lexer_state, parser_state) {
        return NotImplemented;
    }
}
function sort_by_key_tuple(arr, key) {
    arr.sort((a, b) => {
        let ta = key(a);
        let tb = key(b);
        for (let i = 0; i < ta.length; i++) {
            if (ta[i] > tb[i]) {
                return 1;
            }
            else if (ta[i] < tb[i]) {
                return -1;
            }
        }
        return 0;
    });
}
class BasicLexer extends Lexer {
    constructor(conf) {
        super();
        let terminals = [...conf.terminals];
        this.re = conf.re_module;
        if (!conf.skip_validation) {
            // Sanitization
            for (const t of terminals) {
                try {
                    this.re.compile(t.pattern.to_regexp(), conf.g_regex_flags);
                }
                catch (e) {
                    if (e instanceof this.re.error) {
                        throw new LexError(format("Cannot compile token %s: %s", t.name, t.pattern));
                    }
                    else {
                        throw e;
                    }
                }
                if (t.pattern.min_width === 0) {
                    throw new LexError(format("Lexer does not allow zero-width terminals. (%s: %s)", t.name, t.pattern));
                }
            }
            if (!(new Set(conf.ignore) <= new Set(terminals.map((t) => t.name)))) {
                throw new LexError(format("Ignore terminals are not defined: %s", set_subtract(new Set(conf.ignore), new Set(terminals.map((t) => t.name)))));
            }
        }
        // Init
        this.newline_types = frozenset(terminals
            .filter((t) => _regexp_has_newline(t.pattern.to_regexp()))
            .map((t) => t.name));
        this.ignore_types = frozenset(conf.ignore);
        sort_by_key_tuple(terminals, (x) => [
            -x.priority,
            -x.pattern.max_width,
            -x.pattern.value.length,
            x.name,
        ]);
        this.terminals = terminals;
        this.user_callbacks = conf.callbacks;
        this.g_regex_flags = conf.g_regex_flags;
        this.use_bytes = conf.use_bytes;
        this.terminals_by_name = conf.terminals_by_name;
        this._scanner = null;
    }
    _build_scanner() {
        let terminals;
        [terminals, this.callback] = _create_unless(this.terminals, this.g_regex_flags, this.re, this.use_bytes);
        for (const [type_, f] of dict_items(this.user_callbacks)) {
            if (type_ in this.callback) {
                // Already a callback there, probably UnlessCallback
                this.callback[type_] = new CallChain(this.callback[type_], f, (t) => t.type === type_);
            }
            else {
                this.callback[type_] = f;
            }
        }
        this._scanner = new Scanner(terminals, this.g_regex_flags, this.re, this.use_bytes);
    }
    get scanner() {
        if (this._scanner === null) {
            this._build_scanner();
        }
        return this._scanner;
    }
    match(text, pos) {
        return this.scanner.match(text, pos);
    }
    *lex(state, parser_state) {
        try {
            while (true) {
                yield this.next_token(state, parser_state);
            }
        }
        catch (e) {
            if (e instanceof EOFError) {
                // pass
            }
            else {
                throw e;
            }
        }
    }
    next_token(lex_state, parser_state = null) {
        let allowed, res, t, t2, type_, value;
        let line_ctr = lex_state.line_ctr;
        while (line_ctr.char_pos < lex_state.text.length) {
            res = this.match(lex_state.text, line_ctr.char_pos);
            if (!res) {
                allowed = set_subtract(this.scanner.allowed_types, this.ignore_types);
                if (!allowed) {
                    allowed = new Set(["<END-OF-FILE>"]);
                }
                throw new UnexpectedCharacters({
                    seq: lex_state.text,
                    lex_pos: line_ctr.char_pos,
                    line: line_ctr.line,
                    column: line_ctr.column,
                    allowed: allowed,
                    token_history: lex_state.last_token && [lex_state.last_token],
                    state: parser_state,
                    terminals_by_name: this.terminals_by_name,
                });
            }
            let [value, type_] = res;
            if (!this.ignore_types.has(type_)) {
                t = new Token(type_, value, line_ctr.char_pos, line_ctr.line, line_ctr.column);
                line_ctr.feed(value, this.newline_types.has(type_));
                t.end_line = line_ctr.line;
                t.end_column = line_ctr.column;
                t.end_pos = line_ctr.char_pos;
                if (t.type in this.callback) {
                    t = this.callback[t.type](t);
                    if (!(t instanceof Token)) {
                        throw new LexError(format("Callbacks must return a token (returned %r)", t));
                    }
                }
                lex_state.last_token = t;
                return t;
            }
            else {
                if (type_ in this.callback) {
                    t2 = new Token(type_, value, line_ctr.char_pos, line_ctr.line, line_ctr.column);
                    this.callback[type_](t2);
                }
                line_ctr.feed(value, this.newline_types.has(type_));
            }
        }
        // EOF
        throw new EOFError(this);
    }
}
class ContextualLexer extends Lexer {
    constructor({ conf, states, always_accept = [] } = {}) {
        super();
        let accepts, key, lexer, lexer_conf;
        let terminals = [...conf.terminals];
        let terminals_by_name = conf.terminals_by_name;
        let trad_conf = copy(conf);
        trad_conf.terminals = terminals;
        let lexer_by_tokens = new Map();
        this.lexers = {};
        for (let [state, accepts] of dict_items(states)) {
            key = frozenset(accepts);
            if (lexer_by_tokens.has(key)) {
                lexer = lexer_by_tokens.get(key);
            }
            else {
                accepts = union(new Set(accepts), [
                    ...new Set(conf.ignore),
                    ...new Set(always_accept),
                ]);
                lexer_conf = copy(trad_conf);
                lexer_conf.terminals = [...accepts]
                    .filter((n) => n in terminals_by_name)
                    .map((n) => terminals_by_name[n]);
                lexer = new BasicLexer(lexer_conf);
                lexer_by_tokens.set(key, lexer);
            }
            this.lexers[state] = lexer;
        }
        this.root_lexer = new BasicLexer(trad_conf);
    }
    *lex(lexer_state, parser_state) {
        let last_token, lexer, token;
        try {
            while (true) {
                lexer = this.lexers[parser_state.position];
                yield lexer.next_token(lexer_state, parser_state);
            }
        }
        catch (e) {
            if (e instanceof EOFError) {
                // pass
            }
            else if (e instanceof UnexpectedCharacters) {
                // In the contextual lexer, UnexpectedCharacters can mean that the terminal is defined, but not in the current context.
                // This tests the input against the global context, to provide a nicer error.
                try {
                    last_token = lexer_state.last_token;
                    // Save last_token. Calling root_lexer.next_token will change this to the wrong token
                    token = this.root_lexer.next_token(lexer_state, parser_state);
                    throw new UnexpectedToken({
                        token: token,
                        expected: e.allowed,
                        state: parser_state,
                        token_history: [last_token],
                        terminals_by_name: this.root_lexer.terminals_by_name,
                    });
                }
                catch (e) {
                    if (e instanceof UnexpectedCharacters) {
                        throw e;
                    }
                    else {
                        throw e;
                    }
                }
            }
            else {
                throw e;
            }
        }
    }
}
//
// Common
//
class LexerConf extends Serialize {
    static get __serialize_fields__() {
        return ["terminals", "ignore", "g_regex_flags", "use_bytes", "lexer_type"];
    }
    static get __serialize_namespace__() {
        return [TerminalDef];
    }
    constructor({ terminals, re_module, ignore = [], postlex = null, callbacks = null, g_regex_flags = '', skip_validation = false, use_bytes = false, } = {}) {
        super();
        this.terminals = terminals;
        this.terminals_by_name = Object.fromEntries(this.terminals.map((t) => [t.name, t]));
        this.ignore = ignore;
        this.postlex = postlex;
        this.callbacks = Object.keys(callbacks).length || {};
        this.g_regex_flags = g_regex_flags;
        this.re_module = re_module;
        this.skip_validation = skip_validation;
        this.use_bytes = use_bytes;
        this.lexer_type = null;
    }
    _deserialize() {
        this.terminals_by_name = Object.fromEntries(this.terminals.map((t) => [t.name, t]));
    }
}
class ParserConf extends Serialize {
    static get __serialize_fields__() {
        return ["rules", "start", "parser_type"];
    }
    constructor(rules, callbacks, start) {
        super();
        this.rules = rules;
        this.callbacks = callbacks;
        this.start = start;
        this.parser_type = null;
    }
}
//
// Parse Tree Builder
//
class _ExpandSingleChild {
    constructor(node_builder) {
        this.node_builder = node_builder;
    }
    __call__(children) {
        if (children.length === 1) {
            return children[0];
        }
        else {
            return this.node_builder(children);
        }
    }
}
const ExpandSingleChild = callable_class(_ExpandSingleChild);
class _PropagatePositions {
    constructor(node_builder, node_filter = null) {
        this.node_builder = node_builder;
        this.node_filter = node_filter;
    }
    __call__(children) {
        let first_meta, last_meta, res_meta;
        let res = this.node_builder(children);
        if (res instanceof Tree) {
            // Calculate positions while the tree is streaming, according to the rule:
            // - nodes start at the start of their first child's container,
            //   and end at the end of their last child's container.
            // Containers are nodes that take up space in text, but have been inlined in the tree.
            res_meta = res.meta;
            first_meta = this._pp_get_meta(children);
            if (first_meta !== null) {
                if (!("line" in res_meta)) {
                    // meta was already set, probably because the rule has been inlined (e.g. `?rule`)
                    res_meta.line =
                        (first_meta && first_meta["container_line"]) || first_meta.line;
                    res_meta.column =
                        (first_meta && first_meta["container_column"]) || first_meta.column;
                    res_meta.start_pos =
                        (first_meta && first_meta["container_start_pos"]) ||
                            first_meta.start_pos;
                    res_meta.empty = false;
                }
                res_meta.container_line =
                    (first_meta && first_meta["container_line"]) || first_meta.line;
                res_meta.container_column =
                    (first_meta && first_meta["container_column"]) || first_meta.column;
            }
            last_meta = this._pp_get_meta([...children].reverse());
            if (last_meta !== null) {
                if (!("end_line" in res_meta)) {
                    res_meta.end_line =
                        (last_meta && last_meta["container_end_line"]) ||
                            last_meta.end_line;
                    res_meta.end_column =
                        (last_meta && last_meta["container_end_column"]) ||
                            last_meta.end_column;
                    res_meta.end_pos =
                        (last_meta && last_meta["container_end_pos"]) || last_meta.end_pos;
                    res_meta.empty = false;
                }
                res_meta.container_end_line =
                    (last_meta && last_meta["container_end_line"]) || last_meta.end_line;
                res_meta.container_end_column =
                    (last_meta && last_meta["container_end_column"]) ||
                        last_meta.end_column;
            }
        }
        return res;
    }
    _pp_get_meta(children) {
        for (const c of children) {
            if (this.node_filter !== null && !this.node_filter(c)) {
                continue;
            }
            if (c instanceof Tree) {
                if (!c.meta.empty) {
                    return c.meta;
                }
            }
            else if (c instanceof Token) {
                return c;
            }
        }
    }
}
const PropagatePositions = callable_class(_PropagatePositions);
function make_propagate_positions(option) {
    if (callable(option)) {
        return partial({
            unknown_param_0: PropagatePositions,
            node_filter: option,
        });
    }
    else if (option === true) {
        return PropagatePositions;
    }
    else if (option === false) {
        return null;
    }
    throw new ConfigurationError(format("Invalid option for propagate_positions: %r", option));
}
class _ChildFilter {
    constructor(to_include, append_none, node_builder) {
        this.node_builder = node_builder;
        this.to_include = to_include;
        this.append_none = append_none;
    }
    __call__(children) {
        let filtered = [];
        for (const [i, to_expand, add_none] of this.to_include) {
            if (add_none) {
                filtered.push(...list_repeat([null], add_none));
            }
            if (to_expand) {
                filtered.push(...children[i].children);
            }
            else {
                filtered.push(children[i]);
            }
        }
        if (this.append_none) {
            filtered.push(...list_repeat([null], this.append_none));
        }
        return this.node_builder(filtered);
    }
}
const ChildFilter = callable_class(_ChildFilter);
/**
  Optimized childfilter for LALR (assumes no duplication in parse tree, so it's safe to change it)
*/
class _ChildFilterLALR extends _ChildFilter {
    __call__(children) {
        let filtered = [];
        for (const [i, to_expand, add_none] of this.to_include) {
            if (add_none) {
                filtered.push(...list_repeat([null], add_none));
            }
            if (to_expand) {
                if (filtered.length) {
                    filtered.push(...children[i].children);
                }
                else {
                    // Optimize for left-recursion
                    filtered = children[i].children;
                }
            }
            else {
                filtered.push(children[i]);
            }
        }
        if (this.append_none) {
            filtered.push(...list_repeat([null], this.append_none));
        }
        return this.node_builder(filtered);
    }
}
const ChildFilterLALR = callable_class(_ChildFilterLALR);
/**
  Optimized childfilter for LALR (assumes no duplication in parse tree, so it's safe to change it)
*/
class _ChildFilterLALR_NoPlaceholders extends _ChildFilter {
    constructor(to_include, node_builder) {
        super();
        this.node_builder = node_builder;
        this.to_include = to_include;
    }
    __call__(children) {
        let filtered = [];
        for (const [i, to_expand] of this.to_include) {
            if (to_expand) {
                if (filtered.length) {
                    filtered.push(...children[i].children);
                }
                else {
                    // Optimize for left-recursion
                    filtered = children[i].children;
                }
            }
            else {
                filtered.push(children[i]);
            }
        }
        return this.node_builder(filtered);
    }
}
const ChildFilterLALR_NoPlaceholders = callable_class(_ChildFilterLALR_NoPlaceholders);
function _should_expand(sym) {
    return !sym.is_term && sym.name.startsWith("_");
}
function maybe_create_child_filter(expansion, keep_all_tokens, ambiguous, _empty_indices) {
    let empty_indices, s;
    // Prepare empty_indices as: How many Nones to insert at each index?
    if (_empty_indices.length) {
        s = _empty_indices.map((b) => (0 + b).toString()).join("");
        empty_indices = s.split("0").map((ones) => ones.length);
    }
    else {
        empty_indices = list_repeat([0], expansion.length + 1);
    }
    let to_include = [];
    let nones_to_add = 0;
    for (const [i, sym] of enumerate(expansion)) {
        nones_to_add += empty_indices[i];
        if (keep_all_tokens || !(sym.is_term && sym.filter_out)) {
            to_include.push([i, _should_expand(sym), nones_to_add]);
            nones_to_add = 0;
        }
    }
    nones_to_add += empty_indices[expansion.length];
    if (_empty_indices.length ||
        to_include.length < expansion.length ||
        any(to_include.map(([i, to_expand, _]) => to_expand))) {
        if ((_empty_indices.length || ambiguous).length) {
            return partial(ambiguous ? ChildFilter : ChildFilterLALR, to_include, nones_to_add);
        }
        else {
            // LALR without placeholders
            return partial(ChildFilterLALR_NoPlaceholders, to_include.map(([i, x, _]) => [i, x]));
        }
    }
}
/**

    Propagate ambiguous intermediate nodes and their derivations up to the
    current rule.

    In general, converts

    rule
      _iambig
        _inter
          someChildren1
          ...
        _inter
          someChildren2
          ...
      someChildren3
      ...

    to

    _ambig
      rule
        someChildren1
        ...
        someChildren3
        ...
      rule
        someChildren2
        ...
        someChildren3
        ...
      rule
        childrenFromNestedIambigs
        ...
        someChildren3
        ...
      ...

    propagating up any nested '_iambig' nodes along the way.

*/
function inplace_transformer(func) {
    function f(children) {
        // function name in a Transformer is a rule name.
        let tree = new Tree(func.name, children);
        return func(tree);
    }
    f = wraps(func)(f);
    return f;
}
function apply_visit_wrapper(func, name, wrapper) {
    if (wrapper === _vargs_meta || wrapper === _vargs_meta_inline) {
        throw new NotImplementedError("Meta args not supported for internal transformer");
    }
    function f(children) {
        return wrapper(func, name, children, null);
    }
    f = wraps(func)(f);
    return f;
}
class ParseTreeBuilder {
    constructor(rules, tree_class, propagate_positions = false, ambiguous = false, maybe_placeholders = false) {
        this.tree_class = tree_class;
        this.propagate_positions = propagate_positions;
        this.ambiguous = ambiguous;
        this.maybe_placeholders = maybe_placeholders;
        this.rule_builders = [...this._init_builders(rules)];
    }
    *_init_builders(rules) {
        let expand_single_child, keep_all_tokens, options, wrapper_chain;
        let propagate_positions = make_propagate_positions(this.propagate_positions);
        for (const rule of rules) {
            options = rule.options;
            keep_all_tokens = options.keep_all_tokens;
            expand_single_child = options.expand1;
            wrapper_chain = [
                ...filter(null, [
                    expand_single_child && !rule.alias && ExpandSingleChild,
                    maybe_create_child_filter(rule.expansion, keep_all_tokens, this.ambiguous, this.maybe_placeholders ? options.empty_indices : []),
                    propagate_positions,
                ]),
            ];
            yield [rule, wrapper_chain];
        }
    }
    create_callback(transformer = null) {
        let f, user_callback_name, wrapper;
        let callbacks = new Map();
        for (const [rule, wrapper_chain] of this.rule_builders) {
            user_callback_name =
                rule.alias || rule.options.template_source || rule.origin.name;
            if (transformer && transformer[user_callback_name]) {
                f = transformer && transformer[user_callback_name];
                wrapper = (f && f["visit_wrapper"]) || null;
                if (wrapper !== null) {
                    f = apply_visit_wrapper(f, user_callback_name, wrapper);
                }
                else if (transformer instanceof Transformer_InPlace) {
                    f = inplace_transformer(f);
                }
            }
            else {
                f = partial(this.tree_class, user_callback_name);
            }
            for (const w of wrapper_chain) {
                f = w(f);
            }
            if (callbacks.has(rule)) {
                throw new GrammarError(format("Rule '%s' already exists", rule));
            }
            callbacks.set(rule, f);
        }
        return callbacks;
    }
}
//
// Lalr Parser
//
class LALR_Parser extends Serialize {
    constructor({ parser_conf, debug = false } = {}) {
        super();
        let analysis = new LALR_Analyzer({
            unknown_param_0: parser_conf,
            debug: debug,
        });
        analysis.compute_lalr();
        let callbacks = parser_conf.callbacks;
        this._parse_table = analysis.parse_table;
        this.parser_conf = parser_conf;
        this.parser = new _Parser(analysis.parse_table, callbacks, debug);
    }
    static deserialize(data, memo, callbacks, debug = false) {
        const cls = this;
        let inst = new_object(cls);
        inst._parse_table = IntParseTable.deserialize(data, memo);
        inst.parser = new _Parser(inst._parse_table, callbacks, debug);
        return inst;
    }
    serialize(memo) {
        return this._parse_table.serialize(memo);
    }
    parse_interactive(lexer, start) {
        return this.parser.parse({
            lexer: lexer,
            start: start,
            start_interactive: true,
        });
    }
    parse({ lexer, start, on_error = null } = {}) {
        let e, p, s;
        try {
            return this.parser.parse({ lexer: lexer, start: start });
        }
        catch (e) {
            if (e instanceof UnexpectedInput) {
                if (on_error === null) {
                    throw e;
                }
                while (true) {
                    if (e instanceof UnexpectedCharacters) {
                        s = e.interactive_parser.lexer_thread.state;
                        p = s.line_ctr.char_pos;
                    }
                    if (!on_error(e)) {
                        throw e;
                    }
                    if (e instanceof UnexpectedCharacters) {
                        // If user didn't change the character position, then we should
                        if (p === s.line_ctr.char_pos) {
                            s.line_ctr.feed(s.text.slice(p, p + 1));
                        }
                    }
                    try {
                        return e.interactive_parser.resume_parse();
                    }
                    catch (e2) {
                        if (e2 instanceof UnexpectedToken) {
                            if (e instanceof UnexpectedToken &&
                                e.token.type === e2.token.type &&
                                e2.token.type === "$END" &&
                                e.interactive_parser.eq(e2.interactive_parser)) {
                                // Prevent infinite loop
                                throw e2;
                            }
                            e = e2;
                        }
                        else if (e2 instanceof UnexpectedCharacters) {
                            e = e2;
                        }
                        else {
                            throw e2;
                        }
                    }
                }
            }
            else {
                throw e;
            }
        }
    }
}
class ParseConf {
    constructor(parse_table, callbacks, start) {
        this.parse_table = parse_table;
        this.start_state = this.parse_table.start_states[start];
        this.end_state = this.parse_table.end_states[start];
        this.states = this.parse_table.states;
        this.callbacks = callbacks;
        this.start = start;
    }
}
class ParserState {
    constructor(parse_conf, lexer, state_stack = null, value_stack = null) {
        this.parse_conf = parse_conf;
        this.lexer = lexer;
        this.state_stack = state_stack || [this.parse_conf.start_state];
        this.value_stack = value_stack || [];
    }
    get position() {
        return last_item(this.state_stack);
    }
    // Necessary for match_examples() to work
    eq(other) {
        if (!(other instanceof ParserState)) {
            return NotImplemented;
        }
        return (this.state_stack.length === other.state_stack.length &&
            this.position === other.position);
    }
    copy() {
        return copy(this);
    }
    feed_token(token, is_end = false) {
        let _action, action, arg, expected, new_state, rule, s, size, state, value;
        let state_stack = this.state_stack;
        let value_stack = this.value_stack;
        let states = this.parse_conf.states;
        let end_state = this.parse_conf.end_state;
        let callbacks = this.parse_conf.callbacks;
        while (true) {
            state = last_item(state_stack);
            if (token.type in states[state]) {
                [action, arg] = states[state][token.type];
            }
            else {
                expected = new Set(dict_keys(states[state])
                    .filter((s) => isupper(s))
                    .map((s) => s));
                throw new UnexpectedToken({
                    token: token,
                    expected: expected,
                    state: this,
                    interactive_parser: null,
                });
            }
            if (action === Shift) {
                // shift once and return
                state_stack.push(arg);
                value_stack.push(!(token.type in callbacks) ? token : callbacks[token.type](token));
                return;
            }
            else {
                // reduce+shift as many times as necessary
                rule = arg;
                size = rule.expansion.length;
                if (size) {
                    s = value_stack.slice(-size);
                    state_stack.splice(-size);
                    value_stack.splice(-size);
                }
                else {
                    s = [];
                }
                value = callbacks.get(rule)(s);
                [_action, new_state] = states[last_item(state_stack)][rule.origin.name];
                state_stack.push(new_state);
                value_stack.push(value);
                if (is_end && last_item(state_stack) === end_state) {
                    return last_item(value_stack);
                }
            }
        }
    }
}
class _Parser {
    constructor(parse_table, callbacks, debug = false) {
        this.parse_table = parse_table;
        this.callbacks = callbacks;
        this.debug = debug;
    }
    parse({ lexer, start, value_stack = null, state_stack = null, start_interactive = false, } = {}) {
        let parse_conf = new ParseConf(this.parse_table, this.callbacks, start);
        let parser_state = new ParserState(parse_conf, lexer, state_stack, value_stack);
        if (start_interactive) {
            return new InteractiveParser(this, parser_state, parser_state.lexer);
        }
        return this.parse_from_state(parser_state);
    }
    parse_from_state(state) {
        let end_token, token;
        // Main LALR-parser loop
        try {
            token = null;
            for (token of state.lexer.lex(state)) {
                state.feed_token(token);
            }
            end_token = token
                ? Token.new_borrow_pos("$END", "", token)
                : new Token("$END", "", 0, 1, 1);
            return state.feed_token(end_token, true);
        }
        catch (e) {
            if (e instanceof UnexpectedInput) {
                try {
                    e.interactive_parser = new InteractiveParser(this, state, state.lexer);
                }
                catch (e) {
                    if (e instanceof ReferenceError) {
                        // pass
                    }
                    else {
                        throw e;
                    }
                }
                throw e;
            }
            else if (e instanceof Error) {
                if (this.debug) {
                    console.log("");
                    console.log("STATE STACK DUMP");
                    console.log("----------------");
                    for (const [i, s] of enumerate(state.state_stack)) {
                        console.log(format("%d)", i), s);
                    }
                    console.log("");
                }
                throw e;
            }
            else {
                throw e;
            }
        }
    }
}
//
// Lalr Interactive Parser
//
// This module provides a LALR interactive parser, which is used for debugging and error handling
/**
  InteractiveParser gives you advanced control over parsing and error handling when parsing with LALR.

    For a simpler interface, see the ``on_error`` argument to ``Lark.parse()``.

*/
class InteractiveParser {
    constructor(parser, parser_state, lexer_thread) {
        this.parser = parser;
        this.parser_state = parser_state;
        this.lexer_thread = lexer_thread;
        this.result = null;
    }
    /**
      Feed the parser with a token, and advance it to the next state, as if it received it from the lexer.
  
          Note that ``token`` has to be an instance of ``Token``.
  
    */
    feed_token(token) {
        return this.parser_state.feed_token(token, token.type === "$END");
    }
    /**
      Step through the different stages of the parse, by reading tokens from the lexer
          and feeding them to the parser, one per iteration.
  
          Returns an iterator of the tokens it encounters.
  
          When the parse is over, the resulting tree can be found in ``InteractiveParser.result``.
  
    */
    *iter_parse() {
        for (const token of this.lexer_thread.lex(this.parser_state)) {
            yield token;
            this.result = this.feed_token(token);
        }
    }
    /**
      Try to feed the rest of the lexer state into the interactive parser.
  
          Note that this modifies the instance in place and does not feed an '$END' Token
  
    */
    exhaust_lexer() {
        return [...this.iter_parse()];
    }
    /**
      Feed a '$END' Token. Borrows from 'last_token' if given.
    */
    feed_eof(last_token = null) {
        let eof = last_token !== null
            ? Token.new_borrow_pos("$END", "", last_token)
            : new Token("$END", "", 0, 1, 1);
        return this.feed_token(eof);
    }
    copy() {
        return copy(this);
    }
    eq(other) {
        if (!(other instanceof InteractiveParser)) {
            return false;
        }
        return (this.parser_state === other.parser_state &&
            this.lexer_thread === other.lexer_thread);
    }
    /**
      Convert to an ``ImmutableInteractiveParser``.
    */
    as_immutable() {
        let p = copy(this);
        return new ImmutableInteractiveParser(p.parser, p.parser_state, p.lexer_thread);
    }
    /**
      Print the output of ``choices()`` in a way that's easier to read.
    */
    pretty() {
        let out = ["Parser choices:"];
        for (const [k, v] of dict_items(this.choices())) {
            out.push(format("\t- %s -> %r", k, v));
        }
        out.push(format("stack size: %s", this.parser_state.state_stack.length));
        return out.join("\n");
    }
    /**
      Returns a dictionary of token types, matched to their action in the parser.
  
          Only returns token types that are accepted by the current state.
  
          Updated by ``feed_token()``.
  
    */
    choices() {
        return this.parser_state.parse_conf.parse_table.states[this.parser_state.position];
    }
    /**
      Returns the set of possible tokens that will advance the parser into a new valid state.
    */
    accepts() {
        let new_cursor;
        let accepts = new Set();
        for (const t of this.choices()) {
            if (isupper(t)) {
                // is terminal?
                new_cursor = copy(this);
                let exc = null;
                try {
                    new_cursor.feed_token(new Token(t, ""));
                }
                catch (e) {
                    exc = e;
                    if (e instanceof UnexpectedToken) {
                        // pass
                    }
                    else {
                        throw e;
                    }
                }
                if (!exc) {
                    accepts.add(t);
                }
            }
        }
        return accepts;
    }
    /**
      Resume automated parsing from the current state.
    */
    resume_parse() {
        return this.parser.parse_from_state(this.parser_state);
    }
}
/**
  Same as ``InteractiveParser``, but operations create a new instance instead
    of changing it in-place.

*/
class ImmutableInteractiveParser extends InteractiveParser {
    constructor() {
        super(...arguments);
        this.result = null;
    }
    feed_token(token) {
        let c = copy(this);
        c.result = InteractiveParser.feed_token(c, token);
        return c;
    }
    /**
      Try to feed the rest of the lexer state into the parser.
  
          Note that this returns a new ImmutableInteractiveParser and does not feed an '$END' Token
    */
    exhaust_lexer() {
        let cursor = this.as_mutable();
        cursor.exhaust_lexer();
        return cursor.as_immutable();
    }
    /**
      Convert to an ``InteractiveParser``.
    */
    as_mutable() {
        let p = copy(this);
        return new InteractiveParser(p.parser, p.parser_state, p.lexer_thread);
    }
}
//
// Lalr Analysis
//
class Action {
    constructor(name) {
        this.name = name;
    }
    repr() {
        return this.toString();
    }
}
var Shift = new Action("Shift");
var Reduce = new Action("Reduce");
class ParseTable {
    constructor(states, start_states, end_states) {
        this.states = states;
        this.start_states = start_states;
        this.end_states = end_states;
    }
    serialize(memo) {
        let tokens = new Enumerator();
        let states = Object.fromEntries(dict_items(this.states).map(([state, actions]) => [
            state,
            Object.fromEntries(dict_items(actions).map(([token, [action, arg]]) => [
                dict_get(tokens, token),
                action === Reduce ? [1, arg.serialize(memo)] : [0, arg],
            ])),
        ]));
        return {
            tokens: tokens.reversed(),
            states: states,
            start_states: this.start_states,
            end_states: this.end_states,
        };
    }
    static deserialize(data, memo) {
        const cls = this;
        let tokens = data["tokens"];
        let states = Object.fromEntries(dict_items(data["states"]).map(([state, actions]) => [
            state,
            Object.fromEntries(dict_items(actions).map(([token, [action, arg]]) => [
                tokens[token],
                action === 1 ? [Reduce, Rule.deserialize(arg, memo)] : [Shift, arg],
            ])),
        ]));
        return new cls(states, data["start_states"], data["end_states"]);
    }
}
class IntParseTable extends ParseTable {
    static from_ParseTable(parse_table) {
        const cls = this;
        let enum_ = [...parse_table.states];
        let state_to_idx = Object.fromEntries(enumerate(enum_).map(([i, s]) => [s, i]));
        let int_states = {};
        for (let [s, la] of dict_items(parse_table.states)) {
            la = Object.fromEntries(dict_items(la).map(([k, v]) => [
                k,
                v[0] === Shift ? [v[0], state_to_idx[v[1]]] : v,
            ]));
            int_states[state_to_idx[s]] = la;
        }
        let start_states = Object.fromEntries(dict_items(parse_table.start_states).map(([start, s]) => [
            start,
            state_to_idx[s],
        ]));
        let end_states = Object.fromEntries(dict_items(parse_table.end_states).map(([start, s]) => [
            start,
            state_to_idx[s],
        ]));
        return new cls(int_states, start_states, end_states);
    }
}
//
// Parser Frontends
//
function _wrap_lexer(lexer_class) {
    let future_interface = (lexer_class && lexer_class["__future_interface__"]) || false;
    if (future_interface) {
        return lexer_class;
    }
    else {
        class CustomLexerWrapper extends Lexer {
            constructor(lexer_conf) {
                super();
                this.lexer = lexer_class(lexer_conf);
            }
            lex(lexer_state, parser_state) {
                return this.lexer.lex(lexer_state.text);
            }
        }
        return CustomLexerWrapper;
    }
}
class MakeParsingFrontend {
    constructor(parser_type, lexer_type) {
        this.parser_type = parser_type;
        this.lexer_type = lexer_type;
    }
    deserialize(data, memo, lexer_conf, callbacks, options) {
        let parser_conf = ParserConf.deserialize(data["parser_conf"], memo);
        let parser = LALR_Parser.deserialize(data["parser"], memo, callbacks, options.debug);
        parser_conf.callbacks = callbacks;
        return new ParsingFrontend({
            lexer_conf: lexer_conf,
            parser_conf: parser_conf,
            options: options,
            parser: parser,
        });
    }
}
// ... Continued later in the module
function _deserialize_parsing_frontend(data, memo, lexer_conf, callbacks, options) {
    let parser_conf = ParserConf.deserialize(data["parser_conf"], memo);
    let parser = LALR_Parser.deserialize(data["parser"], memo, callbacks, options.debug);
    parser_conf.callbacks = callbacks;
    return new ParsingFrontend({
        lexer_conf: lexer_conf,
        parser_conf: parser_conf,
        options: options,
        parser: parser,
    });
}
var _parser_creators = {};
class ParsingFrontend extends Serialize {
    static get __serialize_fields__() {
        return ["lexer_conf", "parser_conf", "parser"];
    }
    constructor({ lexer_conf, parser_conf, options, parser = null } = {}) {
        super();
        let create_lexer, create_parser;
        this.parser_conf = parser_conf;
        this.lexer_conf = lexer_conf;
        this.options = options;
        // Set-up parser
        if (parser) {
            // From cache
            this.parser = parser;
        }
        else {
            create_parser = dict_get(_parser_creators, parser_conf.parser_type);
            this.parser = create_parser(lexer_conf, parser_conf, options);
        }
        // Set-up lexer
        let lexer_type = lexer_conf.lexer_type;
        this.skip_lexer = false;
        if (["dynamic", "dynamic_complete"].includes(lexer_type)) {
            this.skip_lexer = true;
            return;
        }
        const lexers = {
            basic: create_basic_lexer,
            contextual: create_contextual_lexer
        };
        if (lexer_type in lexers) {
            create_lexer = lexers[lexer_type];
            this.lexer = create_lexer(lexer_conf, this.parser, lexer_conf.postlex, options);
        }
        else {
            this.lexer = _wrap_lexer(lexer_type)(lexer_conf);
        }
        if (lexer_conf.postlex) {
            this.lexer = new PostLexConnector(this.lexer, lexer_conf.postlex);
        }
    }
    _verify_start(start = null) {
        let start_decls;
        if (start === null) {
            start_decls = this.parser_conf.start;
            if (start_decls.length > 1) {
                throw new ConfigurationError("Lark initialized with more than 1 possible start rule. Must specify which start rule to parse", start_decls);
            }
            [start] = start_decls;
        }
        else if (!(this.parser_conf.start.includes(start))) {
            throw new ConfigurationError(format("Unknown start rule %s. Must be one of %r", start, this.parser_conf.start));
        }
        return start;
    }
    _make_lexer_thread(text) {
        return this.skip_lexer ? text : LexerThread.from_text(this.lexer, text);
    }
    parse(text, start = null, on_error = null) {
        let chosen_start = this._verify_start(start);
        let kw = on_error === null ? {} : { on_error: on_error };
        let stream = this._make_lexer_thread(text);
        return this.parser.parse({
            lexer: stream,
            start: chosen_start,
            ...kw,
        });
    }
    parse_interactive(text = null, start = null) {
        let chosen_start = this._verify_start(start);
        if (this.parser_conf.parser_type !== "lalr") {
            throw new ConfigurationError("parse_interactive() currently only works with parser='lalr' ");
        }
        let stream = this._make_lexer_thread(text);
        return this.parser.parse_interactive(stream, chosen_start);
    }
}
function _validate_frontend_args(parser, lexer) {
    let expected;
    assert_config(parser, ["lalr", "earley", "cyk"]);
    if (!(typeof lexer === "object")) {
        // not custom lexer?
        expected = {
            lalr: ["basic", "contextual"],
            earley: ["basic", "dynamic", "dynamic_complete"],
            cyk: ["basic"],
        }[parser];
        assert_config(lexer, expected, format("Parser %r does not support lexer %%r, expected one of %%s", parser));
    }
}
function _get_lexer_callbacks(transformer, terminals) {
    let callback;
    let result = {};
    for (const terminal of terminals) {
        callback = (transformer && transformer[terminal.name]) || null;
        if (callback !== null) {
            result[terminal.name] = callback;
        }
    }
    return result;
}
class PostLexConnector {
    constructor(lexer, postlexer) {
        this.lexer = lexer;
        this.postlexer = postlexer;
    }
    lex(lexer_state, parser_state) {
        let i = this.lexer.lex(lexer_state, parser_state);
        return this.postlexer.process(i);
    }
}
function create_basic_lexer(lexer_conf, parser, postlex, options) {
    return new BasicLexer(lexer_conf);
}
function create_contextual_lexer(lexer_conf, parser, postlex, options) {
    let states = Object.fromEntries(dict_items(parser._parse_table.states).map(([idx, t]) => [
        idx,
        [...dict_keys(t)],
    ]));
    let always_accept = postlex ? postlex.always_accept : [];
    return new ContextualLexer({
        conf: lexer_conf,
        states: states,
        always_accept: always_accept,
    });
}
function create_lalr_parser(lexer_conf, parser_conf, options = null) {
    let debug = options ? options.debug : false;
    return new LALR_Parser({ parser_conf: parser_conf, debug: debug });
}
_parser_creators["lalr"] = create_lalr_parser;
//
// Lark
//
class PostLex extends ABC {
    constructor() {
        super(...arguments);
        this.always_accept = [];
    }
    process(stream) {
        return stream;
    }
}
/**
  Specifies the options for Lark


*/
class LarkOptions extends Serialize {
    constructor(options_dict) {
        super();
        this.OPTIONS_DOC = `
    **===  General Options  ===**

    start
            The start symbol. Either a string, or a list of strings for multiple possible starts (Default: "start")
    debug
            Display debug information and extra warnings. Use only when debugging (Default: \`\`False\`\`)
            When used with Earley, it generates a forest graph as "sppf.png", if 'dot' is installed.
    transformer
            Applies the transformer to every parse tree (equivalent to applying it after the parse, but faster)
    propagate_positions
            Propagates (line, column, end_line, end_column) attributes into all tree branches.
            Accepts \`\`False\`\`, \`\`True\`\`, or a callable, which will filter which nodes to ignore when propagating.
    maybe_placeholders
            When \`\`True\`\`, the \`\`[]\`\` operator returns \`\`None\`\` when not matched.
            When \`\`False\`\`,  \`\`[]\`\` behaves like the \`\`?\`\` operator, and returns no value at all.
            (default= \`\`True\`\`)
    cache
            Cache the results of the Lark grammar analysis, for x2 to x3 faster loading. LALR only for now.

            - When \`\`False\`\`, does nothing (default)
            - When \`\`True\`\`, caches to a temporary file in the local directory
            - When given a string, caches to the path pointed by the string
    regex
            When True, uses the \`\`regex\`\` module instead of the stdlib \`\`re\`\`.
    g_regex_flags
            Flags that are applied to all terminals (both regex and strings)
    keep_all_tokens
            Prevent the tree builder from automagically removing "punctuation" tokens (Default: \`\`False\`\`)
    tree_class
            Lark will produce trees comprised of instances of this class instead of the default \`\`lark.Tree\`\`.

    **=== Algorithm Options ===**

    parser
            Decides which parser engine to use. Accepts "earley" or "lalr". (Default: "earley").
            (there is also a "cyk" option for legacy)
    lexer
            Decides whether or not to use a lexer stage

            - "auto" (default): Choose for me based on the parser
            - "basic": Use a basic lexer
            - "contextual": Stronger lexer (only works with parser="lalr")
            - "dynamic": Flexible and powerful (only with parser="earley")
            - "dynamic_complete": Same as dynamic, but tries *every* variation of tokenizing possible.
    ambiguity
            Decides how to handle ambiguity in the parse. Only relevant if parser="earley"

            - "resolve": The parser will automatically choose the simplest derivation
              (it chooses consistently: greedy for tokens, non-greedy for rules)
            - "explicit": The parser will return all derivations wrapped in "_ambig" tree nodes (i.e. a forest).
            - "forest": The parser will return the root of the shared packed parse forest.

    **=== Misc. / Domain Specific Options ===**

    postlex
            Lexer post-processing (Default: \`\`None\`\`) Only works with the basic and contextual lexers.
    priority
            How priorities should be evaluated - "auto", \`\`None\`\`, "normal", "invert" (Default: "auto")
    lexer_callbacks
            Dictionary of callbacks for the lexer. May alter tokens during lexing. Use with caution.
    use_bytes
            Accept an input of type \`\`bytes\`\` instead of \`\`str\`\`.
    edit_terminals
            A callback for editing the terminals before parse.
    import_paths
            A List of either paths or loader functions to specify from where grammars are imported
    source_path
            Override the source of from where the grammar was loaded. Useful for relative imports and unconventional grammar loading
    **=== End of Options ===**
    `;
        // Adding a new option needs to be done in multiple places:
        // - In the dictionary below. This is the primary truth of which options `Lark.__init__` accepts
        // - In the docstring above. It is used both for the docstring of `LarkOptions` and `Lark`, and in readthedocs
        // - As an attribute of `LarkOptions` above
        // - Potentially in `_LOAD_ALLOWED_OPTIONS` below this class, when the option doesn't change how the grammar is loaded
        // - Potentially in `lark.tools.__init__`, if it makes sense, and it can easily be passed as a cmd argument
        this._defaults = {
            debug: false,
            keep_all_tokens: false,
            tree_class: null,
            cache: false,
            postlex: null,
            parser: "earley",
            lexer: "auto",
            transformer: null,
            start: "start",
            priority: "auto",
            ambiguity: "auto",
            regex: false,
            propagate_positions: false,
            lexer_callbacks: {},
            maybe_placeholders: true,
            edit_terminals: null,
            g_regex_flags: '',
            use_bytes: false,
            import_paths: [],
            source_path: null,
            _plugins: null,
        };
        let value;
        let o = dict(options_dict);
        let options = this;
        for (const [name, default_] of dict_items(this._defaults)) {
            if (name in o) {
                value = dict_pop(o, name);
                if (typeof default_ === "boolean" &&
                    !["cache", "use_bytes", "propagate_positions"].includes(name)) {
                    value = bool(value);
                }
            }
            else {
                value = default_;
            }
            options[name] = value;
        }
        if (typeof options["start"] === "string") {
            options["start"] = [options["start"]];
        }
        this["options"] = options;
        assert_config(this.parser, ["earley", "lalr", "cyk", null]);
        if (this.parser === "earley" && this.transformer) {
            throw new ConfigurationError("Cannot specify an embedded transformer when using the Earley algorithm. " +
                "Please use your transformer on the resulting parse tree, or use a different algorithm (i.e. LALR)");
        }
        if (Object.keys(o).length) {
            throw new ConfigurationError(format("Unknown options: %s", dict_keys(o)));
        }
    }
    serialize(memo) {
        return this.options;
    }
    static deserialize(data, memo) {
        const cls = this;
        return new cls(data);
    }
}
// Options that can be passed to the Lark parser, even when it was loaded from cache/standalone.
// These options are only used outside of `load_grammar`.
var _LOAD_ALLOWED_OPTIONS = new Set([
    "postlex",
    "transformer",
    "lexer_callbacks",
    "use_bytes",
    "debug",
    "g_regex_flags",
    "regex",
    "propagate_positions",
    "tree_class",
]);
var _VALID_PRIORITY_OPTIONS = ["auto", "normal", "invert", null];
var _VALID_AMBIGUITY_OPTIONS = ["auto", "resolve", "explicit", "forest"];
/**
  Main interface for the library.

    It's mostly a thin wrapper for the many different parsers, and for the tree constructor.

    Parameters:
        grammar: a string or file-object containing the grammar spec (using Lark's ebnf syntax)
        options: a dictionary controlling various aspects of Lark.

    Example:
        >>> Lark(r'''start: "foo" ''')
        Lark(...)

*/
class Lark extends Serialize {
    static get __serialize_fields__() {
        return ["parser", "rules", "options"];
    }
    _build_lexer(dont_ignore = false) {
        let lexer_conf = this.lexer_conf;
        if (dont_ignore) {
            lexer_conf = copy(lexer_conf);
            lexer_conf.ignore = [];
        }
        return new BasicLexer(lexer_conf);
    }
    _prepare_callbacks() {
        this._callbacks = new Map();
        // we don't need these callbacks if we aren't building a tree
        if (this.options.ambiguity !== "forest") {
            this._parse_tree_builder = new ParseTreeBuilder(this.rules, this.options.tree_class || make_constructor(Tree), this.options.propagate_positions, this.options.parser !== "lalr" && this.options.ambiguity === "explicit", this.options.maybe_placeholders);
            this._callbacks = this._parse_tree_builder.create_callback(this.options.transformer);
        }
        dict_update(this._callbacks, _get_lexer_callbacks(this.options.transformer, this.terminals));
    }
    /**
      Saves the instance into the given file object
  
          Useful for caching and multiprocessing.
  
    */
    /**
      Loads an instance from the given file object
  
          Useful for caching and multiprocessing.
  
    */
    _deserialize_lexer_conf(data, memo, options) {
        let lexer_conf = LexerConf.deserialize(data["lexer_conf"], memo);
        lexer_conf.callbacks = options.lexer_callbacks || {};
        lexer_conf.re_module = options.regex ? regex : re;
        lexer_conf.use_bytes = options.use_bytes;
        lexer_conf.g_regex_flags = options.g_regex_flags || '';
        lexer_conf.skip_validation = true;
        lexer_conf.postlex = options.postlex;
        return lexer_conf;
    }
    _load({ f, ...kwargs } = {}) {
        let d;
        if (is_dict(f)) {
            d = f;
        }
        else {
            d = pickle.load(f);
        }
        let memo_json = d["memo"];
        let data = d["data"];
        let memo = SerializeMemoizer.deserialize(memo_json, { Rule: Rule, TerminalDef: TerminalDef }, {});
        let options = dict(data["options"]);
        // if (
        //   (new Set(kwargs) - _LOAD_ALLOWED_OPTIONS) &
        //   new Set(LarkOptions._defaults)
        // ) {
        //   throw new ConfigurationError(
        //     "Some options are not allowed when loading a Parser: {}".format(
        //       new Set(kwargs) - _LOAD_ALLOWED_OPTIONS
        //     )
        //   );
        // }
        dict_update(options, kwargs);
        this.options = LarkOptions.deserialize(options, memo);
        this.rules = data["rules"].map((r) => Rule.deserialize(r, memo));
        this.source_path = "<deserialized>";
        _validate_frontend_args(this.options.parser, this.options.lexer);
        this.lexer_conf = this._deserialize_lexer_conf(data["parser"], memo, this.options);
        this.terminals = this.lexer_conf.terminals;
        this._prepare_callbacks();
        this._terminals_dict = Object.fromEntries(this.terminals.map((t) => [t.name, t]));
        this.parser = _deserialize_parsing_frontend(data["parser"], memo, this.lexer_conf, this._callbacks, this.options);
        return this;
    }
    static _load_from_dict({ data, memo, ...kwargs } = {}) {
        const cls = this;
        let inst = new_object(cls);
        return inst._load({
            f: { data: data, memo: memo },
            ...kwargs,
        });
    }
    /**
      Create an instance of Lark with the grammar given by its filename
  
          If ``rel_to`` is provided, the function will find the grammar filename in relation to it.
  
          Example:
  
              >>> Lark.open("grammar_file.lark", rel_to=__file__, parser="lalr")
              Lark(...)
  
  
    */
    /**
      Create an instance of Lark with the grammar loaded from within the package `package`.
          This allows grammar loading from zipapps.
  
          Imports in the grammar will use the `package` and `search_paths` provided, through `FromPackageLoader`
  
          Example:
  
              Lark.open_from_package(__name__, "example.lark", ("grammars",), parser=...)
  
    */
    repr() {
        return format("Lark(open(%r), parser=%r, lexer=%r, ...)", this.source_path, this.options.parser, this.options.lexer);
    }
    /**
      Only lex (and postlex) the text, without parsing it. Only relevant when lexer='basic'
  
          When dont_ignore=True, the lexer will return all tokens, even those marked for %ignore.
  
          :raises UnexpectedCharacters: In case the lexer cannot find a suitable match.
  
    */
    lex(text, dont_ignore = false) {
        let lexer;
        if (!("lexer" in this) || dont_ignore) {
            lexer = this._build_lexer(dont_ignore);
        }
        else {
            lexer = this.lexer;
        }
        let lexer_thread = LexerThread.from_text(lexer, text);
        let stream = lexer_thread.lex(null);
        if (this.options.postlex) {
            return this.options.postlex.process(stream);
        }
        return stream;
    }
    /**
      Get information about a terminal
    */
    get_terminal(name) {
        return this._terminals_dict[name];
    }
    /**
      Start an interactive parsing session.
  
          Parameters:
              text (str, optional): Text to be parsed. Required for ``resume_parse()``.
              start (str, optional): Start symbol
  
          Returns:
              A new InteractiveParser instance.
  
          See Also: ``Lark.parse()``
  
    */
    parse_interactive(text = null, start = null) {
        return this.parser.parse_interactive({
            unknown_param_0: text,
            start: start,
        });
    }
    /**
      Parse the given text, according to the options provided.
  
          Parameters:
              text (str): Text to be parsed.
              start (str, optional): Required if Lark was given multiple possible start symbols (using the start option).
              on_error (function, optional): if provided, will be called on UnexpectedToken error. Return true to resume parsing.
                  LALR only. See examples/advanced/error_handling.py for an example of how to use on_error.
  
          Returns:
              If a transformer is supplied to ``__init__``, returns whatever is the
              result of the transformation. Otherwise, returns a Tree instance.
  
          :raises UnexpectedInput: On a parse error, one of these sub-exceptions will rise:
                  ``UnexpectedCharacters``, ``UnexpectedToken``, or ``UnexpectedEOF``.
                  For convenience, these sub-exceptions also inherit from ``ParserError`` and ``LexerError``.
  
  
    */
    parse(text, start = null, on_error = null) {
        return this.parser.parse(text, start, on_error);
    }
}
//
// Indenter
//
class DedentError extends LarkError {
}
class Indenter extends PostLex {
    constructor() {
        super();
        this.paren_level = 0;
        this.indent_level = [0];
    }
    *handle_NL(token) {
        if (this.paren_level > 0) {
            return;
        }
        yield token;
        let indent_str = rsplit(token.value, "\n", 1)[1];
        // Tabs and spaces
        let indent = str_count(indent_str, " ") + str_count(indent_str, "\t") * this.tab_len;
        if (indent > last_item(this.indent_level)) {
            this.indent_level.push(indent);
            yield Token.new_borrow_pos(this.INDENT_type, indent_str, token);
        }
        else {
            while (indent < last_item(this.indent_level)) {
                this.indent_level.pop();
                yield Token.new_borrow_pos(this.DEDENT_type, indent_str, token);
            }
            if (indent !== last_item(this.indent_level)) {
                throw new DedentError(format("Unexpected dedent to column %s. Expected dedent to %s", indent, last_item(this.indent_level)));
            }
        }
    }
    *_process(stream) {
        for (const token of stream) {
            if (token.type === this.NL_type) {
                yield* this.handle_NL(token);
            }
            else {
                yield token;
            }
            if (this.OPEN_PAREN_types.includes(token.type)) {
                this.paren_level += 1;
            }
            else if (this.CLOSE_PAREN_types.includes(token.type)) {
                this.paren_level -= 1;
            }
        }
        while (this.indent_level.length > 1) {
            this.indent_level.pop();
            yield new Token(this.DEDENT_type, "");
        }
    }
    process(stream) {
        this.paren_level = 0;
        this.indent_level = [0];
        return this._process(stream);
    }
    // XXX Hack for ContextualLexer. Maybe there's a more elegant solution?
    get always_accept() {
        return [this.NL_type];
    }
    get NL_type() {
        throw new NotImplementedError();
    }
    get OPEN_PAREN_types() {
        throw new NotImplementedError();
    }
    get CLOSE_PAREN_types() {
        throw new NotImplementedError();
    }
    get INDENT_type() {
        throw new NotImplementedError();
    }
    get DEDENT_type() {
        throw new NotImplementedError();
    }
    get tab_len() {
        throw new NotImplementedError();
    }
}
class PythonIndenter extends Indenter {
    static get NL_type() {
        return "_NEWLINE";
    }
    get NL_type() {
        return this.constructor.NL_type;
    }
    static get OPEN_PAREN_types() {
        return ["LPAR", "LSQB", "LBRACE"];
    }
    get OPEN_PAREN_types() {
        return this.constructor.OPEN_PAREN_types;
    }
    static get CLOSE_PAREN_types() {
        return ["RPAR", "RSQB", "RBRACE"];
    }
    get CLOSE_PAREN_types() {
        return this.constructor.CLOSE_PAREN_types;
    }
    static get INDENT_type() {
        return "_INDENT";
    }
    get INDENT_type() {
        return this.constructor.INDENT_type;
    }
    static get DEDENT_type() {
        return "_DEDENT";
    }
    get DEDENT_type() {
        return this.constructor.DEDENT_type;
    }
    static get tab_len() {
        return 8;
    }
    get tab_len() {
        return this.constructor.tab_len;
    }
}
const NAMESPACE = {
    Terminal: Terminal,
    NonTerminal: NonTerminal,
    RuleOptions: RuleOptions,
    PatternStr: PatternStr,
    PatternRE: PatternRE,
    TerminalDef: TerminalDef
};
const module_exports = {
    LarkError,
    ConfigurationError,
    GrammarError,
    ParseError,
    LexError,
    UnexpectedInput,
    UnexpectedEOF,
    UnexpectedCharacters,
    UnexpectedToken,
    VisitError,
    Meta,
    Tree,
    Discard,
    Transformer,
    Transformer_InPlace,
    Transformer_NonRecursive,
    Transformer_InPlaceRecursive,
    VisitorBase,
    Visitor,
    Visitor_Recursive,
    Interpreter,
    Symbol,
    Terminal,
    NonTerminal,
    RuleOptions,
    Rule,
    Pattern,
    PatternStr,
    PatternRE,
    TerminalDef,
    Token,
    Lexer,
    LexerConf,
    ParserConf,
    InteractiveParser,
    ImmutableInteractiveParser,
    PostLex,
    Lark,
    DedentError,
    Indenter,
    PythonIndenter,
    get_parser,
};
var DATA = {
    "parser": {
        "lexer_conf": {
            "terminals": [
                {
                    "@": 0
                },
                {
                    "@": 1
                },
                {
                    "@": 2
                },
                {
                    "@": 3
                },
                {
                    "@": 4
                },
                {
                    "@": 5
                },
                {
                    "@": 6
                },
                {
                    "@": 7
                },
                {
                    "@": 8
                },
                {
                    "@": 9
                },
                {
                    "@": 10
                },
                {
                    "@": 11
                },
                {
                    "@": 12
                },
                {
                    "@": 13
                },
                {
                    "@": 14
                },
                {
                    "@": 15
                },
                {
                    "@": 16
                },
                {
                    "@": 17
                },
                {
                    "@": 18
                },
                {
                    "@": 19
                },
                {
                    "@": 20
                },
                {
                    "@": 21
                },
                {
                    "@": 22
                },
                {
                    "@": 23
                },
                {
                    "@": 24
                },
                {
                    "@": 25
                },
                {
                    "@": 26
                },
                {
                    "@": 27
                }
            ],
            "ignore": [
                "WS"
            ],
            "g_regex_flags": 0,
            "use_bytes": false,
            "lexer_type": "contextual",
            "__type__": "LexerConf"
        },
        "parser_conf": {
            "rules": [
                {
                    "@": 28
                },
                {
                    "@": 29
                },
                {
                    "@": 30
                },
                {
                    "@": 31
                },
                {
                    "@": 32
                },
                {
                    "@": 33
                },
                {
                    "@": 34
                },
                {
                    "@": 35
                },
                {
                    "@": 36
                },
                {
                    "@": 37
                },
                {
                    "@": 38
                },
                {
                    "@": 39
                },
                {
                    "@": 40
                },
                {
                    "@": 41
                },
                {
                    "@": 42
                },
                {
                    "@": 43
                },
                {
                    "@": 44
                },
                {
                    "@": 45
                },
                {
                    "@": 46
                },
                {
                    "@": 47
                },
                {
                    "@": 48
                },
                {
                    "@": 49
                },
                {
                    "@": 50
                },
                {
                    "@": 51
                },
                {
                    "@": 52
                },
                {
                    "@": 53
                },
                {
                    "@": 54
                },
                {
                    "@": 55
                },
                {
                    "@": 56
                },
                {
                    "@": 57
                },
                {
                    "@": 58
                },
                {
                    "@": 59
                },
                {
                    "@": 60
                },
                {
                    "@": 61
                },
                {
                    "@": 62
                },
                {
                    "@": 63
                },
                {
                    "@": 64
                },
                {
                    "@": 65
                },
                {
                    "@": 66
                },
                {
                    "@": 67
                },
                {
                    "@": 68
                },
                {
                    "@": 69
                },
                {
                    "@": 70
                },
                {
                    "@": 71
                },
                {
                    "@": 72
                },
                {
                    "@": 73
                },
                {
                    "@": 74
                },
                {
                    "@": 75
                },
                {
                    "@": 76
                },
                {
                    "@": 77
                },
                {
                    "@": 78
                },
                {
                    "@": 79
                },
                {
                    "@": 80
                },
                {
                    "@": 81
                }
            ],
            "start": [
                "start"
            ],
            "parser_type": "lalr",
            "__type__": "ParserConf"
        },
        "parser": {
            "tokens": {
                "0": "__ANON_1",
                "1": "__ANON_4",
                "2": "__ANON_2",
                "3": "BANG",
                "4": "__ANON_0",
                "5": "strong_negation",
                "6": "consistency",
                "7": "__ANON_3",
                "8": "value",
                "9": "mosil_nabla",
                "10": "unary",
                "11": "VARIABLE",
                "12": "VALUE",
                "13": "variable",
                "14": "baaz_delta",
                "15": "doubtful_operator",
                "16": "weak_negation",
                "17": "parentheses",
                "18": "I",
                "19": "post_negation",
                "20": "__ANON_5",
                "21": "__ANON_13",
                "22": "__ANON_16",
                "23": "__ANON_9",
                "24": "__ANON_11",
                "25": "QMARK",
                "26": "__ANON_19",
                "27": "__ANON_18",
                "28": "__ANON_14",
                "29": "__ANON_7",
                "30": "__ANON_12",
                "31": "__ANON_17",
                "32": "__ANON_15",
                "33": "$END",
                "34": "RBRACE",
                "35": "__ANON_8",
                "36": "__ANON_20",
                "37": "__ANON_10",
                "38": "__ANON_6",
                "39": "operation",
                "40": "expression",
                "41": "weak_conjunction",
                "42": "j_implication",
                "43": "g_bi_implication",
                "44": "l_implication",
                "45": "bochvar_disjunction",
                "46": "k_implication",
                "47": "k_bi_implication",
                "48": "strong_disjunction",
                "49": "j_bi_implication",
                "50": "l_bi_implication",
                "51": "g_implication",
                "52": "binary",
                "53": "l_strong_conjunction",
                "54": "weak_disjunction",
                "55": "quine_dagger",
                "56": "query",
                "57": "start"
            },
            "states": {
                "0": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "10": [
                        0,
                        37
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "1": {
                    "21": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 53
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 53
                        }
                    ]
                },
                "2": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "10": [
                        0,
                        39
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "3": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "10": [
                        0,
                        40
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "4": {
                    "21": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 66
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 66
                        }
                    ]
                },
                "5": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "10": [
                        0,
                        42
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "6": {
                    "21": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 47
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 47
                        }
                    ]
                },
                "7": {
                    "39": [
                        0,
                        61
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "40": [
                        0,
                        32
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "41": [
                        0,
                        20
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "42": [
                        0,
                        69
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "43": [
                        0,
                        74
                    ],
                    "44": [
                        0,
                        72
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "45": [
                        0,
                        60
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "46": [
                        0,
                        10
                    ],
                    "47": [
                        0,
                        6
                    ],
                    "0": [
                        0,
                        8
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "10": [
                        0,
                        38
                    ],
                    "48": [
                        0,
                        41
                    ],
                    "49": [
                        0,
                        43
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "50": [
                        0,
                        55
                    ],
                    "51": [
                        0,
                        68
                    ],
                    "52": [
                        0,
                        67
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "53": [
                        0,
                        76
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "54": [
                        0,
                        62
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "55": [
                        0,
                        71
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "8": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "10": [
                        0,
                        28
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "9": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "10": [
                        0,
                        44
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "10": {
                    "21": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 43
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 43
                        }
                    ]
                },
                "11": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "10": [
                        0,
                        45
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "12": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "10": [
                        0,
                        46
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "13": {
                    "21": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 48
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 48
                        }
                    ]
                },
                "14": {
                    "21": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 55
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 55
                        }
                    ]
                },
                "15": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "10": [
                        0,
                        47
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "16": {
                    "21": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 56
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 56
                        }
                    ]
                },
                "17": {
                    "21": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 67
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 67
                        }
                    ]
                },
                "18": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ],
                    "10": [
                        0,
                        49
                    ]
                },
                "19": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "10": [
                        0,
                        50
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "20": {
                    "21": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 38
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 38
                        }
                    ]
                },
                "21": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "10": [
                        0,
                        51
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "22": {
                    "33": [
                        1,
                        {
                            "@": 30
                        }
                    ]
                },
                "23": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "10": [
                        0,
                        54
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "24": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "10": [
                        0,
                        56
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "25": {
                    "21": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 64
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 64
                        }
                    ]
                },
                "26": {
                    "37": [
                        0,
                        79
                    ],
                    "30": [
                        0,
                        11
                    ],
                    "27": [
                        0,
                        12
                    ],
                    "36": [
                        0,
                        15
                    ],
                    "35": [
                        0,
                        18
                    ],
                    "31": [
                        0,
                        19
                    ],
                    "32": [
                        0,
                        21
                    ],
                    "22": [
                        0,
                        0
                    ],
                    "26": [
                        0,
                        23
                    ],
                    "24": [
                        0,
                        2
                    ],
                    "21": [
                        0,
                        3
                    ],
                    "23": [
                        0,
                        5
                    ],
                    "29": [
                        0,
                        9
                    ],
                    "28": [
                        0,
                        24
                    ],
                    "25": [
                        1,
                        {
                            "@": 59
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 59
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 59
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 59
                        }
                    ]
                },
                "27": {
                    "37": [
                        0,
                        79
                    ],
                    "30": [
                        0,
                        11
                    ],
                    "27": [
                        0,
                        12
                    ],
                    "36": [
                        0,
                        15
                    ],
                    "35": [
                        0,
                        18
                    ],
                    "31": [
                        0,
                        19
                    ],
                    "32": [
                        0,
                        21
                    ],
                    "22": [
                        0,
                        0
                    ],
                    "26": [
                        0,
                        23
                    ],
                    "24": [
                        0,
                        2
                    ],
                    "21": [
                        0,
                        3
                    ],
                    "23": [
                        0,
                        5
                    ],
                    "29": [
                        0,
                        9
                    ],
                    "34": [
                        0,
                        58
                    ],
                    "28": [
                        0,
                        24
                    ]
                },
                "28": {
                    "21": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 60
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 60
                        }
                    ]
                },
                "29": {
                    "21": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 61
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 61
                        }
                    ]
                },
                "30": {
                    "21": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 62
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 62
                        }
                    ]
                },
                "31": {
                    "21": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 50
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 50
                        }
                    ]
                },
                "32": {
                    "37": [
                        0,
                        79
                    ],
                    "30": [
                        0,
                        11
                    ],
                    "27": [
                        0,
                        12
                    ],
                    "36": [
                        0,
                        15
                    ],
                    "35": [
                        0,
                        18
                    ],
                    "31": [
                        0,
                        19
                    ],
                    "38": [
                        0,
                        59
                    ],
                    "32": [
                        0,
                        21
                    ],
                    "22": [
                        0,
                        0
                    ],
                    "26": [
                        0,
                        23
                    ],
                    "24": [
                        0,
                        2
                    ],
                    "21": [
                        0,
                        3
                    ],
                    "23": [
                        0,
                        5
                    ],
                    "29": [
                        0,
                        9
                    ],
                    "28": [
                        0,
                        24
                    ]
                },
                "33": {
                    "33": [
                        1,
                        {
                            "@": 29
                        }
                    ]
                },
                "34": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "10": [
                        0,
                        25
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "35": {
                    "21": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 63
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 63
                        }
                    ]
                },
                "36": {
                    "21": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 71
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 71
                        }
                    ]
                },
                "37": {
                    "21": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 77
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 77
                        }
                    ]
                },
                "38": {
                    "21": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 33
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 33
                        }
                    ]
                },
                "39": {
                    "21": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 72
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 72
                        }
                    ]
                },
                "40": {
                    "21": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 74
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 74
                        }
                    ]
                },
                "41": {
                    "21": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 37
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 37
                        }
                    ]
                },
                "42": {
                    "21": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 70
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 70
                        }
                    ]
                },
                "43": {
                    "21": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 46
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 46
                        }
                    ]
                },
                "44": {
                    "21": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 68
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 68
                        }
                    ]
                },
                "45": {
                    "21": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 73
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 73
                        }
                    ]
                },
                "46": {
                    "21": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 79
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 79
                        }
                    ]
                },
                "47": {
                    "21": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 81
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 81
                        }
                    ]
                },
                "48": {
                    "21": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 57
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 57
                        }
                    ]
                },
                "49": {
                    "21": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 69
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 69
                        }
                    ]
                },
                "50": {
                    "21": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 78
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 78
                        }
                    ]
                },
                "51": {
                    "21": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 76
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 76
                        }
                    ]
                },
                "52": {
                    "37": [
                        0,
                        79
                    ],
                    "22": [
                        0,
                        0
                    ],
                    "24": [
                        0,
                        2
                    ],
                    "21": [
                        0,
                        3
                    ],
                    "23": [
                        0,
                        5
                    ],
                    "29": [
                        0,
                        9
                    ],
                    "30": [
                        0,
                        11
                    ],
                    "27": [
                        0,
                        12
                    ],
                    "36": [
                        0,
                        15
                    ],
                    "35": [
                        0,
                        18
                    ],
                    "31": [
                        0,
                        19
                    ],
                    "32": [
                        0,
                        21
                    ],
                    "25": [
                        0,
                        22
                    ],
                    "26": [
                        0,
                        23
                    ],
                    "28": [
                        0,
                        24
                    ],
                    "33": [
                        1,
                        {
                            "@": 28
                        }
                    ]
                },
                "53": {
                    "39": [
                        0,
                        61
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "40": [
                        0,
                        26
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "41": [
                        0,
                        20
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "42": [
                        0,
                        69
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "43": [
                        0,
                        74
                    ],
                    "44": [
                        0,
                        72
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "45": [
                        0,
                        60
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "46": [
                        0,
                        10
                    ],
                    "47": [
                        0,
                        6
                    ],
                    "0": [
                        0,
                        8
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "10": [
                        0,
                        38
                    ],
                    "48": [
                        0,
                        41
                    ],
                    "49": [
                        0,
                        43
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "50": [
                        0,
                        55
                    ],
                    "51": [
                        0,
                        68
                    ],
                    "52": [
                        0,
                        67
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "53": [
                        0,
                        76
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "54": [
                        0,
                        62
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "55": [
                        0,
                        71
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "54": {
                    "21": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 80
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 80
                        }
                    ]
                },
                "55": {
                    "21": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 45
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 45
                        }
                    ]
                },
                "56": {
                    "21": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 75
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 75
                        }
                    ]
                },
                "57": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "10": [
                        0,
                        30
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "58": {
                    "21": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 58
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 58
                        }
                    ]
                },
                "59": {
                    "21": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 65
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 65
                        }
                    ]
                },
                "60": {
                    "21": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 35
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 35
                        }
                    ]
                },
                "61": {
                    "21": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 31
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 31
                        }
                    ]
                },
                "62": {
                    "21": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 34
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 34
                        }
                    ]
                },
                "63": {
                    "21": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 52
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 52
                        }
                    ]
                },
                "64": {
                    "21": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 51
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 51
                        }
                    ]
                },
                "65": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "10": [
                        0,
                        29
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "66": {
                    "21": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 54
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 54
                        }
                    ]
                },
                "67": {
                    "21": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 32
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 32
                        }
                    ]
                },
                "68": {
                    "21": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 40
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 40
                        }
                    ]
                },
                "69": {
                    "21": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 42
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 42
                        }
                    ]
                },
                "70": {
                    "39": [
                        0,
                        61
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "40": [
                        0,
                        27
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "41": [
                        0,
                        20
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "42": [
                        0,
                        69
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "43": [
                        0,
                        74
                    ],
                    "44": [
                        0,
                        72
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "45": [
                        0,
                        60
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "46": [
                        0,
                        10
                    ],
                    "47": [
                        0,
                        6
                    ],
                    "0": [
                        0,
                        8
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "10": [
                        0,
                        38
                    ],
                    "48": [
                        0,
                        41
                    ],
                    "49": [
                        0,
                        43
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "50": [
                        0,
                        55
                    ],
                    "51": [
                        0,
                        68
                    ],
                    "52": [
                        0,
                        67
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "53": [
                        0,
                        76
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "54": [
                        0,
                        62
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "55": [
                        0,
                        71
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "71": {
                    "21": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 36
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 36
                        }
                    ]
                },
                "72": {
                    "21": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 41
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 41
                        }
                    ]
                },
                "73": {},
                "74": {
                    "21": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 44
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 44
                        }
                    ]
                },
                "75": {
                    "39": [
                        0,
                        61
                    ],
                    "40": [
                        0,
                        52
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "41": [
                        0,
                        20
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "56": [
                        0,
                        33
                    ],
                    "42": [
                        0,
                        69
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "43": [
                        0,
                        74
                    ],
                    "44": [
                        0,
                        72
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "45": [
                        0,
                        60
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "57": [
                        0,
                        73
                    ],
                    "46": [
                        0,
                        10
                    ],
                    "47": [
                        0,
                        6
                    ],
                    "0": [
                        0,
                        8
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "10": [
                        0,
                        38
                    ],
                    "48": [
                        0,
                        41
                    ],
                    "49": [
                        0,
                        43
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "50": [
                        0,
                        55
                    ],
                    "51": [
                        0,
                        68
                    ],
                    "52": [
                        0,
                        67
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "53": [
                        0,
                        76
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "20": [
                        0,
                        7
                    ],
                    "54": [
                        0,
                        62
                    ],
                    "55": [
                        0,
                        71
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "18": [
                        0,
                        78
                    ]
                },
                "76": {
                    "21": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 39
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 39
                        }
                    ]
                },
                "77": {
                    "21": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "22": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "23": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "24": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "25": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "26": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "27": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "28": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "29": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "30": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "31": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "32": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "33": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "34": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "35": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "36": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "37": [
                        1,
                        {
                            "@": 49
                        }
                    ],
                    "38": [
                        1,
                        {
                            "@": 49
                        }
                    ]
                },
                "78": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "10": [
                        0,
                        35
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                },
                "79": {
                    "0": [
                        0,
                        8
                    ],
                    "1": [
                        0,
                        34
                    ],
                    "2": [
                        0,
                        65
                    ],
                    "3": [
                        0,
                        53
                    ],
                    "4": [
                        0,
                        70
                    ],
                    "10": [
                        0,
                        36
                    ],
                    "5": [
                        0,
                        31
                    ],
                    "6": [
                        0,
                        66
                    ],
                    "7": [
                        0,
                        57
                    ],
                    "8": [
                        0,
                        48
                    ],
                    "9": [
                        0,
                        64
                    ],
                    "11": [
                        0,
                        4
                    ],
                    "12": [
                        0,
                        17
                    ],
                    "13": [
                        0,
                        16
                    ],
                    "14": [
                        0,
                        63
                    ],
                    "15": [
                        0,
                        1
                    ],
                    "16": [
                        0,
                        13
                    ],
                    "17": [
                        0,
                        14
                    ],
                    "18": [
                        0,
                        78
                    ],
                    "19": [
                        0,
                        77
                    ],
                    "20": [
                        0,
                        7
                    ]
                }
            },
            "start_states": {
                "start": 75
            },
            "end_states": {
                "start": 73
            }
        },
        "__type__": "ParsingFrontend"
    },
    "rules": [
        {
            "@": 28
        },
        {
            "@": 29
        },
        {
            "@": 30
        },
        {
            "@": 31
        },
        {
            "@": 32
        },
        {
            "@": 33
        },
        {
            "@": 34
        },
        {
            "@": 35
        },
        {
            "@": 36
        },
        {
            "@": 37
        },
        {
            "@": 38
        },
        {
            "@": 39
        },
        {
            "@": 40
        },
        {
            "@": 41
        },
        {
            "@": 42
        },
        {
            "@": 43
        },
        {
            "@": 44
        },
        {
            "@": 45
        },
        {
            "@": 46
        },
        {
            "@": 47
        },
        {
            "@": 48
        },
        {
            "@": 49
        },
        {
            "@": 50
        },
        {
            "@": 51
        },
        {
            "@": 52
        },
        {
            "@": 53
        },
        {
            "@": 54
        },
        {
            "@": 55
        },
        {
            "@": 56
        },
        {
            "@": 57
        },
        {
            "@": 58
        },
        {
            "@": 59
        },
        {
            "@": 60
        },
        {
            "@": 61
        },
        {
            "@": 62
        },
        {
            "@": 63
        },
        {
            "@": 64
        },
        {
            "@": 65
        },
        {
            "@": 66
        },
        {
            "@": 67
        },
        {
            "@": 68
        },
        {
            "@": 69
        },
        {
            "@": 70
        },
        {
            "@": 71
        },
        {
            "@": 72
        },
        {
            "@": 73
        },
        {
            "@": 74
        },
        {
            "@": 75
        },
        {
            "@": 76
        },
        {
            "@": 77
        },
        {
            "@": 78
        },
        {
            "@": 79
        },
        {
            "@": 80
        },
        {
            "@": 81
        }
    ],
    "options": {
        "debug": false,
        "keep_all_tokens": false,
        "tree_class": null,
        "cache": false,
        "postlex": null,
        "parser": "lalr",
        "lexer": "contextual",
        "transformer": null,
        "start": [
            "start"
        ],
        "priority": "normal",
        "ambiguity": "auto",
        "regex": false,
        "propagate_positions": false,
        "lexer_callbacks": {},
        "maybe_placeholders": false,
        "edit_terminals": null,
        "g_regex_flags": 0,
        "use_bytes": false,
        "import_paths": [],
        "source_path": null,
        "_plugins": {}
    },
    "__type__": "Lark"
};
var MEMO = {
    "0": {
        "name": "WS",
        "pattern": {
            "value": "(?:[ \t\f\r\n])+",
            "flags": [],
            "_width": [
                1,
                18446744073709551616
            ],
            "__type__": "PatternRE"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "1": {
        "name": "VARIABLE",
        "pattern": {
            "value": "[a-z]",
            "flags": [],
            "_width": [
                1,
                1
            ],
            "__type__": "PatternRE"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "2": {
        "name": "VALUE",
        "pattern": {
            "value": "(?:\\\\frac\\{1\\}\\{2\\}|\\\\frac12|0|1)",
            "flags": [],
            "_width": [
                1,
                11
            ],
            "__type__": "PatternRE"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "3": {
        "name": "QMARK",
        "pattern": {
            "value": "?",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "4": {
        "name": "__ANON_0",
        "pattern": {
            "value": "\\overline{",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "5": {
        "name": "RBRACE",
        "pattern": {
            "value": "}",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "6": {
        "name": "BANG",
        "pattern": {
            "value": "!",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "7": {
        "name": "__ANON_1",
        "pattern": {
            "value": "\\lnot",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "8": {
        "name": "__ANON_2",
        "pattern": {
            "value": "\\nabla",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "9": {
        "name": "__ANON_3",
        "pattern": {
            "value": "\\Delta",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "10": {
        "name": "I",
        "pattern": {
            "value": "I",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "11": {
        "name": "__ANON_4",
        "pattern": {
            "value": "\\circ",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "12": {
        "name": "__ANON_5",
        "pattern": {
            "value": "\\left(",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "13": {
        "name": "__ANON_6",
        "pattern": {
            "value": "\\right)",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "14": {
        "name": "__ANON_7",
        "pattern": {
            "value": "\\lor",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "15": {
        "name": "__ANON_8",
        "pattern": {
            "value": "\\underset{+}{\\lor}",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "16": {
        "name": "__ANON_9",
        "pattern": {
            "value": "\\downarrow",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "17": {
        "name": "__ANON_10",
        "pattern": {
            "value": "\\oplus",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "18": {
        "name": "__ANON_11",
        "pattern": {
            "value": "\\land",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "19": {
        "name": "__ANON_12",
        "pattern": {
            "value": "\\otimes",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "20": {
        "name": "__ANON_13",
        "pattern": {
            "value": "\\xrightarrow[G]{}",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "21": {
        "name": "__ANON_14",
        "pattern": {
            "value": "\\xrightarrow[L]{}",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "22": {
        "name": "__ANON_15",
        "pattern": {
            "value": "\\xrightarrow[J]{}",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "23": {
        "name": "__ANON_16",
        "pattern": {
            "value": "\\xrightarrow[K]{}",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "24": {
        "name": "__ANON_17",
        "pattern": {
            "value": "\\xleftrightarrow[G]{}",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "25": {
        "name": "__ANON_18",
        "pattern": {
            "value": "\\xleftrightarrow[L]{}",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "26": {
        "name": "__ANON_19",
        "pattern": {
            "value": "\\xleftrightarrow[J]{}",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "27": {
        "name": "__ANON_20",
        "pattern": {
            "value": "\\xleftrightarrow[K]{}",
            "flags": [],
            "__type__": "PatternStr"
        },
        "priority": 0,
        "__type__": "TerminalDef"
    },
    "28": {
        "origin": {
            "name": "start",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "29": {
        "origin": {
            "name": "start",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "query",
                "__type__": "NonTerminal"
            }
        ],
        "order": 1,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "30": {
        "origin": {
            "name": "query",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "QMARK",
                "filter_out": true,
                "__type__": "Terminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "31": {
        "origin": {
            "name": "expression",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "operation",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "32": {
        "origin": {
            "name": "operation",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "binary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "33": {
        "origin": {
            "name": "operation",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 1,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "34": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "weak_disjunction",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "35": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "bochvar_disjunction",
                "__type__": "NonTerminal"
            }
        ],
        "order": 1,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "36": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "quine_dagger",
                "__type__": "NonTerminal"
            }
        ],
        "order": 2,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "37": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "strong_disjunction",
                "__type__": "NonTerminal"
            }
        ],
        "order": 3,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "38": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "weak_conjunction",
                "__type__": "NonTerminal"
            }
        ],
        "order": 4,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "39": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "l_strong_conjunction",
                "__type__": "NonTerminal"
            }
        ],
        "order": 5,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "40": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "g_implication",
                "__type__": "NonTerminal"
            }
        ],
        "order": 6,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "41": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "l_implication",
                "__type__": "NonTerminal"
            }
        ],
        "order": 7,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "42": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "j_implication",
                "__type__": "NonTerminal"
            }
        ],
        "order": 8,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "43": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "k_implication",
                "__type__": "NonTerminal"
            }
        ],
        "order": 9,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "44": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "g_bi_implication",
                "__type__": "NonTerminal"
            }
        ],
        "order": 10,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "45": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "l_bi_implication",
                "__type__": "NonTerminal"
            }
        ],
        "order": 11,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "46": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "j_bi_implication",
                "__type__": "NonTerminal"
            }
        ],
        "order": 12,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "47": {
        "origin": {
            "name": "binary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "k_bi_implication",
                "__type__": "NonTerminal"
            }
        ],
        "order": 13,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "48": {
        "origin": {
            "name": "unary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "weak_negation",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "49": {
        "origin": {
            "name": "unary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "post_negation",
                "__type__": "NonTerminal"
            }
        ],
        "order": 1,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "50": {
        "origin": {
            "name": "unary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "strong_negation",
                "__type__": "NonTerminal"
            }
        ],
        "order": 2,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "51": {
        "origin": {
            "name": "unary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "mosil_nabla",
                "__type__": "NonTerminal"
            }
        ],
        "order": 3,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "52": {
        "origin": {
            "name": "unary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "baaz_delta",
                "__type__": "NonTerminal"
            }
        ],
        "order": 4,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "53": {
        "origin": {
            "name": "unary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "doubtful_operator",
                "__type__": "NonTerminal"
            }
        ],
        "order": 5,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "54": {
        "origin": {
            "name": "unary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "consistency",
                "__type__": "NonTerminal"
            }
        ],
        "order": 6,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "55": {
        "origin": {
            "name": "unary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "parentheses",
                "__type__": "NonTerminal"
            }
        ],
        "order": 7,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "56": {
        "origin": {
            "name": "unary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "variable",
                "__type__": "NonTerminal"
            }
        ],
        "order": 8,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "57": {
        "origin": {
            "name": "unary",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "value",
                "__type__": "NonTerminal"
            }
        ],
        "order": 9,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "58": {
        "origin": {
            "name": "weak_negation",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "__ANON_0",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "RBRACE",
                "filter_out": true,
                "__type__": "Terminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "59": {
        "origin": {
            "name": "post_negation",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "BANG",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "expression",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "60": {
        "origin": {
            "name": "strong_negation",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "__ANON_1",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "61": {
        "origin": {
            "name": "mosil_nabla",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "__ANON_2",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "62": {
        "origin": {
            "name": "baaz_delta",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "__ANON_3",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "63": {
        "origin": {
            "name": "doubtful_operator",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "I",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "64": {
        "origin": {
            "name": "consistency",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "__ANON_4",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "65": {
        "origin": {
            "name": "parentheses",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "__ANON_5",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_6",
                "filter_out": true,
                "__type__": "Terminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": true,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "66": {
        "origin": {
            "name": "variable",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "VARIABLE",
                "filter_out": false,
                "__type__": "Terminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "67": {
        "origin": {
            "name": "value",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "VALUE",
                "filter_out": false,
                "__type__": "Terminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "68": {
        "origin": {
            "name": "weak_disjunction",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_7",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "69": {
        "origin": {
            "name": "bochvar_disjunction",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_8",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "70": {
        "origin": {
            "name": "quine_dagger",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_9",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "71": {
        "origin": {
            "name": "strong_disjunction",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_10",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "72": {
        "origin": {
            "name": "weak_conjunction",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_11",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "73": {
        "origin": {
            "name": "l_strong_conjunction",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_12",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "74": {
        "origin": {
            "name": "g_implication",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_13",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "75": {
        "origin": {
            "name": "l_implication",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_14",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "76": {
        "origin": {
            "name": "j_implication",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_15",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "77": {
        "origin": {
            "name": "k_implication",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_16",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "78": {
        "origin": {
            "name": "g_bi_implication",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_17",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "79": {
        "origin": {
            "name": "l_bi_implication",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_18",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "80": {
        "origin": {
            "name": "j_bi_implication",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_19",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    },
    "81": {
        "origin": {
            "name": "k_bi_implication",
            "__type__": "NonTerminal"
        },
        "expansion": [
            {
                "name": "expression",
                "__type__": "NonTerminal"
            },
            {
                "name": "__ANON_20",
                "filter_out": true,
                "__type__": "Terminal"
            },
            {
                "name": "unary",
                "__type__": "NonTerminal"
            }
        ],
        "order": 0,
        "alias": null,
        "options": {
            "keep_all_tokens": false,
            "expand1": false,
            "priority": null,
            "template_source": null,
            "empty_indices": [],
            "__type__": "RuleOptions"
        },
        "__type__": "Rule"
    }
};
export { get_parser, Token, Transformer, Tree, UnexpectedCharacters, UnexpectedToken };
