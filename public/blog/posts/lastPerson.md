# The Last Person Who Understands Everything

*On knowledge, complexity, science, and the strange world we are building with artificial intelligence.*

---

There is a thought that has been bothering me for some time: **will there ever be a point where humanity knows more than any human can possibly understand?**

At first, that sounds obvious. Of course no individual knows everything. I don't know how a semiconductor is manufactured. I couldn't build a power grid from scratch. I don't know how an airplane engine works down to the last component. But I can still use a laptop, switch on a light, board an airplane, and send a message across the world in seconds.

That is one of the remarkable things about civilization. We don't need every person to understand everything. We divide knowledge between people, generations and institutions, and somehow the collective becomes capable of things no individual could accomplish alone.

But artificial intelligence is beginning to introduce something slightly different. We are not only creating systems that are too complicated for one person to understand. We are beginning to create systems where **even the people who built them cannot always give a satisfying explanation for everything they do.**

And that raises a much bigger question than "How does AI work?"

It raises the question: **what does it mean to understand something at all?**

---

## The world became too complicated for one mind

There was a time when the boundaries between different areas of knowledge were much less defined. A person interested in nature could study mathematics, astronomy, anatomy and engineering without necessarily spending an entire lifetime mastering one tiny corner of a field.

Leonardo da Vinci is perhaps the most famous example. He painted, studied anatomy, designed machines and investigated the natural world. Today, we tend to think of this as extraordinary genius. But there is another way of looking at it: the total body of available knowledge was simply much smaller.

