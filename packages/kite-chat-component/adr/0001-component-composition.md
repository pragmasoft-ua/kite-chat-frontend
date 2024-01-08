# 1. Move on from Shared Web Workers to Main Thread for WebSocket Management using BroadcastChannel

Date: 2023-11-22

## Status

Accepted

## Context

The KiteChat component, originally designed as an embeddable live chat, has undergone changes and received new features over time. The addition of these features has introduced code complexity, impacting readability. This has raised concerns about maintainability and the ease of understanding the codebase.

## Facing

The previous component implementation as single custom component hinders code readability as well as single responsibility principle.

## Decision

To enhance modularity, maintainability, and reusability, the decision has been made to adopt a component composition approach by exposing custom components and mixins.

## Alternatives Considered

1. **Single Component Approach**
   - *Pros:*
     - Simplifies the structure with a single component.
   - *Cons:*
     - Reduced modularity.
     - Increased difficulty in maintaining and extending the codebase.

2. **Shadow DOM**
   - *Pros:*
     - Provides encapsulation for components.
   - *Cons:*
     - May introduce complexity in styling and event handling.

## Chosen Solution

We have chosen to use custom components inside the main component for KiteChat, leveraging the benefits of reduced rerenders, improved modularity, and syntax features provided by Lit. To mitigate the exposure of inner components to the global scope, we will use unique prefixes for custom element names to minimize the risk of naming conflicts.

## Consequences

- Reduced rerenders and improved modularity
- Leveraging Lit's data and event binding syntax provides a more expressive and concise way to handle data and events within the components.
- Inner components are exposed to the global scope, potentially increasing the risk of naming conflicts.

## Future Considerations

Using scoped elements:
https://open-wc.org/docs/development/scoped-elements/
