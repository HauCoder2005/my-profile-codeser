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
    menu: "Choose a game",
    badge: "{count} games",
    game_over: "Game over",
    score: "Score",
    best: "Best",
    lives: "lives left",
    games: {
      defender: {
        tagline: "Shoot down the falling asteroids",
        start: "Hover or tap to play",
        hint: "Move your mouse or drag a finger across the screen to steer. The ship fires on its own.",
        aria: "Mini game: a spaceship shooting down falling asteroids",
        log: {
          playing: "new session started, good luck",
          hit: "asteroid destroyed +{points}",
          escape: "an asteroid got past you",
          over: "ship destroyed"
        }
      },
      runner: {
        tagline: "Jump gaps, ledges and spikes. It keeps getting faster",
        start: "Tap or press Space to play",
        hint: "Tap the screen or press Space / ↑ to jump across gaps, up ledges and over spikes. The run keeps speeding up.",
        aria: "Mini game: an endless runner jumping across gaps and spikes",
        log: {
          playing: "run started, jump!",
          speed: "speed up · level {level}",
          over: "crashed, run over"
        }
      },
      stack: {
        tagline: "Drop the blocks and stack them as high as you can",
        start: "Tap or press Space to play",
        hint: "Tap or press Space to drop the sliding block. Whatever hangs over the edge gets cut off.",
        aria: "Mini game: stack sliding blocks into a tower",
        log: {
          playing: "deploying the stack...",
          perfect: "perfect drop!",
          over: "the stack fell over"
        }
      },
      breakout: {
        tagline: "Break every brick on the wall",
        start: "Hover or tap to play",
        hint: "Move your mouse or finger to steer the paddle. Clear the wall and the ball gets faster.",
        aria: "Mini game: bounce the ball off a paddle to break bricks",
        log: {
          playing: "new game, ball served",
          clear: "wall cleared · ball speeds up",
          miss: "dropped the ball",
          over: "out of balls"
        }
      }
    }
  },
  inspiration: {
    title: "Philosophy",
    quote_by: "Terry A. Davis",
    rules: [
      { text: "An idiot admires complexity,\na genius admires simplicity." },
      { text: "You can see the code.\nNo black boxes.\nYou're in full control." },
      { text: "I built a compiler,\nan assembler, and a kernel\nfrom scratch." }
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
        timeline: "2023 – 2026",
        status: "Graduated with Distinction",
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
    view_details: "View details",
    close: "Close",
    modal_overview: "Overview",
    modal_vision: "Business Problem & Vision",
    modal_highlights: "Key Features",
    modal_architecture: "System Architecture",
    view_architecture: "Architecture Blueprint (PDF)",
    view_docs: "System Documentation (Docs)",
    items: [
      {
        title: "RoomBeacons",
        description: "Rental housing data platform for Ho Chi Minh City combining Software & Data Engineering with Python 3.11+, ClickHouse OLAP, MySQL 8.4, MinIO, and Apache Parquet. Resolves fragmented rental market data from multi-source crawling to exploratory analytics and machine learning.",
        details: {
          tagline: "Location-Aware Rental Discovery & Data Intelligence Platform",
          subtags: "Multi-source Web Crawling · Data Engineering · Data Warehouse · Analytics · Machine Learning",
          overview: "RoomBeacons is a rental data platform focused on Ho Chi Minh City, bridging Software Engineering, Data Engineering, Data Analytics, and Machine Learning.\n\nThe project addresses fragmented, duplicate, and stale rental listings across disparate websites by establishing a unified data pipeline.\n\nData Lifecycle: Data Sources ➔ Multi-source Ingestion (HTTPX / Playwright) ➔ Raw Parquet on MinIO ➔ Data Processing & Quality Validation ➔ Dual-pipeline split: MySQL 8.4 (Application DB) & ClickHouse (Data Warehouse OLAP) ➔ Spatial Rental Search, EDA / Market Analytics & Machine Learning ➔ Rental Intelligence.",
          vision: "Business Problem: Rental listings are scattered across dozens of platforms with heavy duplicates, inconsistent pricing, invalid/expired ads, and inaccurate coordinates.\n\nVision: Deliver a platform empowering tenants to find rentals within a 2 km radius, filter by budget/criteria, compare fair market prices, analyze neighborhood trends over time, and receive personalized recommendations.\n\nMission: 'From fragmented rental listings to structured rental intelligence'.",
          highlights: [
            "Multi-source Web Crawling: Modular crawling engine with Source Adapters, leveraging HTTPX for fast HTTP requests and Playwright for dynamic JavaScript rendering, per-domain rate limiting, and batch processing.",
            "Raw Data Preservation: Raw datasets stored as ZSTD-compressed Apache Parquet on MinIO Object Storage partitioned by (Source → Crawl Date → Batch), preserving historical data for re-processing and ML modeling.",
            "Data Quality & Validation: Rigorous transformation rules normalizing prices to VND/month, areas to m², address cleansing constrained to HCMC, coordinate verification, deduplication, and invalid listing filtering.",
            "Nearby Rental Search (Planned): Spatial proximity discovery within a default 2 km radius from any selected location, filtering verified listings and ranking by ascending rental price.",
            "Rental Price Assessment & Analytics: Market analytics on ClickHouse Data Warehouse, benchmarking rental prices against comparable nearby properties and estimating fair value by district.",
            "Smart Recommendation (Planned): Multi-criteria recommendation engine matching user location, budget, size, and amenities (Rule-based initially, transitioning to ML ranking)."
          ],
          architecture: "RoomBeacons employs an end-to-end Data Platform architecture splitting two independent processing pipelines from Raw Parquet on MinIO:\n• Ingestion Engine: Python Crawler Manager orchestrating Source Adapters, enforcing the Raw Data Contract, and streaming ZSTD-compressed Parquet files to MinIO.\n• Application Processing: Pipeline reading Raw Parquet, cleaning, normalizing, deduplicating, and persisting application records to MySQL 8.4 (Application OLTP) for real-time rental search.\n• Warehouse Processing: Dedicated pipeline processing historical observations, validating data quality, tracking price fluctuations, and loading analytical datasets into ClickHouse (OLAP Data Warehouse) for EDA and ML.\n• Infrastructure: Services containerized with Docker Engine & Docker Compose V2, running as lightweight containers on Ubuntu Linux.",
          architectureUrl: "https://github.com/HauCoder2005/roombeacon-system/blob/main/architecture/RoomBeacons_Architecture.pdf",
          docsUrl: "https://github.com/HauCoder2005/roombeacon-system/blob/main/docs"
        }
      },
      {
        title: "Cinema Booking",
        description: "Movie ticket reservation system for a multi-branch cinema chain with secure online payments. Designed a 25+ table relational database and real-time seat booking architecture.",
        details: {
          tagline: "Multi-branch movie ticket reservation platform with secure payments",
          overview: "Cinema Booking is a full-featured cinema chain reservation platform built to handle heavy concurrent traffic during blockbuster releases, with complex query optimization and multi-user seat synchronization.",
          highlights: [
            "Designed a robust 25+ table relational schema, highly normalized with query indexing optimizations.",
            "Distributed session-based seat locking to eliminate race conditions and double bookings.",
            "Integrated secure online payment gateway, automated order lifecycle tracking, and electronic ticketing.",
            "Dynamic showtime and pricing engine adjusting across time slots, screens, and seat tiers (VIP/Standard/Couple)."
          ],
          architecture: "Core backend built with Java 21 & Spring Boot on MySQL. Redis manages distributed locks and active checkout sessions. Next.js powers a responsive, interactive frontend."
        }
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
    button: {
      idle: "Send",
      sending: "Sending…",
      sent: "Sent!",
      error: "Try again"
    },
    status: {
      sent: "Message delivered. I'll get back to you soon ✓",
      error: "Couldn't send it. Check your connection and try again."
    },
    copy_email: "Copy email",
    copied: "Copied!",
    footer: "© {year} Huynh Hau. Designed by Huynh Hau — Codeser"
  }
};

export default en;
