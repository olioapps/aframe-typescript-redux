# AFrame & Redux - What This Is

At [Olio Apps](http://www.olioapps.com/), we are applying software engineering idioms from React and React Native development ecosystems to WebVR development.  

This project is our effort to make a development platform that can be used to create aframe components and subclasses which makes it easy to connect your VR components to a redux store, for these reasons:

- to facilitate the use of data driven logic.
- to be able to manage state the same way as other front end javascript/redux applications, and also to be able to think about the components in a familiar React-esque way.
- to facililate easier onboarding for new and more experienced developers for rapid development and component creation.

We will be discussing the [complete example](examples/connected_component.html) below. You can also play with a live example in action at [https://codesandbox.io/s/o71qm45xy](https://codesandbox.io/s/o71qm45xy).

[![Foo](./docs/preview.png)](https://codesandbox.io/s/o71qm45xy)

## OVERVIEW OF CONNECTING AN AFRAME COMPONENT TO A REDUX STORE

To summarize, we will be doing the following:

1. defining a `Redux Store`
2. instantiating `ReduxConnectedSystem` and connecting it to this redux store
3. creating an AFrame entity that is redux-connected
4. defining `my-component` and adding listeners for redux store changes
5. defining an `onClick` function in order to dispatch a redux action

## 1. Define a Redux Store

Defining a simple redux store involves at least 3 main pieces:

- the shape of the store,
- the root reducer,
- any action(s) for altering the store.

After these three pieces are in place, the store itself can be created.

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

// finally, create the store with the root reducer
const store = Redux.createStore(reducer)
```

In the example above, dispatching the `doAdd` action will increment the store's `count` it holds by one:

```javascript
console.log(store.getState()) // { count: 1 }

store.dispatch(doAdd()) // dispatch doAdd to the store

console.log(store.getState()) // { count: 2 }
```

See [Redux documentation](https://redux.js.org/basics/actions) for more details.

## 2. Instantiate `ReduxConnectedSystem` and Connect It To The Redux Store

```javascript
// create a new instance of AframeRedux.ReduxConnectedSystem,
// pass in the just created store, then register it
const system = new AframeRedux.ReduxConnectedSystem(store).register()
```

Instantiating a `ReduxConnectedSystem` and supplying your redux store will cause store changes to be forwarded to entities bound to the `redux-connected` component.

## 3. Create a `redux-connected` AFrame Entity

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
    init: function() {
        this.el.addEventListener("count", function(event) {
            const score = event.detail.newState
            this.setAttribute("value", score)
        })
    }
})
```

In the `init` function, AFRAME creates an instance of `my-component` and attaches it to the entity. At this point we can attach a listener to the element (`this.el`) to listen for events called `count`, which will be forwarded by `ReduxConnectedSystem` to the event handler whenever the `count` property in state changes.  

Alternatively, the watched redux store property could have been specified using the `watchedKeys` property on the entity component:

```html
<a-text my-component redux-connected="watchedKeys: count"
...
```

When `watchedKeys` is used, the event listened to by the target component (`my-component` in these examples) is assumed to have the same name as the watched redux property. Multiple redux store keys/events can be specified, eg. `watchedKey: prop1,prop2,prop3`.

## 5. Define `onClick` to dispatch actions

The button click handler dispatches `doAdd` to the store when it is clicked, causing the store to change state, and in turn `ReduxConnectedSystem` notifies any entities listening to changes to the `count` property.

```javascript
// define click handler
const onClick = () => {
    store.dispatch(doAdd())
}
```

We defined a simple button outside of the scene to hold the click handler. When the button is clicked, the `a-text` entity within the scene increments itself.

```html
// create an html button holding the new onClick function
<a onclick="javascript:onClick()" id="clickMe" href="#">Click Me</a>
```
<img src="./assets/counter-example.gif" />

## Sequence diagram

Pictured below are the sequence of events that lead from a user action (button click) to affecting the AFrame scene via redux action dispatch through `ReduxConnectedSystem`.

![alt text](./docs/flow.png)

```
User -> Button: click
Button -> Store: dispatch doAdd
Store -> Store: increment count by 1
Store -> ReduxConnectedSystem: notify that `count` has changed in the store
ReduxConnectedSystem -> my-component: emit `count` event
my-component -> my-component: update text value in the scene
```
