# Information Theory and Tangle

> What follows is a summary of some of the random thoughts that popped into my head as I read Cesar Hidalgo's _Why Information Grows: The Evolution of Order, from Atoms, to Economies_ as they relate to Tangle. They are raw and relatively unstructured. They are likely best consumed after having read the book, which I would highly recommend.

## Motivation for Tangle

Cesar Hidalgo describes the motivation for a musician recording of their music as follows (p. 67):

> A musician records her music as a way to perfect her art, but also as a way of creating copies of her mind that can be shared with others and that can survive her. Without these copies her talents would be trapped in her body, inaccessible to others.

We can see that parallel motivation exists for the knowledge worker and Tangle

> A knowledge worker captures her thoughts in Tangle as a way to perfect her art, but also as a way of creating copies of her mind that can be shared with other that can survive her. Without these copies of her talents would be trapped in her body, inaccessible to others.

In both instances, the motivation is the same (p. 67):

> We crystallize imagination to make copies of our thoughts and share them with others. This makes crystallizing imagination the essence of creative expression.

## Why Graphs are Important

Over the next decade AR and VR will come into existence that will render the necessity to display information linearly obsolete. We are operating with a physical constraint that will no longer exist when the next paradigm shift inevitably comes. In this paradigm shift ushered in by AR and VR, "screen real estate" will not be limited. The value of displaying search results will be function of the amount of information that can be intuitively communicated visually. This will be best done in graphs with layouts that provide increasing value to the end user. Honing our product to favor these graphs over linear lists will positions us well in with the coming paradigm shift of AR and VR in the next 10 years.

## Nestedness in General and Personal Knowledge Graph

If we are able to relate captured thoughts through entities in the general case. We can create a graph that represents the "thought space". This thought space for all individuals will broadly show us how thinking about one thinking will make your thinking nested in a particular area. It may even exhibit the same type of nestedness shown in Cesar Hidalgos product space for country exports (p. 140).

With this in mind, we could create the general knowledge graph with the ability to visually show how a a personal knowledge graph fits into it. In doing so we could allow our user to see the areas of "thought" they are likely to explore or are well equipped to explore because they have some of the related knowledge and knowhow (that makes up their personbyte).

## Tangle for the Consumer vs Enterprise

The intermingling of ideas and fluidity of networks between related firms allows for the crystallization of new products of our imagination. It was Steve Jobs walking Xerox Parc that led to the consumer graphical user interface (GUI). If we build a tool designed to help enterprise capture and leverage knowledge, we are in some locking in its productive capability as it will be less likely to travel outside of that firm. If our goal is to increase the value we derive from our thoughts, we need to design a tool that empowers the individual, the individual that carries their knowledge and knowhow between firms. The cross pollination and fertilization of ideas is what leads to truly great innovations.

## Temporal, Relevance Layout for Personal Knowledge Graphs

Instead of using a force directed layout for personal knowledge graphs, we need the layout to provide an extra layer of meaning beyond clustering as it regards to search. Clustering is useful at the macro scale, but less so at the micro scale when searching for something particular. That particularity is likely too small to exhibit useful insights from clustering. I propose a layout that hinges on search relevance and temporal dependance. Search relevance can be scored like traditional text based searched mechanisms with augmentation from the graph database (centrality etc.). Temporal dependance is more interesting. Instead of relating captures only through entities, we can design an algorithm for establishing temporal dependence across captures. Unlike in a general knowledge graph where captures would be related through entities that are understood by the general populace, personal knowledge graphs can create relationships that would not be generally understood or meaningful.

For a personal knowledge graph, imagine an individual makes a capture `a` and time period 0 and a capture `b` and time period 1. The capture `a` contains a set of `A` and `b` a set of entities `B`. The union of `A` and `B` will be called `C` and represents the entities that are contained in both `A` and `B`. In the general knowledge graph case, `a` and `b` would be inserted into the graph simply by connected them to entities in `A` and `B` respectively. In the personal knowledge graph we instead connect `a` to the entities in `A` and `B` to `a` (because of the entity overlap) and the remaining entities in `B` not included in `C`. In this way `B` is dependent on `A`. This is logical because if an individual is thinking about a set of entities, their past thoughts likely influence their future thoughts.

The question you may be asking is how do you select the set of captures that a given capture is dependent on since many may have an overlap in terms of entities. This could be done by leveraging the general knowledge graph. First we insert a new capture into a general knowledge graph and identify its `k` nearest neighbors. We then use the method described above, but instead of using just the single previous capture, we use `k` previous captures.

This system hinges on keeping track of two graphs, a general knowledge graph and personal knowledge graph.

## Humans Attraction to Information Density (p. 32)

It seems to me that we are generally attracted to information density: given two like objects, the one with greater information density as defined by Shannon's definition of entropy will be more attractive. This can be seen to manifest in the preference of social media to media. I believe design is the visual exploration for information rich states.

## Information vs Meaning (p. xvi)

Information and meaning refer to concepts that are fundamentally different. A general knowledge graph, like what Google is constructing, contains a lot of information and can be used to extract meaning from individual messages. A personal knowledge graph, like Tangle, contains less information but more meaning by creating a temporal dependency between the messages captures within it and the entities extracted. The meaning of a personal knowledge graph stems from the unique order in which information is added and its interdependency. This ordering cannot be captured in a general knowledge graph since it is unique to each individuals journey of knowledge acquisition. It is the unique patter in which knowledge is acquired that gives it meaning to the individual, and this is a what a personal knowledge graph, Tangle, tries to capture and empower. Ultimately the meaning of a tangle is in the eye of the beholder, since their tacit knowledge (knowhow) is what gives the connections between messages their value.

## A Bugatti and Tangle (p. 12)

On crashing a Bugatti:

> This is another way of saying that teh $2.5 million worth of value was not stored in the car's atoms but in the way those atoms were arranged. That arrangement is information.

The value of a Tangle is not in the raw data that is stored there, but how that data is arranged into a unique personal knowledge graph.

## The Modern Knowledge Worker (p. 43)

> I'm often tired of processing information. I move around as fast as I can, but the world is overwhelmingly vast and fast. I answer emails, pick up things, comment on drafts, prepare slides, give talks, think of agreements, think of website designs, referee papers, write proposals, prepare figures, think of algorithms, take pictures, board planes, pack luggage, give advice, receive advice, make sandwiches, press buttons on an elevators, try to remember things, and of course suffer at the keyboard while rearranging words.

## Tangle's Mission (p. 44)

> And that, in a nutshell, is what life is all about.: moving around and processing information, helping information grow while interacting in a social context.

## Startups and Trust (p. 117)

Large firms lack trust at scale. Lack of trust between individuals an groups means that lengthy contracts and bueracracies must be involved to get things done and collaborate. Trust is an incredibly efficient mechanism to achieve things in groups and collaborate. Startups can leverage trust as differentiator early on before gains the advantages and disadvantages of scale. This is why open source collaboration is often more effective than closed source development.

## A Diatribe on Ideas Intermingling (p. 183)

The acknowledgments of this book tell a story over the course where people and ideas intermingle in non linear ways. Tangle should facilitate stories likes this.
