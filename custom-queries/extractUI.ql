/**
 * @name extract user input
 * @description finding areas where user inputs are taken
 * @kind problem
 * @problem.severity error
 * @precision high
 * @id js/extract_UI
 * @tags 
 */

import javascript

from CallExpr c
where c.getCalleeName() = "eval"
select c, "This contains eval()"