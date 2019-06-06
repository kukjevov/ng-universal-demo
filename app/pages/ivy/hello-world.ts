import {Component, ChangeDetectionStrategy, ViewContainerRef, ComponentFactoryResolver, ɵNgModuleFactory as NgModuleFactory, Injector} from '@angular/core'
import {SelectModule} from './sel/select.module';


@Component({
  selector: 'hello-world',
  template: `
    <div>
      <a routerLink="/">default</a>&nbsp;
      <a routerLink="/static">static</a>&nbsp;
      <a routerLink="/lazy">lazy</a>
    </div>
    <div style="font-weight: bold;">
      <div>routed</div>
      <router-outlet></router-outlet>
    </div>
    <div *ngIf="cond">toto je div</div>
    <button (click)="cond = !cond">click</button>
    <h3>Hello {{name}}</h3>
    <button (click)="loadComponent()">load</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelloWorld {
  name = 'World!'
  cond: boolean = true;
  constructor(private _viewContainer: ViewContainerRef,
              private _componentFactoryResolver: ComponentFactoryResolver,
              private _injector: Injector)
  {
  }  

  async loadComponent()
  {
    let {LazyComponent} = await import('./lazy.component');
    let factory = this._componentFactoryResolver.resolveComponentFactory(LazyComponent);
    this._viewContainer.createComponent(factory);

    let {Lazy2Component} = await import('./lazy2.component');
    let factory2 = this._componentFactoryResolver.resolveComponentFactory(Lazy2Component);
    this._viewContainer.createComponent(factory2);

    var fac = new NgModuleFactory(SelectModule);
    
    let {SelectComponent} = await import('./sel/select.component');
    
    //with module providers
    let factoryselect = fac.create(this._injector).componentFactoryResolver.resolveComponentFactory(SelectComponent);

    //no module providers
    // let factoryselect = this._componentFactoryResolver.resolveComponentFactory(SelectComponent);
    this._viewContainer.createComponent(factoryselect);
  }
}