import React from "react";
import { motion } from "framer-motion";
import { Verified, Psychology, Engineering } from "@mui/icons-material";
import { container, itemUp } from "../utils/motion";
import { GlassCard } from "../components/GlassCard";
import { profile } from "../data/profile";

export default function About() {
  const points = [
    {
      icon: Verified,
      title: "Structured code",
      desc: "Ưu tiên flow rõ ràng, naming sạch và module dễ mở rộng.",
    },
    {
      icon: Psychology,
      title: "System thinking",
      desc: "Đi từ bài toán, dữ liệu, API tới trải nghiệm người dùng.",
    },
    {
      icon: Engineering,
      title: "Execution",
      desc: "Thích build project thật, kiểm soát chất lượng và ship đều tay.",
    },
  ];

  return (
    <motion.div
      variants={container(0.04)}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      <motion.div variants={itemUp(0)} className="grid gap-3">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Profile
        </div>
        <div className="text-3xl font-black uppercase leading-tight sm:text-4xl md:text-5xl">
          {profile.fullName} / {profile.alias}
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemUp(0.02)} className="h-full">
          <GlassCard className="h-full">
            <div className="grid h-full content-between gap-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200 md:min-h-[460px] md:text-base">
              <div className="grid gap-4">
              <p>
                Mình theo đuổi hướng làm sản phẩm từ nền tảng backend vững, sau đó mở rộng sang frontend và trải nghiệm tương tác để hệ thống vừa chạy tốt vừa nhìn tốt.
              </p>
              <p>
                Java Spring Boot là vùng làm việc chính. Song song đó là NestJS, Node.js, ReactJS, NextJS và cách tổ chức dữ liệu để mỗi phần của hệ thống kết nối trơn tru.
              </p>
              <p>
                Điều mình ưu tiên nhất là code có cấu trúc, dữ liệu rõ ràng, luồng xử lý có thể bảo trì và giao diện không thừa chi tiết.
              </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {points.map((point) => {
                  const Icon = point.icon;

                  return (
                    <div
                      key={point.title}
                      className="border border-slate-900/10 bg-[var(--panel-strong)] p-4 dark:border-white/10"
                    >
                      <div className="flex h-10 w-10 items-center justify-center border border-slate-900/10 bg-[var(--panel)] dark:border-white/10">
                        <Icon />
                      </div>
                      <div className="mt-3 text-sm font-black uppercase tracking-[0.16em]">
                        {point.title}
                      </div>
                      <div className="mt-2 text-sm leading-relaxed">
                        {point.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemUp(0.06)} className="h-full">
          <GlassCard className="h-full p-0">
            <div className="relative min-h-[460px] h-full overflow-hidden">
              <img
                src="/images/codeser.jpg"
                alt="Huynh Hau working portrait"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_10%,rgba(9,13,18,0.38)_100%)]" />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
