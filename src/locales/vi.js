const vi = {
  nav: {
    about: "Giới thiệu",
    languages: "Ngôn ngữ",
    inspiration: "Triết lý",
    education: "Học vấn",
    skills: "Kỹ năng",
    projects: "Dự án",
    contact: "Liên hệ",
    toggle_theme: "Đổi giao diện sáng/tối",
    toggle_menu: "Mở menu",
    switch_lang: "Chuyển sang tiếng Anh"
  },
  hero: {
    hello: "Xin chào, mình là",
    name: "Huỳnh Hậu",
    role: "Software Engineer",
    description: [
      "Mình bắt đầu yêu thích lập trình từ những năm cấp 3, khi lần đầu được tự tay viết những chương trình nhỏ và nhìn thấy những dòng code có thể biến một ý tưởng thành thứ thực sự hoạt động. Từ sự tò mò ban đầu đó, lập trình dần trở thành lĩnh vực mà mình muốn theo đuổi nghiêm túc và phát triển lâu dài.",
      "Trong quá trình học tập và thực hiện các dự án cá nhân, mình không chỉ tập trung vào việc làm cho chương trình “chạy được”, mà ngày càng quan tâm nhiều hơn đến cách một hệ thống được thiết kế và vận hành phía sau: dữ liệu được tổ chức như thế nào, các thành phần giao tiếp với nhau ra sao, làm thế nào để code dễ đọc, dễ bảo trì, có thể mở rộng và vẫn hoạt động ổn định khi hệ thống trở nên lớn hơn.",
      "Mình có trải nghiệm phát triển cả back-end lẫn front-end, vì mình thích được nhìn một sản phẩm dưới góc nhìn toàn diện — từ dữ liệu, logic nghiệp vụ và kiến trúc hệ thống cho đến cách người dùng thực sự tương tác với sản phẩm. Tuy nhiên, điều mình quan tâm không nằm ở việc biết thật nhiều framework, mà là hiểu được bản chất của vấn đề, lựa chọn công nghệ phù hợp và xây dựng một giải pháp rõ ràng, hiệu quả.",
      "Mình đặc biệt hứng thú với software engineering, system design, database, data processing và những bài toán yêu cầu suy nghĩ về hiệu năng, tính ổn định cũng như khả năng mở rộng của hệ thống. Mình cũng thường xuyên tự xây dựng các dự án để thử nghiệm những kiến thức đã học, từ đó hiểu sâu hơn thay vì chỉ dừng lại ở lý thuyết hoặc việc sử dụng công cụ có sẵn.",
      "Hiện tại, mình vẫn đang trong quá trình học hỏi và hoàn thiện nền tảng để trở thành một Software Engineer tốt hơn. Mình mong muốn được làm việc trong một môi trường mà mọi người nghiêm túc với kỹ thuật, sẵn sàng chia sẻ kiến thức, cùng nhau giải quyết những vấn đề thực tế và xây dựng những sản phẩm thực sự có giá trị cho người dùng.",
      "Với mình, lập trình không đơn thuần là viết code — đó là quá trình liên tục học hỏi, đặt câu hỏi, giải quyết vấn đề và biến những ý tưởng thành những hệ thống có thể hoạt động trong thực tế."
    ],
    download_cv: "Tải CV",
    contact_cta: "Nhắn cho mình"
  },
  languages: {
    title: "Ngôn ngữ",
    hint: "Kéo vòng quay theo hình tròn để xoay, như điện thoại quay số ngày xưa",
    prev: "Ngôn ngữ trước",
    next: "Ngôn ngữ tiếp theo",
    channel: "KÊNH",
    on_air: "Đang phát",
    no_signal: "Đang dò kênh…",
    sound_on: "Bật tiếng rè",
    sound_off: "Tắt tiếng rè",
    items: {
      java: { focus: "Spring Boot · Back-end", description: "Ngôn ngữ back-end chính của mình. Hệ thống Cinema Booking được xây dựng bằng Java 21 và Spring Boot." },
      typescript: { focus: "NestJS · Next.js", description: "Dùng cho cả hai đầu: API với NestJS và giao diện với Next.js. Kiểu tĩnh giúp codebase lớn vẫn dễ đọc, dễ sửa." },
      javascript: { focus: "React · Node.js", description: "Ngôn ngữ đầu tiên mình dùng để làm web, và cũng là thứ đang chạy trang này cùng Three.js." },
      python: { focus: "Data · AI", description: "Dùng để xử lý dữ liệu, chạy notebook và viết các công cụ tự động hoá nhỏ, phục vụ ngành Khoa học dữ liệu mình đang học." },
      csharp: { focus: "OOP · .NET", description: "Ngôn ngữ mình dùng để rèn tư duy lập trình hướng đối tượng và làm quen với hệ sinh thái .NET." },
      cpp: { focus: "Thuật toán · Hệ thống", description: "Dùng để luyện cấu trúc dữ liệu, thuật toán và viết những công cụ nhỏ chạy trực tiếp trên máy, như toolz-create-folder." }
    }
  },
  arcade: {
    title: "Giải lao",
    start: "Di chuột hoặc chạm để chơi",
    hint: "Di chuột hoặc kéo ngón tay ngang màn hình để lái tàu, tàu sẽ tự bắn.",
    game_over: "Hết mạng",
    score: "Điểm",
    best: "Kỷ lục",
    lives: "mạng còn lại",
    aria: "Mini game: tàu vũ trụ bắn hạ các thiên thạch đang rơi",
    log: {
      playing: "phiên chơi mới, chúc may mắn",
      hit: "bắn hạ thiên thạch +{points}",
      escape: "một thiên thạch đã lọt qua",
      over: "tàu đã bị phá hủy"
    }
  },
  inspiration: {
    title: "Triết lý",
    quote_by: "Terry A. Davis",
    rules: [
      { label: "Nguyên tắc 01", text: "Kẻ ngốc thích phức tạp,\nngười giỏi chọn đơn giản." },
      { label: "Nguyên tắc 02", text: "Code nằm ngay trước mắt.\nKhông có hộp đen.\nMọi thứ trong tay bạn." },
      { label: "Nguyên tắc 03", text: "Tôi đã tự viết trình biên dịch,\ntrình hợp dịch và cả nhân\nhệ điều hành từ đầu." }
    ]
  },
  education: {
    title: "Học vấn",
    items: [
      {
        school: "Đại học Giao thông Vận tải TP.HCM (UTH)",
        degree: "Khoa học dữ liệu",
        timeline: "2023 – 2026",
        status: "Sắp tốt nghiệp",
        description: "Cấu trúc dữ liệu, thuật toán, machine learning và nền tảng kỹ thuật phần mềm.",
      },
      {
        school: "Aptech Computer Education",
        degree: "Kỹ sư Phần mềm Quốc tế",
        timeline: "2023 – 2025",
        status: "Đã tốt nghiệp",
        description: "Học thực hành full-stack, thiết kế cơ sở dữ liệu và xây dựng ứng dụng cho doanh nghiệp.",
      }
    ]
  },
  skills: {
    title: "Kỹ năng",
    categories: [
      { title: "Back-end" },
      { title: "Front-end" },
      { title: "Database & Công cụ" }
    ]
  },
  projects: {
    title: "Dự án",
    source: "Mã nguồn",
    demo: "Xem demo",
    items: [
      {
        title: "AI Mock Interview",
        description: "Luyện phỏng vấn kỹ thuật cùng AI: câu hỏi theo vị trí, góp ý CV và phản hồi ngay. Dùng Whisper để chuyển giọng nói thành chữ và Qwen 2.5 chạy trên Ollama.",
      },
      {
        title: "Cinema Booking",
        description: "Đặt vé xem phim cho chuỗi rạp nhiều chi nhánh, có thanh toán online. Mình thiết kế cơ sở dữ liệu hơn 25 bảng và phần logic đặt vé chính.",
      },
      {
        title: "Shopping Now (Giao)",
        description: "Sàn thương mại điện tử tập trung vào giao hàng trong ngày theo khu vực, có pipeline xử lý hình ảnh và video sản phẩm.",
      }
    ]
  },
  contact: {
    title: "Trò chuyện nhé",
    subtitle: "Bạn có ý tưởng, cơ hội việc làm hay chỉ muốn chào một câu? Cứ nhắn mình nhé.",
    name: "Tên",
    email: "Email",
    message: "Lời nhắn",
    placeholder_name: "Tên của bạn",
    placeholder_email: "ban@email.com",
    placeholder_message: "Bạn muốn nói gì?",
    button: {
      idle: "Gửi",
      sending: "Đang gửi…",
      sent: "Đã gửi!",
      error: "Gửi lại"
    },
    status: {
      sent: "Đã gửi tin nhắn. Mình sẽ phản hồi sớm nhé ✓",
      error: "Chưa gửi được. Kiểm tra kết nối mạng rồi thử lại nhé."
    },
    copy_email: "Copy email",
    copied: "Đã copy!",
    footer: "© {year} Huỳnh Hậu. Làm bằng React & Three.js."
  }
};

export default vi;
