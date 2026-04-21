import type { SvgIconComponent } from "@mui/icons-material";
import {
  GitHub,
  LinkedIn,
  Facebook,
  Instagram,
  Email,
  Language,
  Terminal,
  Storage,
  Web,
  AutoAwesome,
  School,
  PhoneIphone,
  Code,
  Bolt,
  Dns,
  Security,
  Build,
} from "@mui/icons-material";

/** ========== PROFILE ========== */
export const profile = {
  fullName: "Huỳnh Hậu",
  alias: "codeser",
  headline: "Software Engineer • Backend-first • Full-stack capable",
  location: "TP. Hồ Chí Minh, Việt Nam",
  goal:
    "Xây dựng hệ thống có cấu trúc rõ ràng, hiệu năng tốt và trải nghiệm gọn gàng từ backend tới frontend.",
  shortBio: [
    "Backend mạnh với Java Spring Boot, NestJS và Node.js theo từng bài toán.",
    "Frontend tập trung ReactJS, NextJS, TypeScript và trải nghiệm UI có nhịp tốt.",
    "Database ưu tiên MySQL, SQL Server, tối ưu schema, query và indexing.",
  ],
};

/** ========== SKILLS (pages/Skills.tsx cần skillCategories) ========== */
export type SkillCategory = {
  title: string;
  icon: SvgIconComponent;
  items: string[];
};


/*SKILL*/
export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    icon: Web,
    items: [
      "ReactJS, NextJS, TypeScript",
      "TailwindCSS, Material UI",
      "Responsive UI, component architecture",
      "Framer Motion, interaction flow",
      "Figma handoff, layout control",
    ],
  },
  {
    title: "Backend",
    icon: Storage,
    items: [
      "Java Core, Spring Boot, REST API",
      "NestJS, module architecture, DTO, guard",
      "API Gateway, service boundary, webhook handler",
      "Order service, payment service, provider adapter",
      "Validation, pagination, DTO, mapper",
      "Security, auth flow, RBAC",
      "Node.js service layer",
    ],
  },
  {
    title: "Database",
    icon: Dns,
    items: [
      "MySQL, SQL Server, MongoDB",
      "Schema design, FK, indexing",
      "JOIN, GROUP BY, subquery",
      "Query plan, optimization mindset",
      "Transaction and data integrity",
      "Media metadata, transaction status, webhook log",
    ],
  },
  {
    title: "Integration",
    icon: Security,
    items: [
      "VNPay, MoMo, card payment integration",
      "Webhook verify, callback processing, status sync",
      "Email flow, OTP, external provider communication",
      "Auth, catalog, checkout, orders, users shop module split",
    ],
  },
  {
    title: "Infra",
    icon: Build,
    items: [
      "Redis cache, temp status, idempotency",
      "RabbitMQ queue, payment event, media job",
      "MinIO object storage, file pipeline",
      "Python worker for resize, compress, convert",
      "Upload hub, media hub, processing orchestration",
    ],
  },
  {
    title: "Analysis",
    icon: AutoAwesome,
    items: [
      "Use case, user story, scope breakdown",
      "Flow mapping and edge-case review",
      "Wireframe and API specification",
      "Product value and feature priority",
      "Order lifecycle and shipment tracking flow",
      "Voucher, flash sale, pricing rule mapping",
    ],
  },
  {
    title: "Workflow",
    icon: Terminal,
    items: [
      "Git, GitHub, branch workflow",
      "Linux terminal and debugging",
      "Modular structure, clean code",
      "Testing mindset by business flow",
      "Email OTP flow and role permission mapping",
    ],
  },
];
/** ========== EDUCATION (pages/Education.tsx cần education) ========== */
export type EducationItem = {
  title: string;
  subtitle: string;
  icon: SvgIconComponent;
  period: string;
  description: string[];
  imageUrl?: string; 
  imageHint?: string; 
};

