/**
 * @name extract exec
 * @description finding areas where exec() is called
 * @kind problem
 * @problem.severity error
 * @precision high
 * @id js/extract_exec
 * @tags 
 */

import javascript

from CallExpr c
where c.getCalleeName() = "exec"
select c, "This contains exec()"