import { TChartHeadPointPosition, TColorSet, TDropShadow, TElementCenterPositions, TEventType, THeadImageShape, THeadPointPosition, TLinkerCircleColor, TLinkerShape, TTreeToItemHierarchy } from "../types/utils";
import { IChartHead, ID3DataFormat, } from "../types/MainTypes";
import { TChartHeadType, TLinkType } from "../types/utils";
import TSElement from "../utils/ts-element";
import ColorHandler from "./colorHandler";
import * as d3 from "d3";

class ChartMainHelper {
    tree_data: Array<IChartHead> = [];
    handleCollapseChildren: (svgNode: any, id: string, clicked_pos: number) => void | undefined = () => {};
    center_elem: (rect: DOMRect, position?: TElementCenterPositions) => void = ({}) => null;

    itemHierarchy: TTreeToItemHierarchy = [];

    tmp_tree_data: IChartHead[] = [];
    tree_level_step = 2;
    display_tree_in_step = true;
    auto_display_tree_in_step = true;

    link_point_position: {[key in THeadPointPosition]: Function} = {
        top: (rect: any) => `translate(${parseInt(rect!.attr('width'))/2}, 0)`,
        bottom: (rect: any) => `translate(${parseInt(rect!.attr('width'))/2}, ${rect!.attr('height')})`,
        right: (rect: any) => `translate(${rect!.attr('width')}, ${rect!.attr('height') / 2})`,
        left: (rect: any) => `translate(0, ${rect!.attr('height') / 2})`,
    }

    inverse_link_point_position: {[key in THeadPointPosition]: string} = {
        "top": "bottom",
        "bottom": "top",
        "left": "right",
        "right": "left",
    }

    chartHeadWidth = 120;
    chartHeadHeight = 130;

    chartHeadLandscapeWidth = 240;
    chartHeadLandscapeHeight = 80;

    chartHeadRoundedWidth = 120;
    chartHeadRoundedHeight = 180;

    color_handler: ColorHandler = {} as ColorHandler;

    chart_head_type: TChartHeadType = 'default';
    show_chart_head_border: boolean = true;

    animation_rotation_speed = 50;
    animation_rotation_interval = 1;

    head_linker_thumb_circle_radius = 8
    linker_thumb_icon_color: TLinkerCircleColor = 'bright500'
    linker_thumb_shape: TLinkerShape = 'symbolDiamond2'
    head_image_shape: THeadImageShape = 'symbolCircle'
    head_image_surface_area: number = 60

    chart_head_bg: string = '#ffffff'
    auto_set_chart_head_bg: boolean = false;

    dropshadow: TDropShadow = {
        x: "-50%",
        y: "-50%",
        width: "200%",
        height: "200%",
        dx: 1,
        dy: 1,
        stdDeviation: 4,
        floodColor: "rgba(91, 91, 91, 0.19)",
    }

    emitEvent: (eventName: TEventType, data?: any, cancelable?: boolean) => boolean = () => false;

    tree_link_types = {
        curveBumpX: d3!.curveBumpX,
        curveBumpY: d3!.curveBumpY,
        curveBasisClosed: d3!.curveBasisClosed,
        curveLinear: d3!.curveLinear,
        curveStep: d3!.curveStep,
        curveStepAfter: d3!.curveStepAfter,
        curveStepBefore: d3!.curveStepBefore
    }

    tree_link_type: TLinkType | undefined = undefined;

    rootWrapperContainer: HTMLElement | null = null;
    app_unique_id: string = ''
    app_root_unique_selector = ''
    
    constructor () {
        setTimeout(() => {
            this.app_root_unique_selector = `[data-ts-unique-id='${this.app_unique_id}']`            
        }, 0);
    }

    public createDynamicEl () {
        return new TSElement();
    }

    public splitStringIntoBatch (text: string, len:number) {
        let arr = [];
        for(let i = 0; i < text?.length; i+=len) {
            arr.push(text.substring(i, Math.min(i+len, text.length)))
        }
        return arr;
    }

    public get_user_initials (name: string) {
        const split_name = name?.split(' ')
        return split_name?.length > 1 ? split_name?.[0][0] + split_name?.at(-1)?.[0] : split_name?.[0][0];
    }

    public format_employee_name (name: string, length = 15) {
        const split_name = name?.split(' ')
        const make_name = split_name?.length > 2 ? split_name?.[0] + " " + split_name?.at(-1) : split_name?.join(' ');
        const clip_name = this.splitStringIntoBatch(make_name, length)
        return clip_name
    } 

    private symbol_type (symbolName: string): 'stroke' | 'fill' {
        const fillSymbols = ['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']
        const strokeSymbols = ['plus', 'x', 'triangle2', 'asterisk', 'square2', 'diamond2']
        const trim_name = symbolName.replace(/symbol/, '').toLowerCase()
        return fillSymbols.includes(trim_name) ? 'fill' : strokeSymbols.includes(trim_name) ? 'stroke' : 'fill'
    }

