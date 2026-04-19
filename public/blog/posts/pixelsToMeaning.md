# From Pixels to Meaning: How Machines Actually "See" Images

*A 3-year journey into the gap between data and perception*

---

> "The eye sees only what the mind is prepared to comprehend." — Henri Bergson

I want you to try something before you read further.

Look at the nearest object around you: a coffee cup, a chair, a face. You recognised it instantly. No effort. No deliberate thought. It just *was*.

Now ask yourself: how?

I spent nearly three years working in computer vision, building systems that try to do exactly that, teach machines to recognise things. And the deeper I went, the more convinced I became that "seeing" is one of the most deceptive words in the English language. We use it casually. But it hides an unfathomable complexity underneath.

This is my attempt to pull back that curtain, for engineers, for photographers, for curious people who've never written a line of code. Because this story belongs to all of us.

---

## What Does It Actually Mean to "See"?

When you look at a photograph of a crowded street at night, you don't think in layers. You don't compute. You just *see*, people, lights, rain-slicked roads, the feeling of a city still awake.

But here's what's actually happening inside your brain, at a biological level:

Photons hit your retina. Roughly *130 million photoreceptors* convert that light into electrical signals. Those signals cascade through the optic nerve into the visual cortex -> the back of your brain —> which processes edges, then shapes, then objects, then *meaning*, all within 150 milliseconds.

You don't experience any of this. You just see the street.

A machine sees none of it. A machine sees **numbers**. It sees 0s and 1s.

That's the fundamental divide. And everything in computer vision is a long, ingenious attempt to bridge it.

---

## Step 1: The World as a Grid of Numbers

Let's start from zero. Literally.

When you load an image into a computer, it becomes a matrix(size: nXm) a rectangular grid of integers. Each cell is called a **pixel** (short for *picture element*), and it holds a value describing brightness.

**For a grayscale image:**

$$I \in \mathbb{Z}^{H \times W}, \quad I_{ij} \in [0, 255]$$

Where $H$ is height in pixels, $W$ is width, and each value $I_{ij}$ goes from `0` (pure black) to `255` (pure white).

**For a colour image**, you have three of these grids stacked together: one for Red, one for Green, one for Blue(RGB):

$$I \in \mathbb{Z}^{H \times W \times 3}$$

![Processing of Image To RGB Pixel Matrix](/blog/pixels/rgbPixelMatrix.png)

So a standard 1080p colour photograph is actually a tensor of shape $1920 \times 1080 \times 3$ — over **6.2 million individual numbers**.

No cat. No smile. No memory. Just an array of numbers.

Just `[123, 98, 255]`.

This is the raw material machines work with. And for most of my time working in this field, that fact never stopped being strange to me. Every image I fed into a model: a face, a road, a traffic sign, was ultimately just a very long list of integers. Feels quite weird to be honest.

---

## Step 2: Finding Structure: Filters and Convolutions

Here's a question: if all a machine has is numbers, how does it start to find meaning?

The answer starts with something beautifully simple: **look for change**.

Think about edges. Where is the boundary between a person and a wall behind them? It's where the pixel values *change sharply*. Bright on one side, dark on the other. The machine doesn't need to know what a person is, it just needs to detect that something changed. Some of the common operators to find edges are Sobel Operator, Laplacian Operator, Prewitt Operator, Canny Edge Detection and many more. Check the picture below as an example:

![Example of Different Types of Edge Detection](/blog/pixels/edges.png)

This is done using **filters** (also called kernels), tiny grids of numbers that slide across the image and measure local patterns.

A classic edge-detection filter (the **Sobel filter**) looks like this:

$$G_x = \begin{bmatrix} -1 & 0 & +1 \\ -2 & 0 & +2 \\ -1 & 0 & +1 \end{bmatrix}$$

This $3 \times 3$ kernel, when slid across an image, amplifies vertical edges and suppresses everything else. The mathematical operation is called **convolution**:

$$(I * K)(i,j) = \sum_{m}\sum_{n} I(i+m,\, j+n) \cdot K(m,n)$$

Where $I$ is the input image and $K$ is the kernel. The output — called a **feature map** — highlights wherever that pattern exists.

![Edge Detection (Sobel)](/blog/pixels/edgeDetection.webp)

Different filters detect different things:

| Filter | What it detects |
|---|---|
| Sobel X | Vertical edges |
| Sobel Y | Horizontal edges |
| Laplacian | Both, plus corners |
| Gaussian blur | Smoothing / noise reduction |
| Gabor filter | Textures at specific angles |

