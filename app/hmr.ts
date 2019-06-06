import {PlatformRef} from "@angular/core";

export function hmrAccept(platformGet: () => PlatformRef, rootComponentSelector: string = 'app')
{
    // Enable Hot Module Reloading if available
    if (aceDevMode && module['hot'])
    {
        module['hot'].accept();

        module['hot'].dispose(() =>
        {
            platformGet().destroy();

            if(!document.querySelector(rootComponentSelector))
            {
                document.body.append(document.createElement(rootComponentSelector));
            }

            if((<any>window).___hmrDataGetters)
            {
                let getters = (<any>window).___hmrDataGetters;
                let data = (<any>window).___hmrData = {};
            
                Object.keys(getters).forEach((hmrKey: string) =>
                {
                    data[hmrKey] = getters[hmrKey]();
                });
            }
        });
    }
}

export function hmrFinishedNotification()
{
    if (aceDevMode && module['hot'])
    {
        let div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.zIndex = '54345';
        div.style.background = 'rgb(255, 255, 255) none repeat scroll 0% 0%';
        div.style.padding = '8px';
        div.style.fontWeight = 'bold';
        div.style.borderRadius = 'bold';
        div.style.color = 'rgb(21, 57, 255)';
        div.style.left = '47%';
        div.style.top = '11px';
        div.style.boxShadow = '0px 0px 4px rgb(170, 170, 170)';
        div.style.transition = 'all 500ms';
        div.style.opacity = '0';

        div.id = 'hmrdiv';
        div.innerText = "HMR finished, app updated!";

        document.body.append(div);

        setTimeout(() => div.style.opacity = '1', 50);

        setTimeout(() =>
        {
            if(div)
            {
                div.style.opacity = '0';

                setTimeout(() =>
                {
                    div.remove();
                    div = null;
                }, 500);
            }
        }, 2000);
    }
}