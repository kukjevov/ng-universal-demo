import {Component} from "@angular/core";

//TODO prehodit vsetku logiku droppable sem, pridat output na drop

@Component(
    {
        selector: 'drop-area',
        templateUrl: 'dropArea.component.html',
        host:
        {
            '[style.display]': '"block"',
            '[class]': '"drop-area"'
        }
    }
)
export class DropAreaComponent
{

}