# AFrame Redux bindings

At [Olio Apps](http://www.olioapps.com/), we are applying software engineering idioms from React and React Native development ecosystem to WebVR development.

This a collection of aframe components and subclasses which makes it easy to connect your VR components to a redux store. 

# Connect any aframe component to redux

We will be discussing the [complete example](examples/connected_component.html) below.


## 1. Define a redux store

Defining a simple redux store involves at least 3 main pieces -- the shape of the store, the root reducer, and any actions for altering the store:

```javascript
// define shape of store
const initialState = {
    count: 1
}

// define actions
const doAdd = () => ({ type: "DO_ADD" })

// define root reducer 
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "DO_ADD":
            return { count: state.count + 1 }
        default:
            return state
    }
}

// create the store with the root reducer
const store = Redux.createStore(reducer)
```

In the example above, dispatching `doAdd` action will increment the `count` it holds by one:

```javascript
console.log(store.getState())
// ^ produces { count: 1 }

// dispatch doAdd to the store
store.dispatch(doAdd())

console.log(store.getState())
// ^ produces { count: 2 }
```

See [Redux documentation](https://redux.js.org/basics/actions) for more details

## 2. Instantiate `ReduxConnectedSystem` and connect it to your store

```javascript
const system = new AframeRedux.ReduxConnectedSystem(store).register()
```

Instantiating a `ReduxConnectedSystem` and supplying your redux store will cause store changes to be forwarded to entities bound to the `redux-connected` component.

## 3. Create an aframe entity that is redux-connected

Below is the html to create an aframe `a-text` entity which is given a component `my-component`, and is also redux connected via `redux-connected`:

```html
<a-text my-component redux-connected="count: count" 
    color="black"
    position="0 2 -5">
</a-text>
```

Defining `redux-connected="count: count"` causes the entity to be notified of changes to the `count` property in the store, via an event of the name `count`.

## 4. Define `my-component` and add listeners for store changes

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

In the `init` function, AFrame will create an instance of `my-component` and attach it to the entity. At this point we can attach a listener to the element to listen for events called `count`, which will be forwarded by `ReduxConnectedSystem` to the event handler whenever the `count` property in state changes.

## 4. Define `onClick` to dispatch actions

The button click handler dispatches `doAdd` to the store when it is clicked, causing the store to change state, and in turn `ReduxConnectedSystem` notifies any entities listening to changes to the `count` property. 

```javascript
// click handler 
const onClick = () => {
    store.dispatch(doAdd())
}
```
We defined a simple button outside of the scene to hold the click handler. When the button is clicked, you will notice the `a-text` entity within the scene increment.
```html
<a onclick="javascript:onClick()" id="clickMe" href="#">Click Me</a>
```
<img src="./assets/counter-example.gif"/>