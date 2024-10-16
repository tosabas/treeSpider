import { IChartHead } from "../types/MainTypes.js";
import ChartMainHelper from "../helpers/chart-helper.js";
import { TBranchLineOrigin, TTreeClassParams, TTreeMapArr } from "../types/utils.js";
import HCElement from "../utils/st-element.js";

class HorizontalSpiderWalkTree {
    protected content_wrapper: HTMLElement | null = null;
    protected head_child_wrapper_center: HTMLElement | null = null;
    protected head_child_wrapper_1: HTMLElement | null = null;
    protected head_child_wrapper_2: HTMLElement | null = null;

    protected hcInnerContainer: HTMLElement | null = null;

    chartHelper: ChartMainHelper | undefined;

    tree_map_arr: Array<TTreeMapArr> = [];

    hc_d3: typeof globalThis.d3 = window.d3;

    current_scale = 1;

    constructor ({hcInnerContainer, chartHelper}: TTreeClassParams) {
        this.hcInnerContainer = hcInnerContainer;

        this.chartHelper = chartHelper;
        this.chartHelper.handleCollapseChildren = this.handleCollapseChildren.bind(this);

        setTimeout(() => {
            this.organizeUI()
        }, 0);
    }

    private organizeUI () {
        this.content_wrapper = this.chartHelper!.createDynamicEl();
        this.head_child_wrapper_center = this.chartHelper!.createDynamicEl();
        this.head_child_wrapper_1 = this.chartHelper!.createDynamicEl();
        this.head_child_wrapper_2 = this.chartHelper!.createDynamicEl();

        this.head_child_wrapper_center.className = "st-child-wrapper"
        this.head_child_wrapper_1.className = "st-child-wrapper"
        this.head_child_wrapper_2.className = "st-child-wrapper"

        this.content_wrapper.className = "st-hsw-content-wrapper";

        this.content_wrapper.appendChild(this.head_child_wrapper_1);
        this.content_wrapper.appendChild(this.head_child_wrapper_center);
        this.content_wrapper.appendChild(this.head_child_wrapper_2);

        this.hcInnerContainer?.append(this.content_wrapper);

        this.chartHelper!.set_tmp_tree_data()
        
        this.map_children_data_to_head();

        this.drawBranchLinkFresh();

        this.hc_d3!.timeout(() => {
            const first_svg_el = (this.hc_d3!.select('.st-root-el > svg')!.node() as SVGSVGElement)!.getBoundingClientRect();
            this.chartHelper?.center_elem(first_svg_el, "center")
        }, 0)

    }

    private map_children_data_to_head (parentSVGEl?: any, parentId?: string, provided_hierarchy?: IChartHead[]) {
        let hierarchies = this.chartHelper!.tmp_tree_data.filter(data => data.parentId == parentId);
        if (!provided_hierarchy) {
            hierarchies = this.chartHelper!.tmp_tree_data.filter(data => data.parentId == parentId);
        }else{
            hierarchies = provided_hierarchy
        }
        
        const childElContainer = this.chartHelper!.createDynamicEl();
        const isElParentRootEl = this.chartHelper!.getIsParentRootEl(parentId as string) && parentId != undefined;

        hierarchies.forEach(head => {
            const head_UI_wrapper = this.chartHelper!.createDynamicEl();
            const get_item_root_item = this.chartHelper!.get_second_ancestor_item(head.id)
            let second_ancestor_rel_pos = get_item_root_item == undefined ? 1 : this.chartHelper!.getElemRelPosInTree(get_item_root_item?.id as string)
            
            const head_UI = this.chartHelper!.makeHead(head as IChartHead, parentId == undefined, {parent: "right", children: second_ancestor_rel_pos % 2 == 0 ? "right" : 'left'});
            head_UI_wrapper.appendChild(head_UI?.node() as SVGSVGElement);
            const root_el_cls = parentId == undefined ? " st-root-el" : ""
            head_UI_wrapper.className = "hc-head-node-wrapper hc-w-id-" + head.id + root_el_cls;
            second_ancestor_rel_pos % 2 == 0 && head_UI_wrapper.classList.add("top")

            if (parentSVGEl === undefined) {
                this.head_child_wrapper_center?.appendChild(head_UI_wrapper);
            }else if (isElParentRootEl) {
                if (this.chartHelper!.getElemRelPosInTree(head.id as string) % 2 == 0) { // el position relative to root parent is even
                    this.head_child_wrapper_1?.appendChild(head_UI_wrapper);
                }else{
                    this.head_child_wrapper_2?.appendChild(head_UI_wrapper);
                }                
            }else{
                childElContainer!.appendChild(head_UI_wrapper);
                second_ancestor_rel_pos % 2 == 0 && childElContainer.classList.add("top");
            }
            
            parentSVGEl != undefined && this.tree_map_arr.push({
                id: head.id, 
                svgNode: parentSVGEl, 
                targetChild: head_UI?.node() as SVGSVGElement, 
                parentId: parentId as string,
                lineOrigin: second_ancestor_rel_pos % 2 == 0 ? "right" : "left"
            });

            if (this.chartHelper?.el_has_children(head.id)) {
                if (isElParentRootEl) {
                    if (this.chartHelper!.getElemRelPosInTree(head.id as string) % 2 == 0) { // el position relative to root parent is even
                        head_UI_wrapper.prepend(this.map_children_data_to_head(head_UI, head.id) as HCElement);
                    }else{
                        head_UI_wrapper.append(this.map_children_data_to_head(head_UI, head.id) as HCElement);
                    }                
                }else{
                    const map_children = this.map_children_data_to_head(head_UI, head.id) as HCElement;
                    second_ancestor_rel_pos % 2 == 0 ?  head_UI_wrapper!.prepend(map_children) : head_UI_wrapper!.appendChild(map_children);
                }
            }

        })

        childElContainer!.classList.add("child-container");
        return childElContainer;
    }