    private get_page_body_bg () {
        const page_style = (d3.select('body').node() as HTMLBodyElement).style.getPropertyValue('background-color')
        return page_style == '' ? '#ffffff' : page_style
    }

    private get_chart_head_bg () {
        if (this.auto_set_chart_head_bg) return this.get_page_body_bg();        
        return this.chart_head_bg
    }

    private get_image_shape_spacing(symbol: string) {
        const spacings = {
            symbolCircle: 10, 
            symbolCross: 10, 
            symbolDiamond: 25, 
            symbolDiamond2: 10, 
            symbolSquare: 0, 
            symbolSquare2: -8, 
            symbolStar: 20, 
            symbolTriangle: 20, 
            symbolTriangle2: 10, 
            symbolWye: 20
        }
        return spacings[symbol as keyof typeof spacings]
    }

    public makeHead (head_data: IChartHead, doubleVerticalPoints = false, pointPosition: TChartHeadPointPosition = {parent: "bottom", children: "top"}) {
        if (this.chart_head_type == 'default') {
            return this.defaultHead(head_data, doubleVerticalPoints, pointPosition)
        }else if (this.chart_head_type == 'landscape') {
            return this.landscapeHead(head_data, doubleVerticalPoints, pointPosition)
        }else if (this.chart_head_type == 'rounded') {
            return this.roundedHead(head_data, doubleVerticalPoints, pointPosition)            
        }else{
            return this.defaultHead(head_data, doubleVerticalPoints, pointPosition)
        }
    }

    public handleCenterHead(e: any) {
        e.stopPropagation();
        const curr_target = e.currentTarget;
        const rect = curr_target.getBoundingClientRect()
        this.center_elem(rect, 'center')
    }

    public defaultHead (head_data: IChartHead, doubleVerticalPoints = false, pointPosition: TChartHeadPointPosition = {parent: "bottom", children: "top"}) {
        const has_children = this.tree_data.filter(data => data.parentId === head_data.id).length > 0;
        const has_parent = this.tree_data.filter(data => data.id === head_data.parentId).length > 0;

        const color_set = this.color_handler.getColor(head_data.id as unknown as number);
        let move_down = 0

        const chart_head_bg = this.get_chart_head_bg();

        const svgNode = d3?.create('svg')
        .attr("class", "main-svg-el" + (this.getIsElRootTreeChild(head_data.id) ? ' root-svg-el' : ''))
        .attr('width', this.chartHeadWidth)
        .attr('height', this.chartHeadHeight)
        .attr('min-height', '0')
        .attr('overflow', 'auto')
        .on('dblclick', (e) => this.handleCenterHead(e));

        // Dropshadow blur
        this.add_drop_shadow(svgNode)

        const all_group = svgNode.append('g')
        
        const rect = all_group?.append('rect')
        .attr('rx', 16)
        .attr('ry', 16)
        .attr('width', this.chartHeadWidth)
        .attr('height', this.chartHeadHeight)
        .attr('stroke', this.show_chart_head_border ? color_set.color : 'none')
        .attr('fill', chart_head_bg)
        .attr('stroke-width', 0)
        .attr('filter', 'url(#shadow)')

        const rect_half_width = parseInt(rect!.attr('width'))/2

        const firstSection = all_group?.append('g')
        .attr('y', 100)

        const chart_head_image_size = Math.pow(this.head_image_surface_area-this.get_image_shape_spacing(this.head_image_shape),2);
        if (!head_data.image) {
            move_down = rect_half_width - this.head_image_surface_area < 1 ? Math.abs(rect_half_width - this.head_image_surface_area) + 15 : 0
            
            firstSection?.append('path')
            .attr('d', d3!.symbol().type(d3![this.head_image_shape as unknown as keyof typeof d3] as d3.SymbolType).size(chart_head_image_size))
            .attr('stroke', this.symbol_type(this.head_image_shape) == 'stroke' ? color_set.color : 'none')
            .attr('stroke-width', this.symbol_type(this.head_image_shape) == 'stroke' ? 1 : 0)
            .attr('fill', this.symbol_type(this.head_image_shape) == 'stroke' ? 'transparent' : color_set.color)
            .attr('transform', `translate(${parseInt(rect!.attr('width'))/2}, 50)`)
    
            firstSection?.append('text')
            .attr('class', '')
            .attr('text-anchor', 'middle')
            .attr('fill', this.symbol_type(this.head_image_shape) == 'stroke' ? color_set.color : color_set.bright500)
            .attr('x', parseInt(rect!.attr('width'))/2)
            .attr('y', 56)
            .attr('font-size', '95%')
            .text(this.get_user_initials(head_data.name)); // employee name            
        }else{
            let extra_y_dist = rect_half_width - this.head_image_surface_area
            extra_y_dist = extra_y_dist > 10 ? 0 : extra_y_dist - 10
            extra_y_dist = extra_y_dist > 0 ? -extra_y_dist : extra_y_dist
            extra_y_dist = (rect_half_width - this.head_image_surface_area) <= 10 && extra_y_dist == 0 ? -10 : extra_y_dist

            move_down = rect_half_width - this.head_image_surface_area < 1 ? Math.abs(rect_half_width - this.head_image_surface_area) + 15 : 0

            firstSection.append('defs')
            .append('clipPath')
            .attr('id', "default-head-clip-"+head_data.id)
            .append('path')
            .attr('d', d3!.symbol().type(d3![this.head_image_shape as unknown as keyof typeof d3] as d3.SymbolType).size(chart_head_image_size))
            .attr('transform', `translate(${(parseInt(rect!.attr('width'))/2)}, ${this.head_image_surface_area + extra_y_dist})`)
            .attr('fill', color_set.bright500)

            firstSection?.append('image')
            .attr('href', head_data.image)
            .attr('preserveAspectRatio', 'xMaxYMax slice')
            .attr('width', this.head_image_surface_area)
            .attr('height', this.head_image_surface_area)
            .attr('x', (parseInt(rect!.attr('width'))/2) - (this.head_image_surface_area/2))
            .attr('y', (this.head_image_surface_area/2) + extra_y_dist)
            .attr('clip-path', `url(#default-head-clip-${head_data.id})`);
        }

        const employee_name_split = this.format_employee_name(head_data.name);

        employee_name_split.forEach((name, i) => {
            all_group?.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', parseInt(rect!.attr('width'))/2)
            .attr('y', i > 0 ? 95+move_down : 80+move_down)
            .attr('font-size', '85%')
            .attr('fill', color_set.darker)
            .attr('style', `text-transform: ${i > 0 ? 'none' : 'capitalize'}`)
            .text(name); // employee name
            i > 0 && (move_down += 15);
        })

        const positionTitle = all_group?.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', parseInt(rect!.attr('width'))/2)
        .attr('y', 100 + move_down)
        .attr('font-size', '65%')

        const titles = this.splitStringIntoBatch(head_data.role, 20) // role

        titles.forEach((title: string, index: number) => {
            positionTitle?.append('tspan')
            .attr('x', parseInt(rect!.attr('width'))/2)
            .attr('dy', index > 0 ? 10 : 0)
            .text(title.toString())
            .attr('fill', color_set.dark100);
            index > 0 && (move_down += 10);
        })

        if (head_data.location !== undefined) {
            const employeeLocation = all_group?.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', parseInt(rect!.attr('width'))/2)
            .attr('y', 115 + move_down)
            .attr('font-size', '65%')
            .attr('fill', color_set.dark100);
    
            const location_title = this.splitStringIntoBatch(head_data.location, 19) // role
    
            location_title.forEach((title: string, index: number) => {
                employeeLocation?.append('tspan')
                .attr('x', parseInt(rect!.attr('width'))/2)
                .attr('dy', index > 0 ? 10 : 0)
                .text(title.toString());
                index > 0 && (move_down += 10);
            })
        }

        const container_height = this.chartHeadHeight + move_down;
        rect?.attr('height', container_height);
        svgNode?.attr('height', container_height);

        this.add_linker(
            all_group, has_parent, has_children, pointPosition, 
            color_set, rect, svgNode, head_data, doubleVerticalPoints
        )

        this.emitEvent('chart_head.create', {headNode: svgNode.node()})
        
        return svgNode;
    }

