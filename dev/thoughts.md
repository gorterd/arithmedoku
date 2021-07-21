1. The structure of a recursive problem

We've discussed how a recursive approach to a problem involves dividing the problem into one or more simpler versions of the same problem, and then using the solution to those subproblems to compute the solution to the whole problem. 

For example, to sum up an array, you could first solve a similar, but simpler, subproblem: find the sum of the subarray containing all but the last element. Add that subsum to the last element, and you get the sum of the whole array.

The brilliance of recursion, is that you solve the subproblem the same way you solve the whole problem: to sum up this subarray, step 1 of solving our original problem, we find the sum of the subarray containing all but *its* last element, then add it to its last element. 

We keep repeating this process until we eventually 'bottom' out. 

In fact, every recursive problem must bottom out somewhere. Otherwise you'll just keep on making recursive calls forever. We call the case where a recursive problem bottoms out, its base case. 

In the case or recursively summing an array, it was easiest to find the base case by first figuring out the recursive step: sum up the subarray containing all but the last element, then add that to the last element, and think about at one point we can't keep going: at what point we can't divide an array into a smaller subarray. This is one valid approach to finding a base case: I like to call it a top-down: we start at a complex case, and work back to the simplest.

Sometimes, though, it's easiest to first identify the simplest case, and from there, think about how you can build on that foundation to solve more complex problems. 

For example, if we're trying to figure out how many subsets there are of an array.

Well, 

The base case of a recursive algorithm bottoms out -- it's where you can't 