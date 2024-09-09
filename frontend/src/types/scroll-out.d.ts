declare module "scroll-out" {
  interface ScrollOutOptions {
    cssProps?: Record<string, boolean>;
    [key: string]: any;
  }

  interface ScrollOut {
    on(name: string, callback: (element: Element, ctx: any) => void): void;
    trigger(name: string, data: any): void;
  }

  function ScrollOut(options?: ScrollOutOptions): ScrollOut;

  export = ScrollOut;
}
