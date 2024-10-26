import TSElement from "../utils/ts-element";
import { IChartHead } from "./MainTypes";
import ChartMainHelper from "../helpers/chart-helper";
export type TTreeMapArr = {
    svgNode: any;
    targetChild: SVGSVGElement;
    parentId: string;
    id: string;
    lineOrigin?: TBranchLineOrigin;
};
export type TChildrenMapperReturnEl = TSElement;
export type TSingleChildrenMap = {
    child_el: TSElement;
    children_map_arr: TTreeMapArr[];
};
export type TTreeClassParams = {
    tree_data: Array<IChartHead>;
    tsInnerContainer: HTMLElement;
    chartHelper: ChartMainHelper;
};
export type THeadPointPosition = "top" | "bottom" | "left" | "right";
export type TChartHeadPointPosition = {
    parent: THeadPointPosition;
    children: THeadPointPosition;
} | false;
export type TColorSet = {
    color: string;
    brighter: string;
    darker: string;
    bright100: string;
    dark100: string;
    bright500: string;
    gray: string;
    gray85: string;
};
export type TTreeToItemHierarchy = Array<{
    level: number;
    items: Array<IChartHead>;
}>;
export type TBranchLineOrigin = "top" | "bottom" | "left" | "right";
export type TElementCenterPositions = 'center' | 'top' | 'bottom' | 'right' | 'left';
export type TLinkerCircleColor = 'brighter' | 'bright500' | 'bright100';
export type TLinkerShape = 'symbolAsterisk' | 'symbolCircle' | 'symbolCross' | 'symbolDiamond' | 'symbolDiamond2' | 'symbolPlus' | 'symbolSquare' | 'symbolSquare2' | 'symbolStar' | 'symbolTriangle' | 'symbolTriangle2' | 'symbolWye' | 'symbolX';
export type THeadImageShape = 'symbolCircle' | 'symbolCross' | 'symbolDiamond' | 'symbolDiamond2' | 'symbolSquare' | 'symbolSquare2' | 'symbolStar' | 'symbolTriangle' | 'symbolTriangle2' | 'symbolWye';
export type TEventType = 'chart_head.create' | 'chart_head.expanded' | 'chart_head.collapsed' | 'zooming' | 'library.init';
