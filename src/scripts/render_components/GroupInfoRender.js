import InfoRender from "./InfoRender";

export default class GroupInfoRender extends InfoRender {

  constructor(puzzle) {
    super(puzzle, puzzle.divs.groupInfoDiv);
  }

}

// -> click number key
// -> find focused square (this.puzzle) ???
// -> find corresponding DOM element (DOMUtil)
// -> change value (imperative) ???
// -> check if option to check conflicts is active (this.opts)
// IF CHECK CONFLICT OPTION: 
//   -> check for conflicts with this.qpuzzle.checkConflicts (this.puzzle)
//   IF CONFLICT: 
//     -> erase in 600 ms with animation (DOMUtil)
//     -> EXIT
// -> check if option to auto eliminate options is on (this.opts)
// IF AUTOELIMINATE OPTION:
//    -> game logic (this.puzzle)
//    -> dom logic (DOMUtil)
// -> set val (this.puzzle)

// refactor ->
//   -> each square has its own keydown listener
//   -> status (error?), focus, value, (updating status is async -> rxjs?)
//   -> dispatches an action to try to place the value
//   -> subcribed to change in status, focus, or value, after which it calls dom manipulation methods

//   -> each square 