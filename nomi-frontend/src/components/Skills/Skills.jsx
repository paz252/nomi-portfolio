import "./Skills.css";
import MetallicText from "../utils/MetallicText";
import {
    SiOpenjdk,
    SiSpringboot,
    SiSpring,
    SiReact,
    SiApachekafka,
    SiRedis,
    SiDocker,
    SiKubernetes,
    SiRender,
    SiGrafana,
    SiPrometheus,
    SiElasticsearch,
    SiMysql,
    SiGit,
} from "react-icons/si";
import { SiZapier } from "react-icons/si";
import { Boxes, Network, GitBranch } from "lucide-react";

const STACK = [
    { name: "Java", Icon: SiOpenjdk, iconColor: "#ED8B00" },
    { name: "Spring Boot", Icon: SiSpringboot, iconColor: "#6DB33F" },
    { name: "Spring AI", Icon: SiSpring, iconColor: "#6DB33F" },
    { name: "React.js", Icon: SiReact, iconColor: "#61DAFB" },
    { name: "Microservices", Icon: Boxes, iconColor: "#4FD8A8" },
    { name: "System Design", Icon: Network, iconColor: "#38BDF8" },
    { name: "Kafka", Icon: SiApachekafka, iconColor: "#FF4D4D" },
    { name: "Redis", Icon: SiRedis, iconColor: "#DC382D" },
    { name: "Docker", Icon: SiDocker, iconColor: "#2496ED" },
    { name: "Kubernetes", Icon: SiKubernetes, iconColor: "#326CE5" },
    { name: "Render", Icon: SiRender, iconColor: "#46E3B7" },
    { name: "Grafana", Icon: SiGrafana, iconColor: "#F05A28" },
    { name: "Prometheus", Icon: SiPrometheus, iconColor: "#E6522C" },
    { name: "Elasticsearch", Icon: SiElasticsearch, iconColor: "#005571" },
    { name: "MySQL", Icon: SiMysql, iconColor: "#1E9BD6" },
    { name: "Git", Icon: SiGit, iconColor: "#F05032" },
    { name: "GitOps", Icon: GitBranch, iconColor: "#4FD8A8" },
    { name: "Zapier", Icon: SiZapier, iconColor: "#FF4A00" },
];

const half = Math.ceil(STACK.length / 2);
const ROW_ONE = STACK.slice(0, half);
const ROW_TWO = STACK.slice(half);

function SkillCard({ name, Icon, iconColor }) {
    return (
        <div className="skill-card text-white fw-bold">
            <Icon className="skill-icon" style={{ color: iconColor || "currentColor" }} />
            <span>{name}</span>
        </div>
    );
}

function MarqueeRow({ items, direction }) {
    // Duplicate the items so the CSS animation loops seamlessly.
    const looped = [...items, ...items];

    return (
        <div className="marquee-row p-1">
            <div className={`marquee-track marquee-${direction}`}>
                {looped.map((skill, i) => (
                    <SkillCard key={`${skill.name}-${i}`} {...skill} />
                ))}
            </div>
        </div>
    );
}

export default function Skills() {
    return (
        <section className="skills-section pt-5 pb-5">
            <h1 className="skills-title text-center">
                My <MetallicText speed={6}>Skills</MetallicText>
            </h1>

            <div className="skills-marquee pt-5">
                <div className="pb-3">
                    <MarqueeRow items={ROW_ONE} direction="ltr" />
                </div>
                <div>
                    <MarqueeRow items={ROW_TWO} direction="rtl" />
                </div>
            </div>
        </section>
    );
}
