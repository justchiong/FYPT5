/**
 * INTERNAL use only. This is an experimental API subject to change without notice.
 *
 * Provides classes and predicates for dealing with flow models specified in CSV format.
 *
 * The CSV specification has the following columns:
 * - Sources:
 *   `namespace; type; subtypes; name; signature; ext; output; kind`
 * - Sinks:
 *   `namespace; type; subtypes; name; signature; ext; input; kind`
 * - Summaries:
 *   `namespace; type; subtypes; name; signature; ext; input; output; kind`
 *
 * The interpretation of a row is similar to API-graphs with a left-to-right
 * reading.
 * 1. The `namespace` column selects a package.
 * 2. The `type` column selects a type within that package.
 * 3. The `subtypes` is a boolean that indicates whether to jump to an
 *    arbitrary subtype of that type.
 * 4. The `name` column optionally selects a specific named member of the type.
 * 5. The `signature` column optionally restricts the named member. If
 *    `signature` is blank then no such filtering is done. The format of the
 *    signature is a comma-separated list of types enclosed in parentheses. The
 *    types can be short names or fully qualified names (mixing these two options
 *    is not allowed within a single signature).
 * 6. The `ext` column specifies additional API-graph-like edges. Currently
 *    there are only two valid values: "" and "Annotated". The empty string has no
 *    effect. "Annotated" applies if `name` and `signature` were left blank and
 *    acts by selecting an element that is annotated by the annotation type
 *    selected by the first 4 columns. This can be another member such as a field
 *    or method, or a parameter.
 * 7. The `input` column specifies how data enters the element selected by the
 *    first 6 columns, and the `output` column specifies how data leaves the
 *    element selected by the first 6 columns. An `input` can be either "",
 *    "Argument", "Argument[n]", "ReturnValue":
 *    - "": Selects a write to the selected element in case this is a field.
 *    - "Argument": Selects any argument in a call to the selected element.
 *    - "Argument[n]": Similar to "Argument" but restricted to a specific numbered
 *      argument (zero-indexed, and `-1` specifies the qualifier).
 *    - "ReturnValue": Selects a value being returned by the selected element.
 *      This requires that the selected element is a method with a body.
 *
 *    An `output` can be either "", "Argument", "Argument[n]", "Parameter",
 *    "Parameter[n]", or "ReturnValue":
 *    - "": Selects a read of a selected field, or a selected parameter.
 *    - "Argument": Selects the post-update value of an argument in a call to the
 *      selected element. That is, the value of the argument after the call returns.
 *    - "Argument[n]": Similar to "Argument" but restricted to a specific numbered
 *      argument (zero-indexed, and `-1` specifies the qualifier).
 *    - "Parameter": Selects the value of a parameter of the selected element.
 *      "Parameter" is also allowed in case the selected element is already a
 *      parameter itself.
 *    - "Parameter[n]": Similar to "Parameter" but restricted to a specific
 *      numbered parameter (zero-indexed, and `-1` specifies the value of `this`).
 *    - "ReturnValue": Selects the return value of a call to the selected element.
 * 8. The `kind` column is a tag that can be referenced from QL to determine to
 *    which classes the interpreted elements should be added. For example, for
 *    sources "remote" indicates a default remote flow source, and for summaries
 *    "taint" indicates a default additional taint step and "value" indicates a
 *    globally applicable value-preserving step.
 */

import java
private import semmle.code.java.dataflow.DataFlow::DataFlow
private import internal.DataFlowPrivate

private predicate sourceModelCsv(string row) {
  row =
    [
      // ServletRequestGetParameterMethod
      "javax.servlet;ServletRequest;false;getParameter;(String);;ReturnValue;remote",
      "javax.servlet;ServletRequest;false;getParameterValues;(String);;ReturnValue;remote",
      "javax.servlet.http;HttpServletRequest;false;getParameter;(String);;ReturnValue;remote",
      "javax.servlet.http;HttpServletRequest;false;getParameterValues;(String);;ReturnValue;remote",
      // ServletRequestGetParameterMapMethod
      "javax.servlet;ServletRequest;false;getParameterMap;();;ReturnValue;remote",
      "javax.servlet.http;HttpServletRequest;false;getParameterMap;();;ReturnValue;remote",
      // ServletRequestGetParameterNamesMethod
      "javax.servlet;ServletRequest;false;getParameterNames;();;ReturnValue;remote",
      "javax.servlet.http;HttpServletRequest;false;getParameterNames;();;ReturnValue;remote",
      // HttpServletRequestGetQueryStringMethod
      "javax.servlet.http;HttpServletRequest;false;getQueryString;();;ReturnValue;remote",
      //
      // URLConnectionGetInputStreamMethod
      "java.net;URLConnection;false;getInputStream;();;ReturnValue;remote",
      // SocketGetInputStreamMethod
      "java.net;Socket;false;getInputStream;();;ReturnValue;remote",
      // BeanValidationSource
      "javax.validation;ConstraintValidator;true;isValid;;;Parameter[0];remote"
    ]
}

