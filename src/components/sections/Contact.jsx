import { BriefcaseBusiness, Code, Mail } from "lucide-react";
import SquareButton from "../ui/SquareButton";
import "./Contact.css";

const contactLinks = [
  {
    label: "Email",
    href: "haucoderfullstack05@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    href: "https://github.com/HauCoder2005",
    icon: Code,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/huynhhau",
    icon: BriefcaseBusiness,
  },
];

function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className="contact" id="contact">
      <div className="contact__intro">
        <p className="contact__eyebrow">Contact</p>
        <h2 className="contact__title">Let's build something clean.</h2>
      </div>

      <div className="contact__layout">
        <form className="contact__form" id="contact-form" onSubmit={handleSubmit}>
          <label className="contact__field">
            <span>Name</span>
            <input type="text" name="name" autoComplete="name" required />
          </label>

          <label className="contact__field">
            <span>Email</span>
            <input type="email" name="email" autoComplete="email" required />
          </label>

          <label className="contact__field">
            <span>Message</span>
            <textarea name="message" rows="6" required />
          </label>

          <SquareButton text="Send Message" type="submit" />
        </form>

        <div className="contact__links" aria-label="Contact links">
          {contactLinks.map((link) => {
            const Icon = link.icon;

            return (
              <a
                className="contact__link"
                href={link.href}
                key={link.label}
                rel="noreferrer"
                target={link.href.startsWith("http") ? "_blank" : undefined}
              >
                <Icon size={20} strokeWidth={2} />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Contact;
