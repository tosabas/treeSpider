import { TTreeClassParams } from "src/types/utils.js";
import ChartMainHelper from "../helpers/chart-helper.js";

class GoldenRodSpider {
    protected content_wrapper: HTMLElement | null = null;
    protected head_child_wrapper: HTMLElement | null = null;

    protected hcInnerContainer: HTMLElement | null = null;

    chartHelper: ChartMainHelper | undefined;

    hc_d3: typeof globalThis.d3 = window.d3;

    current_scale = 1;

    nodes_group: any = undefined
    links_group: any = undefined;
    rotate_deg = 0;
    animation_interval: NodeJS.Timeout = -1 as any;

    constructor ({hcInnerContainer, chartHelper}: TTreeClassParams) {
        this.hcInnerContainer = hcInnerContainer;

        this.chartHelper = chartHelper;

        setTimeout(() => {
            this.organizeUI();
        }, 0);
    }

    private organizeUI () {
        this.content_wrapper = this.chartHelper!.createDynamicEl();
        this.head_child_wrapper = this.chartHelper!.createDynamicEl();

        this.head_child_wrapper.className = "st-child-wrapper";

        this.content_wrapper.className = "st-grs-content-wrapper";

        this.content_wrapper.appendChild(this.head_child_wrapper);

        this.hcInnerContainer?.append(this.content_wrapper);

        this.map_children_data_to_head();
        setTimeout(() => {
            // this.animate_chat();
        }, 0);
    }

    private animate_chat () {
        this.nodes_group.attr('style', `transition: transform .3s linear`);
        this.links_group.attr('style', `transition: transform .3s linear`);

        this.animation_interval = setInterval(() => {
            this.rotate_deg += 1;
            this.nodes_group.attr('transform', `rotate(${this.rotate_deg}, 0, 0)`);
            this.links_group.attr('transform', `rotate(${this.rotate_deg}, 0, 0)`);
        }, 50);
    }

    private map_children_data_to_head () {
        const data = this.chartHelper!.data_to_d3_format();

        const root = this.hc_d3.hierarchy(data)
        .sort((a,b) => b.height - a.height || a.data.name.localeCompare(b.data.name));

        const radius = 540 * Math.sqrt(this.chartHelper!.tree_data.length/3);

        const treeLayout = this.hc_d3.cluster()
        .size([360, radius])
        .separation((a,b) => 50);

        treeLayout(root as any);

        const svgNode = this.hc_d3.create('svg');

        svgNode.attr('width', 580)
        svgNode.attr('height', 250)
        svgNode.attr('style', 'overflow: visible')

        const root_g = svgNode.append('g')
        .attr('transform', `translate(${(svgNode.attr('width')  as unknown as number)/2},${(svgNode.attr('height') as unknown as number)/2})`)

        root_g.append('g')
        .attr('class', 'links')
        root_g.append('g')
        .attr('class', 'nodes')

        root.each((node: any) => {
            const chartHead = this.chartHelper?.makeHead(node.data, false, false);
            node['head'] = chartHead!.node();
            node['color_set'] = this.chartHelper?.color_handler.getColor(node.data.id as unknown as number);
        });

        // draw nodes
        svgNode.select('g.nodes')
        .selectAll('svg.node')
        .data(root.descendants())
        .enter()
        .append((d: any) => {
            d.head.querySelector('rect').style.fill = "white"
            d.head.querySelector('rect').style.strokeWidth = "1"
            return d.head
        })
        .classed('node', true)
        .select('g')
        .attr("transform", (d: any) => `rotate(${d.x}, 0, 0) translate(0, ${-d.y})`);
        
        svgNode.select('g.nodes')
        .selectAll('circle.node')
        .data(root.descendants())
        .enter()
        .append('circle')
        .classed('node', true)
        .attr('cx', 0)
        .attr('cy', (d: any) => -d.y)
        .attr('r', 5)
        .attr("fill", (d: any) => d.color_set.color)
        .attr('stroke', (d: any) => d.color_set.gray)
        .attr('stroke-width', 1)
        .attr("transform", (d: any) => `rotate(${d.x}, 0, 0)`)

        const lineGen = this.hc_d3.lineRadial()
        .angle((d: any) => d.x * Math.PI / 180)
        .radius((d: any) => d.y);

        // draw links
        svgNode.select('g.links')
        .selectAll('path.link')
        .data(root.links())
        .enter()
        .append("path")
        .classed('link', true)
        .attr('stroke', (d: any) => d.target.color_set.gray)
        .attr('fill', "none")
        .attr('stroke-width', 1.5)
        .attr("d", (d: any) => lineGen([d.target, d.source]));

        this.nodes_group = svgNode.select('g.nodes');

        this.links_group = svgNode.select('g.links');

        this.head_child_wrapper?.append(svgNode.node() as SVGSVGElement)
    }

}

export default GoldenRodSpider;