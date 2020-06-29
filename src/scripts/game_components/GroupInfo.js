import Info from "./Info";

export default class GroupInfo extends Info {
  constructor(puzzle) {
    super(puzzle, puzzle.renderers.groupInfo);
  }

}