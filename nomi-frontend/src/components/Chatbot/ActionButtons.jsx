import { Briefcase, User, Code2, Mail } from "lucide-react";

const PREDEFINED_QUESTIONS = [
  {
    key: "work",
    label: "Work",
    icon: Briefcase,
    question: "Tell me about your work experience.",
  },
  {
    key: "about",
    label: "About Me",
    icon: User,
    question: "Tell me more about yourself.",
  },
  {
    key: "skills",
    label: "Skills",
    icon: Code2,
    question: "Tell me more about your skills and projects",
  },
  {
    key: "contact",
    label: "Contact",
    icon: Mail,
    question: "How can I contact you?",
  },
];

export default function ActionButtons({ onSend, isLoading }) {
  return (
    <div className="action-buttons mt-3 mb-2 d-flex gap-2 flex-wrap">
      {PREDEFINED_QUESTIONS.map(({ key, label, icon: Icon, question }) => (
        <button
          key={key}
          className="btn btn-sm btn-outline-secondary rounded-1 d-flex align-items-center gap-1"
          onClick={() => onSend(question)}
          disabled={isLoading}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}