    public landscapeHead (head_data: IChartHead, doubleVerticalPoints = false, pointPosition: TChartHeadPointPosition = {parent: "bottom", children: "top"}) {
        const has_children = this.tree_data.filter(data => data.parentId === head_data.id).length > 0;
        const has_parent = this.tree_data.filter(data => data.id === head_data.parentId).length > 0;

        const color_set = this.color_handler.getColor(head_data.id as unknown as number);

        let move_down = 0;
        const chart_head_bg = this.get_chart_head_bg();

        const svgNode = d3?.create('svg')
        .attr("class", "main-svg-el" + (this.getIsElRootTreeChild(head_data.id) ? ' root-svg-el' : ''))
        .attr('width', this.chartHeadLandscapeWidth)
        .attr('height', this.chartHeadLandscapeHeight)
        .attr('style', 'background-color: ' + this.chart_head_bg)
        .on('dblclick', (e) => this.handleCenterHead(e));

        const all_group = svgNode.append('g');
        this.add_drop_shadow(svgNode)

        const rect = all_group?.append('rect')
        .attr('rx', 16)
        .attr('ry', 16)
        .attr('width', this.chartHeadLandscapeWidth)
        .attr('height', this.chartHeadLandscapeHeight)
        .attr('stroke', this.show_chart_head_border ? color_set.color : 'none')
        .attr('fill', chart_head_bg)
        .attr('filter', 'url(#shadow)')
        .attr('stroke-width', 0)

        const rect_half_height = parseInt(rect!.attr('height'))/2

        const employee_name_split = this.format_employee_name(head_data.name, 18);

        const rightGroup = all_group.append('g')
        .attr('x', 0)
        .attr('y', 0)        

        const leftStartOrigin = parseInt(rect!.attr('height')) + 20;

        const employeeName = rightGroup?.append('text')
            .attr('x', leftStartOrigin)
            .attr('y', 30)
            .attr('font-size', '95%')
            .attr('fill', color_set.darker);
    
        employee_name_split.forEach((title: string, index: number) => {
            employeeName?.append('tspan')
            .attr('x', leftStartOrigin)
            .attr('y', 30)
            .attr('dy', index > 0 ? move_down + 14 + index : 0)
            .attr('font-size', '95%')
            .attr('style', "z-index: +9")
            .text(title.toString());
            index > 0 && (move_down += 14);
        })

        const positionTitle = rightGroup?.append('text')
        .attr('x', leftStartOrigin)
        .attr('y', 54 + move_down)
        .attr('font-size', '65%')

        const titles = this.splitStringIntoBatch(head_data.role, 30) // role

        titles.forEach((title: string, index: number) => {
            positionTitle?.append('tspan')
            .attr('x', leftStartOrigin)
            .attr('dy', index > 0 ? 10 : 0)
            .attr('y', 54 + move_down)
            .text(title.toString())
            .attr('fill', color_set.dark100);
            index > 0 && (move_down += 10);
        })

        if (head_data.location !== undefined) {
            const employeeLocation = rightGroup?.append('text')
            .attr('x', leftStartOrigin)
            .attr('y', 69 + move_down)
            .attr('font-size', '65%')
            .attr('fill', color_set.dark100);
    
            const location_title = this.splitStringIntoBatch(head_data.location, 30) // role
    
            location_title.forEach((title: string, index: number) => {
                employeeLocation?.append('tspan')
                .attr('x', leftStartOrigin)
                .attr('dy', index > 0 ? 10 : 0)
                .text(title.toString());
                index > 0 && (move_down += 10);
            })
        }

        const leftGroup = all_group.append('g');

        const locked_height = this.chartHeadLandscapeHeight + move_down
        rect.attr('height', locked_height)
        svgNode.attr('height', locked_height)

        if (!head_data.image) {            
            const chartHeadLandscapeHeight = this.head_image_surface_area > rect_half_height ? Math.abs(this.head_image_surface_area - rect_half_height) : 0
            
            rect.attr('height', locked_height + chartHeadLandscapeHeight)
            svgNode.attr('height', locked_height + chartHeadLandscapeHeight)
            svgNode.attr('width', this.chartHeadLandscapeWidth + 20 + chartHeadLandscapeHeight)
            rect.attr('width', this.chartHeadLandscapeWidth + 20 + chartHeadLandscapeHeight)

            leftGroup?.append('path')
            .attr('d', d3!.symbol().type(d3![this.head_image_shape as unknown as keyof typeof d3] as d3.SymbolType).size(Math.pow(this.head_image_surface_area-this.get_image_shape_spacing(this.head_image_shape),2)))
            .attr('stroke', this.symbol_type(this.head_image_shape) == 'stroke' ? color_set.color : 'none')
            .attr('stroke-width', this.symbol_type(this.head_image_shape) == 'stroke' ? 1 : 0)
            .attr('fill', this.symbol_type(this.head_image_shape) == 'stroke' ? 'transparent' : color_set.color)
            .attr('transform', `translate(50, ${parseInt(rect!.attr('height'))/2})`)
            
            leftGroup?.append('text')
            .attr('class', '')
            .attr('text-anchor', 'middle')
            .attr('fill', this.symbol_type(this.head_image_shape) == 'stroke' ? color_set.color : color_set.bright500)
            .attr('x', 50)
            .attr('y', (parseInt(rect!.attr('height'))/2) + 6)
            .attr('font-size', '95%')
            .text(this.get_user_initials(head_data.name)); // employee initials
        }else{
            let extra_y_dist = rect_half_height - this.head_image_surface_area
            extra_y_dist = extra_y_dist > 10 ? 0 : extra_y_dist - 10
            extra_y_dist = extra_y_dist > 0 ? -extra_y_dist : extra_y_dist
            extra_y_dist = (rect_half_height - this.head_image_surface_area) <= 10 && extra_y_dist == 0 ? -10 : extra_y_dist

            const chartHeadLandscapeHeight = this.head_image_surface_area > rect_half_height ? Math.abs(this.head_image_surface_area - rect_half_height) : 0
            
            rect.attr('height', locked_height + chartHeadLandscapeHeight)
            svgNode.attr('height', locked_height + chartHeadLandscapeHeight)
            svgNode.attr('width', this.chartHeadLandscapeWidth + chartHeadLandscapeHeight)
            rect.attr('width', this.chartHeadLandscapeWidth + chartHeadLandscapeHeight)

            leftGroup.append('defs')
            .append('clipPath')
            .attr('id', "landscape-clip-"+head_data.id)
            .append('path')
            .attr('d', d3!.symbol().type(d3![this.head_image_shape as unknown as keyof typeof d3] as d3.SymbolType).size(Math.pow(this.head_image_surface_area-this.get_image_shape_spacing(this.head_image_shape),2)))
            .attr('transform', `translate(50, ${parseInt(rect!.attr('height'))/2})`)
            .attr('fill', color_set.bright500);

            leftGroup?.append('image')
            .attr('href', head_data.image)
            .attr('preserveAspectRatio', 'xMaxYMax slice')
            .attr('width', this.head_image_surface_area)
            .attr('height', this.head_image_surface_area)
            .attr('x', 50 - (this.head_image_surface_area/2))
            .attr('y', parseInt(rect!.attr('height'))/2 - (this.head_image_surface_area/2))
            .attr('clip-path', `url(#landscape-clip-${head_data.id})`);
        }


        this.add_linker(
            all_group, has_parent, has_children, pointPosition, 
            color_set, rect, svgNode, head_data, doubleVerticalPoints
        )

        this.emitEvent('chart_head.create', {headNode: svgNode.node()})

        return svgNode;
    }

