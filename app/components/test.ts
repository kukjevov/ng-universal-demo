import {Component, ChangeDetectionStrategy, Input, ContentChild, TemplateRef} from '@angular/core';

@Component(
{
    selector: 'test',
    template: '<ng-container *ngTemplateOutlet="template"></ng-container>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestWrapper
{
    @ContentChild(TemplateRef)
    public template: TemplateRef<any>;
}

@Component(
{
    selector: 'test-content',
    template: 'data: "{{data}}"',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestContent
{
    @Input()
    public data: string;
}