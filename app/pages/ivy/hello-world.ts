import {Component, ChangeDetectionStrategy, ViewContainerRef, ComponentFactoryResolver, ɵNgModuleFactory as NgModuleFactory, Injector, StaticProvider} from '@angular/core'
import {SelectModule} from './sel/select.module';
import {Test} from './provider';

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
    var extended = Injector.create(
    [
      <StaticProvider>
      {
        provide: Test,
        useClass: Test,
        deps: []
      }
    ], this._injector);

    let {LazyComponent} = await import('./lazy.component');
    let factory = this._componentFactoryResolver.resolveComponentFactory(LazyComponent);
    this._viewContainer.createComponent(factory, null, extended);

    let {Lazy2Component} = await import('./lazy2.component');
    let factory2 = extended.get(ComponentFactoryResolver).resolveComponentFactory(Lazy2Component);
    this._viewContainer.createComponent(factory2);

    var fac = new NgModuleFactory(SelectModule);
    
    let {SelectComponent} = await import('./sel/select.component');
    
    //with module providers
    let factoryselect = fac.create(extended).componentFactoryResolver.resolveComponentFactory(SelectComponent);

    //no module providers
    // let factoryselect = this._componentFactoryResolver.resolveComponentFactory(SelectComponent);
    this._viewContainer.createComponent(factoryselect);
  }
}