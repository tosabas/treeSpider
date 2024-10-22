class GoldenRodSpider {
    content_wrapper = null;
    head_child_wrapper = null;
    hcInnerContainer = null;
    chartHelper;
    hc_d3 = window.d3;
    current_scale = 1;
    nodes_group = undefined;
    links_group = undefined;
    rotate_deg = 0;
    animation_interval = undefined;
    start_animation = false;
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
        this.head_child_wrapper.className = "st-child-wrapper";
        this.content_wrapper.className = "st-grs-content-wrapper";
        this.content_wrapper.appendChild(this.head_child_wrapper);
        this.hcInnerContainer?.append(this.content_wrapper);
        this.map_children_data_to_head();
        this.hc_d3.timeout(() => {
            const first_svg_el = this.hc_d3.select(`${this.chartHelper.app_root_unique_selector} .root-svg-el`).node().getBoundingClientRect();
            this.chartHelper?.center_elem(first_svg_el, "center");
        }, 0);
    }
    animate_chat(once = false, anti = false) {
        if (once) {
            this.rotate_deg += this.chartHelper?.animation_rotation_interval * (anti ? -1 : 1);
            this.nodes_group.attr('transform', `rotate(${this.rotate_deg}, 0, 0)`);
            return this.links_group.attr('transform', `rotate(${this.rotate_deg}, 0, 0)`);
        }
        this.start_animation = !this.start_animation;
        if (this.start_animation) {
            this.animation_interval = setInterval(() => {
                this.rotate_deg += this.chartHelper?.animation_rotation_interval * (anti ? -1 : 1);
                this.nodes_group.attr('transform', `rotate(${this.rotate_deg}, 0, 0)`);
                this.links_group.attr('transform', `rotate(${this.rotate_deg}, 0, 0)`);
            }, this.chartHelper?.animation_rotation_speed);
        }
        else {
            this.animation_interval != undefined && clearInterval(this.animation_interval);
            this.animation_interval = undefined;
        }
    }
    map_children_data_to_head() {
        const data = this.chartHelper.data_to_d3_format();
        const root = this.hc_d3.hierarchy(data)
            .sort((a, b) => b.height - a.height || a.data.name.localeCompare(b.data.name));
        const radius = 540 * Math.sqrt(this.chartHelper.tree_data.length / 3);
        const treeLayout = this.hc_d3.cluster()
            .size([360, radius])
            .separation((a, b) => 50);
        treeLayout(root);
        const svgNode = this.hc_d3.create('svg');
        svgNode.attr('width', 580);
        svgNode.attr('height', 250);
        svgNode.attr('style', 'overflow: visible');
        const root_g = svgNode.append('g')
            .attr('transform', `translate(${svgNode.attr('width') / 2},${svgNode.attr('height') / 2})`);
        root_g.append('g')
            .attr('class', 'links');
        root_g.append('g')
            .attr('class', 'nodes');
        root.each((node) => {
            const chartHead = this.chartHelper?.makeHead(node.data, false, false);
            node['head'] = chartHead.node();
            node['color_set'] = this.chartHelper?.color_handler.getColor(node.data.id);
        });
        // draw nodes
        svgNode.select('g.nodes')
            .selectAll('svg.node')
            .data(root.descendants())
            .enter()
            .append((d) => {
            if (this.chartHelper?.chart_head_type != 'rounded' && this.chartHelper?.show_chart_head_border) {
                d.head.querySelector('rect').style.fill = "white";
                d.head.querySelector('rect').style.strokeWidth = "1";
            }
            return d.head;
        })
            .classed('node', true)
            .select('g')
            .attr("transform", (d) => `rotate(${d.x}, 0, 0) translate(0, ${-d.y})`);
        svgNode.select('g.nodes')
            .selectAll('circle.node')
            .data(root.descendants())
            .enter()
            .append('circle')
            .classed('node', true)
            .attr('cx', 0)
            .attr('cy', (d) => -d.y)
            .attr('r', 5)
            .attr("fill", (d) => d.color_set.color)
            .attr('stroke', (d) => d.color_set.gray)
            .attr('stroke-width', 1)
            .attr("transform", (d) => `rotate(${d.x}, 0, 0)`);
        const lineGen = this.hc_d3.lineRadial()
            .angle((d) => d.x * Math.PI / 180)
            .radius((d) => d.y);
        // draw links
        svgNode.select('g.links')
            .selectAll('path.link')
            .data(root.links())
            .enter()
            .append("path")
            .classed('link', true)
            .attr('stroke', (d) => d.target.color_set.gray)
            .attr('fill', "none")
            .attr('stroke-width', 1.5)
            .attr("d", (d) => lineGen([d.target, d.source]));
        this.nodes_group = svgNode.select('g.nodes');
        this.links_group = svgNode.select('g.links');
        this.head_child_wrapper?.append(svgNode.node());
    }
}
export default GoldenRodSpider;