private predicate sinkModelCsv(string row) { none() }

private predicate summaryModelCsv(string row) { none() }

/**
 * A unit class for adding additional source model rows.
 *
 * Extend this class to add additional source definitions.
 */
class SourceModelCsv extends Unit {
  /** Holds if `row` specifies a source definition. */
  abstract predicate row(string row);
}

/**
 * A unit class for adding additional sink model rows.
 *
 * Extend this class to add additional sink definitions.
 */
class SinkModelCsv extends Unit {
  /** Holds if `row` specifies a sink definition. */
  abstract predicate row(string row);
}

/**
 * A unit class for adding additional summary model rows.
 *
 * Extend this class to add additional flow summary definitions.
 */
class SummaryModelCsv extends Unit {
  /** Holds if `row` specifies a summary definition. */
  abstract predicate row(string row);
}

private predicate sourceModel(string row) {
  sourceModelCsv(row) or
  any(SourceModelCsv s).row(row)
}

private predicate sinkModel(string row) {
  sinkModelCsv(row) or
  any(SinkModelCsv s).row(row)
}

private predicate summaryModel(string row) {
  summaryModelCsv(row) or
  any(SummaryModelCsv s).row(row)
}

private predicate sourceModel(
  string namespace, string type, boolean subtypes, string name, string signature, string ext,
  string output, string kind
) {
  exists(string row |
    sourceModel(row) and
    row.splitAt(";", 0) = namespace and
    row.splitAt(";", 1) = type and
    row.splitAt(";", 2) = subtypes.toString() and
    subtypes = [true, false] and
    row.splitAt(";", 3) = name and
    row.splitAt(";", 4) = signature and
    row.splitAt(";", 5) = ext and
    row.splitAt(";", 6) = output and
    row.splitAt(";", 7) = kind
  )
}

private predicate sinkModel(
  string namespace, string type, boolean subtypes, string name, string signature, string ext,
  string input, string kind
) {
  exists(string row |
    sinkModel(row) and
    row.splitAt(";", 0) = namespace and
    row.splitAt(";", 1) = type and
    row.splitAt(";", 2) = subtypes.toString() and
    subtypes = [true, false] and
    row.splitAt(";", 3) = name and
    row.splitAt(";", 4) = signature and
    row.splitAt(";", 5) = ext and
    row.splitAt(";", 6) = input and
    row.splitAt(";", 7) = kind
  )
}

private predicate summaryModel(
  string namespace, string type, boolean subtypes, string name, string signature, string ext,
  string input, string output, string kind
) {
  exists(string row |
    summaryModel(row) and
    row.splitAt(";", 0) = namespace and
    row.splitAt(";", 1) = type and
    row.splitAt(";", 2) = subtypes.toString() and
    subtypes = [true, false] and
    row.splitAt(";", 3) = name and
    row.splitAt(";", 4) = signature and
    row.splitAt(";", 5) = ext and
    row.splitAt(";", 6) = input and
    row.splitAt(";", 7) = output and
    row.splitAt(";", 8) = kind
  )
}