> **For non-engineers:** Imagine holding a magnifying glass over a printed photo, but instead of zooming in, it highlights only edges. Move it left, and it finds vertical lines. Flip it, and it finds horizontal ones. That's a filter.

Early computer vision systems used **hand-crafted** versions of these filters. Engineers would sit down and manually design kernels to detect eyes, or wheels, or specific textures. It was painstaking. And it worked, barely. It were the Model T of computer vision filters, they were ground breaking, but not the best.

The revolution came when we stopped designing filters by hand and let models *learn* them.

---

## Step 3: Convolutional Neural Networks: Layers of Seeing

**Convolutional Neural Networks (CNNs)** are the backbone of modern computer vision. The core idea is almost embarrassingly elegant: instead of choosing filters manually, train the network to discover which filters matter.

And more than that — stack layers of filters on top of each other, so the model builds understanding progressively.

Here's what that looks like across depth:

```
Input image (raw pixels)
       ↓
Conv Layer 1  →  Edges, corners, colour gradients
       ↓
Conv Layer 2  →  Curves, blobs, simple textures
       ↓
Conv Layer 3  →  Object parts — eyes, wheels, leaves
       ↓
Conv Layer 4  →  Full objects — faces, cars, trees
       ↓
Fully Connected Layer  →  Classification decision
       ↓
Output: [cat: 0.92, dog: 0.05, rabbit: 0.02]
```

![Visualization of CNNs](/blog/pixels/cnn.jpg)

Each layer transforms the representation. The image stops being "an image" partway through and becomes an abstract cloud of activated features — a mathematical description of what the model noticed.

One key operation that makes CNNs computationally tractable is **pooling** — specifically, max-pooling. After a convolution layer, you downsample by keeping only the strongest activations in each region:

$$P(i,j) = \max_{(m,n) \in \text{region}} F(m,n)$$

![Max Pooling Diagram (AI Generated)](/blog/pixels/maxPooling.png)

This does two things: it reduces computation, and it builds in **spatial tolerance**, small shifts in the input don't derail the output. If a cat moves two pixels to the left, the network still recognises a cat.

> **LEGO analogy:** Pixels are individual bricks. Filters are the first act of assembly. Edges snap into shapes -> shapes into parts -> parts into whole objects. The model constructs meaning from raw material, one layer at a time.

---

## Step 4: From Image to Feature Vector

At some point deep inside the network, something fundamental changes.

The spatial structure of the image, that 2D grid, gets flattened into a single long vector(magnitude/value + direction). This is called the **feature vector** (or **embedding**), and it typically looks like:

$$\mathbf{z} \in \mathbb{R}^{d}, \quad d \in \{512, 1024, 2048, \ldots\}$$

This vector is the machine's internal representation of the image. It doesn't look like anything you can draw. But it encodes everything the network learned to care about.

Here's the part I find genuinely beautiful: **similar images end up near each other in this high-dimensional space**.

Two photos of golden retrievers — taken in different lighting, from different angles, produce vectors that cluster close together. A photo of a husky lands nearby. A photo of a car lands somewhere else entirely.

It is like people who like tennis will sit together, maybe accompanied by people from other racquet sports. And the people who are into science sit in a completely different place, far away.

This is called **semantic similarity in embedding space**, and it's the engine behind image search, face recognition, and content recommendation.

![2D t-SNN Projection](/blog/pixels/snn.png)

You can measure how "different" two images are using cosine similarity:

$$\text{similarity}(A, B) = \frac{\mathbf{z}_A \cdot \mathbf{z}_B}{\|\mathbf{z}_A\| \cdot \|\mathbf{z}_B\|}$$

A value of `1.0` means identical. A value near `0` means completely different.

---

## Step 5: Making the Decision: Classification

Now the network needs to commit. Given a feature vector, what is this image?

The final layer is typically a **softmax** classifier. It takes the feature vector, multiplies it through a learned weight matrix, and produces a probability distribution across all possible classes:

$$p(y = k \mid \mathbf{z}) = \frac{e^{\mathbf{w}_k^\top \mathbf{z}}}{\sum_{j} e^{\mathbf{w}_j^\top \mathbf{z}}}$$

The output might look like:

```
Cat   → 0.91
Dog   → 0.06
Fox   → 0.02
Other → 0.01
```

All probabilities sum to 1. The model picks the class with the highest score.

No understanding. No emotion. Just **statistical confidence** that the pattern it found matches patterns it learned before.

