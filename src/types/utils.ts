import HCElement from "src/utils/st-element";
import { IChartHead } from "./MainTypes";

export type TD3 = typeof globalThis.d3

export type TTreeMapArr = {
    svgNode: any; 
    targetChild: HTMLElement; 
    parentId: string;
    id: string;
    lineOrigin?: TBranchLineOrigin;
}

export type TChildrenMapperReturnEl = HCElement;

export type TSingleChildrenMap = {
    child_el: HCElement;
    children_map_arr: TTreeMapArr[];
};

export type TTreeClassParams = {
    tree_data: Array<IChartHead>; 
    hcInnerContainer: HTMLElement;
}

export type TChartHeadPointPosition = "top" | "bottom"

export type TTreeToItemHierarchy = Array<{level: number, items: Array<IChartHead>}>;

export type TBranchLineOrigin = "top" | "bottom" | "left" | "right"