/** Provides a query predicate to check the CSV data for validation errors. */
module CsvValidation {
  /** Holds if some row in a CSV-based flow model appears to contain typos. */
  query predicate invalidModelRow(string msg) {
    exists(string pred, string namespace, string type, string name, string signature, string ext |
      sourceModel(namespace, type, _, name, signature, ext, _, _) and pred = "source"
      or
      sinkModel(namespace, type, _, name, signature, ext, _, _) and pred = "sink"
      or
      summaryModel(namespace, type, _, name, signature, ext, _, _, _) and pred = "summary"
    |
      not namespace.regexpMatch("[a-zA-Z0-9_\\.]+") and
      msg = "Dubious namespace \"" + namespace + "\" in " + pred + " model."
      or
      not type.regexpMatch("[a-zA-Z0-9_\\$]+") and
      msg = "Dubious type \"" + type + "\" in " + pred + " model."
      or
      not name.regexpMatch("[a-zA-Z0-9_]*") and
      msg = "Dubious name \"" + name + "\" in " + pred + " model."
      or
      not signature.regexpMatch("|\\([a-zA-Z0-9_\\.\\$<>,]*\\)") and
      msg = "Dubious signature \"" + signature + "\" in " + pred + " model."
      or
      not ext.regexpMatch("|Annotated") and
      msg = "Unrecognized extra API graph element \"" + ext + "\" in " + pred + " model."
    )
    or
    exists(string pred, string input, string part |
      sinkModel(_, _, _, _, _, _, input, _) and pred = "sink"
      or
      summaryModel(_, _, _, _, _, _, input, _, _) and pred = "summary"
    |
      specSplit(input, part, _) and
      not part.regexpMatch("|Argument|ReturnValue") and
      not parseArg(part, _) and
      msg = "Unrecognized input specification \"" + part + "\" in " + pred + " model."
    )
    or
    exists(string pred, string output, string part |
      sourceModel(_, _, _, _, _, _, output, _) and pred = "source"
      or
      summaryModel(_, _, _, _, _, _, _, output, _) and pred = "summary"
    |
      specSplit(output, part, _) and
      not part.regexpMatch("|Argument|Parameter|ReturnValue") and
      not parseArg(part, _) and
      not parseParam(part, _) and
      msg = "Unrecognized output specification \"" + part + "\" in " + pred + " model."
    )
    or
    exists(string pred, string row, int expect |
      sourceModel(row) and expect = 8 and pred = "source"
      or
      sinkModel(row) and expect = 8 and pred = "sink"
      or
      summaryModel(row) and expect = 9 and pred = "summary"
    |
      exists(int cols |
        cols = 1 + max(int n | exists(row.splitAt(";", n))) and
        cols != expect and
        msg =
          "Wrong number of columns in " + pred + " model row, expected " + expect + ", got " + cols +
            "."
      )
      or
      exists(string b |
        b = row.splitAt(";", 2) and
        not b = ["true", "false"] and
        msg = "Invalid boolean \"" + b + "\" in " + pred + " model."
      )
    )
  }
}

private predicate elementSpec(
  string namespace, string type, boolean subtypes, string name, string signature, string ext
) {
  sourceModel(namespace, type, subtypes, name, signature, ext, _, _) or
  sinkModel(namespace, type, subtypes, name, signature, ext, _, _) or
  summaryModel(namespace, type, subtypes, name, signature, ext, _, _, _)
}

bindingset[namespace, type, subtypes]
private RefType interpretType(string namespace, string type, boolean subtypes) {
  exists(RefType t |
    t.hasQualifiedName(namespace, type) and
    if subtypes = true then result.getASourceSupertype*() = t else result = t
  )
}

private string paramsStringPart(Callable c, int i) {
  i = -1 and result = "("
  or
  exists(int n, string p | c.getParameterType(n).toString() = p |
    i = 2 * n and result = p
    or
    i = 2 * n - 1 and result = "," and n != 0
  )
  or
  i = 2 * c.getNumberOfParameters() and result = ")"
}

private string paramsString(Callable c) {
  result = concat(int i | | paramsStringPart(c, i) order by i)
}

private Element interpretElement0(
  string namespace, string type, boolean subtypes, string name, string signature
) {
  elementSpec(namespace, type, subtypes, name, signature, _) and
  exists(RefType t | t = interpretType(namespace, type, subtypes) |
    exists(Member m |
      result = m and
      m.getDeclaringType() = t and
      m.hasName(name)
    |
      signature = "" or
      m.(Callable).getSignature() = any(string nameprefix) + signature or
      paramsString(m) = signature
    )
    or
    result = t and
    name = "" and
    signature = ""
  )
}

private Element interpretElement(
  string namespace, string type, boolean subtypes, string name, string signature, string ext
) {
  elementSpec(namespace, type, subtypes, name, signature, ext) and
  exists(Element e | e = interpretElement0(namespace, type, subtypes, name, signature) |
    ext = "" and result = e
    or
    ext = "Annotated" and result.(Annotatable).getAnAnnotation().getType() = e
  )
}

private predicate sourceElement(Element e, string output, string kind) {
  exists(
    string namespace, string type, boolean subtypes, string name, string signature, string ext
  |
    sourceModel(namespace, type, subtypes, name, signature, ext, output, kind) and
    e = interpretElement(namespace, type, subtypes, name, signature, ext)
  )
}

private predicate sinkElement(Element e, string input, string kind) {
  exists(
    string namespace, string type, boolean subtypes, string name, string signature, string ext
  |
    sinkModel(namespace, type, subtypes, name, signature, ext, input, kind) and
    e = interpretElement(namespace, type, subtypes, name, signature, ext)
  )
}

private predicate summaryElement(Element e, string input, string output, string kind) {
  exists(
    string namespace, string type, boolean subtypes, string name, string signature, string ext
  |
    summaryModel(namespace, type, subtypes, name, signature, ext, input, output, kind) and
    e = interpretElement(namespace, type, subtypes, name, signature, ext)
  )
}

private string inOutSpec() {
  sourceModel(_, _, _, _, _, _, result, _) or
  sinkModel(_, _, _, _, _, _, result, _) or
  summaryModel(_, _, _, _, _, _, result, _, _) or
  summaryModel(_, _, _, _, _, _, _, result, _)
}