    private drawBranchLinkFresh () {
        document.querySelectorAll('.linker-line').forEach(el => el.remove());
        this.tree_map_arr.forEach(branch => this.drawBranchLink(branch.id, branch.svgNode, branch.targetChild as SVGSVGElement, branch.parentId, branch.lineOrigin));
    }

    private drawBranchLink (id: string, svgNode: any, targetChild: SVGSVGElement, parentId: string, lineOrigin: TBranchLineOrigin = "bottom") {
        const isParentChildrenHidden = this.hcInnerContainer?.querySelector('.hc-w-id-'+parentId)?.getAttribute('data-hc-head-children-hidden');
        if (isParentChildrenHidden === 'true') return;

        const ancestor_pos = this.chartHelper?.getIsParentRootEl(parentId)
        const extra_root_child_linker_cls = ancestor_pos ? parseInt(id) % 2 == 0 ? 'linker-1' : 'linker-0' : ''        

        const color_set = this.chartHelper?.color_handler.getColor(id as unknown as number);
        
        const elementBounds = targetChild.getBoundingClientRect();
        const svgSourceNodeBounds = svgNode.node().getBoundingClientRect();
        
        const st_linker_radius = Math.sqrt(Math.PI * this.chartHelper!.head_button_circle_radius * this.chartHelper!.head_button_circle_radius) / 2

        const lineStartX = lineOrigin == "right" ? (0 - st_linker_radius) : ((svgSourceNodeBounds.width + st_linker_radius) / this.current_scale);
        const lineStartY = (svgSourceNodeBounds.height / this.current_scale) / 2;

        const lineEndX = ((elementBounds.x + (lineOrigin == "right" ? elementBounds.width : 0)) / this.current_scale) - ((svgSourceNodeBounds.x) / this.current_scale) + 0
        const lineEndY = (((elementBounds.top + (elementBounds.height / 2)) / this.current_scale) - ((svgSourceNodeBounds.top) / this.current_scale))

        const link = this.hc_d3!.linkHorizontal();
        
        const data = [
            {source: [lineStartX, lineStartY], target: [lineEndX, lineEndY]},
        ];
        
        svgNode?.append('path')
        .data(data)
        .attr('d', link)
        .attr('fill', 'none')
        .attr('class', 'linker-line linker-' + lineOrigin)
        .attr('stroke-width', 1)
        .attr('stroke', color_set?.gray)
        .attr('style', 'z-index: -1');
    }

    private handleCollapseChildren (svgNode: any, id: string, clicked_pos: number) {
        const nodeParent = svgNode.node()?.parentElement;
        console.log("I'm here")
        console.log("nodeParentnodeParent", nodeParent);
        
        const isRootTreeEl = this.chartHelper!.getIsElRootTreeChild(id);
        const nodeChildrenHidden = nodeParent?.getAttribute('data-hc-head-children-hidden')

        if (isRootTreeEl) {
            return this.handleCollapseRootElChildren(svgNode, id, clicked_pos)
        }

        if (!nodeParent?.hasAttribute('data-hc-head-children-hidden') && nodeParent.querySelector('.child-container').innerHTML == '') {
            this.chartHelper!.set_tmp_tree_data(id)

            nodeParent.querySelector('.child-container').remove()
            
            const remade_children_obj = this.map_children_data_to_head(svgNode, id);
            const get_item_root_item = this.chartHelper!.get_second_ancestor_item(id)
            let second_ancestor_rel_pos = get_item_root_item == undefined ? 1 : this.chartHelper!.getElemRelPosInTree(get_item_root_item?.id as string)
            if (second_ancestor_rel_pos % 2 == 0) {
                nodeParent?.prepend(remade_children_obj);
            }else{
                nodeParent?.appendChild(remade_children_obj);
            }

            nodeParent?.setAttribute('data-hc-head-children-hidden', 'false');            

            setTimeout(() => {
                this.drawBranchLinkFresh();
            }, 0);
            
        }else if (nodeChildrenHidden == 'true') {

            nodeParent.querySelector('.child-container').style.visibility = ''

            nodeParent?.setAttribute('data-hc-head-children-hidden', 'false');            

            this.drawBranchLinkFresh();
        }else{
            // const childrenContainer = nodeParent?.querySelector('.child-container');
            // childrenContainer?.remove();
            // this.removeNodeRecursiveFromTreeMap(id)
            nodeParent?.setAttribute('data-hc-head-children-hidden', 'true')

            nodeParent?.querySelectorAll('.linker-line').forEach((line: SVGPathElement) => line.remove());
            nodeParent.querySelector('.child-container').style.visibility = 'hidden'

            console.log("nodeParent.querySelector('.child-container')", nodeParent.querySelector('.child-container'));
            
        }

        // setTimeout(() => {
        //     this.drawBranchLinkFresh();
        // }, 0);
    }

