class RadialSpiderLeg {
    content_wrapper = null;
    head_child_wrapper = null;
    hcInnerContainer = null;
    chartHelper;
    hc_d3 = window.d3;
    current_scale = 1;
    root_svg = undefined;
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
        this.head_child_wrapper.className = "st-child-wrapper";
        this.content_wrapper.className = "st-grs-content-wrapper";
        this.content_wrapper.appendChild(this.head_child_wrapper);
        this.hcInnerContainer?.append(this.content_wrapper);
        this.map_children_data_to_head();
        this.hc_d3.timeout(() => {
            const first_svg_el = this.hc_d3.select('.main-svg-el').node().getBoundingClientRect();
            this.chartHelper?.center_elem(first_svg_el, "center");
        }, 0);
    }
    animate_chat() {
        this.root_svg.attr('style', `transition: transform .3s linear`);
        this.animation_interval = setInterval(() => {
            this.rotate_deg += 1;
            this.root_svg.attr('transform', `rotate(${this.rotate_deg}, 0, 0)`);
        }, 50);
    }
    map_children_data_to_head() {
        const data = this.chartHelper.data_to_d3_format();
        const root = this.hc_d3.hierarchy(data)
            .sort((a, b) => b.height - a.height || a.data.name.localeCompare(b.data.name));
        const radius = 540 * Math.sqrt(this.chartHelper.tree_data.length / 3);
        const width = radius * 2;
        const height = radius * 2;
        const marginLeft = 110;
        const marginTop = 110;
        root.each((node) => {
            const chartHead = this.chartHelper?.makeHead(node.data, false, false);
            node['head'] = chartHead.node();
            node['color_set'] = this.chartHelper?.color_handler.getColor(node.data.id);
        });
        const tree = this.hc_d3.tree;
        const strokeWidth = 1.5; // stroke width for links
        const strokeOpacity = 1; // stroke opacity for links
        // const separation = (a: any, b: any) => ((a.parent == b.parent ? 1 : 2) / a.depth) * 1200;
        const separation = (a, b) => 100;
        // Compute the layout.
        tree().size([2 * Math.PI, radius]).separation(separation)(root);
        const svg = this.hc_d3.create("svg")
            .attr("viewBox", [-marginLeft - radius, -marginTop - radius, width, height])
            .attr("width", width)
            .attr("height", height)
            .attr("style", "background-color: none; max-width: 100%; height: auto;  overflow: visible;");
        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", this.chartHelper?.color_handler.get_app_gray())
            .attr("stroke-opacity", strokeOpacity)
            .attr("stroke-width", strokeWidth)
            .selectAll("path")
            .data(root.links())
            .join("path")
            .attr("d", this.hc_d3.linkRadial()
            .angle((d) => d.x)
            .radius((d) => d.y));
        const mainNode = svg.append("g")
            .attr("fill", "blue")
            .selectAll("g")
            .data(root.descendants())
            .join("g")
            .attr("transform", (d) => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);
        const r = 3;
        mainNode.append("circle")
            .attr("fill", (d) => d.color_set.color)
            .attr("r", r);
        mainNode.append((d) => {
            d.head.querySelector('rect').style.fill = "white";
            d.head.querySelector('rect').style.strokeWidth = "1";
            return d.head;
        });
        mainNode.append("title")
            .text(d => d.data.name + " - " + d.data.role);
        this.root_svg = svg.node();
        this.head_child_wrapper?.append(svg.node());
    }
}
export default RadialSpiderLeg;
