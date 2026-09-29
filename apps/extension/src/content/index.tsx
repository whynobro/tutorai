import { createRoot } from "react-dom/client";
import { AnswerChecker } from "../components/AnswerChecker.js";
import { widgetCss } from "../styles/widget.js";

const hostId = "tutorai-answer-checker-host";

if (!document.getElementById(hostId)) {
  const host = document.createElement("div");
  host.id = hostId;
  host.setAttribute("data-tutorai", "answer-checker");
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  const mount = document.createElement("div");
  style.textContent = widgetCss;
  shadow.append(style, mount);
  document.documentElement.append(host);
  createRoot(mount).render(<AnswerChecker host={host} />);
}

