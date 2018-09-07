# AFrame Redux bindings

We at Olio Apps (http://www.olioapps.com/) are applying software development idioms from React and React Native development ecosystem to WebVR development.

This a collection of aframe components and subclasses which makes it easy to integrate your components with a redux store. 

# Connect any aframe component to redux

We will be discussing the [complete example](examples/connected_component.html) below.


## 1. Define a redux store

Defining a simple redux store involves at least 3 main pieces -- the shape of the store, the root reducer, and any mutator actions. We accomplish this below:

```javascript
// define shape of store
const initialState = {
    count: 1
}

// define mutator actions
const doAdd = () => ({ type: "DO_ADD" })

// create the store with a root reducer
const store = Redux.createStore(
    (state = initialState, action) => {
    switch (action.type) {
        case "DO_ADD":
            return { count: state.count + 1 }
        default:
            return state
    }
})
```

In the example above, dispatching `doAdd` action to the store will increment the `count` it holds by one:

```javascript
console.log(store.getState())
// ^ produces { count: 1 }

// dispatch doAdd to the store
store.dispatch(doAdd())

console.log(store.getState())
// ^ produces { count: 2 }
```

## 2. Instantiate `ReduxConnectedSystem` and connect it to your store

```javascript
const system = new AframeRedux.ReduxConnectedSystem(store).register()
```

Registering this AFrame system will cause `ReduxConnectedSystem` to forward state changes to any entities bound to the `redux-connected` comopnent as shown below.

## 2. Create an aframe entity that is redux-connected

Below is the html to create an aframe `a-text` entity which is given a component `my-component`, and is also redux connected via the compnent `redux-connected`:

```html
<a-text my-component redux-connected="count: count" 
    color="black"
    position="0 2 -5">
</a-text>
```

By defining `redux-connected="count: count"` the entity will receive changes to the property `count` in the redux store via an event of the name `count`.

## 3. Define `my-component` and add listeners for store changes

The component `my-component` is defined as follows:

```javascript
AFRAME.registerComponent("my-component", {
    init: function () {
        this.el.addEventListener("count", function (event) {
            const score = event.detail.newState
            this.setAttribute("value", score)
        })
    }
})
```

In the `init` function, AFrame will create an instance of `my-component` and attach it to the entity. We at this point can attach a listener to the element to listen for events called `count`, which will be forwarded by `ReduxConnectedSystem` to the event handler whenever the `count` property in state changes.

The button clickhandler dispatches `doAdd` to the store when its clicked, causing the store to change state, and in turn `ReduxConnectedSystem` notifies any entities listening to changes to the `count` property. 

```javascript
const dispatchAdd = () => {
    store.dispatch(doAdd())
}
```