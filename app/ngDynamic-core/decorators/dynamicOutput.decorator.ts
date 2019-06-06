import {Subject} from "rxjs";

/**
 * Creates dynamic output for property
 */
export function DynamicOutput(): PropertyDecorator
{
    return function(target: any, propertyKey: string)
    {
        Object.defineProperty(target,
                              `${propertyKey}Change`,
                              {
                                  get: function()
                                  {
                                      if(!this[`ɵ${propertyKey}Change`])
                                      {
                                          this[`ɵ${propertyKey}Change`] = new Subject<void>();
                                      }

                                      return this[`ɵ${propertyKey}Change`];
                                  }
                              });

        Object.defineProperty(target,
                              propertyKey,
                              {
                                  get: function()
                                  {
                                      return this[`ɵ${propertyKey}`];
                                  },
                                  set: function(value:any)
                                  {
                                      this[`ɵ${propertyKey}`] = value;
                                      this[`${propertyKey}Change`].next();
                                  }
                              });
    };
}