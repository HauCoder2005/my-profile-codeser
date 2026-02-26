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
  headline: "Software Engineer (Backend-oriented) • Full-stack ready",
  location: "TP. Hồ Chí Minh, Việt Nam",
  goal:
    "Mục tiêu của mình là trở thành một Kỹ sư Phần mềm đúng nghĩa: hiểu vấn đề, thiết kế giải pháp, viết code có cấu trúc, tối ưu hiệu năng, và ship sản phẩm thật sự dùng được.",
  shortBio: [
    "Backend: Java (Spring Boot), mở rộng C# (ASP.NET Core) và Node.js để linh hoạt theo dự án.",
    "Frontend: ReactJS và level-up NextJS để scale sản phẩm tốt hơn.",
    "Database: MySQL/SQL Server + tư duy tối ưu query, indexing, schema chuẩn.",
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
    title: "Frontend (React / Next / UI)",
    icon: Web,
    items: [
      "ReactJS: Router, Hooks, Component patterns",
      "NextJS: App Router, SSR/CSR, SEO basics, API patterns",
      "TypeScript / JavaScript (strict typing, clean component API)",
      "UI Libraries: Material UI (MUI) • Bootstrap",
      "Styling: TailwindCSS (design system, responsive, dark mode)",
      "Design tool: Figma (layout, component, handoff cơ bản)",
      "Animation: Framer Motion (stagger, transitions, micro-interactions)",
      "CRUD UI chuẩn dự án: form state + validation + loading/error/empty states",
      "Data table: pagination/filter/sort/search UI + debounced search",
      "Optimistic update (cơ bản) + cache invalidation mindset (React Query)",
      "UX basics: spacing, typography hierarchy, accessibility mindset",
    ],
  },

  {
    title: "Backend (Java / C# / Node)",
    icon: Storage,
    items: [
      "Java Core: OOP, collections, clean code",
      "Spring Boot: REST API, validation, pagination/filter, DTO/Mapper",
      "Spring Security: Authentication, Authorization, RBAC",
      "CRUD REST chuẩn dự án: validate input + error handling (400/404/409/500)",
      "Pagination / Sorting / Filtering / Search cho danh sách API",
      "AuthN/AuthZ: JWT/session cơ bản + RBAC (Admin/Nhân viên/Client)",
      "DTO/Mapper + response shape nhất quán, convention đặt endpoint",
      "Upload media/file: size/format limit, path, fallback, security basics",
      "Logging/Audit: ai tạo/sửa/xoá, timestamp, trace để debug",
      "C#: fundamentals, OOP, ASP.NET Core (learning)",
      "Node.js: REST API, MVC pattern (learning)",
      "API design: status codes, consistent response shape, versioning cơ bản",
    ],
  },

  {
    title: "Database & DBMS (MySQL / SQL Server)",
    icon: Dns,
    items: [
      "MySQL: schema design, constraints, FK, indexing",
      "SQL Server: fundamentals, query & management basics",
      "SQL advanced: JOIN, GROUP BY, HAVING, subquery, window basics",
      "Normalization: 1NF–3NF, tránh duplication, đảm bảo data integrity",
      "Data integrity: FK, UNIQUE, CHECK, cascade rules đúng nghiệp vụ",
      "Index strategy: B-Tree, composite index, covering index (tư duy chọn index)",
      "Query optimization: EXPLAIN, đọc query plan, tối ưu slow query",
      "Transactions: ACID, isolation levels, xử lý deadlock/cạnh tranh dữ liệu",
      "Concurrency: hiểu lost update, phantom read (cơ bản) + cách giảm rủi ro",
      "Stored procedures / views (cơ bản), backup/restore (tư duy vận hành)",
    ],
  },

  {
    title: "Business Analysis (BA) / Product Thinking",
    icon: AutoAwesome,
    items: [
      "Thu thập yêu cầu: user story, use case, scope rõ ràng",
      "Phân tích nghiệp vụ: actor, luồng chính/phụ, edge cases",
      "Wireframe/flow: mô tả màn hình, hành vi, trạng thái UI",
      "Tài liệu hoá: PRD đơn giản, spec API, acceptance criteria",
      "Tư duy sản phẩm: ưu tiên feature theo giá trị & tác động",
    ],
  },

  {
    title: "Tools & Workflow",
    icon: Terminal,
    items: [
      "Git/GitHub workflow (branching, merge, conflict resolve)",
      "Linux terminal workflow (dev environment)",
      "Debug có hệ thống (log, reproduce, isolate, fix)",
      "Code organization: modular, clean architecture mindset",
      "Testing mindset: test case cơ bản theo luồng nghiệp vụ",
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
    imageHint: ">> Thêm ảnh UTH tại đây <<",
  },
  {
    title: "Aptech Computer Education — TP.HCM",
    subtitle: "Advanced Diploma in Software Engineering (ADSE)",
    icon: Code,
    period: "Đang theo học",
    imageUrl: "/images/aptech.jpg", 
    description: [
      "Chương trình đào tạo chuyên sâu về Kỹ thuật Phần mềm: OOP, System Design, Database, Full-stack.",
      "Tập trung tư duy kỹ sư: chuẩn hoá codebase, triển khai dự án thực tế, tài liệu kỹ thuật.",
    ],
    imageHint: ">> Thêm ảnh Aptech tại đây <<",
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
    name: "LinhLoanSG Company Website",
    role: "Website giới thiệu doanh nghiệp",
    description: [
      "Website giới thiệu công ty Cung cấp vật liệu xây dựng và đầu tư Linh Loan Sài Gòn.",
      "Tập trung vào nội dung giới thiệu, thông tin dịch vụ, và định hướng trình bày rõ ràng cho khách hàng tham khảo.",
      "Chi tiết kỹ thuật / demo: xem trong phần Repo.",
    ],
    tags: ["Company", "Website", "UI/UX", "Frontend"],
    repoUrl: "https://github.com/HauCoder2005/company-LinhLoanSG",
    liveUrl: "#",
    imageHint: ">> Thêm ảnh/screenshot giao diện dự án tại đây <<",
  },
  {
    name: "Toolz – Get All Courses UTH",
    role: "Tool/Automation hỗ trợ đăng ký học phần",
    description: [
      "Tool giúp lấy danh sách học phần và hỗ trợ đăng ký khi trang trường bị quá tải/sập, thông qua API.",
      "Mục tiêu: giảm thao tác thủ công, tăng tốc độ xử lý và chủ động khi hệ thống gặp sự cố.",
      "Chi tiết cách chạy và API: xem trong phần Repo.",
    ],
    tags: ["Tooling", "Automation", "API", "UTH"],
    repoUrl: "https://github.com/HauCoder2005/Toolz-get-all-courses-UTH",
    liveUrl: "#",
    imageHint: ">> Thêm ảnh CLI/log/demo output tại đây <<",
  },
  {
    name: "BeachesOfBeauty (Full-stack)",
    role: "Full-stack Project • Content/Discovery",
    description: [
      "Dự án full-stack giới thiệu các bãi biển nổi tiếng trên thế giới.",
      "Người dùng có thể xem online để tham khảo địa điểm muốn đến: mô tả, điểm nổi bật và trải nghiệm gợi ý.",
      "Chi tiết tính năng và cấu trúc hệ thống: xem trong phần Repo (Projects).",
    ],
    tags: ["Full-stack", "Discovery", "Content", "Web App"],
    repoUrl: "https://github.com/HauCoder2005/BeachesOfBeauty",
    liveUrl: "#",
    imageHint: ">> Thêm ảnh trang listing/detail bãi biển tại đây <<",
  },
  {
    name: "CanTeenGo",
    role: "Ứng dụng đặt đồ ăn căn tin",
    description: [
      "Ứng dụng đặt đồ ăn trong căn tin: cho phép đặt trong số lượng (suất) đồ ăn có sẵn.",
      "Tập trung vào luồng đặt món nhanh, rõ ràng và phù hợp môi trường căn tin.",
      "Chi tiết mô hình dữ liệu và luồng đặt món: xem trong phần Repo.",
    ],
    tags: ["Ordering", "Canteen", "App Flow", "CRUD"],
    repoUrl: "https://github.com/HauCoder2005/CanTeenGo",
    liveUrl: "#",
    imageHint: ">> Thêm ảnh giao diện đặt món/giỏ hàng tại đây <<",
  },
  {
    name: "Cinema Booking System",
    role: "Đang triển khai • Coming soon",
    description: [
      "Hệ thống quản lý rạp chiếu phim cho phép khách đặt chỗ/đặt vé online.",
      "Đang triển khai theo từng module: phim, lịch chiếu, phòng/ghế, đặt vé, thanh toán và quản trị.",
      "Demo/chi tiết sẽ cập nhật sớm khi hoàn thiện các phần chính.",
    ],
    tags: ["Coming soon", "Booking", "System Design", "Backend + Frontend"],
    repoUrl: "#",
    liveUrl: "#",
    imageHint: ">> Thêm ảnh ERD / UI / flow booking tại đây <<",
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
    name: "Mobile Repo Placeholder 01",
    icon: PhoneIphone,
    description: [
      "Repo mobile/PWA để show chạy tốt trên điện thoại.",
      "Bạn thay nội dung theo repo thật của bạn.",
    ],
    tech: ["React Native / PWA", "API integration", "UI"],
    repoUrl: "#",
    imageHint: ">> Thêm ảnh demo mobile tại đây <<",
  },
  {
    name: "Mobile Repo Placeholder 02",
    icon: Bolt,
    description: ["Mini tool / app nhỏ để showcase UX & tốc độ."],
    tech: ["React", "Offline-first"],
    repoUrl: "#",
    imageHint: ">> Thêm ảnh demo mobile tại đây <<",
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