export const education: EducationItem[] = [
  {
    title: "University of Transport and Communications (UTH) — TP.HCM",
    subtitle: "Data Science",
    icon: School,
    period: "Đang theo học",
    imageUrl: "/images/uth.jpg", 
    description: [
      "Học nền tảng phân tích dữ liệu, xử lý dữ liệu, mô hình hoá và đánh giá.",
      "Làm dự án, báo cáo và thuyết trình theo chuẩn học phần.",
    ],
  },
  {
    title: "Aptech Computer Education — TP.HCM",
    subtitle: "Advanced Diploma in Software Engineering (ADSE)",
    icon: Code,
    period: "Đang theo học",
    imageUrl: "/images/aptech.jpg", 
    description: [
      "Chương trình đào tạo chuyên sâu về Kỹ thuật Phần mềm: OOP, Database, Full-stack.",
      "Tập trung tư duy kỹ sư: chuẩn hoá codebase, triển khai dự án thực tế, tài liệu kỹ thuật.",
    ],
  },
];

/** ========== PROJECTS (pages/Projects.tsx cần projects) ========== */
/** ========== PROJECTS (pages/Projects.tsx cần projects) ========== */
export type ProjectItem = {
  name: string;
  role: string;
  description: string[];
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  imageHint?: string;
};

export const projects: ProjectItem[] = [
  {
    name: "Shopping Now",
    role: "E-commerce marketplace",
    description: [
      "Nền tảng thương mại điện tử cho thị trường Việt Nam theo mô hình nhiều shop cùng bán hàng.",
      "Bao gồm xác thực email OTP, role permission riêng, quản lý sản phẩm, giỏ hàng, đặt hàng, thanh toán, voucher, flash sale và theo dõi hành trình đơn hàng.",
    ],
    tags: ["NextJS", "NestJS", "Marketplace", "Order Tracking"],
    repoUrl: "#",
    liveUrl: "#",
  },
  {
    name: "LinhLoanSG Company Website",
    role: "Website giới thiệu doanh nghiệp",
    description: [
      "Website giới thiệu công ty Cung cấp vật liệu xây dựng và đầu tư Linh Loan Sài Gòn.",
      "Tập trung vào bố cục giới thiệu dịch vụ, nội dung rõ ràng và trải nghiệm duyệt mạch lạc.",
    ],
    tags: ["Company", "Website", "UI/UX", "Frontend"],
    repoUrl: "https://github.com/HauCoder2005/company-LinhLoanSG",
    liveUrl: "https://haucoder2005.github.io/company-LinhLoanSG/",
  },
  {
    name: "Toolz – Get All Courses UTH",
    role: "Tool/Automation hỗ trợ đăng ký học phần",
    description: [
      "Tool giúp lấy danh sách học phần và hỗ trợ đăng ký khi trang trường bị quá tải/sập, thông qua API.",
      "Mục tiêu là giảm thao tác thủ công, tăng tốc độ xử lý và chủ động khi hệ thống gặp sự cố.",
    ],
    tags: ["Tooling", "Automation", "API", "UTH"],
    repoUrl: "https://github.com/HauCoder2005/Toolz-get-all-courses-UTH",
    liveUrl: "#",
  },
  {
    name: "BeachesOfBeauty (Full-stack)",
    role: "Full-stack Project • Content/Discovery",
    description: [
      "Dự án full-stack giới thiệu các bãi biển nổi tiếng trên thế giới.",
      "Người dùng có thể xem thông tin địa điểm, điểm nổi bật và trải nghiệm gợi ý.",
    ],
    tags: ["Full-stack", "Discovery", "Content", "Web App"],
    repoUrl: "https://github.com/HauCoder2005/BeachesOfBeauty",
    liveUrl: "#",
  },
  {
    name: "CanTeenGo",
    role: "Ứng dụng đặt đồ ăn căn tin",
    description: [
      "Ứng dụng đặt đồ ăn trong căn tin: cho phép đặt trong số lượng (suất) đồ ăn có sẵn.",
      "Tập trung vào luồng đặt món nhanh, rõ ràng và phù hợp môi trường căn tin.",
    ],
    tags: ["Ordering", "Canteen", "App Flow", "CRUD"],
    repoUrl: "https://github.com/HauCoder2005/CanTeenGo",
    liveUrl: "#",
  },
  {
    name: "Cinema Booking System",
    role: "Booking platform",
    description: [
      "Hệ thống quản lý rạp chiếu phim cho phép khách đặt chỗ/đặt vé online.",
      "Triển khai theo từng module: phim, lịch chiếu, phòng ghế, đặt vé, thanh toán và quản trị.",
    ],
    tags: ["Booking", "Backend", "Frontend", "Payment"],
    repoUrl: "#",
    liveUrl: "#",
  },
];

