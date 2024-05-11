import ChartMainHelper from "../helpers/chart-helper.js";
class VerticalSpiderWalkTree {
    content_wrapper = null;
    head_child_wrapper_center = null;
    head_child_wrapper_1 = null;
    head_child_wrapper_2 = null;
    hcInnerContainer = null;
    chartHelper;
    tree_data = [];
    tree_map_arr = [];
    hc_d3 = window.d3;
    current_scale = 1;
    constructor({ tree_data, hcInnerContainer }) {
        this.hcInnerContainer = hcInnerContainer;
        this.tree_data = tree_data;
        this.chartHelper = new ChartMainHelper();
        this.chartHelper.tree_data = tree_data;
        this.chartHelper.handleCollapseChildren = this.handleCollapseChildren.bind(this);
        setTimeout(() => {
            this.organizeUI();
        }, 0);
    }
    organizeUI() {
        this.content_wrapper = this.chartHelper.createDynamicEl();
        this.head_child_wrapper_center = this.chartHelper.createDynamicEl();
        this.head_child_wrapper_1 = this.chartHelper.createDynamicEl();
        this.head_child_wrapper_2 = this.chartHelper.createDynamicEl();
        this.head_child_wrapper_center.className = "hc-vs-wrapper";
        this.head_child_wrapper_1.className = "hc-vs-wrapper";
        this.head_child_wrapper_2.className = "hc-vs-wrapper";
        this.content_wrapper.appendChild(this.head_child_wrapper_1);
        this.content_wrapper.appendChild(this.head_child_wrapper_center);
        this.content_wrapper.appendChild(this.head_child_wrapper_2);
        this.content_wrapper.className = "hc-v-spider-head-wrapper";
        this.map_children_data_to_head();
        this.hcInnerContainer.appendChild(this.content_wrapper);
        // (document.querySelector('#click-me') as HTMLButtonElement).onclick = () => this.chartHelper?.center_root_tree_el(this.hcInnerContainer as HTMLElement, this.current_scale);
        // this.chartHelper?.center_root_tree_el(this.hcInnerContainer as HTMLElement, this.current_scale);
        this.drawBranchLinkFresh();
    }
    map_children_data_to_head(parentSVGEl, parentId, provided_hierarchy) {
        let hierarchies = this.tree_data.filter(data => data.parentId == parentId);
        if (!provided_hierarchy) {
            hierarchies = this.tree_data.filter(data => data.parentId == parentId);
        }
        else {
            hierarchies = provided_hierarchy;
        }
        const childElContainer = this.chartHelper.createDynamicEl();
        const isElParentRootEl = this.tree_data.find(data => data.id == parentId)?.parentId == undefined && parentId != undefined;
        hierarchies.forEach(head => {
            const head_UI_wrapper = this.chartHelper.createDynamicEl();
            const get_item_root_item = this.chartHelper.get_second_ancestor_item(head.id);
            let second_ancestor_rel_pos = get_item_root_item == undefined ? 1 : this.chartHelper.getElemRelPosInTree(get_item_root_item?.id);
            const head_UI = this.chartHelper.makeHead(head, parentId == undefined, { parent: "bottom", children: second_ancestor_rel_pos % 2 == 0 ? "bottom" : 'top' });
            head_UI_wrapper.appendChild(head_UI?.node());
            const root_el_cls = parentId == undefined ? " st-root-el" : "";
            head_UI_wrapper.className = "hc-head-node-wrapper hc-w-id-" + head.id + root_el_cls;
            second_ancestor_rel_pos % 2 == 0 && head_UI_wrapper.classList.add("top");
            if (parentSVGEl === undefined) {
                this.head_child_wrapper_center?.appendChild(head_UI_wrapper);
            }
            else if (isElParentRootEl) {
                if (this.chartHelper.getElemRelPosInTree(head.id) % 2 == 0) { // el position relative to root parent is even
                    this.head_child_wrapper_1?.appendChild(head_UI_wrapper);
                }
                else {
                    this.head_child_wrapper_2?.appendChild(head_UI_wrapper);
                }
            }
            else {
                childElContainer.appendChild(head_UI_wrapper);
                second_ancestor_rel_pos % 2 == 0 && childElContainer.classList.add("top");
            }
            const has_childs = this.tree_data.filter(data => data.parentId == head.id).length > 0;
            parentSVGEl != undefined && this.tree_map_arr.push({
                id: head.id,
                svgNode: parentSVGEl,
                targetChild: head_UI?.node(),
                parentId: parentId,
                lineOrigin: second_ancestor_rel_pos % 2 == 0 ? "top" : "bottom"
            });
            if (has_childs) {
                if (isElParentRootEl) {
                    if (this.chartHelper.getElemRelPosInTree(head.id) % 2 == 0) { // el position relative to root parent is even
                        head_UI_wrapper.prepend(this.map_children_data_to_head(head_UI, head.id));
                    }
                    else {
                        head_UI_wrapper.append(this.map_children_data_to_head(head_UI, head.id));
                    }
                }
                else {
                    const map_children = this.map_children_data_to_head(head_UI, head.id);
                    second_ancestor_rel_pos % 2 == 0 ? head_UI_wrapper.prepend(map_children) : head_UI_wrapper.appendChild(map_children);
                }
            }
        });
        childElContainer.classList.add("child-container");
        return childElContainer;
    }
    drawBranchLinkFresh() {
        document.querySelectorAll('.linker-line').forEach(el => el.remove());
        this.tree_map_arr.forEach(branch => this.drawBranchLink(branch.svgNode, branch.targetChild, branch.parentId, branch.lineOrigin));
    }
    drawBranchLink(svgNode, targetChild, parentId, lineOrigin = "bottom") {
        const isParentChildrenHidden = this.hcInnerContainer?.querySelector('.hc-w-id-' + parentId)?.getAttribute('data-hc-head-children-hidden');
        const isElParentRootEl = this.tree_data.find(data => data.id == parentId)?.parentId == undefined;
        if (isParentChildrenHidden === 'true' && !isElParentRootEl)
            return;
        const elementBounds = targetChild.getBoundingClientRect();
        const svgSourceNodeBounds = svgNode.node().getBoundingClientRect();
        const lineStartX = (svgSourceNodeBounds.width / this.current_scale) / 2;
        const lineStartY = lineOrigin == "top" ? 0 : svgSourceNodeBounds.height / this.current_scale;
        const lineEndX = (elementBounds.x / this.current_scale - svgSourceNodeBounds.x / this.current_scale) + (targetChild.clientWidth / 2);
        const lineEndY = lineOrigin == "top" ? ((elementBounds.top + elementBounds.height) / this.current_scale) - (svgSourceNodeBounds.top / this.current_scale) : (elementBounds.top / this.current_scale) - (svgSourceNodeBounds.top / this.current_scale);
        const link = this.hc_d3.linkVertical();
        const data = [
            { source: [lineStartX, lineStartY], target: [lineEndX, lineEndY] },
        ];
        svgNode?.append('path')
            .data(data)
            .attr('d', link)
            .attr('fill', 'none')
            .attr('class', 'linker-line')
            .attr('stroke-width', 1)
            .attr('style', 'z-index: -1');
    }
    handleCollapseChildren(svgNode, id, clicked_pos) {
        const nodeParent = svgNode.node()?.parentElement;
        const isRootTreeEl = this.tree_data.find(data => data.id == id)?.parentId == undefined;
        const nodeChildrenHidden = nodeParent?.getAttribute('data-hc-head-children-hidden');
        if (isRootTreeEl) {
            return this.handleCollapseRootElChildren(svgNode, id, clicked_pos);
        }
        if (nodeChildrenHidden == 'true') {
            const remade_children_obj = this.map_children_data_to_head(svgNode, id);
            const get_item_root_item = this.chartHelper.get_second_ancestor_item(id);
            let second_ancestor_rel_pos = get_item_root_item == undefined ? 1 : this.chartHelper.getElemRelPosInTree(get_item_root_item?.id);
            if (second_ancestor_rel_pos % 2 == 0) {
                nodeParent?.prepend(remade_children_obj);
            }
            else {
                nodeParent?.appendChild(remade_children_obj);
            }
            nodeParent?.setAttribute('data-hc-head-children-hidden', 'false');
        }
        else {
            const childrenContainer = nodeParent?.querySelector('.child-container');
            childrenContainer?.remove();
            nodeParent?.querySelectorAll('.linker-line').forEach((line) => line.remove());
            nodeParent?.setAttribute('data-hc-head-children-hidden', 'true');
            this.removeNodeRecursiveFromTreeMap(id);
        }
        this.drawBranchLinkFresh();
    }
    removeNodeRecursiveFromTreeMap(node_id, inclusive) {
        const find_node_children = this.tree_map_arr.filter(tree => tree.parentId == node_id);
        find_node_children.forEach(child => {
            this.tree_map_arr.splice(this.tree_map_arr.findIndex(tree => tree.id == child.id), 1);
            this.tree_map_arr.filter(tree => tree.id == child.id).length > 0 && this.removeNodeRecursiveFromTreeMap(child.id);
        });
        if (inclusive) {
            this.tree_map_arr.splice(this.tree_map_arr.findIndex(tree => tree.id == node_id), 1);
        }
    }
    handleCollapseRootElChildren(svgNode, id, clicked_pos) {
        const nodeParent = svgNode.node()?.parentElement;
        const nodeTopChildrenHidden = nodeParent?.getAttribute('data-hc-top-head-children-hidden');
        const nodeBottomChildrenHidden = nodeParent?.getAttribute('data-hc-bottom-head-children-hidden');
        let immediate_root_children = [];
        if (clicked_pos == 0) {
            immediate_root_children = this.tree_data.filter(data => data.parentId == id && this.chartHelper.getElemRelPosInTree(data.id) % 2 == 0);
        }
        else {
            immediate_root_children = this.tree_data.filter(data => data.parentId == id && this.chartHelper.getElemRelPosInTree(data.id) % 2 != 0);
        }
        if (((!nodeTopChildrenHidden || nodeTopChildrenHidden == "false") && clicked_pos == 0) || ((!nodeBottomChildrenHidden || nodeBottomChildrenHidden == "false") && clicked_pos != 0)) {
            immediate_root_children.forEach(child => {
                const childNodeContainer = this.hcInnerContainer?.querySelector('.hc-w-id-' + child.id);
                const childrenContainer = childNodeContainer?.querySelector('.child-container');
                childrenContainer?.remove();
                this.removeNodeRecursiveFromTreeMap(child.id, true);
                childNodeContainer?.remove();
            });
            clicked_pos == 0 ? nodeParent?.setAttribute('data-hc-top-head-children-hidden', 'true') :
                nodeParent?.setAttribute('data-hc-bottom-head-children-hidden', 'true');
        }
        else {
            this.map_children_data_to_head(svgNode, id, immediate_root_children);
            clicked_pos == 0 ? nodeParent?.setAttribute('data-hc-top-head-children-hidden', 'false') :
                nodeParent?.setAttribute('data-hc-bottom-head-children-hidden', 'false');
        }
        this.drawBranchLinkFresh();
    }
}
export default VerticalSpiderWalkTree;
