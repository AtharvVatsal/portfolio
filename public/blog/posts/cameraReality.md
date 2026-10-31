# Your Camera Doesn't Capture Reality
### The fascinating science behind how a little piece of glass and silicon turns light into something we call a photograph.

*Estimated reading time: 10–12 minutes*

Think about the last photograph you took. Maybe it was a sunset, a picture of your friends, your morning coffee, or perhaps that one time the sky looked unusually beautiful and you immediately pulled out your phone. You pointed the camera, tapped the shutter button, and there it was. A photograph. Simple enough.

Except, what actually happened between pressing that button and seeing the photograph appear on your screen?

Most of us don't really think about it. We take hundreds, sometimes thousands of photographs every year, and somehow we've become so accustomed to the process that we've forgotten how extraordinary it actually is. A little piece of glass, a tiny electronic chip and a remarkable amount of mathematics work together to turn something as intangible as light into an image that we can save, share and revisit years later.

But here's something I find particularly interesting: **the photograph you see isn't necessarily what was actually in front of you.**

Your camera doesn't see the world the way you do. It doesn't recognise a beautiful sunset, appreciate the colours of autumn, or understand why a particular moment is worth remembering. It measures light, converts that light into electrical signals, processes those signals through algorithms and eventually produces an image that it thinks represents the scene.

In a way, your camera doesn't capture reality. It creates an interpretation of it.

And to understand just how much goes into that interpretation, we need to start with something surprisingly simple.

## It all starts with light.

Everything you see around you is visible because light interacts with objects and eventually reaches your eyes. A tree appears green because its leaves reflect green wavelengths of light more strongly than many other wavelengths. A red car looks red because of the way its paint reflects and absorbs different parts of the visible spectrum.

Photography works on the same basic principle. Light reflected from the objects around you enters your camera through a lens, which bends and focuses it onto a surface called an image sensor. You could think of the lens as the eye of your camera. Its job is to gather light from the scene and project an image onto the sensor.

Interestingly, the image formed by a simple camera lens is inverted. That's right. The optical image is essentially upside down and reversed relative to the scene. Your camera's design and processing take care of presenting it in the correct orientation, so you never really notice.

![A simple lens bends light from the scene onto the sensor, forming an image that is upside down and reversed.](/blog/camera/lens-image.webp)

But a lens is not simply a transparent window through which the world passes unchanged. It's a carefully engineered arrangement of optical elements, each designed to control the behaviour of light. Even extremely expensive lenses have limitations. They can introduce distortion, colour fringing, reflections, softness and other optical imperfections.

Ever noticed how straight lines sometimes appear curved when you photograph a building using a wide-angle lens? Or how the corners of an image can look a little softer than the centre? That's not necessarily your camera malfunctioning. It's a consequence of how light behaves when passing through optical systems.

So, before your camera has even begun recording an image, the scene has already been influenced by the equipment you're using.

And we've barely scratched the surface.

## Your camera doesn't actually see colours.

This is probably one of my favourite things about digital photography.

Open a photograph on your phone and look at it closely. You see millions of colours, different shades of blue in the sky, subtle variations in someone's skin tone, and perhaps the warm orange glow of a streetlight. It all looks perfectly natural. You'd assume the camera simply recorded all those colours exactly as they appeared.

Not quite.

Inside your camera is a tiny electronic chip containing millions of light-sensitive areas called photosites. These are the individual locations that collect information about incoming light. When photons, which are essentially individual packets of light energy, strike the semiconductor material, they can generate electrical charge. The sensor measures this charge, and the camera eventually converts it into numerical values.

In other words, your camera is turning photons into numbers.

But there's a problem. A conventional digital camera sensor doesn't independently measure full colour at every photosite. It primarily measures light intensity. To obtain colour information, most cameras use something called a Bayer colour filter array.

Imagine placing microscopic red, green and blue filters over the sensor. Some photosites receive predominantly red light, some receive green, and others receive blue. A typical Bayer arrangement contains twice as many green filters as red or blue filters, arranged in a repeating 2 × 2 pattern.

![A Bayer colour filter array: a repeating 2 × 2 pattern of one red, two green and one blue filter over the photosites.](/blog/camera/bayer-filter.webp)

