import {
  BriefcaseBusiness,
  Camera,
  Code,
  Link,
  Share2,
} from "lucide-react";
import "./FooterSocials.css";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/huynhhau",
    icon: BriefcaseBusiness,
  },
  {
    label: "GitHub",
    href: "https://github.com/HauCoder2005",
    icon: Code,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/huynh.hau.360484?locale=vi_VN",
    icon: Share2,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: Camera,
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/haucoderfullstack05/",
    icon: Link,
  },
];

function FooterSocials() {
  return (
    <footer className="footer-socials">
      <p className="footer-socials__title">CONNECT WITH ME</p>

      <nav className="footer-socials__links" aria-label="Social links">
        {socialLinks.map((social) => {
          const Icon = social.icon;

          return (
            <a
              aria-label={social.label}
              className="footer-socials__button"
              href={social.href}
              key={social.label}
              rel="noreferrer"
              target="_blank"
              title={social.label}
            >
              <Icon size={22} strokeWidth={2} />
            </a>
          );
        })}
      </nav>
    </footer>
  );
}

export default FooterSocials;