    public roundedHead (head_data: IChartHead, doubleVerticalPoints = false, pointPosition: TChartHeadPointPosition = {parent: "bottom", children: "top"}) {
        const has_children = this.tree_data.filter(data => data.parentId === head_data.id).length > 0;
        const has_parent = this.tree_data.filter(data => data.id === head_data.parentId).length > 0;

        const color_set = this.color_handler.getColor(head_data.id as unknown as number);
        let move_down = 0

        const svgNode = d3?.create('svg')
        .attr('class', 'main-svg-el rounded-head' + (this.getIsElRootTreeChild(head_data.id) ? ' root-svg-el' : ''))
        .attr('style', 'overflow: visible;')
        .attr('width', this.chartHeadRoundedWidth)
        .attr('height', this.chartHeadRoundedHeight)
        .attr('fill', 'none')
        .on('dblclick', (e) => this.handleCenterHead(e));

        const all_group = svgNode.append('g')

        const rect = all_group?.append('rect')
        .attr('rx', 16)
        .attr('ry', 16)
        .attr('width', this.chartHeadRoundedWidth)
        .attr('height', this.chartHeadRoundedHeight)
        .attr('stroke', this.show_chart_head_border ? color_set.color : 'none')
        .attr('fill', 'none')
        .attr('stroke-width', 0)

        const rect_half_width = parseInt(rect!.attr('width'))/2

        const firstSection = all_group?.append('g')
        const symbol_size = Math.pow((this.head_image_surface_area-this.get_image_shape_spacing(this.head_image_shape))*2,2)
        const head_shape_type = d3![this.head_image_shape as unknown as keyof typeof d3] as d3.SymbolType;
        if (!head_data.image) {   
            let extra_y_dist = rect_half_width - this.head_image_surface_area
            extra_y_dist = extra_y_dist > 10 ? 0 : extra_y_dist - 10
            extra_y_dist = extra_y_dist > 0 ? -extra_y_dist : extra_y_dist
            extra_y_dist = (rect_half_width - this.head_image_surface_area) <= 10 && extra_y_dist == 0 ? -10 : extra_y_dist

            move_down = rect_half_width - this.head_image_surface_area < 0 ? Math.abs(rect_half_width - this.head_image_surface_area) * 2  : 0

            firstSection?.append('path')
            .attr('d', d3!.symbol().type(head_shape_type).size(symbol_size))
            .attr('stroke', this.symbol_type(this.head_image_shape) == 'stroke' ? color_set.color : 'none')
            .attr('stroke-width', this.symbol_type(this.head_image_shape) == 'stroke' ? 1 : 0)
            .attr('fill', this.symbol_type(this.head_image_shape) == 'stroke' ? 'transparent' : color_set.color)
            .attr('transform', `translate(${(parseInt(rect!.attr('width'))/2) }, ${(this.head_image_surface_area*2) - ((this.head_image_surface_area))})`)
    
            firstSection?.append('text')
            .attr('class', '')
            .attr('text-anchor', 'middle')
            .attr('fill', this.symbol_type(this.head_image_shape) == 'stroke' ? color_set.color : color_set.bright500)
            .attr('x', parseInt(rect!.attr('width'))/2)
            .attr('y', this.head_image_surface_area + Math.sqrt(symbol_size)/6)
            .attr('font-size', (this.head_image_surface_area/1.5) + 'px')
            .text(this.get_user_initials(head_data.name)); // employee name   
        }else{
            let extra_y_dist = rect_half_width - this.head_image_surface_area
            extra_y_dist = extra_y_dist > 10 ? 0 : extra_y_dist - 10
            extra_y_dist = extra_y_dist > 0 ? -extra_y_dist : extra_y_dist
            extra_y_dist = (rect_half_width - this.head_image_surface_area) <= 10 && extra_y_dist == 0 ? -10 : extra_y_dist

            move_down = rect_half_width - this.head_image_surface_area < 0 ? Math.abs(rect_half_width - this.head_image_surface_area) * 2  : 0

            firstSection.append('defs')
            .append('clipPath')
            .attr('id', "rounded-corners-"+head_data.id)
            .append('path')
            .attr('d', d3!.symbol().type(head_shape_type).size(symbol_size))
            .attr('transform', `translate(${(parseInt(rect!.attr('width'))/2) }, ${(this.head_image_surface_area*2) - ((this.head_image_surface_area) )})`)
            .attr('fill', color_set.bright500)

            firstSection?.append('image')
            .attr('href', head_data.image)
            .attr('preserveAspectRatio', 'xMaxYMax slice')
            .attr('width', this.head_image_surface_area*2)
            .attr('height', this.head_image_surface_area*2)
            .attr('x', (parseInt(rect!.attr('width'))/2) - (this.head_image_surface_area))
            .attr('y', (this.head_image_surface_area) - ((this.head_image_surface_area) ))
            .attr('clip-path', `url(#rounded-corners-${head_data.id})`);
        }

        const employee_name_split = this.format_employee_name(head_data.name, 27);

        employee_name_split.forEach((name, i) => {
            all_group?.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', parseInt(rect!.attr('width'))/2)
            .attr('y', this.chartHeadRoundedWidth + 18)
            .attr('dy', i > 0 ? 15+move_down : 0+move_down)
            .attr('font-size', '105%')
            .attr('fill', color_set.darker)
            .attr('style', `text-transform: ${i > 0 ? 'none' : 'capitalize'}`)
            .text(name); // employee name
            i > 0 && (move_down += 15);
        })

        const positionTitle = all_group?.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', parseInt(rect!.attr('width'))/2)
        .attr('y', this.chartHeadRoundedWidth + 35 + move_down)
        .attr('font-size', '65%')

        const titles = this.splitStringIntoBatch(head_data.role, 20) // role

        titles.forEach((title: string, index: number) => {
            positionTitle?.append('tspan')
            .attr('x', parseInt(rect!.attr('width'))/2)
            .attr('dy', index > 0 ? 10 : 0)
            .text(title.toString())
            .attr('fill', color_set.dark100);
            index > 0 && (move_down += 10);
        })

        if (head_data.location !== undefined) {
            const employeeLocation = all_group?.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', parseInt(rect!.attr('width'))/2)
            .attr('y', this.chartHeadRoundedWidth + 50 + move_down)
            .attr('font-size', '65%')
            .attr('fill', color_set.dark100);
    
            const location_title = this.splitStringIntoBatch(head_data.location, 19) // role
    
            location_title.forEach((title: string, index: number) => {
                employeeLocation?.append('tspan')
                .attr('x', parseInt(rect!.attr('width'))/2)
                .attr('dy', index > 0 ? 10 : 0)
                .text(title.toString());
                index > 0 && (move_down += 10);
            })
        }

        const container_height = this.chartHeadRoundedHeight + move_down;
        rect?.attr('height', container_height);
        svgNode?.attr('height', container_height);

        this.add_linker(
            all_group, has_parent, has_children, pointPosition, 
            color_set, rect, svgNode, head_data, doubleVerticalPoints
        )

        this.emitEvent('chart_head.create', {headNode: svgNode.node()})

        return svgNode;
    }

