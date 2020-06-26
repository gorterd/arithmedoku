import GroupInfoRender from "../render_components/GroupInfoRender";
import Info from "./Info";

export default class GroupInfo extends Info {
  constructor(puzzle, root) {
    super(puzzle);
    this.renderer = new GroupInfoRender(root, this);
  }

}