    private removeNodeRecursiveFromTreeMap (node_id: string, inclusive?: boolean) {
        const find_node_children = this.tree_map_arr.filter(tree => tree.parentId == node_id);
        find_node_children.forEach(child => {
            this.tree_map_arr.splice(this.tree_map_arr.findIndex(tree => tree.id == child.id), 1);
            this.tree_map_arr.filter(tree => tree.id == child.id).length > 0 && this.removeNodeRecursiveFromTreeMap(child.id);
        });
        if (inclusive) {
            this.tree_map_arr.splice(this.tree_map_arr.findIndex(tree => tree.id == node_id), 1);
        }
    }

    private handleCollapseRootElChildren (svgNode: any, id: string, clicked_pos: number) {
        const nodeParent = svgNode.node()?.parentElement;
        const nodeTopChildrenHidden = nodeParent?.getAttribute('data-hc-top-head-children-hidden')
        const nodeBottomChildrenHidden = nodeParent?.getAttribute('data-hc-bottom-head-children-hidden')

        let immediate_root_children = [] as any[];
        if (clicked_pos == 0) {
            immediate_root_children = this.chartHelper!.tree_data.filter(data => data.parentId == id && this.chartHelper!.getElemRelPosInTree(data.id as string) % 2 == 0);
        }else{
            immediate_root_children = this.chartHelper!.tree_data.filter(data => data.parentId == id && this.chartHelper!.getElemRelPosInTree(data.id as string) % 2 != 0);
        }

        if (((!nodeTopChildrenHidden || nodeTopChildrenHidden == "false") && clicked_pos == 0) || ((!nodeBottomChildrenHidden || nodeBottomChildrenHidden == "false") && clicked_pos != 0)) {
            // immediate_root_children.forEach(child => {
            //     const childNodeContainer = this.hcInnerContainer?.querySelector('.hc-w-id-'+child.id) as any;
            //     const childrenContainer = childNodeContainer?.querySelector('.child-container') as HTMLElement;
            //     // childrenContainer?.remove();
            //     // this.removeNodeRecursiveFromTreeMap(child.id, true);
            //     // childNodeContainer?.remove();
            //     childrenContainer.style.visibility = 'hidden'
            //     childNodeContainer!.querySelectorAll('.linker-line').forEach((line: SVGPathElement) => line.remove());
            // });

            // immediate_root_children[0].parentElement.style.visibility = 'visible'

            console.log("in here 001", clicked_pos);
            
            
            const section = clicked_pos == 0 ? nodeParent.parentElement.previousElementSibling : nodeParent.parentElement.nextElementSibling
            section.style.visibility = 'hidden'
            console.log("sectionsection",section);
            
            section.querySelectorAll('.linker-line').forEach((line: SVGPathElement) => line.remove());
            nodeParent.querySelectorAll('.linker-'+(clicked_pos == 0 ? 'left' : 'right')).forEach((node: SVGSVGElement) => node.remove())


            clicked_pos == 0 ? nodeParent?.setAttribute('data-hc-top-head-children-hidden', 'true') :
            nodeParent?.setAttribute('data-hc-bottom-head-children-hidden', 'true')
        }else{
            // this.map_children_data_to_head(svgNode, id, immediate_root_children);

            console.log("immediate_root_children", immediate_root_children);
            console.log("in here 002");
            
            
            const section = clicked_pos == 0 ? nodeParent.parentElement.previousElementSibling : nodeParent.parentElement.nextElementSibling
            section.style.visibility = 'visible'
            
            setTimeout(() => {
                this.drawBranchLinkFresh();                
            }, 0);
            clicked_pos == 0 ? nodeParent?.setAttribute('data-hc-top-head-children-hidden', 'false') :
            nodeParent?.setAttribute('data-hc-bottom-head-children-hidden', 'false')
        }
        // this.drawBranchLinkFresh();
    }


}

export default HorizontalSpiderWalkTree;