    public add_linker (all_group: d3.Selection<SVGGElement, undefined, null, undefined>, 
            has_parent: boolean, has_children: boolean, pointPosition: TChartHeadPointPosition,
            color_set: TColorSet, rect: d3.Selection<SVGRectElement, undefined, null, undefined>,
            svgNode: d3.Selection<SVGSVGElement, undefined, null, undefined>,
            head_data: IChartHead, doubleVerticalPoints: boolean) {

        const ts_linker = Math.PI * this.head_linker_thumb_circle_radius * this.head_linker_thumb_circle_radius

        const add_link_icon = (type: 'cross' | 'minus', inverse_link_point_position: any, class_name: string) => {
            if (this.rootWrapperContainer?.querySelector('.'+class_name) != null) this.rootWrapperContainer?.querySelector('.'+class_name)?.remove();
            const color = this.symbol_type(this.linker_thumb_shape) == 'stroke' ? color_set.bright100 : color_set[this.linker_thumb_icon_color]
            return all_group.append('path')
            .attr('d', d3!.symbol().type(type == 'cross' ? d3.symbolCross : d3!.symbolX).size(Math.sqrt(ts_linker)))
            .attr('x', parseInt(rect!.attr('width'))/2)
            .attr('y', rect!.attr('height'))
            .attr('fill', color)
            .attr('stroke', type == 'minus' ? color: 'none')
            .attr('class', class_name)
            .attr('style', 'pointer-events: none')
            .attr('stroke-width', type == 'minus' ? 2 : 0)
            .attr('transform', this.link_point_position[inverse_link_point_position as keyof typeof this.link_point_position](rect))
        }
        
        if (pointPosition != false && has_parent) {
            all_group?.append('path')
            .attr('d', d3!.symbol().type(d3![this.linker_thumb_shape as unknown as keyof typeof d3] as d3.SymbolType).size(ts_linker))
            .attr('x', parseInt(rect!.attr('width'))/2)
            .attr('y', 0)
            .attr('class', 'ts-linker')
            .attr('fill', this.symbol_type(this.linker_thumb_shape) == 'fill' ? color_set.color : 'none')
            .attr('stroke', this.symbol_type(this.linker_thumb_shape) == 'stroke' ? color_set.gray : 'none')
            .attr('stroke-width', this.symbol_type(this.linker_thumb_shape) == 'stroke' ? 1 : 0)
            .attr('transform', this.link_point_position[pointPosition.children](rect))
        }
        
        if (pointPosition != false && has_children) {
            const _class = this;
            const translate_y = pointPosition.parent == "bottom" ? 0 : rect!.attr('height') as unknown as number;
            let click_counter = 0
            all_group?.append('path')
            .attr('d', d3!.symbol().type(d3![this.linker_thumb_shape as unknown as keyof typeof d3] as d3.SymbolType).size(ts_linker))
            .attr('x', parseInt(rect!.attr('width'))/2)
            .attr('y', rect!.attr('height'))
            .attr('class', 'ts-linker')
            .attr('style', 'cursor: pointer;')
            .attr('fill', this.symbol_type(this.linker_thumb_shape) == 'fill' ? color_set.color : 'transparent')
            .attr('stroke', this.symbol_type(this.linker_thumb_shape) == 'stroke' ? color_set.gray : 'none')
            .attr('stroke-width', this.symbol_type(this.linker_thumb_shape) == 'stroke' ? 1 : 0)
            .attr('transform', this.link_point_position[this.inverse_link_point_position[pointPosition.children] as keyof typeof this.link_point_position](rect))
            .on('click', (e) => {
                const curr_target_parent = e.currentTarget.parentElement;
                click_counter % 2 == 0 ? 
                add_link_icon('cross', this.inverse_link_point_position[pointPosition.children], 'ts-lnk-icn-'+head_data.id+'-1'):
                add_link_icon('minus', this.inverse_link_point_position[pointPosition.children], 'ts-lnk-icn-'+head_data.id+'-1')
                click_counter++;
                _class.handleCollapseChildren?.(svgNode, head_data.id, translate_y)
                const rect = curr_target_parent.getBoundingClientRect();
                setTimeout(() => {
                    click_counter % 2 == 0 && this.center_elem(rect);
                }, 0);
                click_counter % 2 == 0 ? this.emitEvent('chart_head.expanded', {svgNode, head_data, pointPosition}, false) :
                this.emitEvent('chart_head.collapsed', {svgNode, head_data, pointPosition}, false);
            });

            if (!this.el_has_children(head_data.id, true)) {
                click_counter++
            }

            add_link_icon(!this.el_has_children(head_data.id, true) ? 'cross' : 'minus', this.inverse_link_point_position[pointPosition.children], 'ts-lnk-icn-'+head_data.id+'-1')
            
            if (doubleVerticalPoints) {
                const translate_y_2 = translate_y == 0 ? rect!.attr('height') as unknown as number : 0;
                let click_counter_2 = 0
                all_group?.append('path')
                .attr('d', d3!.symbol().type(d3![this.linker_thumb_shape as unknown as keyof typeof d3] as d3.SymbolType).size(ts_linker))
                .attr('x', parseInt(rect!.attr('width'))/2)
                .attr('y', rect!.attr('height'))
                .attr('class', 'ts-linker')
                .attr('style', 'cursor: pointer')
                .attr('fill', this.symbol_type(this.linker_thumb_shape) == 'fill' ? color_set.color : 'transparent')
                .attr('stroke', this.symbol_type(this.linker_thumb_shape) == 'stroke' ? color_set.gray : 'none')
                .attr('stroke-width', this.symbol_type(this.linker_thumb_shape) == 'stroke' ? 1 : 0)
                .attr('transform', this.link_point_position[this.inverse_link_point_position[pointPosition.parent] as keyof typeof this.link_point_position](rect))
                .on('click', (e) => {
                    const curr_target_parent = e.currentTarget.parentElement;
                    click_counter_2 % 2 == 0 ? 
                    add_link_icon('cross', this.inverse_link_point_position[pointPosition.parent], 'ts-lnk-icn-'+head_data.id+'-2'):
                    add_link_icon('minus', this.inverse_link_point_position[pointPosition.parent], 'ts-lnk-icn-'+head_data.id+'-2')
                    _class.handleCollapseChildren?.(svgNode, head_data.id, translate_y_2)
                    const rect = curr_target_parent.getBoundingClientRect();
                    click_counter_2++;
                    setTimeout(() => {
                        click_counter_2 % 2 == 0 && this.center_elem(rect);
                    }, 0);
                    click_counter_2 % 2 == 0 ? this.emitEvent('chart_head.expanded', {svgNode, head_data, pointPosition}, false) :
                    this.emitEvent('chart_head.collapsed', {svgNode, head_data, pointPosition}, false);
                });

                add_link_icon('minus', this.inverse_link_point_position[pointPosition.parent], 'ts-lnk-icn-'+head_data.id+'-2')

            }
        }
    }