private predicate specSplit(string s, string c, int n) {
  inOutSpec() = s and s.splitAt(" of ", n) = c
}

private predicate len(string s, int len) { len = 1 + max(int n | specSplit(s, _, n)) }

private string getLast(string s) {
  exists(int len |
    len(s, len) and
    specSplit(s, result, len - 1)
  )
}

private predicate parseParam(string c, int n) {
  specSplit(_, c, _) and c.regexpCapture("Parameter\\[([-0-9]+)\\]", 1).toInt() = n
}

private predicate parseArg(string c, int n) {
  specSplit(_, c, _) and c.regexpCapture("Argument\\[([-0-9]+)\\]", 1).toInt() = n
}

private predicate inputNeedsReference(string c) {
  c = "Argument" or
  parseArg(c, _)
}

private predicate outputNeedsReference(string c) {
  c = "Argument" or
  parseArg(c, _) or
  c = "ReturnValue"
}

private predicate sourceElementRef(Top ref, string output, string kind) {
  exists(Element e |
    sourceElement(e, output, kind) and
    if outputNeedsReference(getLast(output)) then ref.(Call).getCallee() = e else ref = e
  )
}

private predicate sinkElementRef(Top ref, string input, string kind) {
  exists(Element e |
    sinkElement(e, input, kind) and
    if inputNeedsReference(getLast(input)) then ref.(Call).getCallee() = e else ref = e
  )
}

private predicate summaryElementRef(Top ref, string input, string output, string kind) {
  exists(Element e |
    summaryElement(e, input, output, kind) and
    if inputNeedsReference(getLast(input)) then ref.(Call).getCallee() = e else ref = e
  )
}

private newtype TAstOrNode =
  TAst(Top t) or
  TNode(Node n)

private predicate interpretOutput(string output, int idx, Top ref, TAstOrNode node) {
  (
    sourceElementRef(ref, output, _) or
    summaryElementRef(ref, _, output, _)
  ) and
  len(output, idx) and
  node = TAst(ref)
  or
  exists(Top mid, string c, Node n |
    interpretOutput(output, idx + 1, ref, TAst(mid)) and
    specSplit(output, c, idx) and
    node = TNode(n)
  |
    exists(int pos | n.(PostUpdateNode).getPreUpdateNode().(ArgumentNode).argumentOf(mid, pos) |
      c = "Argument" or parseArg(c, pos)
    )
    or
    exists(int pos | n.(ParameterNode).isParameterOf(mid, pos) |
      c = "Parameter" or parseParam(c, pos)
    )
    or
    (c = "Parameter" or c = "") and
    n.asParameter() = mid
    or
    c = "ReturnValue" and
    n.asExpr().(Call) = mid
    or
    c = "" and
    n.asExpr().(FieldRead).getField() = mid
  )
}

private predicate interpretInput(string input, int idx, Top ref, TAstOrNode node) {
  (
    sinkElementRef(ref, input, _) or
    summaryElementRef(ref, input, _, _)
  ) and
  len(input, idx) and
  node = TAst(ref)
  or
  exists(Top mid, string c, Node n |
    interpretInput(input, idx + 1, ref, TAst(mid)) and
    specSplit(input, c, idx) and
    node = TNode(n)
  |
    exists(int pos | n.(ArgumentNode).argumentOf(mid, pos) | c = "Argument" or parseArg(c, pos))
    or
    exists(ReturnStmt ret |
      c = "ReturnValue" and
      n.asExpr() = ret.getResult() and
      mid = ret.getEnclosingCallable()
    )
    or
    exists(FieldWrite fw |
      c = "" and
      fw.getField() = mid and
      n.asExpr() = fw.getRHS()
    )
  )
}

/**
 * Holds if `node` is specified as a source with the given kind in a CSV flow
 * model.
 */
predicate sourceNode(Node node, string kind) {
  exists(Top ref, string output |
    sourceElementRef(ref, output, kind) and
    interpretOutput(output, 0, ref, TNode(node))
  )
}

/**
 * Holds if `node` is specified as a sink with the given kind in a CSV flow
 * model.
 */
predicate sinkNode(Node node, string kind) {
  exists(Top ref, string input |
    sinkElementRef(ref, input, kind) and
    interpretInput(input, 0, ref, TNode(node))
  )
}

/**
 * Holds if `node1` to `node2` is specified as a flow step with the given kind
 * in a CSV flow model.
 */
predicate summaryStep(Node node1, Node node2, string kind) {
  exists(Top ref, string input, string output |
    summaryElementRef(ref, input, output, kind) and
    interpretInput(input, 0, ref, TNode(node1)) and
    interpretOutput(output, 0, ref, TNode(node2))
  )
}
