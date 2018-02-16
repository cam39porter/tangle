# Glossary of Terms

## Motivation

We need to have a common lexicon as a team to ensure we are always speaking the same language. This will also help us compare and contrast our ideas on what the final product is going to be.

## Editing and (or) adding terms

I do not expect the initial list of terms and definitions to be final. For that reason, feel free to add a new term, edit an existing one, or add further clarification via subpoints. Please make sure to request a review when you create your pull request.

## General Definitions

* **Thought**: Any data that a user wishes to capture with our system

* **Tag**: A phrase with no spaces and beginning with `#` that user annotates a thought with

* **Mention**: A phrase with no spaces and beginning with `@` that shares a capture with one or more other users.

* **Context**: The enviroment where a thought was generated

* **Capture**: A thought or a thougth and context stored in a Tangle.

* **Tangle**: A network of captures related through people, tags, entities, time, and sentiment. Each user has their own Tangle.

* **Group Tangle**: A user can share captures with other users or groups via mentions (@group or @user). In doing so, the user creates group Tangles. These Tangles are intersections of the individual group members' Tangles.

* **Global Tangle**: A user can share captures with all users via @Global. In doing so, connects part of their Tangle with all other users Tangles that have shared a capture globally. This creates the Global Tangle.

* **Insight**: Value add analytics produced by our system for the user

* **Surface**: The act of retrieving captures and insights stored in a Tangle.

* **Non-actionable**: Knoweldge or information that cannot be used or acted upon, even though you have it.

* **Actionable**: Knowledge or information that can be used or acted upon to achieve a goal.

* **Protocol**: A standard procedure or set of steps, in this case, to store user knowledge and insights in way that is usable.

* **Innovation**: A new valuable method, idea, or product.

* **Collaboration**: The sharing and coordination of ideas, tasks, and processes between peers with a shared goal in mind.

## Graph DB Definitions

* **Node**: a data point in a graph

* **Edge**: a relationship between nodes

* **Directed Edge**: You can only go between nodes in one way and not the other

* **Undirected Edge**: You can go bidirectionally between nodes

* **Tree**: A subset/special form of graph i.e. minimally connected graph and having only one path between any two vertices. Trees start with a root node, and might connect to other nodes, which means that could contain subtrees within them. Trees are defined by a certain set of rules: one root node may or may not connect to others, but ultimately, it all stems from one specific place. Some trees have even more specific rules, like binary search trees, which can only ever have two links to two nodes at any given time.

* **Graph**: With graphs, there are no restrictions. There is no concept of a “root” node. Nodes can be connected in any way possible. One node might be connected to five others! Graphs also don’t have any notion of “one-directional” flow — instead, they might have direction, or they might have no direction whatsoever. 

* **Closeness Centrality**: a measure of a node's capacity to effect all other elements in the network

* **Betweeness Centrality**: How critical a node is to a network as a connection point. How many times does the node act as a bridge

* **Prestige Centrality**: Highly connected nodes count more than those with a lower degree of connectivity (page rank)
