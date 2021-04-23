# Current Goals

  ## Cur Todo
  - purple outline to cage in game
  - reset button; that's all for filter
  - upper left badge: square / cage
  - header: combinations, filter
  - keyboard shortcut to switch between tabs with arrows
  - very slight opacity to not-allowed numbers
  - if possible, select only combinations (when you hit enter, start new combination, esc ends without change, button locks it in)
  - fix menus etc

  ## Info
  - finish info box styling 
  - filter / rules reset
  - make square possibilities and collection possibilities more consistent
  - make naming more consistent: 
    * focused vs cur, 
    * rule vs filter, 
    * num vs val, 
    * combo vs combo, 
    * value vs possibility,
  - test square select value by default, eliminate with ctrl down
  - alter behavior of 'or' so that it doesn't immediately take effect
  - search combos
  - set combos
  - button for cage-specific elim math impossibilities

  ## Implications
  - create
    * trigger if & then with keyboard and/or buttons
  - see and use
    * show active implications
    * show inactive implications
    * show fulfilled implications
    * activate fulfilled implications

# Future Goals

  ## Mechanics
  - when erasing a square, go back to point in game where you added it
  - note pad
  - label cages / squares with a chess like notation, for logging when creating an implication

  ## Info
  - collection info
    * swipe between collections
    * show little diagram of collection
  - combos
    * search / filter
    * show number of direct and indirect implications from choosing that combo
    * starring combos
    * eliminate unstarred combos
  - rules 
    * multiple include ones
  - permutations
    * selecting a combo allows you to toggle through the permutations, which show up to the right
    * show up on the screen greyed out
    * can eliminate / select permutations
    * permutations then used to filter square possiblities

  ## Implications
  - creating implication adds further possiblity filters
  - switching back and forth between possiblity branches


# Implications: if then
  ## How it works
  - Press `i` (if) to enter `if` mode
    * when in `if` mode, every move made is yellow
  - Press `t` (then) or `spacebar` to enter `then` mode
    * yellow remains on the screen
    * every subsequent move is green
  - Press `d` (done) or `spacebar` to lock in the implication
  - Press `esc` to cancel implication
  - Press `p` to play out the `then`
    * all `if` moves turn from yellow to standard coloring
    * it's like you're playing a normal game
  - Stretch: by creating an implication, rules are automatically applied to groups / squares
  - Shortcut: one-move `if`; jump straight to `then`
    * hold down `i` while making move?
    * hold `control` while making move?


  ## Implementation
  1. Keep track of implications
    - `if` / premise
      * option A: a series of diffs / actions / patches
        + when 'changing mind', the previous move should be added to premise. e.g. removing / changing value in a square, removing a filter; anything that expands rather than narrows possibilities
      * option B: a game state that can be diffed against
        + if current game state is a logical subset of premise game state, then the premise is fulfilled
        + logical subset: each current square possibility set is subset of premise square possiblity set
    - `then` / conclusion
      * a series of diffs / actions / patches
      * ban 'changes of mind' in implications
  2. Active / relevant implications
    - `if` and `then` game states must be consistent with current game state
    - consistent: each current/implication square possibility set has some overlap

# MST Structure: Brain Dump

ui: {
  active: {
    puzzle ?, square, group, set, permutation
  }
  filters: {
    all:
    some:
    none: 
  },
  -> mode: from type of active puzzle
}

a consideration could be a derived diff

a puzzle:
squares
value
answer
ui_status: none, mistake, reason_for_conflict
pos[row, col]
user yes
user no
  -> group yes and group no
    -> dom element
cages
group: ref,
  result
operation
  ->
  groups
squares: array of refs to squares
user yes
user no
user one of: [[], []]
set_eliminations
permutation_eliminations
set_stars
permutation_stars
math_possibilies_eliminated ? bool
  -> sets
  -> mathematical possibilities
    -> implication eliminations
      -> if an implication is constrained to just this group

active puzzle
consideration puzzles with diff algorithms comparing to active

a consideration is still possible if there are no contradictions:
current square possiblities don't overlap with conserations
group possibilities don't overlap
a consideration is activated when:
current square possiblities subset of consideration's
group possibilities subset of considerations

active:
mode: ['primary', null], ['consider', int], ['implication', int]

# Implication: Brain Dump
- from main, need to go back
  -- back: rehydrate most recent snapshot in history
- from main, need to compare with implications
  * each implication is a tuple of two snapshot ids, an if and a then
  * compare: rehydrate an implication to compare
- from main, need to start implication
  * 
- from `if` or `then`, go back to main
  * rehydrate main snapshot
- from `if`, compare with main
  * stage main for comparison
- from `then`, compare with `if`
  * stage `if` for comparison

implications: [
  (if snapshot, then snapshot)
],
curMain: snapshot,
curIf: snapshot,
staged: an orphan mobx puzzle store that is rehydrated for comparison
