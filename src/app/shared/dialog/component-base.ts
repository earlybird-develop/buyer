import {
  ComponentFactoryResolver,
  ComponentRef,
  ReflectiveInjector,
  Type,
  ViewContainerRef
} from '@angular/core';
import { ResolvedReflectiveProvider } from '@angular/core/src/di/reflective_provider';

export class ComponentBase {
  protected container: ComponentRef<any>;
  protected rootViewContainerRef: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  public _show<T>(
    component: Type<T>,
    providers: ResolvedReflectiveProvider[] = [])
  : void {

    if (!this.container) {
      const childComponent =
        this.componentFactoryResolver.resolveComponentFactory(component);

      const childInjector = ReflectiveInjector.fromResolvedProviders(
        providers,
        this.rootViewContainerRef.parentInjector
      );

      this.container =
        this.rootViewContainerRef
          .createComponent(
            childComponent,
            this.rootViewContainerRef.length,
            childInjector
          );
    }
  }

  public setRootViewContainerRef(vRef: ViewContainerRef) {
    this.rootViewContainerRef = vRef;
  }

  public dispose(): void {
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }
  }
}
