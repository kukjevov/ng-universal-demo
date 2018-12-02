import {SvgNodeDynamicNode} from "../../ngDynamic-designer";
import {SvgNode} from "../../ngDynamic-designer/components/nodeDesigner/misc";

/**
 * Implementation of custom SVG node for script
 */
export class ScriptSvgNode extends SvgNode implements SvgNodeDynamicNode
{
    //######################### protected methods #########################

    /**
     * Renders misc visuals
     */
    protected _renderVisuals()
    {
        super._renderVisuals();
        let currentHeight = this._getHeight();

        this._miscGroup.append("rect")
                .attr('x', 45)
                .attr('y', currentHeight - 25)
                .attr('width', 75)
                .attr('height', 20)
                .attr('fill', '#569cd6')
                .attr('rx', 6)
                .attr('ry', 6)
                .attr('style', "cursor: pointer;")
            .on('click', () =>
            {
                console.log('click');
            });

        this._miscGroup.append('text')
            .text('Show code')
                .attr('x', 50)
                .attr('y', currentHeight - 11)
                .attr('fill', '#F8F8F8')
                .attr('style', "cursor: pointer;");
    }
}