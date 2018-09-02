import { Store } from "redux";
export default class StoreAware<PROPS = {}> {
    protected localProps: PROPS;
    protected store: Store;
    constructor(store: Store, props?: PROPS);
    componentShouldUpdate(props: PROPS, nextProps: PROPS): boolean;
    componentWillReceiveProps(props: PROPS, nextProps: PROPS): void;
}
