# 1. Move on from Shared Web Workers to Main Thread for WebSocket Management using BroadcastChannel

## Status

Accepted

## Context

In our project, WebSocket management using Shared Web Workers has introduced complexities related to code clarity, same-origin issues, and compatibility across browsers. The build process, requiring a separate build and inline script import for workers, has added unnecessary complications. Additionally, the event-driven architecture for tab-worker communication has contributed to code complexity.

## Facing

The previous implementation using Web Workers hinders code maintainability and presents browsers compatibility challenges.

## Decision

After thorough consideration, we have decided to transition from Shared Web Workers to managing WebSocket connections directly at the main thread using the BroadcastChannel API.

## Alternatives Considered

1. **Continue with Shared Web Workers:**
   - *Pros:*
     - Leverages parallelism for performance gains.
     - Shared state. No need to resolve the connection holder, shared messageQueue.
   - *Cons:*
     - Browsers compatibility (not supported at Chrome for Android)
     - Same-origin issues related to inline worker script. (affects BroadcastChannel and IndexedDB)
     - Build process complexities, including the need for separate worker build and static asset handling.

2. **Individual WebSocket Connections per Tab:**
   - *Pros:*
     - Simplifies the message related logic.
     - Avoids same-origin issues.
     - Ensures compatibility across all browsers.
     - Eliminates the need for a separate worker build process.
   - *Cons:*
     - Requires additional lifecycle logic to manage the active tab.
     - Increased number of reconnections due to individual tab management.

## Chosen Solution

We opt for managing WebSocket connections at the main thread and utilizing the BroadcastChannel API for inter-tab communication. This decision simplifies the codebase, mitigates same-origin issues, ensures compatibility across all browsers, and eliminates the need for a separate worker build process.
Additional reconnections shouldn`t affect the user experience.

## Consequences

Introducing individual tab management requires implementing additional reconnection logic.
Since tab becomes active on visibilitychange, we should set the timeout to limit the reconnections while changing the tabs.

Also we probably need shared messages queue and consider scenario when multiple tabs is active (implement the tab sync or notify that chat is open in other tab).
