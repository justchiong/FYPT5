/**
 * @name extract all functions
 * @description findings areas where functions are called
 * @kind problem
 * @problem.severity error
 * @precision high
 * @id js/extract_AllFuncs
 * @tags 
 */

import javascript

from Function declareFn
select declareFn, "this is a function"