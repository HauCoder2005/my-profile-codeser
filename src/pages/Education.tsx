import React from "react";
import { motion } from "framer-motion";
import { container, itemUp } from "../utils/motion";
import { SectionHeading } from "../components/SectionHeading";
import { GlassCard } from "../components/GlassCard";
import { education } from "../data/profile";
import { Link } from "react-router-dom";
import { Public, PointOfSale, LocalMovies } from "@mui/icons-material";

type EducationWithImage = (typeof education)[number] & {
  imageUrl?: string;
};

export default function Education() {
  return (
    <motion.div
      variants={container(0.04)}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      <SectionHeading
        eyebrow="LEARNING"
        title="Học vấn"
        subtitle="Data Science tại UTH • Software Engineer tại Aptech TP.HCM — nền tảng + thực chiến."
      />

      <div className="grid gap-6">
        {(education as EducationWithImage[]).map((e, idx) => {
          const Icon = e.icon;

          return (
            <GlassCard key={e.title} delayIndex={idx}>
              <motion.div variants={itemUp(0.02 * idx)} className="flex gap-4">
                {/* Logo/Icon (gọn đẹp) */}
                <div
                  className="w-12 h-12 rounded-2xl overflow-hidden shrink-0
                             bg-white/70 dark:bg-white/5 backdrop-blur-xl
                             border border-slate-200/60 dark:border-white/10
                             shadow-sm flex items-center justify-center"
                  title={e.imageUrl ? "Logo" : "Icon"}
                >
                  {e.imageUrl ? (
                    <img
                      src={e.imageUrl}
                      alt={`${e.title} logo`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <Icon />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="text-lg md:text-xl font-black">
                        {e.title}
                      </div>
                      <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                        {e.subtitle}
                      </div>
                    </div>

                    <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-extrabold border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5">
                      {e.period}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                    {e.description.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>

                  {/* Hint nếu chưa có imageUrl */}
                  {!e.imageUrl ? (
                    <div className="mt-4 text-xs text-slate-600 dark:text-slate-300">
                      (Gợi ý: thêm{" "}
                      <code className="px-1.5 py-0.5 rounded bg-slate-900/5 dark:bg-white/10">
                        imageUrl
                      </code>{" "}
                      trong{" "}
                      <code className="px-1.5 py-0.5 rounded bg-slate-900/5 dark:bg-white/10">
                        src/data/profile.ts
                      </code>{" "}
                      để hiện logo)
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard delayIndex={12}>
        <div className="grid gap-5">
          <div className="text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
            <b>Note (Aptech):</b> Trong quá trình học tại Aptech, mình bắt đầu
            làm dự án từ những ngày đầu còn “chập chững”. Dưới đây là 3 dự án
            tiêu biểu theo từng giai đoạn:
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Project 1 */}
            <motion.div
              variants={itemUp(0.02)}
              className="rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl border border-slate-200/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/10 flex items-center justify-center">
                  <Public fontSize="small" />
                </div>
                <div className="font-black text-slate-900 dark:text-slate-100">
                  Dự án đầu tay
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                Website giới thiệu &amp; review các bãi biển đẹp trên thế giới.
                Mình tập trung vào nội dung và cách trình bày: mô tả điểm nổi
                bật, trải nghiệm nên thử và lý do mỗi bãi biển đáng đến.
              </div>

              <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                * Lúc này mình mới làm quen dự án nên frontend/backend chưa đầy
                đủ và chưa biết deploy.
              </div>
            </motion.div>

            {/* Project 2 */}
            <motion.div
              variants={itemUp(0.04)}
              className="rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl border border-slate-200/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/10 flex items-center justify-center">
                  <PointOfSale fontSize="small" />
                </div>
                <div className="font-black text-slate-900 dark:text-slate-100">
                  Dự án thứ hai
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                Ứng dụng bán hàng dạng desktop bằng Java (Spring). Có 2 nhóm
                người dùng chính: <b>Admin</b> và <b>Nhân viên</b>. Chức năng:
                đăng nhập phân quyền, bán hàng, quản lý nhân viên, in bill, tính
                tiền + voucher/khuyến mãi.
              </div>
            </motion.div>

            {/* Project 3 */}
            <motion.div
              variants={itemUp(0.06)}
              className="rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl border border-slate-200/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/10 flex items-center justify-center">
                  <LocalMovies fontSize="small" />
                </div>
                <div className="font-black text-slate-900 dark:text-slate-100">
                  Dự án gần đây nhất
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                Hệ thống quản lý rạp chiếu phim cho phép khách đặt chỗ/đặt vé
                online. Hiện mình đang triển khai demo theo từng module để mở
                rộng dần.
              </div>
            </motion.div>
          </div>

          <div className="pt-1">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-extrabold
                   bg-slate-900 text-white hover:bg-slate-950 transition-colors shadow-sm hover:shadow"
            >
              Xem demo/chi tiết tại Projects →
            </Link>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
