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
    menu: "Chọn game",
    badge: "{count} game",
    game_over: "Hết mạng",
    score: "Điểm",
    best: "Kỷ lục",
    lives: "mạng còn lại",
    games: {
      defender: {
        tagline: "Bắn hạ các thiên thạch đang rơi",
        start: "Di chuột hoặc chạm để chơi",
        hint: "Di chuột hoặc kéo ngón tay ngang màn hình để lái tàu, tàu sẽ tự bắn.",
        aria: "Mini game: tàu vũ trụ bắn hạ các thiên thạch đang rơi",
        log: {
          playing: "phiên chơi mới, chúc may mắn",
          hit: "bắn hạ thiên thạch +{points}",
          escape: "một thiên thạch đã lọt qua",
          over: "tàu đã bị phá hủy"
        }
      },
      runner: {
        tagline: "Nhảy qua hố, lên bậc, né gai. Càng chạy càng nhanh",
        start: "Chạm hoặc bấm Space để chơi",
        hint: "Chạm màn hình hoặc bấm Space / ↑ để nhảy qua hố, lên bậc cao và né gai. Tốc độ tăng dần.",
        aria: "Mini game: nhân vật chạy liên tục, nhảy qua hố và gai",
        log: {
          playing: "bắt đầu chạy, nhảy đi!",
          speed: "tăng tốc · cấp {level}",
          over: "va chạm rồi, hết lượt"
        }
      },
      stack: {
        tagline: "Thả khối gạch, chồng tháp càng cao càng tốt",
        start: "Chạm hoặc bấm Space để chơi",
        hint: "Chạm hoặc bấm Space để thả khối đang trượt. Phần thò ra ngoài sẽ bị cắt mất.",
        aria: "Mini game: thả các khối trượt để chồng thành tháp",
        log: {
          playing: "bắt đầu xây tháp...",
          perfect: "thả chuẩn tuyệt đối!",
          over: "tháp đổ rồi"
        }
      },
      breakout: {
        tagline: "Phá sạch tường gạch",
        start: "Di chuột hoặc chạm để chơi",
        hint: "Di chuột hoặc ngón tay để lái thanh đỡ. Phá hết tường thì bóng sẽ nhanh hơn.",
        aria: "Mini game: đỡ bóng bằng thanh trượt để phá gạch",
        log: {
          playing: "ván mới, giao bóng",
          clear: "phá sạch tường · bóng nhanh hơn",
          miss: "rơi bóng rồi",
          over: "hết bóng"
        }
      }
    }
  },
  inspiration: {
    title: "Triết lý",
    quote_by: "Terry A. Davis",
    rules: [
      { text: "Kẻ ngốc thích phức tạp,\nngười giỏi chọn đơn giản." },
      { text: "Code nằm ngay trước mắt.\nKhông có hộp đen.\nMọi thứ trong tay bạn." },
      { text: "Tôi đã tự viết trình biên dịch,\ntrình hợp dịch và cả nhân\nhệ điều hành từ đầu." }
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
        timeline: "2023 – 2026",
        status: "Tốt nghiệp loại Distinction",
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
    view_details: "Xem chi tiết",
    close: "Đóng",
    modal_overview: "Tổng quan",
    modal_vision: "Bài toán & Tầm nhìn",
    modal_highlights: "Tính năng cốt lõi (Key Features)",
    modal_architecture: "Kiến trúc hệ thống (System Architecture)",
    view_architecture: "Bản vẽ kiến trúc (PDF)",
    view_docs: "Tài liệu hệ thống (Docs)",
    items: [
      {
        title: "RoomBeacons",
        description: "Nền tảng thu thập, xử lý và phân tích dữ liệu bất động sản cho thuê tại TP. Hồ Chí Minh. Xây dựng Data Platform toàn diện kết hợp Software & Data Engineering với Python 3.11+, ClickHouse OLAP, MySQL 8.4, MinIO và Apache Parquet, giải quyết triệt để bài toán phân tán thông tin thị trường.",
        details: {
          tagline: "Location-Aware Rental Discovery & Data Intelligence Platform",
          subtags: "Multi-source Web Crawling · Data Engineering · Data Warehouse · Analytics · Machine Learning",
          overview: "RoomBeacons là nền tảng thu thập, xử lý và phân tích dữ liệu bất động sản cho thuê tại TP. Hồ Chí Minh, kết hợp toàn diện giữa Software Engineering, Data Engineering, Data Analytics và Machine Learning.\n\nDự án giải quyết bài toán thông tin phòng trọ/nhà thuê bị phân tán trên nhiều website, thiếu đồng nhất về giá, diện tích, vị trí và thường xuyên bị lỗi thời.\n\nVòng đời dữ liệu (Data Lifecycle): Nguồn dữ liệu ➔ Thu thập đa nguồn (HTTPX / Playwright) ➔ Lưu trữ Raw Parquet trên MinIO ➔ Xử lý dữ liệu & Kiểm định chất lượng (Data Quality) ➔ Tách 2 nhánh độc lập: MySQL 8.4 (Application DB) & ClickHouse (Data Warehouse OLAP) ➔ Tìm kiếm không gian, EDA / Phân tích thị trường & Machine Learning ➔ Rental Intelligence.",
          vision: "Thực trạng bài toán: Tin đăng bất động sản bị phân tán trên nhiều website, trùng lặp nhiều nguồn, giá cả không đồng nhất định dạng, tin ảo/hết hạn và sai lệch tọa độ địa lý.\n\nTầm nhìn (Vision): Hướng đến một nền tảng hỗ trợ người dùng tìm phòng gần địa điểm mong muốn (bán kính 2 km), lọc theo ngân sách/tiêu chí, so sánh giá tương đương, phân tích xu hướng giá theo khu vực và thời gian, gợi ý thông minh dựa trên nhu cầu cá nhân.\n\nSứ mệnh: 'From fragmented rental listings to structured rental intelligence'.",
          highlights: [
            "Multi-source Web Crawling: Động cơ thu thập đa nguồn qua Source Adapters, tích hợp HTTPX cho web tĩnh và Playwright khi cần render JavaScript, kiểm soát Rate Limiting theo domain, incremental crawling và batch processing.",
            "Raw Data Preservation: Lưu trữ dữ liệu gốc phân vùng theo (Source → Crawl Date → Batch) dưới định dạng Apache Parquet nén ZSTD trên MinIO Object Storage, bảo toàn lịch sử phục vụ replay và Machine Learning.",
            "Data Quality & Validation: Chuẩn hóa giá thuê về VND/tháng, diện tích m², địa chỉ chuẩn hóa, giới hạn phạm vi TP.HCM, kiểm tra tọa độ địa lý, phát hiện dữ liệu trùng lặp và loại bỏ tin không hợp lệ.",
            "Nearby Rental Search (Planned): Tìm kiếm phòng thuê tối ưu trong bán kính 2 km từ vị trí người dùng, tự động kiểm tra tính hợp lệ của tin đăng và sắp xếp theo giá thuê tăng dần.",
            "Rental Price Assessment & Analytics: Phân tích và đánh giá giá thuê dựa trên khu vực, loại hình, diện tích, tiện ích và giá rao thuê của các bất động sản tương đương trên ClickHouse OLAP.",
            "Smart Recommendation (Planned): Gợi ý bất động sản thông minh theo vị trí, ngân sách, diện tích và tiện ích (giai đoạn đầu ưu tiên Rule-based, tiếp nối bởi Machine Learning Ranking)."
          ],
          architecture: "RoomBeacons sử dụng kiến trúc Data Platform phân tách hai luồng xử lý độc lập từ Raw Parquet trên MinIO:\n• Ingestion Engine: Python Crawler Manager điều phối các Source Adapters thu thập đa nguồn, xuất dữ liệu theo Raw Data Contract chuẩn hóa thành các file Parquet nén ZSTD lưu lên MinIO.\n• Application Processing: Pipeline đọc Raw Parquet, làm sạch, chuẩn hóa, lọc tin trùng lặp và ghi vào MySQL 8.4 (Application OLTP) phục vụ tìm kiếm bất động sản.\n• Warehouse Processing: Pipeline độc lập đọc lịch sử từ Parquet, kiểm tra Data Quality, theo dõi biến động giá và nạp vào ClickHouse (OLAP Data Warehouse) phục vụ EDA và Machine Learning.\n• Infrastructure: Đóng gói toàn bộ services bằng Docker Engine & Docker Compose V2, vận hành tối ưu tài nguyên trên Ubuntu Linux.",
          architectureUrl: "https://github.com/HauCoder2005/roombeacon-system/blob/main/architecture/RoomBeacons_Architecture.pdf",
          docsUrl: "https://github.com/HauCoder2005/roombeacon-system/blob/main/docs"
        }
      },
      {
        title: "Cinema Booking",
        description: "Hệ thống đặt vé xem phim quy mô chuỗi rạp đa chi nhánh, tích hợp thanh toán trực tuyến bảo mật. Thiết kế cơ sở dữ liệu hơn 25 bảng và kiến trúc xử lý đặt chỗ thời gian thực.",
        details: {
          tagline: "Nền tảng đặt vé xem phim trực tuyến đa chi nhánh & thanh toán bảo mật",
          overview: "Cinema Booking là hệ thống quản lý và bán vé xem phim toàn diện dành cho chuỗi cụm rạp. Dự án tập trung giải quyết bài toán tải cao khi mở bán các suất chiếu hot, tối ưu truy vấn dữ liệu phức tạp và quản lý trạng thái ghế đa người dùng.",
          highlights: [
            "Thiết kế cơ sở dữ liệu quan hệ chuyên sâu với hơn 25 bảng, chuẩn hóa cấu trúc và tối ưu hóa chỉ mục (indexing).",
            "Cơ chế khóa ghế theo phiên (distributed seat locking) chống tình trạng trùng lặp ghế khi nhiều người cùng đặt vé một lúc.",
            "Tích hợp cổng thanh toán trực tuyến an toàn, quản lý trạng thái đơn hàng và xuất vé điện tử tự động.",
            "Hệ thống quản lý suất chiếu, giá vé linh hoạt theo khung giờ, phòng chiếu và loại ghế (VIP/Standard/Couple)."
          ],
          architecture: "Lõi backend phát triển trên nền Java 21 & Spring Boot kết hợp MySQL. Tích hợp Redis quản lý trạng thái khóa ghế và phiên người dùng. Giao diện frontend xây dựng bằng Next.js mang lại trải nghiệm mượt mà."
        }
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
    footer: "© {year} Huỳnh Hậu. Thiết kế bởi Huỳnh Hậu — Codeser"
  }
};

export default vi;
