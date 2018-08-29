import { Store } from "redux";
export default class StoreAware<S, P> {
    protected localProps: P;
    protected store: Store;
    constructor(store: Store, props?: P);
    componentShouldUpdate(props: P, nextProps: P): boolean;
    componentWillReceiveProps(props: P, nextProps: P): void;
    render(): void;
}
