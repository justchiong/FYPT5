/**
 * @name extract conditions
 * @description finding conditional statements in js
 * @kind problem
 * @problem.severity error
 * @precision high
 * @id js/extract_cond
 * @tags 
 */

import javascript
import semmle.javascript.Stmt

from IfStmt i
where i.getElse().(BlockStmt).getNumStmt() >= 1
select i, "This contains conditional statements"