    private add_drop_shadow (svgNode: d3.Selection<SVGSVGElement, undefined, null, undefined>) {
        // Dropshadow blur
        svgNode.append('defs')
        .append('filter')
        .attr('id', 'shadow')
        .attr('x', this.dropshadow.x)
        .attr('y', this.dropshadow.y)
        .attr('width', this.dropshadow.width)
        .attr('height', this.dropshadow.height)
        .append('feDropShadow')
        .attr('dx', this.dropshadow.dx)
        .attr('dy', this.dropshadow.dy)
        .attr('stdDeviation', this.dropshadow.stdDeviation)
        .attr('flood-color', this.dropshadow.floodColor)
    }

    public get_tree_items_hierarchy (parentId?: string, parent_index?: number, action?: {level?: number; item_id?: string; callbackFn: (item: IChartHead, level: number) => void}) {
        const hierarchies = this.tree_data.filter(data => data.parentId == parentId);
        const set_child_level = parent_index == undefined ? 1 : parent_index + 1;
        const level_children_arr = [] as Array<IChartHead>;

        hierarchies.forEach(head => {
            level_children_arr.push(head);
            if (action != undefined && (action.item_id != undefined && action.item_id == head.id || action.level != undefined && action.level == set_child_level)) {
                action.callbackFn(head, set_child_level)                
            }
            const has_childs = this.tree_data.filter(data => data.parentId == head.id).length > 0;
            if (has_childs) {
                this.get_tree_items_hierarchy(head.id, set_child_level, action);
            }
        });

        const current_level = this.itemHierarchy.findIndex(item => item.level == set_child_level)
        if (current_level == -1) {
            this.itemHierarchy.push({level: set_child_level, items: level_children_arr})
        }else{
            this.itemHierarchy[current_level].items = level_children_arr
        }

        return this.itemHierarchy;
    }

