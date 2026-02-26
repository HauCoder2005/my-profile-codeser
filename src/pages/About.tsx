import React from "react";
import { motion } from "framer-motion";
import { container, itemUp } from "../utils/motion";
import { profile } from "../data/profile";
import { GlassCard } from "../components/GlassCard";
import { SectionHeading } from "../components/SectionHeading";
import { Verified, Psychology, Engineering } from "@mui/icons-material";

export default function About() {
  return (
    <motion.div
      variants={container(0.04)}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      <SectionHeading
        eyebrow="INTRO"
        title="Mình là Huỳnh Hậu (codeser)"
        subtitle="Một người đang rèn kỹ năng mỗi ngày để tiến gần hơn tới mục tiêu: Software Engineer."
      />

      <div className="grid md:grid-cols-12 gap-6">
        <motion.div variants={itemUp(0)} className="md:col-span-7">
          <GlassCard>
            {/* BODY TEXT: tăng size trên mobile */}
            <div className="space-y-4 text-base md:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              <p>
                Mình theo đuổi con đường trở thành <b>Kỹ sư Phần mềm</b> theo đúng
                nghĩa: hiểu vấn đề, thiết kế giải pháp, viết code có cấu trúc, và
                quan trọng nhất là <b>ship sản phẩm</b> có thể dùng được ngoài đời.
              </p>
              <p>
                Về backend, mình ưu tiên nền tảng chắc chắn với{" "}
                <b>Java (Spring Boot)</b>, song song học và mở rộng sang <b>C#</b>{" "}
                và <b>Node.js</b> để linh hoạt theo từng dự án. Về frontend, mình
                chọn <b>ReactJS</b> (và level-up lên <b>NextJS</b>) để build UI
                mượt, dễ mở rộng.
              </p>
              <p>
                Mình cũng học <b>Data Science</b> để hiểu dữ liệu và cách hệ thống
                vận hành từ góc nhìn phân tích — giúp mình đưa ra quyết định tốt
                hơn khi thiết kế sản phẩm.
              </p>
            </div>

            {/* GRID: mobile 1 -> sm 2 -> lg 3 */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  icon: Verified,
                  title: "Chuẩn hoá",
                  desc: "Code rõ ràng, module gọn, naming thống nhất.",
                },
                {
                  icon: Psychology,
                  title: "Tư duy hệ thống",
                  desc: "Thiết kế CSDL, flow, API boundary.",
                },
                {
                  icon: Engineering,
                  title: "Thực chiến",
                  desc: "Build project end-to-end, có demo.",
                },
              ].map((it, idx) => {
                const Icon = it.icon;
                return (
                  <motion.div
                    key={it.title}
                    variants={itemUp(0.06 + idx * 0.04)}
                    className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4"
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900/5 dark:bg-white/10 border border-slate-200/60 dark:border-white/10">
                      <Icon />
                    </div>

                    <div className="mt-2 text-base font-extrabold">
                      {it.title}
                    </div>

                    {/* DESC: tăng size trên mobile */}
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {it.desc}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemUp(0.08)} className="md:col-span-5">
          <div
            className="relative h-full min-h-[260px] sm:min-h-[320px] md:min-h-[420px] overflow-hidden rounded-3xl
                      border border-slate-200/60 dark:border-white/10
                      bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-sm"
          >
            <img
              src="/images/codeser.jpg"
              alt="Ảnh cá nhân / ảnh working setup"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/15 dark:from-black/25 dark:to-black/35" />
          </div>
        </motion.div>
      </div>

      <GlassCard delayIndex={4}>
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-6">
            <div className="text-[11px] md:text-xs font-extrabold tracking-[0.25em] uppercase text-slate-500 dark:text-slate-400">
              Tuyên ngôn nhỏ
            </div>

            <h3 className="mt-3 text-lg sm:text-xl md:text-2xl font-black">
              Mình thích “đúng bản chất” hơn là “đúng trend”.
            </h3>

            {/* tăng size trên mobile */}
            <p className="mt-3 text-base md:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              Với mình, nền tảng là thứ quyết định đường dài: kiến trúc rõ ràng,
              dữ liệu chuẩn, API gọn, UI mượt — rồi mới tới fancy feature. Mình
              sẵn sàng học nhanh, nhưng luôn ưu tiên hiểu thật kỹ trước khi tối ưu.
            </p>
          </div>

          <div className="md:col-span-6">
            <div className="text-[11px] md:text-xs font-extrabold tracking-[0.25em] uppercase text-slate-500 dark:text-slate-400">
              Snapshot
            </div>

            <div className="mt-3 space-y-2 text-base text-slate-700 dark:text-slate-200">
              <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 px-4 py-3">
                <b>Name:</b> {profile.fullName}
              </div>
              <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 px-4 py-3">
                <b>Alias:</b> {profile.alias}
              </div>
              <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 px-4 py-3">
                <b>Focus:</b> Backend strong • Full-stack ready • UI smooth
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}