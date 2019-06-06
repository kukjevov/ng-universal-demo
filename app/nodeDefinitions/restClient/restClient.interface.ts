/**
 * Available types of RestClient params
 */
export enum RestClientParamType
{
    /**
     * Parameters will be used as QueryString
     */
    Query,

    /**
     * Parameter will be used as part of request Path
     */
    Path,

    /**
     * Parameter will be used as http body
     */
    Body,

    /**
     * Parameter properties will be used as QueryString after serialization
     */
    QueryObject
}

/**
 * Available types of RestClient http methods
 */
export enum RestClientMethodType
{
    /**
     * Http GET method
     */
    GET,

    /**
     * Http POST method
     */
    POST,

    /**
     * Http DELETE method
     */
    DELETE
}

/**
 * Represents single definition of parameter for rest service
 */
export interface RestClientNodeParameter
{
    /**
     * Name of input property bound to this parameter
     */
    inputName: string;

    /**
     * Type of parameter
     */
    type: RestClientParamType;

    /**
     * Name of parameter bound http
     */
    name?: string;
}

/**
 * Represents single definition of parameter for service with value
 */
export interface RestClientNodeParameterValue extends RestClientNodeParameter
{
    /**
     * Value assigned to this rest parameter
     */
    value?: any;
}

/**
 * Options for RestClientNode
 */
export interface RestClientNodeOptions
{
    /**
     * Array of parameters that can be filled with values
     */
    parameters: RestClientNodeParameter[];

    /**
     * Name of http method used for this request
     */
    method?: RestClientMethodType;

    /**
     * Url to be called by this rest
     */
    url?: string;
}