    public get_second_ancestor_item (child_id: string): any {
        const child_data = this.tree_data.find(data => data.id == child_id)
        const get_parent = this.tree_data.find(data => data.id == child_data?.parentId)
        const grand_parent_is_root = this.tree_data.find(data => data.id == get_parent?.parentId)?.parentId == undefined;
        let second_ancestor = undefined;
        if (get_parent?.parentId == undefined) {
            second_ancestor = child_data;
        }else if (!grand_parent_is_root) {
            second_ancestor = this.get_second_ancestor_item(get_parent?.id as string)
        }else{
            second_ancestor = get_parent;
        }

        return second_ancestor;
    }

    public getElemRelPosInTree (el_id: string) {
        const find_el = this.tree_data.find(data => data.id == el_id);
        const find_all_siblings = this.tree_data.filter(data => data.parentId == find_el!.parentId);
        return find_all_siblings.findIndex(data => data.id == find_el!.id) + 1;
    }

    public set_tmp_tree_data(el_id?: string | undefined) {
        if (this.display_tree_in_step || (this.tree_data.length > 500 && this.auto_display_tree_in_step)) {
            const id = el_id == undefined ? '1' : el_id
            this.tmp_tree_data = this.get_children_down_to_level(id, this.tree_level_step)
            if (el_id == undefined) {
                this.tmp_tree_data = [this.tree_data[0], ...this.tmp_tree_data]            
            }            
        }else{
            this.tmp_tree_data = this.tree_data
        }
    }

