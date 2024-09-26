import HCElement from "../utils/st-element.js";
class ChartMainHelper {
    hc_d3 = window.d3;
    tree_data = [];
    handleCollapseChildren = () => { };
    center_elem = ({}) => null;
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
    chartHeadWidth = 120;
    chartHeadHeight = 130;
    chartHeadLandscapeWidth = 240;
    chartHeadLandscapeHeight = 80;
    chartHeadRoundedWidth = 120;
    chartHeadRoundedHeight = 180;
    color_handler = {};
    chart_head_type = 'default';
    show_chart_head_border = true;
    animation_rotation_speed = 50;
    animation_rotation_interval = 1;
    head_button_circle_radius = 8;
    linker_collapse_icon_color = 'bright500';
    linker_shape = 'symbolDiamond2';
    constructor() {
        console.log('symbolsFill', typeof this.hc_d3.symbolsFill[0]);
    }
    createDynamicEl() {
        return new HCElement();
    }
    splitStringIntoBatch(text, len) {
        let arr = [];
        for (let i = 0; i < text?.length; i += len) {
            arr.push(text.substring(i, Math.min(i + len, text.length)));
        }
        return arr;
    }
    get_user_initials(name) {
        const split_name = name?.split(' ');
        return split_name?.length > 1 ? split_name?.[0][0] + split_name?.at(-1)?.[0] : split_name?.[0][0];
    }
    format_employee_name(name, length = 15) {
        const split_name = name?.split(' ');
        const make_name = split_name?.length > 2 ? split_name?.[0] + " " + split_name?.at(-1) : split_name?.join(' ');
        const clip_name = this.splitStringIntoBatch(make_name, length);
        return clip_name;
    }
    symbol_type(symbolName) {
        const fillSymbols = ['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'];
        const strokeSymbols = ['plus', 'x', 'triangle2', 'asterisk', 'square2', 'diamond2'];
        const trim_name = symbolName.replace(/symbol/, '').toLowerCase();
        return fillSymbols.includes(trim_name) ? 'fill' : strokeSymbols.includes(trim_name) ? 'stroke' : 'fill';
    }
    makeHead(head_data, doubleVerticalPoints = false, pointPosition = { parent: "bottom", children: "top" }) {
        if (this.chart_head_type == 'default') {
            return this.defaultHead(head_data, doubleVerticalPoints, pointPosition);
        }
        else if (this.chart_head_type == 'landscape') {
            return this.landscapeHead(head_data, doubleVerticalPoints, pointPosition);
        }
        else if (this.chart_head_type == 'rounded') {
            return this.roundedHead(head_data, doubleVerticalPoints, pointPosition);
        }
        else {
            return this.defaultHead(head_data, doubleVerticalPoints, pointPosition);
        }
    }
    defaultHead(head_data, doubleVerticalPoints = false, pointPosition = { parent: "bottom", children: "top" }) {
        const has_children = this.tree_data.filter(data => data.parentId === head_data.id).length > 0;
        const has_parent = this.tree_data.filter(data => data.id === head_data.parentId).length > 0;
        const color_set = this.color_handler.getColor(head_data.id);
        const svgNode = this.hc_d3?.create('svg')
            .attr("class", "main-svg-el" + (this.getIsElRootTreeChild(head_data.id) ? ' root-svg-el' : ''))
            .attr('width', this.chartHeadWidth)
            .attr('height', this.chartHeadHeight)
            .on('dblclick', (e) => {
            e.stopPropagation();
            const curr_target = e.currentTarget;
            const rect = curr_target.getBoundingClientRect();
            this.center_elem(rect);
        });
        // Gaussian blur
        const defs = this.hc_d3.create('defs')
            .append('filter')
            .attr('id', 'blur1')
            .attr('x', 0)
            .attr('y', 0)
            .append('feGaussianBlur')
            .attr('in', 'SourceGraphic')
            .attr('stdDeviation', '3');
        const all_group = svgNode.append('g');
        const rect = all_group?.append('rect')
            .attr('rx', 16)
            .attr('ry', 16)
            .attr('width', this.chartHeadWidth)
            .attr('height', this.chartHeadHeight)
            .attr('stroke', this.show_chart_head_border ? color_set.color : 'none')
            .attr('fill', 'none')
            .attr('stroke-width', 0);
        const firstSection = all_group?.append('g')
            .attr('y', 100);
        if (!head_data.image) {
            firstSection?.append('circle')
                .attr('r', 20)
                .attr('stroke-width', 1)
                .attr('fill', color_set.color)
                .attr('cx', parseInt(rect.attr('width')) / 2)
                .attr('cy', 35);
            firstSection?.append('text')
                .attr('class', '')
                .attr('text-anchor', 'middle')
                .attr('fill', color_set.bright500)
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('y', 42)
                .attr('font-size', '95%')
                .text(this.get_user_initials(head_data.name)); // employee name            
        }
        else {
            firstSection.append('defs')
                .append('clipPath')
                .attr('id', "rounded-corners")
                .append('circle')
                .attr('cx', (parseInt(rect.attr('width')) / 2) - 40)
                .attr('cy', 20)
                .attr('fill', color_set.bright500)
                .attr('r', 20);
            firstSection?.append('image')
                .attr('href', head_data.image)
                .attr('preserveAspectRatio', 'xMaxYMax slice')
                .attr('width', 40)
                .attr('height', 40)
                .attr('transform', `translate(${(parseInt(rect.attr('width')) / 2) - 20}, 15)`)
                .attr('clip-path', 'url(#rounded-corners)');
        }
        const employee_name_split = this.format_employee_name(head_data.name);
        let move_down = 0;
        employee_name_split.forEach((name, i) => {
            all_group?.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('y', i > 0 ? 95 : 80)
                .attr('font-size', '85%')
                .attr('fill', color_set.darker)
                .attr('style', `text-transform: ${i > 0 ? 'none' : 'capitalize'}`)
                .text(name); // employee name
            i > 0 && (move_down = 15);
        });
        const positionTitle = all_group?.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', parseInt(rect.attr('width')) / 2)
            .attr('y', 100 + move_down)
            .attr('font-size', '65%');
        const titles = this.splitStringIntoBatch(head_data.role, 20); // role
        titles.forEach((title, index) => {
            positionTitle?.append('tspan')
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('dy', index > 0 ? '.6rem' : 0)
                .text(title.toString())
                .attr('fill', color_set.dark100);
            index > 0 && (move_down += 10);
        });
        if (head_data.location !== undefined) {
            const employeeLocation = all_group?.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('y', 115 + move_down)
                .attr('font-size', '65%')
                .attr('fill', color_set.dark100);
            const location_title = this.splitStringIntoBatch(head_data.location, 19); // role
            location_title.forEach((title, index) => {
                employeeLocation?.append('tspan')
                    .attr('x', parseInt(rect.attr('width')) / 2)
                    .attr('dy', index > 0 ? '.6rem' : 0)
                    .text(title.toString());
                index > 0 && (move_down += 10);
            });
        }
        const container_height = this.chartHeadHeight + move_down;
        rect?.attr('height', container_height);
        svgNode?.attr('height', container_height);
        this.add_linker(all_group, has_parent, has_children, pointPosition, color_set, rect, svgNode, head_data, doubleVerticalPoints);
        return svgNode;
    }
    landscapeHead(head_data, doubleVerticalPoints = false, pointPosition = { parent: "bottom", children: "top" }) {
        const has_children = this.tree_data.filter(data => data.parentId === head_data.id).length > 0;
        const has_parent = this.tree_data.filter(data => data.id === head_data.parentId).length > 0;
        const color_set = this.color_handler.getColor(head_data.id);
        let move_down = 0;
        const svgNode = this.hc_d3?.create('svg')
            .attr("class", "main-svg-el" + (this.getIsElRootTreeChild(head_data.id) ? ' root-svg-el' : ''))
            .attr('width', this.chartHeadLandscapeWidth)
            .attr('height', this.chartHeadLandscapeHeight)
            .on('dblclick', (e) => {
            e.stopPropagation();
            const curr_target = e.currentTarget;
            const rect = curr_target.getBoundingClientRect();
            this.center_elem(rect);
        });
        const all_group = svgNode.append('g');
        const rect = all_group?.append('rect')
            .attr('rx', 16)
            .attr('ry', 16)
            .attr('width', this.chartHeadLandscapeWidth)
            .attr('height', this.chartHeadLandscapeHeight)
            .attr('stroke', this.show_chart_head_border ? color_set.color : 'none')
            .attr('fill', 'none')
            .attr('stroke-width', 0);
        const employee_name_split = this.format_employee_name(head_data.name, 18);
        const rightGroup = all_group.append('g')
            .attr('x', 0)
            .attr('y', 0);
        const leftGroup = all_group.append('g');
        const leftStartOrigin = parseInt(rect.attr('height'));
        const employeeName = rightGroup?.append('text')
            .attr('x', leftStartOrigin)
            .attr('y', 30)
            .attr('font-size', '95%')
            .attr('fill', color_set.darker);
        employee_name_split.forEach((title, index) => {
            employeeName?.append('tspan')
                .attr('x', leftStartOrigin)
                .attr('y', 30)
                .attr('dy', index > 0 ? '.7rem' : 0)
                .attr('font-size', '95%')
                .attr('style', "z-index: +9")
                .text(title.toString());
            index > 0 && (move_down += 10);
        });
        const positionTitle = rightGroup?.append('text')
            .attr('x', leftStartOrigin)
            .attr('y', 50 + move_down)
            .attr('font-size', '65%');
        const titles = this.splitStringIntoBatch(head_data.role, 30); // role
        titles.forEach((title, index) => {
            positionTitle?.append('tspan')
                .attr('x', leftStartOrigin)
                .attr('dy', index > 0 ? '.6rem' : 0)
                .attr('y', 50 + move_down)
                .text(title.toString())
                .attr('fill', color_set.dark100);
            index > 0 && (move_down += 10);
        });
        if (head_data.location !== undefined) {
            const employeeLocation = rightGroup?.append('text')
                .attr('x', leftStartOrigin)
                .attr('y', 65 + move_down)
                .attr('font-size', '65%')
                .attr('fill', color_set.dark100);
            const location_title = this.splitStringIntoBatch(head_data.location, 30); // role
            location_title.forEach((title, index) => {
                employeeLocation?.append('tspan')
                    .attr('x', leftStartOrigin)
                    .attr('dy', index > 0 ? '.6rem' : 0)
                    .text(title.toString());
                index > 0 && (move_down += 10);
            });
        }
        rect.attr('height', this.chartHeadLandscapeHeight + move_down);
        svgNode.attr('height', this.chartHeadLandscapeHeight + move_down);
        if (!head_data.image) {
            leftGroup?.append('circle')
                .attr('r', 20)
                .attr('stroke-width', 1)
                .attr('fill', color_set.color)
                .attr('cx', (parseInt(rect.attr('height')) / 2))
                .attr('cy', (parseInt(rect.attr('height')) / 2));
            leftGroup?.append('text')
                .attr('class', '')
                .attr('text-anchor', 'middle')
                .attr('fill', color_set.bright500)
                .attr('x', parseInt(rect.attr('height')) / 2)
                .attr('y', (parseInt(rect.attr('height')) / 2) + 6)
                .attr('font-size', '95%')
                .text(this.get_user_initials(head_data.name)); // employee initials
        }
        else {
            leftGroup.append('defs')
                .append('clipPath')
                .attr('id', "rounded-corners")
                .append('circle')
                .attr('cx', 40)
                .attr('cy', 40)
                .attr('fill', color_set.bright500)
                .attr('r', 20);
            leftGroup?.append('image')
                .attr('href', head_data.image)
                .attr('width', 40)
                .attr('height', 40)
                .attr('x', 20)
                .attr('y', 20)
                .attr('preserveAspectRatio', 'xMaxYMax slice')
                .attr('clip-path', 'url(#rounded-corners)');
        }
        this.add_linker(all_group, has_parent, has_children, pointPosition, color_set, rect, svgNode, head_data, doubleVerticalPoints);
        return svgNode;
    }
    roundedHead(head_data, doubleVerticalPoints = false, pointPosition = { parent: "bottom", children: "top" }) {
        const has_children = this.tree_data.filter(data => data.parentId === head_data.id).length > 0;
        const has_parent = this.tree_data.filter(data => data.id === head_data.parentId).length > 0;
        const color_set = this.color_handler.getColor(head_data.id);
        const svgNode = this.hc_d3?.create('svg')
            .attr('class', 'main-svg-el rounded-head' + (this.getIsElRootTreeChild(head_data.id) ? ' root-svg-el' : ''))
            .attr('style', 'overflow: visible;')
            .attr('width', this.chartHeadRoundedWidth)
            .attr('height', this.chartHeadRoundedHeight)
            .attr('fill', 'none')
            .on('dblclick', (e) => {
            e.stopPropagation();
            const curr_target = e.currentTarget;
            const rect = curr_target.getBoundingClientRect();
            this.center_elem(rect);
        });
        const all_group = svgNode.append('g');
        const rect = all_group?.append('rect')
            .attr('rx', 16)
            .attr('ry', 16)
            .attr('width', this.chartHeadRoundedWidth)
            .attr('height', this.chartHeadRoundedHeight)
            .attr('stroke', this.show_chart_head_border ? color_set.color : 'none')
            .attr('fill', 'none')
            .attr('stroke-width', 0);
        const firstSection = all_group?.append('g');
        if (!head_data.image) {
            firstSection?.append('circle')
                .attr('r', this.chartHeadRoundedWidth / 2)
                .attr('stroke-width', 1)
                .attr('fill', color_set.color)
                .attr('cx', this.chartHeadRoundedWidth / 2)
                .attr('cy', this.chartHeadRoundedWidth / 2);
            firstSection?.append('text')
                .attr('class', '')
                .attr('text-anchor', 'middle')
                .attr('fill', color_set.bright500)
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('y', this.chartHeadRoundedWidth / 2 + 20)
                .attr('font-size', '45px')
                .text(this.get_user_initials(head_data.name)); // employee name            
        }
        else {
            firstSection.append('defs')
                .append('clipPath')
                .attr('id', "rounded-corners")
                .append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('rx', 100)
                .attr('ry', 100)
                .attr('fill', color_set.bright500)
                .attr('width', this.chartHeadRoundedWidth)
                .attr('height', this.chartHeadRoundedWidth);
            firstSection?.append('image')
                .attr('href', head_data.image)
                .attr('width', this.chartHeadRoundedWidth)
                .attr('height', this.chartHeadRoundedWidth)
                .attr('x', 0)
                .attr('preserveAspectRatio', 'xMaxYMax slice')
                .attr('y', 0)
                .attr('clip-path', 'url(#rounded-corners)');
        }
        const employee_name_split = this.format_employee_name(head_data.name, 27);
        let move_down = 0;
        employee_name_split.forEach((name, i) => {
            all_group?.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('y', this.chartHeadRoundedWidth + 18)
                .attr('dy', i > 0 ? '.6rem' : 0)
                .attr('font-size', '105%')
                .attr('fill', color_set.darker)
                .attr('style', `text-transform: ${i > 0 ? 'none' : 'capitalize'}`)
                .text(name); // employee name
            i > 0 && (move_down = 15);
        });
        const positionTitle = all_group?.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', parseInt(rect.attr('width')) / 2)
            .attr('y', this.chartHeadRoundedWidth + 35 + move_down)
            .attr('font-size', '65%');
        const titles = this.splitStringIntoBatch(head_data.role, 20); // role
        titles.forEach((title, index) => {
            positionTitle?.append('tspan')
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('dy', index > 0 ? '.6rem' : 0)
                .text(title.toString())
                .attr('fill', color_set.dark100);
            index > 0 && (move_down += 10);
        });
        if (head_data.location !== undefined) {
            const employeeLocation = all_group?.append('text')
                .attr('text-anchor', 'middle')
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('y', this.chartHeadRoundedWidth + 50 + move_down)
                .attr('font-size', '65%')
                .attr('fill', color_set.dark100);
            const location_title = this.splitStringIntoBatch(head_data.location, 19); // role
            location_title.forEach((title, index) => {
                employeeLocation?.append('tspan')
                    .attr('x', parseInt(rect.attr('width')) / 2)
                    .attr('dy', index > 0 ? '.6rem' : 0)
                    .text(title.toString());
                index > 0 && (move_down += 10);
            });
        }
        const container_height = this.chartHeadRoundedHeight + move_down;
        rect?.attr('height', container_height);
        svgNode?.attr('height', container_height);
        this.add_linker(all_group, has_parent, has_children, pointPosition, color_set, rect, svgNode, head_data, doubleVerticalPoints);
        return svgNode;
    }
    add_linker(all_group, has_parent, has_children, pointPosition, color_set, rect, svgNode, head_data, doubleVerticalPoints) {
        const ts_linker = Math.PI * this.head_button_circle_radius * this.head_button_circle_radius;
        console.log("ts_linker", ts_linker, Math.sqrt(ts_linker), Math.SQRT2);
        const add_link_icon = (type, inverse_link_point_position, class_name) => {
            if (document.querySelector('.' + class_name) != null)
                document.querySelector('.' + class_name)?.remove();
            const color = this.symbol_type(this.linker_shape) == 'stroke' ? color_set.bright100 : color_set[this.linker_collapse_icon_color];
            return all_group.append('path')
                .attr('d', this.hc_d3.symbol().type(type == 'cross' ? this.hc_d3.symbolCross : this.hc_d3.symbolX).size(Math.sqrt(ts_linker)))
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('y', rect.attr('height'))
                .attr('fill', color)
                .attr('stroke', type == 'minus' ? color : 'none')
                .attr('class', class_name)
                .attr('stroke-width', type == 'minus' ? 2 : 0)
                .attr('transform', this.link_point_position[inverse_link_point_position](rect));
        };
        if (pointPosition != false && has_parent) {
            all_group?.append('path')
                .attr('d', this.hc_d3.symbol().type(this.hc_d3[this.linker_shape]).size(ts_linker))
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('y', 0)
                .attr('class', 'hc-linker')
                .attr('fill', this.symbol_type(this.linker_shape) == 'fill' ? color_set.color : 'none')
                .attr('stroke', this.symbol_type(this.linker_shape) == 'stroke' ? color_set.gray : 'none')
                .attr('stroke-width', this.symbol_type(this.linker_shape) == 'stroke' ? 1 : 0)
                .attr('transform', this.link_point_position[pointPosition.children](rect));
        }
        if (pointPosition != false && has_children) {
            const _class = this;
            const translate_y = pointPosition.parent == "bottom" ? 0 : rect.attr('height');
            let click_counter = 0;
            all_group?.append('path')
                .attr('d', this.hc_d3.symbol().type(this.hc_d3[this.linker_shape]).size(ts_linker))
                .attr('x', parseInt(rect.attr('width')) / 2)
                .attr('y', rect.attr('height'))
                .attr('class', 'hc-linker')
                .attr('style', 'cursor: pointer;')
                .attr('fill', this.symbol_type(this.linker_shape) == 'fill' ? color_set.color : 'transparent')
                .attr('stroke', this.symbol_type(this.linker_shape) == 'stroke' ? color_set.gray : 'none')
                .attr('stroke-width', this.symbol_type(this.linker_shape) == 'stroke' ? 1 : 0)
                .attr('transform', this.link_point_position[this.inverse_link_point_position[pointPosition.children]](rect))
                .on('click', (e) => {
                click_counter % 2 == 0 ?
                    add_link_icon('cross', this.inverse_link_point_position[pointPosition.parent], 'ts-lnk-icn-' + head_data.id + '-1') :
                    add_link_icon('minus', this.inverse_link_point_position[pointPosition.parent], 'ts-lnk-icn-' + head_data.id + '-1');
                click_counter++;
                _class.handleCollapseChildren?.(svgNode, head_data.id, translate_y);
            });
            add_link_icon('minus', this.inverse_link_point_position[pointPosition.children], 'ts-lnk-icn-' + head_data.id + '-1');
            if (doubleVerticalPoints) {
                const translate_y_2 = translate_y == 0 ? rect.attr('height') : 0;
                let click_counter_2 = 0;
                all_group?.append('path')
                    .attr('d', this.hc_d3.symbol().type(this.hc_d3[this.linker_shape]).size(ts_linker))
                    .attr('x', parseInt(rect.attr('width')) / 2)
                    .attr('y', rect.attr('height'))
                    .attr('class', 'hc-linker')
                    .attr('style', 'cursor: pointer')
                    .attr('fill', this.symbol_type(this.linker_shape) == 'fill' ? color_set.color : 'transparent')
                    .attr('stroke', this.symbol_type(this.linker_shape) == 'stroke' ? color_set.gray : 'none')
                    .attr('stroke-width', this.symbol_type(this.linker_shape) == 'stroke' ? 1 : 0)
                    .attr('transform', this.link_point_position[this.inverse_link_point_position[pointPosition.parent]](rect))
                    .on('click', (e) => {
                    click_counter_2 % 2 == 0 ?
                        add_link_icon('cross', this.inverse_link_point_position[pointPosition.parent], 'ts-lnk-icn-' + head_data.id + '-2') :
                        add_link_icon('minus', this.inverse_link_point_position[pointPosition.parent], 'ts-lnk-icn-' + head_data.id + '-2');
                    click_counter_2++;
                    _class.handleCollapseChildren?.(svgNode, head_data.id, translate_y_2);
                });
                add_link_icon('minus', this.inverse_link_point_position[pointPosition.parent], 'ts-lnk-icn-' + head_data.id + '-2');
            }
        }
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
    data_to_d3_format(parentId, include_stat) {
        let parent_el = this.tree_data?.find(data => (parentId == undefined ? data.parentId : data.id) == parentId);
        parent_el = { ...parent_el, children: [] };
        const children = this.tree_data.filter(data => data.parentId == parent_el.id);
        children.forEach(child => {
            include_stat && (child.stat = 1);
            if (this.el_has_children(child.id)) {
                parent_el.children.push(this.data_to_d3_format(child.id, include_stat));
            }
            else {
                parent_el.children.push(child);
            }
        });
        return parent_el;
    }
}
export default ChartMainHelper;
