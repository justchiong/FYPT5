/**
 * @name Cross-site scripting from vulnerable AngularJS functions
 * @description Creating a database query to look for vulnerable points in the database
 *  based on the functions used
 * @kind path-problem
 * @problem.severity error
 * @precision high
 * @id js/xss-angular
 * @tags security
 */

import javascript

class XSSTracker extends TaintTracking::Configuration {
  XSSTracker() { this = "XSSTracker" }

  override predicate isSource(DataFlow::Node BypassNode) {
    exists(CallExpr funcBypassCall |
      BypassNode.asExpr() instanceof CallExpr and
      funcBypassCall.getCalleeName() = "bypassSecurityTrustHtml" and
      BypassNode.asExpr() = funcBypassCall
    )
  }

  override predicate isSink(DataFlow::Node BypassNode) {
    exists(CallExpr funcBypassCall |
      funcBypassCall.getCalleeName() = "bypassSecurityTrustHtml" and
      BypassNode.asExpr() = funcBypassCall.getArgument(0)
    )
  }
}

from XSSTracker XSSvuln, DataFlow::Node source, DataFlow::Node sink
where XSSvuln.hasFlow(source, sink)
select source, sink,
  "calling this method with untrusted user data exposes your application to XSS security risks!"
