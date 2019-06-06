import {ScriptNodeInterface} from "./script.interface";

const scriptNodeTemplates = [];

scriptNodeTemplates[ScriptNodeInterface.Transform] =
`import {TransformScript} from '@ngDynamic/scriptNode/transform';

/**
 * Class that implements transform script code
 */
export class TransformClass implements TransformScript
{
    /**
     * Method that transforms value into any requested value
     * @param value Value to be transformed
     */
    public transform(value: any): any
    {
        return value;
    }
}`;

scriptNodeTemplates[ScriptNodeInterface.ResponseTransform] =
`import {ResponseTransformScript} from '@ngDynamic/scriptNode/responseTransform';
import {Observable} from "rxjs";

/**
 * Class that implements response transform script code
 */
export class ResponseTransformClass implements ResponseTransformScript
{
    /**
     * Method that transforms value into any requested value
     * @param value Value to be transformed
     */
    public responseTransform(response: Observable<any>): Observable<any>
    {
        return response;
    }
}`;

export {scriptNodeTemplates};