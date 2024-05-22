class SpiderlingsPacksTree {
    content_wrapper = null;
    head_child_wrapper = null;
    hcInnerContainer = null;
    chartHelper;
    hc_d3 = window.d3;
    current_scale = 1;
    nodes_group = undefined;
    links_group = undefined;
    rotate_deg = 0;
    animation_interval = -1;
    constructor({ hcInnerContainer, chartHelper }) {
        this.hcInnerContainer = hcInnerContainer;
        this.chartHelper = chartHelper;
        setTimeout(() => {
            this.organizeUI();
        }, 0);
    }
    organizeUI() {
        this.content_wrapper = this.chartHelper.createDynamicEl();
        this.head_child_wrapper = this.chartHelper.createDynamicEl();
        this.head_child_wrapper.className = "ts-splp-child-wrapper";
        this.content_wrapper.className = "ts-splp-content-wrapper";
        this.content_wrapper.appendChild(this.head_child_wrapper);
        this.hcInnerContainer?.append(this.content_wrapper);
        this.map_children_data_to_head();
    }
    map_children_data_to_head() {
        const data = this.chartHelper.data_to_d3_format(undefined, true);
        const svgRootNodeWidth = 260;
        const svgRootNodeHeight = 260;
        const svgRootNode = this.hc_d3.create('svg')
            .attr('width', 260)
            .attr('height', 260)
            .attr('style', 'overflow: visible;');
        const root_g = svgRootNode.append('g')
            .attr('style', 'fill: none');
        const root = this.hc_d3.hierarchy(data)
            .sum((d) => d.hasOwnProperty("stat") ? d.stat : 0)
            .sort((a, b) => b.value - a.value);
        root.each((node) => {
            const chartHead = this.chartHelper?.makeHead(node.data, false, false);
            node['head'] = chartHead.node();
        });
        const partitionSize = this.chartHelper.chartHeadWidth * Math.sqrt(this.chartHelper.tree_data.length * 8);
        const partition = this.hc_d3.pack()
            .size([partitionSize, partitionSize])
            .padding(0);
        partition(root);
        root_g.selectAll('circle.node')
            .data(root.descendants())
            .enter()
            .append('circle')
            .classed('node', true)
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y)
            .attr('style', `stroke: #545454`)
            .attr('r', (d) => d.r);
        root_g.selectAll('svg.node')
            .data(root.descendants())
            .enter()
            .append((d) => d.head)
            .classed('node', true)
            .attr('transform', (d) => `translate(${d.x - this.chartHelper.chartHeadWidth / 2}, ${d.children != undefined ? ((d.y - d.r) - this.chartHelper.chartHeadHeight) : (d.y - this.chartHelper.chartHeadHeight / 2)})`);
        this.head_child_wrapper?.append(svgRootNode.node());
        root_g.attr('transform', `translate(${svgRootNodeWidth / 2 - (root_g.node().getBoundingClientRect().width / 2)},${svgRootNodeHeight / 2 - (root_g.node().getBoundingClientRect().height / 2)})`);
    }
}
export default SpiderlingsPacksTree;
