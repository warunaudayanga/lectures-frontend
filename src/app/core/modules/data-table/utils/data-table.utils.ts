export const getDimensions = (element: HTMLElement): { width: number; height: number } => {
    const computedStyle = getComputedStyle(element);
    let height = element.clientHeight; // height with padding
    let width = element.clientWidth; // width with padding
    height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
    width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
    return { width, height };
};