This is worth sitting with. The model is not thinking "that's a cat." It's computing: *"the pattern of activations I observed is most similar to activations I've previously associated with the label 'cat'."*

The output feels meaningful. The mechanism is not.

---

## Step 6: Learning: How the Model Gets Good

Nothing I've described above is hardwired. Every filter value, every weight in the classifier, these all start as random noise. The model learns by **being wrong, repeatedly, and correcting itself**.

Here's the cycle:

1. Feed the model an image
2. It makes a prediction
3. Compare the prediction to the correct label using a **loss function**:

$$\mathcal{L} = -\sum_{k} y_k \log(\hat{p}_k)$$

*(This is cross-entropy loss — it penalises confident wrong predictions heavily.)*

4. Compute how much each weight contributed to the error using **backpropagation** (chain rule of calculus, applied backward through every layer)
5. Update the weights using **gradient descent**:

$$\theta \leftarrow \theta - \eta \cdot \nabla_\theta \mathcal{L}$$

Where $\theta$ are the model's parameters and $\eta$ (eta) is the **learning rate** — how large a step to take.

6. Repeat — millions of times, across millions of images.

![Training And Validation Loss Viz.](/blog/pixels/trainLoss.png)

Over time, the loss drops. The model gets better. The filters that emerge aren't hand-designed, they're **discovered** from data. And what the model learns is often surprising. Researchers have visualised what early filters in CNNs respond to, and they look strikingly similar to edge detectors found in mammalian visual cortex.

Evolution took millions of years to find that solution. We find it with gradient descent in a few GPU-hours.

---

## Beyond CNNs: The Modern Landscape

CNNs dominated the field from 2012 (when AlexNet won ImageNet) through the late 2010s. But the architecture that reshaped everything — not just computer vision, but all of AI — was the **Transformer**.

Originally invented for language, Transformers were adapted for images as **Vision Transformers (ViT)** in 2020. The key mechanism is **self-attention**: instead of looking at local patches with filters, the model learns which parts of the image to attend to relative to every other part.

$$\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

![Attention Overlay Map On An Image - ViT](/blog/pixels/ViT.png)

The intuition: when you see a dog, your eyes don't move uniformly across the whole image. You attend to the face, the fur texture, the ears. ViTs learn to do something analogous.

Modern systems like CLIP, DINO, and SAM (Segment Anything Model) push even further training on hundreds of millions of image-text pairs, learning visual concepts that generalise across tasks without task-specific fine-tuning.

---

## When It All Goes Wrong: Adversarial Examples

Here's the part that has stayed with me the longest.

In 2013, researchers discovered something deeply unsettling. You can take an image, add a tiny amount of mathematically crafted noise, **invisible to any human eye**,and the model's classification collapses completely.

A panda becomes a gibbon. A stop sign becomes a speed limit sign. A face becomes nobody.

It is like you can just change the meaning without anybody noticing. Fells like lying while not lying.

The perturbation looks like this:

$$x_{\text{adv}} = x + \epsilon \cdot \text{sign}(\nabla_x \mathcal{L}(\theta, x, y))$$

This is the **Fast Gradient Sign Method (FGSM)** — push the input in the direction that maximises loss, by a tiny amount $\epsilon$. The image changes imperceptibly. The model breaks catastrophically.

![Classic adversarial example: panda + noise = gibbon (from Goodfellow et al., 2014)](/blog/pixels/panda.png)

Why does this happen?

Because models learn **shortcuts**. They associate certain pixel-level statistical patterns with labels. These patterns can be deliberately exploited in ways human vision cannot be, because human vision is grounded in a world model: context, physics, memory, that statistical pattern-matching simply doesn't have.

This is the most honest statement I can make about current computer vision:

> **Models are not intelligent. They are extraordinarily good at memorising and generalising statistical patterns. In well-specified settings, that looks like intelligence. At the edges, it falls apart.**

Understanding this didn't diminish my appreciation for the field. It deepened it. Because now the question becomes: *what would it take to do better?*

---

## The Photographer's Angle

I want to pause here and tell you something personal.

I picked up photography a long time before I started in computer vision. And during my jounry through Computer Vision Iceberg, I found out that the two pursuits collided in ways I didn't expect.

When you shoot street photography at night, you obsess over light. Where it falls. How it carves edges. How shadow creates form. You learn to see the world in terms of contrast, composition, the geometry of how things relate to each other in a frame.

And then you go back to your desk and stare at feature maps, the intermediate activations of a CNN, and you see something familiar. The model has learned to obsess over the same things: **edges, gradients, contrast, spatial structure**.