![Drawings from Leonardo da Vinci's notebooks: anatomy, flight and machines on one page](/blog/lastPerson/daVinci.jpeg)

Science eventually became too successful for this to remain possible.

Physics divided into dozens of specializations. Biology became molecular biology, genetics, neuroscience, ecology and countless other fields. Mathematics expanded into areas so specialized that two mathematicians can spend their entire careers working on problems the other has never encountered.

This wasn't because humans became less capable. It was almost the opposite.

**We discovered too much.**

Specialization became our solution. Instead of one person knowing everything, thousands of people each learned something extremely deeply. Civilization became a network of specialists who collectively possessed an enormous amount of knowledge.

![One body of knowledge branching into many specializations](/blog/lastPerson/specialization.png)

There is an important distinction here: **humanity can understand something collectively even when no individual understands the whole thing.**

That distinction becomes particularly interesting when we talk about artificial intelligence.

---

## Mathematics becomes a machine

At its foundation, modern AI is not magic. It is mathematics implemented on enormous amounts of computing hardware.

A neural network, in its simplest abstraction, is a function:

$$y = f(x;\theta)$$

The input $x$ passes through a series of mathematical transformations controlled by parameters $\theta$, producing an output $y$.

During training, the model makes predictions, compares them against desired outcomes, calculates an error through a loss function, and adjusts its parameters to reduce that error. Calculus provides the machinery for calculating how those parameters should change. Linear algebra provides much of the language in which the computations are expressed. Probability and statistics help us reason about uncertainty and patterns in data.

![The training loop: predict, measure the loss, adjust the parameters, repeat](/blog/lastPerson/trainingLoop.png)

Repeat this process millions or billions of times, with enough data and computational power, and something remarkable happens.

The model begins to represent patterns that were never explicitly programmed into it.

This is where things get interesting.

We know the mathematics. We know the architecture. We know how the model was trained. We can inspect its parameters.

And yet, understanding the mathematics does not necessarily mean understanding the model's behaviour.

---

## The black box problem

Imagine that I give you a neural network containing billions of parameters. Every number is available to you. You know the training procedure. You know the architecture. You know the data.

Technically, you have the entire machine.

Now ask it a question and it gives you an unexpected answer.

Why?

We can investigate. We can look at activations, examine individual components, run controlled experiments, trace information through the network and use interpretability techniques to identify patterns. Modern research in mechanistic interpretability is making real progress in this direction.

But there is still a fundamental difficulty.

A neural network does not usually store knowledge in neat, human-readable compartments. There is no folder inside the model called `physics`, another called `cats`, and another called `sarcasm`. Information can be distributed across many parameters and represented through relationships between different parts of the network.

A single parameter means very little on its own. The behaviour emerges from their interaction.

This is not entirely unfamiliar to science. A single water molecule is not "wet." Wetness emerges from the behaviour of enormous numbers of molecules interacting with one another. A single neuron is not a thought. A single ant does not understand the colony it participates in.

Complex systems often have properties that cannot be understood simply by examining their individual components.

![Dharamshala at sunset: thousands of separate lives, one working whole](/blog/lastPerson/emergence.jpg)

AI is becoming another example of this.

---

## Knowing how something works is not always understanding it

This distinction is what I find most fascinating.

Suppose you know every equation that describes a physical system. You can calculate what will happen. You can predict the outcome with extraordinary accuracy.

Does that necessarily mean you understand the system?

In science, we often use the words *prediction*, *explanation* and *understanding* almost interchangeably. But they are not quite the same.

A weather model can predict tomorrow's temperature without giving us an intuitive understanding of every interaction occurring in the atmosphere. A physicist can calculate the trajectory of a particle without being able to explain quantum mechanics in terms that feel intuitive to an ordinary human mind.

AI makes this distinction even more uncomfortable.

We can sometimes know what a model will do without knowing precisely why it arrived there in terms that a human can understand.

And perhaps that is what a black box really is.

Not a system about which we know nothing, but a system where **our ability to describe the mechanism has grown faster than our ability to explain its behaviour in human terms.**

---

## The strange mathematics of scale

Consider what happens when we take this idea to an extreme.

Suppose a model has a billion parameters. Each parameter is just a number. There is nothing particularly intelligent about any individual number.

But those numbers interact.

A simple equation can describe a complicated relationship. A collection of equations can describe a physical system. Billions of mathematical operations can produce a system capable of translating languages, recognizing objects, writing programs or generating images.

The surprising part is that complexity does not necessarily require complicated individual pieces.

Sometimes simple pieces, connected in enormous numbers, produce behaviour that is difficult to reason about intuitively.

This is one reason scale matters so much in AI.

A model with more parameters is not simply a larger spreadsheet. It can develop new representations and behaviours as the system becomes more capable.

That does not mean intelligence suddenly appears at some magical number of parameters. It means that sufficiently complex systems can contain relationships that are difficult to anticipate simply by looking at their individual parts.

And that brings us back to our original problem.

If the system becomes more complicated than any individual can mentally model, who actually understands it?

---

## We are already surrounded by things we don't understand

Perhaps this isn't really an AI problem.

Modern civilization is already built this way.

Think about your smartphone. You can understand how to use it without understanding semiconductor physics. You can understand how to write an application without understanding every layer of the operating system beneath it. You can send a message across the world without knowing how the internet routes packets between thousands of machines.

You don't need to understand all of this.

You trust the system.

And usually, that trust is justified because somewhere within the enormous structure of modern civilization, there are people who understand each individual layer.

The electrical engineer understands the grid. The network engineer understands routing. The semiconductor engineer understands the chip. The software engineer understands the application.

![The layers beneath a single message, each one understood by its own specialists](/blog/lastPerson/layers.png)

The whole system is too large for one person, but each part has specialists.

AI introduces a subtle difference.

We may eventually reach systems where **there isn't a single specialist who can explain the whole behaviour either.**

Not because nobody is intelligent enough.

Because the system itself has become too complex.

---

## What happens when the machine discovers something we can't understand?

This possibility is where things become genuinely fascinating.

Imagine an AI system that analyses an enormous scientific dataset and discovers a pattern humans had never noticed. We test its prediction experimentally, and it works.

The machine has given us a correct answer.

But suppose we cannot understand why.

Do we consider this knowledge?

Or do we merely consider it a useful prediction?

For most of human history, knowledge and understanding were closely connected. To know something was, at least ideally, to be able to explain it.

AI could separate those ideas.

We may eventually have systems that discover mathematical relationships, scientific hypotheses, new materials or biological structures that humans can verify but struggle to comprehend.

The machine might effectively say:

> *"I found something here."*

And our response might be:

> *"We don't know why it works, but we have tested it, and it does."*

That would be a profound change in our relationship with knowledge.

---

## Perhaps the problem isn't that we know too little

The interesting thing is that I don't think the answer is to make every human understand everything.

That would be impossible.

The amount of knowledge available today is simply too vast. Nobody can master physics, medicine, computer science, mathematics, economics, biology and philosophy simultaneously.

The answer, instead, might be to make knowledge easier to **reach**.

A person should be able to ask a question about quantum mechanics without feeling that they need a physics degree before they are allowed to be curious.

Someone should be able to ask how an AI model works without first spending three years learning linear algebra.

Simplifying an idea does not have to mean making it inaccurate.

There is a difference between making knowledge simple and making knowledge shallow.

And I think that distinction is becoming increasingly important.

---

## The future may belong to people who can ask better questions

We are entering a world where no individual will be able to understand every system they depend upon.

That isn't necessarily a failure of humanity.

It might simply be the natural consequence of progress.

The important thing is what we do with that reality.

If our technology becomes more complicated while our explanations become less accessible, we risk creating a world where people can use increasingly powerful systems without having any meaningful understanding of them.

That is where I think education matters more than ever.

Not education as memorizing facts.

Not education as collecting degrees.

But education as the ability to look at something complicated and say:

**"I don't understand this yet. Let me find out."**

Because curiosity is perhaps the only scalable response to an infinite amount of knowledge.

We don't need to know everything.

We need to remain capable of learning.

---

## The last person who understands everything

Maybe there was never a last person who understood everything.

Maybe there was never even a first.

The idea itself may be a fantasy.

But the direction is real. Every scientific discovery adds to the collective body of knowledge. Every technological advancement creates another layer of complexity. Artificial intelligence is accelerating this process by allowing us to build systems whose behaviour can emerge from mathematical interactions far beyond ordinary human intuition.

And perhaps that isn't something we should fear.

Humanity has always extended its ability to know.

Writing allowed us to remember more than our brains could hold. Libraries allowed generations to preserve knowledge beyond individual lifetimes. Computers allowed us to calculate things that would take humans centuries to compute. The internet allowed knowledge to travel almost instantly across the planet.

AI may become another extension of that process.

But there is one responsibility that comes with it.

**Knowledge should not become a priesthood.**

The fact that something is complicated should never mean that ordinary people are not allowed to understand it.

We may never understand everything.

No individual ever will.

But we can build a culture where asking questions is encouraged, where difficult ideas are explained rather than hidden behind jargon, and where technology is not treated as magic simply because it is complicated.

Because perhaps the most important question isn't whether humanity will eventually understand everything.

It is whether, as the world becomes more complicated, **we will continue to care about understanding at all.**

And if the answer is yes, then perhaps we don't need a person who understands everything.

We only need people who refuse to stop asking **why**.

---

*Thinking about any of this too? Find me on [LinkedIn](https://www.linkedin.com/in/atharvvatsal) or reach out through the [contact form](https://www.atharvvatsal.com/#contact).*