Why green? Because our visual system is particularly sensitive to fine luminance detail, and green samples contribute substantially to reconstructing that detail. Having more green samples helps the camera produce a more detailed-looking image.

But now we have another problem. Each photosite only measures the colour component allowed through its own filter. A photosite covered by a red filter doesn't independently know the green and blue values at that location.

So how does the camera produce a complete colour photograph?

It estimates the missing information using measurements from neighbouring photosites. This process is called demosaicing. Essentially, the camera intelligently interpolates the available colour measurements to reconstruct a full-colour image.

![Demosaicing: the sensor's single-colour measurements, and the full-colour image reconstructed from them.](/blog/camera/demosaicing.webp)

Think about that for a second. The photograph you're looking at contains complete colour information at every pixel, but the sensor didn't directly measure all three colour components at every location. A significant part of the image was reconstructed computationally.

Of course, not every camera uses a Bayer sensor. There are alternative sensor technologies and colour-filter arrangements. But the Bayer design is widely used in conventional digital cameras.

The next time someone shows you a beautifully detailed photograph, remember that behind those colours is a rather clever combination of physics, electronics and mathematical estimation.

## Three settings, one very complicated relationship.

Now that we know how light reaches the sensor, there's another question worth asking: how does the camera decide how much light to collect?

This is where aperture, shutter speed and ISO enter the conversation. You've probably heard of the exposure triangle, even if you've never particularly cared about learning what it means.

Let's start with aperture. Inside your lens is an adjustable opening that controls how much light passes through it. A wider opening lets more light reach the sensor, while a narrower opening lets less through. It's measured using an f-number, calculated by dividing the focal length of the lens by the diameter of its entrance pupil:

\[
N = \frac{f}{D}
\]

Here, \(N\) is the f-number, \(f\) is the focal length, and \(D\) is the entrance pupil diameter.

The slightly confusing part is that a smaller f-number actually means a wider opening. So f/1.8 lets in more light than f/4, which in turn lets in more light than f/11.

For a fixed scene brightness and under comparable conditions, the light reaching the sensor per unit area is approximately proportional to:

\[
\text{Light} \propto \frac{1}{N^2}
\]

This means that moving from f/2.8 to f/4 reduces the amount of light reaching the sensor by approximately half.

But aperture does something else, too. It affects something called depth of field, which determines how much of your photograph appears acceptably sharp in front of and behind your focus point. Those beautiful portraits where the person's face is perfectly sharp but the background melts into a soft blur? That's largely the result of a shallow depth of field, often achieved using a wide aperture.

![The same portrait at a wide and a narrow aperture: f/1.8 blurs the background, f/11 keeps more of the scene sharp.](/blog/camera/aperture-depth-of-field.webp)

Then there's shutter speed, which determines how long the sensor collects light. Imagine leaving a bucket outside during rainfall. The longer you leave it there, the more water it collects. Your camera works on a somewhat similar principle. A shutter speed of 1/1000 of a second collects light for an extremely short period, while an exposure lasting one second gives the sensor considerably more time to gather it.

This is why fast shutter speeds are so useful when photographing birds in flight, sports or moving vehicles. They help freeze movement. Slow shutter speeds, on the other hand, can produce those beautiful silky waterfalls and long trails of light from passing cars, provided the camera remains stable.

![Shutter speed: a fast exposure freezes moving water, a slow one turns it into a silky blur.](/blog/camera/shutter-speed.webp)

And finally, there's ISO, perhaps the most misunderstood of the three. Increasing ISO doesn't magically make more photons enter your camera. The amount of light originally collected is still primarily determined by the scene, aperture, exposure time and transmission through the lens. Instead, the ISO setting controls how the captured signal is amplified and interpreted when producing the image.

Think about increasing the volume on a microphone recording. You can make a quiet recording louder, but the unwanted background noise may become more noticeable, too. That's a reasonably good way to understand why higher ISO settings often result in noisier photographs.

![The same scene at a low and a high ISO: the high-ISO frame is brighter but visibly noisier.](/blog/camera/iso-noise.webp)

The interesting part is that these three settings are constantly working against and alongside one another. You can photograph the same scene at two different combinations of aperture, shutter speed and ISO and produce images with almost identical brightness, yet completely different motion, background blur and noise characteristics.

Photography is not simply about making an image bright enough. It's about deciding which compromises you're willing to make to get the image you want.

## Why your sunset sometimes looks nothing like the sunset you saw.

Let's move away from camera settings for a moment. Imagine standing outside during golden hour. The sky is a beautiful combination of orange, pink and purple. You pull out your camera, take the photograph, and look at the result. Somehow, everything looks slightly yellow. The colours aren't quite right, and the photograph doesn't resemble the scene you remember.

What happened?

The answer lies in something called white balance.

Different light sources have different colour characteristics. Sunlight, candles, fluorescent lights and LEDs don't illuminate objects in exactly the same way. A candle produces warm, orange-looking light, while daylight can appear considerably cooler depending on the time and conditions.

Our visual system is remarkably good at adapting to these changes. A white shirt generally continues to look white to us whether we're standing outdoors in daylight or sitting inside a room illuminated by a warm bulb. Our brains automatically compensate for much of the difference.

A camera has to estimate and correct for this. That's what white balance does.

It's commonly adjusted using colour temperature, measured in Kelvin. A warm indoor light might have a colour temperature around 3000K, while daylight is often approximated using values around 5500–6500K, depending on the conditions.

Here's where things get slightly counterintuitive: a lower Kelvin value generally corresponds to warmer-looking light, while a higher value corresponds to cooler, bluer-looking light.

Your camera uses white-balance information to adjust the relative strengths of its red, green and blue channels. In a simplified form, this can be represented as:

\[
R' = g_R R,\quad G' = g_G G,\quad B' = g_B B
\]

The \(g\) values represent the adjustments applied to each colour channel.

This is why the same photograph can look dramatically different depending on the white-balance setting. And this is one of the reasons photographers often prefer shooting in RAW: it preserves considerably more flexibility to adjust colour and white balance after taking the photograph.

![One photograph at two white-balance settings, 3000K and 6500K: the same scene rendered cooler and warmer.](/blog/camera/white-balance.webp)

Of course, colour temperature isn't the whole story. Some artificial light sources have unusual spectral characteristics that cannot be completely corrected by simply changing a Kelvin value.

Even something as seemingly straightforward as making white look white involves a little interpretation.

## The photograph isn't finished when you press the shutter.

Here's something most people don't realise: the moment you press the shutter button, your camera has only completed part of its job.

The information collected by the sensor still needs to be turned into an image that you can actually look at. This is where the Image Signal Processor, or ISP, comes in. Think of it as a tiny image-processing laboratory inside your camera.

It takes the sensor's measurements and performs a series of operations to produce the final photograph. It reconstructs colour information, adjusts white balance, reduces unwanted noise, enhances edges, corrects colours, manages brightness and contrast, and eventually prepares the image for display or storage.

![Inside the image signal processor: sensor data passes through demosaicing, white balance, noise reduction, sharpening and tone mapping to become a photograph.](/blog/camera/isp-pipeline.webp)

For example, sharpening doesn't necessarily recover detail that was never captured in the first place. Instead, it increases local contrast around edges, making those edges appear clearer. Noise reduction does the opposite kind of balancing act: it tries to distinguish meaningful image detail from random variations in the signal, although excessive noise reduction can make photographs look unnaturally smooth.

One particularly important part of this process is tone mapping. A sensor records information across a certain range of brightness levels, but a typical screen cannot reproduce every possible brightness value in the real world. Tone mapping helps translate that captured information into something that can be displayed while preserving a visually pleasing relationship between highlights, shadows and midtones.

This is also where the difference between RAW and JPEG becomes important.

When you shoot JPEG, your camera has already made many decisions about how the photograph should look. Its colour, contrast, sharpening, noise reduction and compression have largely been applied. The result is convenient, relatively small and ready to share.

RAW files are different. They preserve much more of the original sensor measurements, typically at a higher bit depth, giving you significantly more flexibility when editing. You can adjust exposure, recover some highlight and shadow detail, change white balance and make other corrections with considerably less damage than you might experience when pushing a heavily processed JPEG.

![Recovering a bright sky: the RAW file still holds detail that the JPEG has already clipped to white.](/blog/camera/raw-vs-jpeg.webp)

RAW doesn't mean absolutely untouched, though. The sensor still has to be read, and cameras may apply corrections or record additional information. It's better to think of RAW as a much more flexible starting point rather than a photograph with absolutely nothing done to it.

And if you thought all of this was impressive, modern smartphones have taken the idea of image processing considerably further.

## Your phone might actually be taking several photographs at once.

Take a photograph at night using a modern smartphone. You point it at a poorly lit street, tap the shutter, wait a couple of seconds, and somehow end up with an image that looks considerably brighter and cleaner than the scene appeared.

How does that happen?

Well, your phone may not be relying on a single photograph at all.

Welcome to computational photography, where traditional optics and image sensors are combined with algorithms to produce images that would be difficult to achieve using a single conventional exposure.

Consider a photograph of someone standing in front of a bright sunset. Expose for the person, and the sky might turn into a completely white patch. Expose for the sky, and the person might become almost completely dark.

This happens because cameras can only record a limited range of brightness levels. This range is called dynamic range.

In a simplified mathematical model, dynamic range is the ratio between the maximum measurable signal and the minimum distinguishable signal:

\[
DR = \frac{\text{Maximum signal}}{\text{Minimum distinguishable signal}}
\]

Photographers often express dynamic range in stops. Since each stop represents a doubling of light, the relationship is:

\[
DR_{\text{stops}} = \log_2(DR_{\text{ratio}})
\]

For example, a dynamic range ratio of 1024:1 corresponds to 10 stops.

So how does your smartphone deal with a scene that exceeds what its sensor can comfortably capture?

One approach is High Dynamic Range photography, commonly known as HDR. The camera captures multiple frames at different exposure levels and combines information from them. One frame might preserve the bright sky, while another captures more detail in the shadows. Software then aligns and merges the information to produce a photograph with a wider range of usable brightness.

![HDR: a darker frame keeps the sky, a brighter frame keeps the shadows, and the merged photograph keeps both.](/blog/camera/hdr-merge.webp)

But there's a catch. What happens when something moves between those frames? A person walking, a passing vehicle or even leaves moving in the wind can create ghosting and other unwanted artefacts. This is why HDR processing has to do considerably more than simply stack photographs together.

Night mode takes this a step further. In low light, the sensor receives fewer photons, which generally means a weaker signal relative to noise. Smartphones often capture bursts of multiple frames, align them and combine useful information across those frames. The result can be considerably cleaner than a single exposure.

![A dim street as a single exposure and as a night-mode photograph merged from a burst of frames.](/blog/camera/night-mode.webp)

Google researchers have even published work on burst photography for HDR and low-light imaging on mobile cameras, exploring how multiple exposures can be aligned and combined to improve image quality.

In other words, your phone isn't necessarily capturing more light in one instant. It's collecting information across multiple moments and using software to construct a better photograph.

**Your smartphone is no longer just taking a photograph. It's using computation to decide what the photograph should look like.**

And honestly, that's a rather extraordinary development.

## When software decides what should be blurry.

There's another feature on almost every modern smartphone that demonstrates just how far we've come: portrait mode.

You take a photograph of someone, and suddenly the background is beautifully blurred. The subject remains sharp, and the entire image looks as though it was captured using a professional portrait lens.

Except your phone might have a relatively tiny sensor and lens.

So what's going on?

In many smartphones, portrait mode relies on information from multiple cameras, depth sensors or computational techniques to estimate the distance of different objects from the camera. Some systems also use machine-learning models to help identify people and separate foreground subjects from backgrounds.

The software creates something called a depth map. Think of it as a representation of the scene in which different locations are assigned estimated distances from the camera.

![A portrait-mode depth map: nearer parts of the scene are lighter, farther parts darker.](/blog/camera/depth-map.webp)

Using this information, the phone can identify the subject and artificially blur parts of the background. This is often called computational bokeh.

Traditional optical bokeh occurs naturally because of the lens, aperture, focusing distance and other optical characteristics. Computational bokeh, on the other hand, is generated through software.

And that's why the results aren't always perfect.

Ever noticed how portrait mode occasionally blurs someone's hair, cuts into their glasses or leaves a random patch of the background strangely sharp? That's the software struggling to distinguish the subject from everything surrounding it.

![Where portrait mode guesses wrong: blurred strands of hair and a patch of background left sharp beside the subject.](/blog/camera/portrait-mode-errors.webp)

It's making an educated guess about which pixels belong to the person and which belong to the background. Sometimes it gets it right. Sometimes it doesn't.

The next time someone's ear mysteriously disappears in a portrait photograph, you'll know that somewhere inside your phone, an algorithm made a rather questionable creative decision.

## So, is your photograph actually real?

Let's bring everything together.

You stand in front of a beautiful sunset. Light reflects from the landscape and enters your camera. The lens focuses it onto a sensor, which converts incoming photons into electrical signals. Colour filters help the camera obtain red, green and blue measurements. Algorithms reconstruct missing colour information, adjust white balance, reduce noise, sharpen details and transform the measurements into an image that your screen can display.

Your smartphone might even combine several photographs, estimate depth, brighten shadows, recover highlights and apply artificial blur. And after all that, a social media platform might compress the image again when you upload it.

By the time someone sees your photograph, they're looking at the result of an incredibly long chain of physical and computational decisions.

Does that make the photograph fake?

Not really.

It simply means a photograph is a representation of reality, not reality itself.

Even a completely unedited RAW photograph isn't a neutral window into the world. It's still limited by the lens, sensor, exposure, colour response and physical properties of the camera. The camera records certain information and leaves other information out.

And, interestingly, human vision isn't a perfect recording device either. Our eyes continuously adapt to changing light conditions, while our brains interpret colours and brightness relative to their surroundings. Our perception is also influenced by context, attention and expectations.

We don't experience the world as a collection of perfectly measured pixels. We experience an interpretation of it, too.

The difference is that our brains do most of the processing without asking us for permission.

## Perhaps that's what makes photography so beautiful.

The more you understand the science behind photography, the more interesting the art becomes.

You can spend thousands on a camera body, buy an incredibly sharp lens, learn every setting, understand every exposure formula and still come home with a photograph that doesn't quite capture what you felt when you were standing there.

Because sometimes, a photograph isn't about accurately recording the amount of light in a particular scene. It's about capturing a moment.

It's about standing somewhere at six in the evening when the sky slowly turns orange. It's about a friend laughing when nobody was expecting it. It's about a bird landing on a branch for just long enough to give you one opportunity to photograph it.

And no sensor, however advanced, can fully measure the significance of those moments.

That's not a limitation of photography. That's what makes it interesting.

The next time you take a photograph, remember what's happening behind that little button. There's physics, optics, semiconductor engineering, mathematics and an extraordinary amount of computation working together to produce something you can look at in an instant.

All that, just to capture one moment.

And perhaps the most interesting part is this:

**Your camera doesn't capture exactly what you see. It captures what it can measure, interprets what it cannot, and gives you something that you get to call a photograph.**

Maybe that's why two people can stand in the exact same place, photograph the exact same sunset and come back with two completely different pictures.

They're not necessarily photographing different worlds.

They're just interpreting the same one differently.

---

### Want to explore the science further?

A few interesting resources for anyone who wants to go deeper:

- [Understanding Digital Camera Sensors – Cambridge in Colour](https://www.cambridgeincolour.com/tutorials/camera-sensors.htm)
- [Understanding Exposure – Cambridge in Colour](https://www.cambridgeincolour.com/tutorials/camera-exposure.htm)
- [Computational Photography – MIT](https://people.csail.mit.edu/fredo/comp-photo-book/)
- [Burst Photography for High Dynamic Range and Low-Light Imaging on Mobile Cameras – Google Research](https://research.google/pubs/burst-photography-for-high-dynamic-range-and-low-light-imaging-on-mobile-cameras/)
- [High Dynamic Range Imaging – OpenCV](https://docs.opencv.org/4.x/d3/db7/tutorial_hdr_imaging.html)

*Photography is a science, an art, and perhaps a little bit of interpretation. Keep looking.*

*Image Disclaimer: Some images used in this article were AI-generated, while others were found through Google Images and are used for illustrative purposes. I do not claim ownership of these images or their copyrights. All rights remain with their respective creators and copyright holders. For attribution or removal requests, please get in touch.*