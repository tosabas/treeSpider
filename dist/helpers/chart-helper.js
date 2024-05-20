import HCElement from "../utils/st-element.js";
class ChartMainHelper {
    hc_d3 = window.d3;
    tree_data = [];
    handleCollapseChildren = () => { };
    itemHierarchy = [];
    link_point_position = {
        top: (rect) => `translate(${parseInt(rect.attr('width')) / 2}, 0)`,
        bottom: (rect) => `translate(${parseInt(rect.attr('width')) / 2}, ${rect.attr('height')})`,
        right: (rect) => `translate(${rect.attr('width')}, ${rect.attr('height') / 2})`,
        left: (rect) => `translate(0, ${rect.attr('height') / 2})`,
    };
    inverse_link_point_position = {
        "top": "bottom",
        "bottom": "top",
        "left": "right",
        "right": "left",
    };
    constructor() {
    }
    createDynamicEl() {
        return new HCElement();
    }
    splitStringIntoBatch(text, len) {
        let arr = [];
        for (let i = 0; i < text.length; i += len) {
            arr.push(text.substring(i, Math.min(i + len, text.length)));
        }
        return arr;
    }
    get_user_initials(name) {
        const split_name = name.split(' ');
        return split_name.length > 1 ? split_name[0][0] + split_name.at(-1)?.[0] : split_name[0][0];
    }
    format_employee_name(name) {
        const split_name = name.split(' ');
        const make_name = split_name.length > 2 ? split_name[0] + " " + split_name.at(-1) : split_name.join(' ');
        const clip_name = this.splitStringIntoBatch(make_name.slice(0, 28), 15);
        return clip_name;
    }
    makeHead(head_data, doubleVerticalPoints = false, pointPosition = { parent: "bottom", children: "top" }) {
        const has_children = this.tree_data.filter(data => data.parentId === head_data.id).length > 0;
        const has_parent = this.tree_data.filter(data => data.id === head_data.parentId).length > 0;
        const svgNode = this.hc_d3?.create('svg')
            .attr("class", "main-svg-el")
            .attr('width', 120)
            .attr('height', 130);
        const rect = svgNode?.append('rect')
            .attr('rx', 10)
            .attr('ry', 10)
            .attr('width', 120)
            .attr('height', 130);
        const firstSection = svgNode?.append('g')
            .attr('y', 100);
        firstSection?.append('circle')
            .attr('r', 20)
            .attr('stroke-width', 1)
            .attr('cx', parseInt(rect.attr('width')) / 2)
            .attr('cy', 35);
        firstSection?.append('text')
            .attr('class', '')
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('x', parseInt(rect.attr('width')) / 2)
            .attr('y', 42)
            .attr('font-size', '95%')
            .text(this.get_user_initials(head_data.name)); // employee name
        const employee_name_split = this.format_employee_name(head_data.name);
        let move_down = 0;
        employee_name_split.forEach((name, i) => {
            svgNode?.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('y', i > 0 ? 95 : 80)
                .attr('font-size', '85%')
                .attr('style', `text-transform: ${i > 0 ? 'none' : 'capitalize'}`)
                .text(name); // employee name
            i > 0 && (move_down = 15);
        });
        const positionTitle = svgNode?.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', parseInt(rect.attr('width')) / 2)
            .attr('y', 100 + move_down)
            .attr('font-size', '65%');
        const titles = this.splitStringIntoBatch(head_data.role, 20); // role
        titles.forEach((title, index) => {
            positionTitle?.append('tspan')
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('dy', index > 0 ? '.6rem' : 0)
                .text(title.toString());
            index > 0 && (move_down += 10);
        });
        if (head_data.location !== undefined) {
            const employeeLocation = svgNode?.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('y', 115 + move_down)
                .attr('font-size', '65%');
            const location_title = this.splitStringIntoBatch(head_data.location, 19); // role
            location_title.forEach((title, index) => {
                employeeLocation?.append('tspan')
                    .attr('x', parseInt(rect.attr('width')) / 2)
                    .attr('dy', index > 0 ? '.6rem' : 0)
                    .text(title.toString());
                index > 0 && (move_down += 10);
            });
        }
        const container_height = 130 + move_down;
        rect?.attr('height', container_height);
        svgNode?.attr('height', container_height);
        if (pointPosition != false && has_parent) {
            svgNode?.append('path')
                .attr('d', this.hc_d3.symbol(this.hc_d3.symbolCircle))
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('y', 0)
                .attr('class', 'hc-linker')
                .attr('width', 50)
                .attr('height', 50)
                .attr('transform', this.link_point_position[pointPosition.children](rect));
        }
        if (pointPosition != false && has_children) {
            const _class = this;
            const translate_y = pointPosition.parent == "bottom" ? 0 : rect.attr('height');
            svgNode?.append('path')
                .attr('d', this.hc_d3.symbol(this.hc_d3.symbolCircle))
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('y', rect.attr('height'))
                .attr('class', 'hc-linker')
                .attr('width', 50)
                .attr('height', 50)
                .attr('style', 'cursor: pointer')
                .attr('transform', this.link_point_position[this.inverse_link_point_position[pointPosition.children]](rect))
                .on('click', (e) => _class.handleCollapseChildren?.(svgNode, head_data.id, translate_y));
            if (doubleVerticalPoints) {
                const translate_y_2 = translate_y == 0 ? rect.attr('height') : 0;
                svgNode?.append('path')
                    .attr('d', this.hc_d3.symbol(this.hc_d3.symbolCircle))
                    .attr('x', parseInt(rect.attr('width')) / 2)
                    .attr('y', rect.attr('height'))
                    .attr('class', 'hc-linker')
                    .attr('width', 50)
                    .attr('height', 50)
                    .attr('style', 'cursor: pointer')
                    .attr('transform', this.link_point_position[this.inverse_link_point_position[pointPosition.parent]](rect))
                    .on('click', (e) => _class.handleCollapseChildren?.(svgNode, head_data.id, translate_y_2));
            }
        }
        return svgNode;
    }
    get_tree_items_hierarchy(parentId, parent_index, action) {
        const hierarchies = this.tree_data.filter(data => data.parentId == parentId);
        const set_child_level = parent_index == undefined ? 1 : parent_index + 1;
        const level_children_arr = [];
        hierarchies.forEach(head => {
            level_children_arr.push(head);
            if (action != undefined && (action.item_id != undefined && action.item_id == head.id || action.level != undefined && action.level == set_child_level)) {
                action.callbackFn(head, set_child_level);
            }
            const has_childs = this.tree_data.filter(data => data.parentId == head.id).length > 0;
            if (has_childs) {
                this.get_tree_items_hierarchy(head.id, set_child_level, action);
            }
        });
        const current_level = this.itemHierarchy.findIndex(item => item.level == set_child_level);
        if (current_level == -1) {
            this.itemHierarchy.push({ level: set_child_level, items: level_children_arr });
        }
        else {
            this.itemHierarchy[current_level].items = level_children_arr;
        }
        return this.itemHierarchy;
    }
    get_second_ancestor_item(child_id) {
        const child_data = this.tree_data.find(data => data.id == child_id);
        const get_parent = this.tree_data.find(data => data.id == child_data?.parentId);
        const grand_parent_is_root = this.tree_data.find(data => data.id == get_parent?.parentId)?.parentId == undefined;
        let second_ancestor = undefined;
        if (get_parent?.parentId == undefined) {
            second_ancestor = child_data;
        }
        else if (!grand_parent_is_root) {
            second_ancestor = this.get_second_ancestor_item(get_parent?.id);
        }
        else {
            second_ancestor = get_parent;
        }
        return second_ancestor;
    }
    trsnum = 20;
    center_root_tree_el(hcInnerContainer, current_scale) {
        setTimeout(() => {
            const root_tree_wrapper = document.querySelector('.hc-v-spider-head-wrapper');
            const root_tree_el = document.querySelector('.st-root-el');
            const root_tree_el_rect = root_tree_el.getBoundingClientRect();
            const root_tree_wrapper_rect = root_tree_wrapper.getBoundingClientRect();
            const root_container_rect = hcInnerContainer?.parentElement?.getBoundingClientRect();
            const hcInnerContainerRect = hcInnerContainer?.getBoundingClientRect();
            // const moveX = ((root_container_rect!.width  / 2) - (hcInnerContainerRect.width / 2));
            // const moveY = ((root_container_rect!.height  / 2) - (hcInnerContainerRect.height / 2));
            const moveX = (((hcInnerContainer?.parentElement.offsetWidth - hcInnerContainer.clientWidth) / 2) - root_tree_el.clientLeft);
            const moveY = (((hcInnerContainer?.parentElement.offsetHeight - hcInnerContainer.clientHeight) / 2) - root_tree_el.clientTop);
            const transformOriginX = root_tree_el.offsetLeft + (root_tree_el_rect.width / 2);
            const transformOriginY = root_tree_el.offsetTop + (root_tree_el_rect.height / 2);
            // root_tree_wrapper.style.transformOrigin = `${transformOriginX}px, ${transformOriginY}px)`;
            // root_tree_wrapper.style.translate = `${this.trsnum}% ${this.trsnum}%`;
            // this.trsnum += 5
            hcInnerContainer.style.left = moveX + `px`;
            hcInnerContainer.style.top = moveY + `px`;
            console.log("root_container_rect", root_container_rect, hcInnerContainer.getBoundingClientRect(), moveX, moveY, root_tree_el.offsetLeft, root_tree_el.offsetTop);
        }, 1000);
    }
    getElemRelPosInTree(el_id) {
        const find_el = this.tree_data.find(data => data.id == el_id);
        const find_all_siblings = this.tree_data.filter(data => data.parentId == find_el.parentId);
        return find_all_siblings.findIndex(data => data.id == find_el.id) + 1;
    }
    getIsParentRootEl(parent_id) {
        if (parent_id == undefined)
            return false;
        return this.tree_data.find(data => data.id == parent_id)?.parentId == undefined;
    }
    getIsElRootTreeChild(id) {
        if (id == undefined)
            return false;
        return this.tree_data.find(data => data.id == id)?.parentId == undefined;
    }
    getRootTreeEl() {
        return this.tree_data.find(data => data.parentId == undefined);
    }
    el_has_children(el_id) {
        return this.tree_data.filter(data => data.parentId == el_id).length > 0;
    }
    data_to_d3_format(parentId) {
        const parent_el = this.tree_data.find(data => (parentId == undefined ? data.parentId : data.id) == parentId);
        parent_el.children = [];
        const children = this.tree_data.filter(data => data.parentId == parent_el.id);
        children.forEach(child => {
            if (this.el_has_children(child.id)) {
                parent_el.children.push(this.data_to_d3_format(child.id));
            }
            else {
                parent_el.children.push(child);
            }
        });
        return parent_el;
    }
}
export default ChartMainHelper;
