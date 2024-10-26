import ChartMainHelper from "../helpers/chart-helper.js";
import { TTreeClassParams } from "src/types/utils";
import * as d3 from 'd3'

class SpiderlingsPacksTree {
    protected content_wrapper: HTMLElement | null = null;
    protected head_child_wrapper: HTMLElement | null = null;

    protected tsInnerContainer: HTMLElement | null = null;

    private chartHelper: ChartMainHelper | undefined;

    current_scale = 1;

    private nodes_group: any = undefined
    private links_group: any = undefined;
    private rotate_deg = 0;
    private animation_interval: NodeJS.Timeout = -1 as any;

    constructor ({tsInnerContainer, chartHelper}: TTreeClassParams) {
        this.tsInnerContainer = tsInnerContainer;

        this.chartHelper = chartHelper;

        setTimeout(() => {
            this.organizeUI();
        }, 0);
    }

    private organizeUI () {
        this.content_wrapper = this.chartHelper!.createDynamicEl();
        this.head_child_wrapper = this.chartHelper!.createDynamicEl();

        this.head_child_wrapper.className = "ts-splp-child-wrapper";

        this.content_wrapper.className = "ts-splp-content-wrapper";

        this.content_wrapper.appendChild(this.head_child_wrapper);

        this.tsInnerContainer?.append(this.content_wrapper);
        
        this.map_children_data_to_head();

    }

    private map_children_data_to_head () {
        const data = this.chartHelper!.data_to_d3_format(undefined, true);

        const svgRootNodeWidth = 260;
        const svgRootNodeHeight = 260;

        const svgRootNode = d3.create('svg')
        .attr('width', 260)
        .attr('height', 260)
        .attr('style', 'overflow: visible;');

        const root_g = svgRootNode.append('g')
        .attr('style', 'fill: none');

        const root = d3.hierarchy(data)
        .sum((d: any) => d.hasOwnProperty("stat") ? d.stat : 0)
        .sort((a: any,b: any) => b.value - a.value);

        root.each((node: any) => {
            const chartHead = this.chartHelper?.makeHead(node.data, false, false);
            node['head'] = chartHead!.node();
        });

        const partitionSize =  this.chartHelper!.chartHeadWidth * Math.sqrt(this.chartHelper!.tree_data.length * 8);

        const partition = d3.pack()
        .size([partitionSize, partitionSize])
        .padding(0);

        partition(root as any);

        root_g.selectAll('circle.node')
        .data(root.descendants())
        .enter()
        .append('circle')
        .classed('node', true)
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y)
        .attr('style', `stroke: #545454`)
        .attr('r', (d: any) => d.r);
        
        root_g.selectAll('svg.node')
        .data(root.descendants())
        .enter()
        .append((d: any) => d.head)
        .classed('node', true)
        .attr('transform', (d: any) => `translate(${d.x - this.chartHelper!.chartHeadWidth/2}, ${d.children != undefined ? ((d.y - d.r) - this.chartHelper!.chartHeadHeight) : (d.y - this.chartHelper!.chartHeadHeight/2)})`);

        this.head_child_wrapper?.append(svgRootNode!.node() as SVGSVGElement);
        root_g.attr('transform', `translate(${svgRootNodeWidth/2 - (root_g.node()!.getBoundingClientRect().width / 2)},${svgRootNodeHeight/2 - (root_g.node()!.getBoundingClientRect().height / 2)})`)
    }
}

export default SpiderlingsPacksTree;