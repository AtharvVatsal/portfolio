export const blogPosts = [
{
    id: 1,
    title: "Accuracy Lied to Me: A Beginner's Guide to Model Evaluation",
    excerpt: "Your model has shiny accuracy of 99%. It is also completely useless. Here is why accuracy is a liar and what metrics you should actually use.",
    coverImage: "/blog/accuracy.png",
    content: `
      <p>Your model has shiny accuracy of 99%. Your model is also <strong>completely useless</strong>.</p>

      <p>I have learned this the hard way. You may have as well. Let me save you some pain.</p>
      
      <br />

      <h2><strong>The 99% Disaster</strong></h2>

      <p><strong>Imagine this scenario:</strong> You are building a spam filter, and through tutorials, documentation, and "GPT-ing," your model achieves 99% accuracy. You are more than ready to use this as your new big thing, add it to your resume, and boast about your creation wherever you go – yes, even to your grandma who thinks computers are voodoo.</p>

      <p>Then you deploy it. It detects zero fraud. Zero. Good old round ZERO!</p>
      
      <br />

      <p>So here is what went down: Fact is, 1% of all transactions are fraudulent. And your excellent model, with your outstanding skills, learned it could predict <strong>all of them as legitimate</strong>. That is the simplest thing to learn and do. Therefore—boom—99% accuracy.</p>

      <p>Your model is the metaphorical security guard who waves everyone through because "most people aren't criminals." Technically correct. Completely useless when actually needed.</p>
      
      <br /> 

      <h2><strong>Why Accuracy is a Liar</strong></h2>

      <p>Guessing accuracy simply lets you know that you get things right as frequently as you get them wrong. This does not, however, let you know the nature of the things you are getting wrong. This is similar to a parent who praises you, even if you do not deserve it 95% of the time.</p>
      
      <br />

      <div style="background: #000000; color: #ffffff; padding: 15px; border-radius: 8px; font-family: monospace; text-align: center; margin: 20px 0; border: 1px solid #12337a;">
        Accuracy = Correct Predictions / Total Predictions
      </div>

      <p>Once again, the reality is different in the real world. Not every mistake is the same. There are some mistakes that might drive you nuts, and some mistakes might be nuts themselves.</p>

      <ul>
        <li><strong>Missed a fraudulent transaction?</strong> The customer loses thousands.</li>
        <li><strong>Flagged a legit transaction?</strong> The customer gets mildly annoyed.</li>
      </ul>

      <p>These are not equal, however, accuracy treats them as though they were twins.</p>
      
      <br />

      <h2><strong>The Confusion Matrix: Your Truth Serum</strong></h2>
      
      

      <p>Stop looking at accuracy. Start looking at this:</p>

      <div style="overflow-x: auto;">
        <table border="1" cellpadding="12" style="border-collapse: collapse; width: 100%; margin: 20px 0; text-align: center; border-color: #c7d2fe;">
          <thead style="background-color: #000000; color: #ffffff;">
            <tr>
              <th style="border: 1px solid #c7d2fe;"></th>
              <th style="border: 1px solid #c7d2fe;">Predicted: Safe</th>
              <th style="border: 1px solid #c7d2fe;">Predicted: Fraud</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight: bold; background-color: #000000; color: #ffffff; border: 1px solid #c7d2fe;">Actually Safe</td>
              <td style="border: 1px solid #c7d2fe;">985</td>
              <td style="border: 1px solid #c7d2fe; color: red; font-weight: bold;">5</td>
            </tr>
            <tr>
              <td style="font-weight: bold; background-color: #000000; color: #ffffff; border: 1px solid #c7d2fe;">Actually Fraud</td>
              <td style="border: 1px solid #c7d2fe; color: red; font-weight: bold;">10</td>
              <td style="border: 1px solid #c7d2fe; color: green; font-weight: bold;">0</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>See the number down left there? That’s <strong>10 cases of fraud you didn’t even detect</strong>, thanks to your 99% accuracy rating. The confusion matrix does not lie. It tells you precisely where your model is failing.</p>
      
      <br />

      <h2><strong>Metrics That Actually Matter</strong></h2>

      <h3><strong>Recall: "Did I catch the bad stuff?"</strong></h3>
      
      <div style="background: #000000; color: #ffffff; padding: 10px; border-radius: 6px; font-family: monospace; margin-bottom: 10px; border: 1px solid #c7d2fe; text-align: center;">
        Recall = Caught Frauds / Total Frauds
      </div>
      
      <p>Use this when missing cases poses a costly problem and the potential consequences of missing negatives are critical. Cancer diagnosis? Terrorist threats? Fraudulent transactions? You want high recall.</p>
      
      <br />

      <h3><strong>Precision: "When I yell fraud, am I right?"</strong></h3>
      
      <div style="background: #000000; color: #ffffff; padding: 10px; border-radius: 6px; font-family: monospace; margin-bottom: 10px; border: 1px solid #c7d2fe; text-align: center;">
        Precision = Real Frauds / All Fraud Alerts
      </div>
      
      <p>Use this if false alarms are frustrating. Think Email Spam Filters. If too many legit emails are marked as Spam, people get mad. They might even report your "next big thing".</p>
      
      <br />

      <h3><strong>F1 Score: "Give me one number"</strong></h3>
      <p>The Goldilocks metric. It balances both precision and recall.</p>
      
      <div style="background: #000000; color: #ffffff; padding: 15px; border-radius: 8px; font-family: monospace; text-align: center; margin: 20px 0; border: 1px solid #c7d2fe;">
        F1 = 2 * (Precision * Recall) / (Precision + Recall)
      </div>

      <p>Use this when you can't decide or need to compare models quickly.</p>
      
      <br />

      <h2><strong>The Tradeoff Nobody Tells You About</strong></h2>
      
      

      <p>Precision and recall cannot be maximized at the same time. It is the same as wanting peace of mind and wanting to be an engineer today.</p>

      <ul>
        <li>Want to catch <strong>every single fraud case</strong>? Be ultra-cautious and flag everything you suspect. Your precision will tank.</li>
        <li>Want <strong>legitimate-only</strong> fraud alerts? Be super strict. You WILL miss true fraud.</li>
      </ul>

      <p>Pick your poison based on which one costs the most to lose.</p>
      
      <br />

      <h2><strong>Real Talk: When Accuracy is Fine</strong></h2>
      <p>Don't overthink it for:</p>
      <ul>
        <li>Balanced Datasets (50-50 split, 60-40 split)</li>
        <li>Equal error costs (cat vs. dog classification—who cares which way you mess up?)</li>
        <li>Quick exploration (just checking if your model is completely broken)</li>
      </ul>
      <p>But for anything with imbalanced classes or unequal error costs? Accuracy is lying to you.</p>
      
      <br />

      <h2><strong>The Checklist You Need</strong></h2>
      <p>Before celebrating your next "high accuracy" model:</p>
      <ul>
        <li>✅ Class distribution? (Imbalanced = Accuracy is BS)</li>
        <li>✅ What does the confusion matrix show?</li>
        <li>✅ What's more expensive: false positives or false negatives?</li>
        <li>✅ Choose metrics that fit your cost functions</li>
      </ul>
      
      <br />

      <h2><strong>The Bottom Line</strong></h2>
      <p>The best model is not the one that is most accurate, but the one that is most expensive to fail. Relying on accuracy is like judging a goalkeeper solely on the number of times they touch the ball. Kind of cool, but tells you nothing about the score.</p>

      <p>Stop chasing accuracy. Start asking: <em>"What mistakes is my model making, and can I live with them?"</em></p>

      <p>Now go build something that actually works. 🚀</p>
    `,
    category: "Tech",
    date: "06-02-2026",
    readTime: "10 min read",
    emoji: "🎯",
    tags: ["Machine Learning", "Data Science", "Metrics", "Beginners"],
},
{
    id: 2,
    title: "From a Hand-Me-Down Camera to Shooting the Stars",
    excerpt: "Growth through consistency, learning through real-world exposure, and validation through recognition.",
    coverImage: "/blog/photoStart.jpg",
    content: `
      <p>In 2017, I did not pick up a camera with the intention of becoming a professional photographer. There was no grand plan, no vision board filled with magazine covers, no carefully mapped career trajectory. What I had was a hand-me-down camera, a lot of curiosity, and absolutely no idea where it would take me.</p>

      <p>The camera itself wasn't anything special, at least not by industry standards. It was a Nikon D3100 and it had a few scratches, a slightly worn grip, and came with exactly one kit lens (The lovely 18-55mm) that I would later learn was considered "basic" by most photography circles. But to me, it felt like possibility compressed into a small black box.</p>

      <p>I remember the first few weeks vividly. I photographed everything and nothing. Dew on a leaf? Clicked! A rose looking good? Clicked! Strangers at bus stops who never knew they were being observed. Most of these early shots were technically flawed, overexposed, poorly composed, occasionally blurry in ways that no amount of "artistic interpretation" could justify. But I kept shooting anyway.</p>

      <p>There's something liberating about starting with zero expectations. When you're not chasing perfection, you're free to simply see. And that's what those early days were about—training my eyes before I even understood what I was training them for.</p>

      <p>Over the next few months, I devoured photography books, watched countless tutorials, and joined online forums where I could share my work and get feedback. Each critique, whether harsh or kind, was a stepping stone. I learned about exposure triangles, rule of thirds, leading lines, and the magic of golden hour lighting. Slowly but surely, my photos began to improve.</p>

      <p>Looking back, I think the hand-me-down nature of that first camera mattered more than I realized at the time. It arrived without pressure. Nobody was waiting for me to justify an expensive purchase. Nobody expected a return on investment. It was just mine to explore, to make mistakes with, to slowly fall in love with.</p>

      <p>What started as casual experimentation—filling idle afternoons and giving me an excuse to wander through the city—slowly turned into something I couldn't stop thinking about. I started noticing light differently. I began seeing frames everywhere: in doorways, in crowded markets, in the space between two people sharing a moment.</p>

      <p>I had no idea then that this quiet obsession would eventually put me behind the lens for some of the biggest artists in the country. That journey was still years away, waiting in a future I couldn't have imagined.</p>

      <p>But every photograph I've ever taken—including the ones that ended up mattering—started here. With scratched equipment, amateur instincts, and nothing but curiosity pulling me forward.</p>
    `,
    category: "Photography",
    date: "13-01-2026",
    readTime: "5 min read",
    emoji: "📸",
    tags: ["Photography", "Nikon", "Beginnings"],
  },
    {
    id: 3,
    title: "From Writing My First Java Program to Building for the Real World",
    excerpt: "The First Line of Code...",
    coverImage: "/blog/codingJourney.jpg",
    content: `
      <p>My journey into computer science did not begin with artificial intelligence or complex systems. There were no late night coding marathons, no hackathon victories, no childhood stories of taking apart computers to see how they worked. It began far more quietly than that—with basic Java programs in a school computer lab, surrounded by classmates who were equally confused about why the semicolon mattered so much.</p>

      <p>Tenth grade. That's when I wrote my first real program. And by "real," I mean a few lines that printed "Hello, World!" to a black console screen. I remember staring at that output longer than was probably necessary, feeling a strange mix of accomplishment and bewilderment. <em>I made the computer do something.</em> It was a small thing, but it didn't feel small.</p>

      <p>Those early days were defined by struggles that seem almost laughable now. Loops that ran infinitely because I forgot to update a counter. If else statements nested so poorly that even I couldn't trace my own logic. Compilation errors that felt personal—like the computer was specifically disappointed in me. I spent more time debugging than actually writing code, and half the time I fixed things without truly understanding <em>why</em> the fix worked.</p>

      <p>But something kept pulling me back.</p>

      <p>Maybe it was the puzzle like nature of it all. Every program was a small mystery: <em>Here's what I want to happen. Why isn't it happening?</em> Finding the answer—even when it took an embarrassingly long time—delivered a satisfaction that few other things in school could match. It wasn't about grades or expectations. It was about that moment when the logic finally clicked, when the output matched the intention, when the machine did exactly what I asked it to do.</p>

      <p>I had no understanding then of where any of this would lead. The words "machine learning," "full stack development," and "deployment" weren't part of my vocabulary. I wasn't dreaming of building applications that real people would use. I was just trying to get a basic calculator program to stop crashing.</p>

      <p>And yet, every concept I wrestled with in that school lab—variables, control flow, the importance of thinking step by step—became the foundation for everything that came after. I didn't know I was laying groundwork. I thought I was just completing assignments.</p>

      <p>That's the thing about beginnings. They rarely announce themselves. You don't get a notification that says, <em>"Pay attention, this moment matters."</em> You're just sitting in a computer lab, frustrated with a missing bracket, unaware that you're taking the first steps toward something that will shape your entire future.</p>

      <p>Looking back, I'm grateful the beginning was so unglamorous. It taught me that capability isn't something you're born with—it's something you build, one broken program at a time.</p>
    `,
    category: "Tech",
    date: "11-06-2025",
    readTime: "7 min read",
    emoji: "💻",
    tags: ["Coding", "Java", "Journey", "Beginnings"],
  },
 {
    id: 4,
    title: "Working with Himachal Police – Technology for Society",
    excerpt: "When software meets real-world responsibility...",
    coverImage: "/blog/police.webp",
    content: `
      <p>One of the most defining moments of my journey in computer science was working with the Himachal Police. This experience marked a shift from building projects for learning purposes to developing systems meant for real institutional use—systems that needed to be reliable, secure, and clear in their outcomes.</p>

      <p>One of the key solutions I worked on was an inter-battalion report processing system. The objective was to streamline how reports were submitted, processed, and reviewed across different battalions. Instead of fragmented or manual workflows, the system enabled structured data handling, faster access to information, and improved consistency in reporting. Designing this required careful consideration of usability, data integrity, and operational efficiency, since the end users were officers working in time sensitive environments.</p>

      <p>In addition to this, I developed and analyzed employee engagement surveys. These surveys were not just about collecting responses—they were about transforming raw feedback into meaningful insights. I worked on survey design, data processing, and analytical reporting to help identify patterns related to morale, engagement, and organizational challenges. This reinforced the importance of clarity in data representation, especially when insights influence administrative decisions.</p>

      <p>Another significant contribution was building district level analysis software. This involved aggregating and analyzing district wise data to identify trends, variations, and operational insights. To enhance the effectiveness of this analysis, I applied machine learning techniques to uncover patterns that would be difficult to identify through manual analysis alone. The focus was not on using complex algorithms for the sake of it, but on selecting appropriate models that provided interpretable and actionable results.</p>

      <p>What made this experience truly impactful was the responsibility that came with it. When software is built for an institution, mistakes are no longer academic—they have real consequences. This taught me to prioritize security, reliability, and clarity over experimentation, and to think beyond code correctness toward system behavior in real world conditions.</p>

      <p>Working with Himachal Police reshaped how I view technology. It reinforced the idea that software is not just a technical artifact, but a tool that can directly support people, processes, and public service—when built with intent and accountability.</p>
    `,
    category: "Tech",
    date: "27-10-2025",
    readTime: "4 min read",
    emoji: "🏛️",
    tags: ["Government", "Machine Learning", "Real-World", "Impact"],
  },
];

export const blogCategories = [
  { name: "All", color: "from-gray-400 to-gray-600" },
  { name: "Tech", color: "from-cyan-400 to-blue-500" },
  { name: "Photography", color: "from-purple-400 to-pink-500" },
  { name: "Thoughts", color: "from-amber-400 to-orange-500" },
  { name: "Life", color: "from-green-400 to-emerald-500" },
];