But for completely different reasons.

You care about edges because they create beauty. The model cares about edges because they're statistically predictive of class labels.

The destination can be the same. The motivation is not even in the same universe.

That gap: between statistical mimicry and genuine perception — is what three years in this field has made inescapably clear to me. And rather than feeling like a limitation, it feels like an invitation. We've built systems that are extraordinary in their own right. They're just not doing what we sometimes claim they're doing.

---

## Humans vs. Machines: The Honest Comparison

Let's be precise about the differences:

| Dimension | Human Vision | Machine Vision |
|---|---|---|
| **Core mechanism** | Predictive world modelling | Statistical pattern matching |
| **Context use** | Deep: physics, memory, emotion | Shallow: spatial co-occurrence |
| **Data efficiency** | Extreme: learn from one example | Low: needs millions of examples |
| **Robustness** | High: handles novel conditions well | Brittle at distribution edges |
| **Speed (inference)** | ~150ms to full recognition | Can be <1ms on GPU |
| **Explainability** | Opaque (neuroscience is hard) | Opaque (but we have tools) |
| **Failure mode** | Illusions, biases | Adversarial attacks, OOD collapse |

Neither is simply "better." They're different instruments for different problems.

The interesting work, the work that keeps me up at night — is figuring out how to make machine vision more like human vision without simply copying it blindly. Because human vision has its own failures. We want something different: **robust, grounded, efficient perception**.

---

## The Map So Far

Let's trace the full journey from pixels to meaning:

```
Raw image (H × W × 3 integer array)
        ↓  [Normalisation]
Normalised float tensor ∈ [0, 1]
        ↓  [Conv layers: learned filters]
Hierarchical feature maps (edges → shapes → parts → objects)
        ↓  [Pooling: spatial compression]
Compact spatial representations
        ↓  [Flatten + FC layers]
Feature vector z ∈ ℝᵈ (semantic embedding)
        ↓  [Softmax classifier]
Probability distribution over classes
        ↓  [argmax]
Predicted label + confidence
```

![Full Impage Processing Pipeline](/blog/pixels/flow.jpeg)

---

## Where Is the Field Going?

Three directions I find most compelling right now:

**Foundation models for vision**: Models like CLIP and SAM are trained on internet-scale data to produce general-purpose visual representations. Instead of training a model for each specific task, you fine-tune a massive pre-trained backbone. The same model can detect objects, answer visual questions, and segment images, with minimal task-specific data.

**Neural Radiance Fields (NeRF) and 3D scene understanding**: Moving beyond 2D classification toward full 3D scene reconstruction from 2D images. A camera observes from multiple angles, a model reconstructs the implicit 3D geometry. The scene becomes navigable.

**Vision-Language Models (VLMs)**: Systems like GPT-4V, LLaVA, and Gemini take both images and text as input and reason across them. Ask a model "what emotion is this person likely feeling?" and it can answer, not because it understands emotion, but because it's seen millions of image-text pairs that taught it what "emotion" looks like statistically. The line between vision and language is dissolving.

---

## Final Thought

The next time you glance at a photograph, I want you to remember this:

What you experience is a miracle of biological evolution — a brain that has spent billions of years being selected for its ability to model and navigate the physical world, capable of extracting meaning from a glance.

What a machine experiences, if "experience" is even the right word, is the output of a matrix multiplication on 6.2 million numbers, compared against patterns extracted from a billion previous examples.

And yet: in a well-defined task, on familiar data, the machine sometimes *wins*. Faster. More consistent. More scalable.

That's the tension that drives the entire field. Not "can machines see?", they clearly can't, not in the way we do. But: **can machines build something useful with the information light carries?**

Emphatically, yes.

Three years in, I'm no longer asking whether the magic is real. I'm asking what it would take to make it realer. And I suspect that question will outlast my career.

If you've made it this far, you know more about computer vision than most people who casually say "AI can see." You understand the pipeline, the mathematics, and — more importantly — the honest gap between what these systems do and what we sometimes claim they do.

That gap is where the interesting work lives.

And it's one of the most fascinating places I've ever found myself.

---

*Working on a computer vision system, or just curious about something I mentioned? Find me on [LinkedIn](https://www.linkedin.com/in/atharvvatsal) or reach out through the [contact page](https://www.atharvvatsal.com).*

---

## You have gone from pixels to meaning.
Now here's pure joy, no processing needed. You deserve this 🐕💝
![Thank You, Here's A Gift For You](/blog/pixels/goldens.jpg)