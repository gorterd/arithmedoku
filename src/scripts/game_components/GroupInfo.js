import GroupInfoRender from "../render_components/group_info_render";

export default class GroupInfo {
  constructor(puzzle, root) {
    this.puzzle = puzzle;
    this.renderer = new GroupInfoRender(root, this);
  }

  render() {
    this.renderer.render();
  }

}