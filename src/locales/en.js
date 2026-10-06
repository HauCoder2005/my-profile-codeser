const en = {
  nav: {
    about: "About",
    languages: "Languages",
    inspiration: "Philosophy",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    contact: "Contact",
    toggle_theme: "Toggle theme",
    toggle_menu: "Toggle menu",
    switch_lang: "Switch to Vietnamese"
  },
  hero: {
    hello: "Hi there, I'm",
    name: "Huynh Hau",
    role: "Software Engineer",
    description: [
      "I fell in love with programming in high school, the first time I wrote small programs myself and watched a few lines of code turn an idea into something that actually worked. That early curiosity slowly grew into the field I want to pursue seriously and build a long-term career in.",
      "Through my studies and personal projects, I've stopped caring only about making a program \"just work\" and become more and more interested in how a system is designed and run behind the scenes: how data is organized, how components talk to each other, and how to keep code readable, maintainable, and scalable so it stays stable as the system grows.",
      "I've worked on both the back end and the front end, because I like seeing a product as a whole — from data, business logic, and system architecture to how people actually use it. Still, what matters to me isn't knowing as many frameworks as possible, but understanding the real problem, choosing the right technology, and building a clear, effective solution.",
      "I'm especially drawn to software engineering, system design, databases, data processing, and problems that make you think about performance, reliability, and scalability. I often build my own projects to put what I've learned into practice, so I understand things deeply instead of stopping at theory or ready-made tools.",
      "Right now I'm still learning and strengthening my foundations to become a better Software Engineer. I'd love to work somewhere people take engineering seriously, share knowledge freely, solve real problems together, and build products that truly matter to users.",
      "To me, programming isn't just writing code — it's a continuous process of learning, asking questions, solving problems, and turning ideas into systems that work in the real world."
    ],
    download_cv: "Download CV",
    contact_cta: "Say hello"
  },
  languages: {
    title: "Languages",
    hint: "Drag the dial in a circle to spin it, like an old rotary phone",
    prev: "Previous language",
    next: "Next language",
    channel: "CH",
    on_air: "On air",
    no_signal: "Tuning…",
    sound_on: "Turn static sound on",
    sound_off: "Turn static sound off",
    items: {
      java: { focus: "Spring Boot · Back-end", description: "My main back-end language. The Cinema Booking system is built on Java 21 and Spring Boot." },
      typescript: { focus: "NestJS · Next.js", description: "I use it on both ends: APIs with NestJS and interfaces with Next.js. Static types keep large codebases easy to read and change." },
      javascript: { focus: "React · Node.js", description: "The language I first built the web with, and what runs this very page together with Three.js." },
      python: { focus: "Data · AI", description: "For data processing, notebooks, and small automation tools that support my Data Science studies." },
      csharp: { focus: "OOP · .NET", description: "Where I sharpen object-oriented design and get hands-on with the .NET ecosystem." },
      cpp: { focus: "Algorithms · Systems", description: "For practising data structures and algorithms, and for small native tools like toolz-create-folder." }
    }
  },
  arcade: {
    title: "Break time",
    start: "Hover or tap to play",
    hint: "Move your mouse or drag a finger across the screen to steer. The ship fires on its own.",
    game_over: "Game over",
    score: "Score",
    best: "Best",
    lives: "lives left",
    aria: "Mini game: a spaceship shooting down falling asteroids",
    log: {
      playing: "new session started, good luck",
      hit: "asteroid destroyed +{points}",
      escape: "an asteroid got past you",
      over: "ship destroyed"
    }
  },
  inspiration: {
    title: "Philosophy",
    quote_by: "Terry A. Davis",
    rules: [
      { label: "Rule 01", text: "An idiot admires complexity,\na genius admires simplicity." },
      { label: "Rule 02", text: "You can see the code.\nNo black boxes.\nYou're in full control." },
      { label: "Rule 03", text: "I built a compiler,\nan assembler, and a kernel\nfrom scratch." }
    ]
  },
  education: {
    title: "Education",
    items: [
      {
        school: "University of Transport HCMC (UTH)",
        degree: "Data Science",
        timeline: "2023 – 2026",
        status: "Graduating soon",
        description: "Data structures, algorithms, machine learning, and the fundamentals of software engineering.",
      },
      {
        school: "Aptech Computer Education",
        degree: "Advanced Diploma in Software Engineering",
        timeline: "2023 – 2025",
        status: "Graduated",
        description: "Hands-on training in full-stack development, database design, and building business applications.",
      }
    ]
  },
  skills: {
    title: "Skills",
    categories: [
      { title: "Back-end" },
      { title: "Front-end" },
      { title: "Database & Tools" }
    ]
  },
  projects: {
    title: "Projects",
    source: "Source code",
    demo: "Live demo",
    items: [
      {
        title: "AI Mock Interview",
        description: "Practice technical interviews with AI: role-based questions, CV review, and instant feedback. Built with Whisper for speech-to-text and Qwen 2.5 running on Ollama.",
      },
      {
        title: "Cinema Booking",
        description: "Movie ticket booking for a multi-branch cinema chain, with online payment. I designed the 25+ table database and the core booking logic.",
      },
      {
        title: "Shopping Now (Giao)",
        description: "An e-commerce marketplace built around same-day regional delivery, with a pipeline for processing product media.",
      }
    ]
  },
  contact: {
    title: "Let's talk",
    subtitle: "Have an idea, a role, or just want to say hi? My inbox is always open.",
    name: "Name",
    email: "Email",
    message: "Message",
    placeholder_name: "Your name",
    placeholder_email: "you@email.com",
    placeholder_message: "What's on your mind?",
    send: "Send",
    sent: "Your mail app should open with the message ready to send.",
    footer: "© {year} Huynh Hau. Built with React & Three.js."
  }
};

export default en;
