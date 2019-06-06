export interface DropEvent
{
    dropArea: DropArea,
    dragEvent: DragEvent
}

export enum DropArea
{
    TOP,
    RIGHT,
    BOTTOM,
    LEFT
}