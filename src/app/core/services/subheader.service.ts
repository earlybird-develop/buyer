import {
  ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type,
  ViewContainerRef
} from '@angular/core';


@Injectable()
export class SubheaderService {
  private _rootViewContainerRef: ViewContainerRef;
  private _currentComponent: any;
  public container: ComponentRef<any>;

  constructor(private _cfr: ComponentFactoryResolver) { }

  public show<T>(component: Type<T>, providers = []): any {
    // console.log(component);
    if (this._currentComponent === component) {
      return this.container;
    }

    if (this.container) {
      this.dispose();
    }

    const childComponent = this._cfr.resolveComponentFactory(component);

    const childInjector = Injector.create({
      providers: providers,
      parent: this._rootViewContainerRef.parentInjector
    });

    this.container = this._rootViewContainerRef.createComponent<T>(
      childComponent,
      this._rootViewContainerRef.length,
      childInjector
    );

    this._currentComponent = component;
    return this.container.instance;
  }

  public setRootViewContainerRef(vRef: ViewContainerRef) {
    this._rootViewContainerRef = vRef;
  }

  public dispose(): void {
    if (this.container) {
      this.container.destroy();
      this.container = null;
      this._currentComponent = null;
    }
  }



}