/** ========== MOBILE REPOS (pages/MobileRepos.tsx cần mobileRepos) ========== */
export type MobileRepoItem = {
  name: string;
  icon: SvgIconComponent;
  description: string[];
  tech: string[];
  repoUrl?: string;
  imageHint?: string;
};

export const mobileRepos: MobileRepoItem[] = [
  {
    name: "Responsive Web Profile",
    icon: PhoneIphone,
    description: [
      "Bản giao diện profile tối ưu cho màn nhỏ với bố cục rõ ràng, thao tác nhanh và typography lớn hơn.",
      "Tập trung vào responsive layout, touch target và nhịp chuyển động nhẹ.",
    ],
    tech: ["React", "Responsive UI", "Motion"],
    repoUrl: "#",
  },
  {
    name: "Mini Tool Interface",
    icon: Bolt,
    description: ["Mini tool thiên về tốc độ thao tác, trạng thái rõ và luồng sử dụng ngắn gọn."],
    tech: ["React", "Offline-first"],
    repoUrl: "#",
  },
];

/** ========== SOCIALS (pages/Social.tsx cần socials) ========== */
export type SocialLink = {
  label: string;
  icon: SvgIconComponent;
  url: string;
  hint?: string;
};

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    icon: GitHub,
    url: "https://github.com/HauCoder2005",
    hint: "GitHub profile",
  },
  {
    label: "LinkedIn",
    icon: LinkedIn,
    url: "https://www.linkedin.com/in/huynh-hau-602a91341/",
    hint: "LinkedIn profile",
  },
  {
    label: "Facebook",
    icon: Facebook,
    url: "https://www.facebook.com/share/1FZRHu88Bd/?mibextid=wwXIfr",
    hint: "Facebook",
  },
  {
    label: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/codeser_dev?igsh=MW5uOHdlbHEwZnd2OA%3D%3D&utm_source=qr",
    hint: "Instagram",
  },
  {
    label: "Email",
    icon: Email,
    url: "mailto:haucoderfullstack05@gmail.com",
    hint: "haucoderfullstack05@gmail.com",
  },
];

export type TechVisual = {
  name: string;
  image: string;
  tone: string;
};

export const techVisuals: TechVisual[] = [
  { name: "React", image: "/images/tech/react.svg", tone: "from-indigo-500/18 to-slate-300/5" },
  { name: "NextJS", image: "/images/tech/nextjs.svg", tone: "from-slate-700/18 to-slate-300/5" },
  { name: "NestJS", image: "/images/tech/nestjs.svg", tone: "from-indigo-400/18 to-slate-400/5" },
  { name: "TypeScript", image: "/images/tech/typescript.svg", tone: "from-indigo-500/18 to-slate-300/5" },
  { name: "JavaScript", image: "/images/tech/javascript.svg", tone: "from-slate-500/18 to-indigo-300/5" },
  { name: "Java", image: "/images/tech/java.svg", tone: "from-slate-600/18 to-indigo-300/5" },
  { name: "Spring", image: "/images/tech/spring.svg", tone: "from-slate-500/18 to-indigo-200/5" },
  { name: "NodeJS", image: "/images/tech/nodejs.svg", tone: "from-slate-700/18 to-indigo-200/5" },
  { name: "MySQL", image: "/images/tech/mysql.svg", tone: "from-indigo-500/18 to-slate-300/5" },
  { name: "SQL Server", image: "/images/tech/sqlserver.svg", tone: "from-slate-700/18 to-indigo-200/5" },
  { name: "Tailwind", image: "/images/tech/tailwindcss.svg", tone: "from-indigo-400/18 to-slate-300/5" },
  { name: "Git", image: "/images/tech/git.svg", tone: "from-slate-700/18 to-indigo-300/5" },
  { name: "GitHub", image: "/images/tech/github.svg", tone: "from-slate-700/18 to-slate-300/5" },
  { name: "Figma", image: "/images/tech/figma.svg", tone: "from-indigo-400/18 to-slate-300/5" },
];