    public getIsParentRootEl (parent_id: string) {
        if (parent_id == undefined) return false;
        return this.tree_data.find(data => data.id == parent_id)?.parentId == undefined;
    }

    public getIsElRootTreeChild (id: string) {
        if (id == undefined) return false;
        return this.tree_data.find(data => data.id == id)?.parentId == undefined
    }

    public getRootTreeEl () {
        return this.tree_data.find(data => data.parentId == undefined)
    }

    public el_has_children (el_id: string, check_tmp_data = false) {
        if (check_tmp_data) {
            return this.tmp_tree_data.filter(data => data.parentId == el_id).length > 0;            
        }
        return this.tree_data.filter(data => data.parentId == el_id).length > 0;
    }

    public get_children_down_to_level(el_id: string, level_limit: number, current_level = 1): IChartHead[] {
        let cur_level = current_level
        let children: IChartHead[] = []
        const cur_children = this.tree_data.filter(tree => tree.parentId == el_id)
        let c_levl: IChartHead[] = []
        if (cur_level < level_limit && cur_children.length > 0) {
            c_levl = cur_children.map(child => this.get_children_down_to_level(child.id, level_limit, cur_level + 1)).flat()
        }
        children = [...cur_children, ...c_levl]
        return children
    }

    public data_to_d3_format (parentId?: string, include_stat?: boolean) {
        let parent_el: ID3DataFormat = this.tree_data?.find(data => (parentId == undefined ? data.parentId : data.id) == parentId) as ID3DataFormat;

        parent_el = {...parent_el, children: []};

        const children = this.tree_data.filter(data => data.parentId == parent_el.id);

        children.forEach(child => {
            include_stat && (child.stat = 1);
            if (this.el_has_children(child.id)) {
                parent_el.children.push(this.data_to_d3_format(child.id, include_stat))
            }else{
                parent_el.children.push(child)
            }
        })

        return parent_el;
    }

}

export default ChartMainHelper