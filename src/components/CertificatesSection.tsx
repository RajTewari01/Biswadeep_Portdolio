"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase, Certificate } from "@/lib/supabase";

gsap.registerPlugin(ScrollTrigger);

  // Removed hardcoded CATEGORIES. We will compute them dynamically.

// Fallback certificates if Supabase is not configured
const fallbackCertificates: Certificate[] = [
  // Pages 1-10: Anthropic
  { id: "1", title: "AI Fluency: Framework & Foundations", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=1", image_url: null, description: "AI Fluency framework", created_at: "", updated_at: "" },
  { id: "2", title: "Claude with the Anthropic API", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=2", image_url: null, description: "Anthropic API", created_at: "", updated_at: "" },
  { id: "3", title: "Introduction to Model Context Protocol", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=3", image_url: null, description: "MCP Basics", created_at: "", updated_at: "" },
  { id: "4", title: "Model Context Protocol: Advanced Topics", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=4", image_url: null, description: "Advanced MCP", created_at: "", updated_at: "" },
  { id: "5", title: "Claude Code in Action", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=5", image_url: null, description: "Practical coding with Claude", created_at: "", updated_at: "" },
  { id: "6", title: "Introduction to Claude Cowork", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=6", image_url: null, description: "Claude Cowork", created_at: "", updated_at: "" },
  { id: "7", title: "Claude Code 101", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=7", image_url: null, description: "Claude Code Fundamentals", created_at: "", updated_at: "" },
  { id: "8", title: "Claude 101", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=8", image_url: null, description: "Core concepts", created_at: "", updated_at: "" },
  { id: "9", title: "Introduction to Agent Skills", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=9", image_url: null, description: "Agent development", created_at: "", updated_at: "" },
  { id: "10", title: "Introduction to Subagents", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=10", image_url: null, description: "Subagent architecture", created_at: "", updated_at: "" },
  // Pages 11-15: Anthropic continued
  { id: "11", title: "Claude with Google Vertex AI", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=11", image_url: null, description: "Google Vertex AI integration", created_at: "", updated_at: "" },
  { id: "12", title: "Claude with Amazon Bedrock", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=12", image_url: null, description: "Amazon Bedrock integration", created_at: "", updated_at: "" },
  { id: "13", title: "AI Fluency: AI Capabilities & Limitations", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=13", image_url: null, description: "AI Capabilities", created_at: "", updated_at: "" },
  { id: "14", title: "AI Fluency for Educators", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=14", image_url: null, description: "Education AI", created_at: "", updated_at: "" },
  { id: "15", title: "Teaching the AI Fluency Framework", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=15", image_url: null, description: "Instructional methods", created_at: "", updated_at: "" },
  // Pages 16-17: Anthropic
  { id: "16", title: "AI Fluency for Nonprofits", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=16", image_url: null, description: "Nonprofit AI", created_at: "", updated_at: "" },
  { id: "17", title: "AI Fluency for Students", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=17", image_url: null, description: "Student AI Fluency", created_at: "", updated_at: "" },
  // Pages 18-20: LinkedIn Learning (Docker/K8s)
  { id: "18", title: "Learning Kubernetes", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=18", image_url: null, description: "Container Orchestration", created_at: "", updated_at: "" },
  { id: "19", title: "Learning Docker", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=19", image_url: null, description: "Containerization", created_at: "", updated_at: "" },
  { id: "20", title: "Docker: Your First Project", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=20", image_url: null, description: "Docker Projects", created_at: "", updated_at: "" },
  // Page 21: Docker Foundations Professional
  { id: "21", title: "Docker Foundations Professional Certificate", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=21", image_url: null, description: "Docker Professional", created_at: "", updated_at: "" },
  // Pages 22-25: GitHub
  { id: "22", title: "Career Essentials in GitHub Professional Certificate", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=22", image_url: null, description: "GitHub Professional", created_at: "", updated_at: "" },
  { id: "23", title: "Practical GitHub Actions", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=23", image_url: null, description: "GitHub Actions CI/CD", created_at: "", updated_at: "" },
  { id: "24", title: "Practical GitHub Copilot", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=24", image_url: null, description: "AI Pair Programming", created_at: "", updated_at: "" },
  { id: "25", title: "Practical GitHub Code Search", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=25", image_url: null, description: "GitHub Code Search", created_at: "", updated_at: "" },
  // Pages 26-30: GitHub Copilot & Project Management
  { id: "26", title: "Practical GitHub Project Management and Collaboration", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=26", image_url: null, description: "Project Management", created_at: "", updated_at: "" },
  { id: "27", title: "AI Pair Programming with GitHub Copilot", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=27", image_url: null, description: "AI Pair Programming", created_at: "", updated_at: "" },
  { id: "28", title: "Supercharge Development with GitHub Extensions for Copilot Chat", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=28", image_url: null, description: "Copilot Extensions", created_at: "", updated_at: "" },
  { id: "29", title: "Refactoring with GitHub Copilot", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=29", image_url: null, description: "Code Refactoring", created_at: "", updated_at: "" },
  { id: "30", title: "Responsible GitHub Copilot: Creating Reliable Code Ethically", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=30", image_url: null, description: "Ethical AI Coding", created_at: "", updated_at: "" },
  // Pages 31-35: Azure, Public Speaking
  { id: "31", title: "Microsoft Azure Essentials by Microsoft Press", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=31", image_url: null, description: "Azure Cloud", created_at: "", updated_at: "" },
  { id: "32", title: "Public Speaking Skills Professional Certificate by Toastmasters", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=32", image_url: null, description: "Toastmasters Professional", created_at: "", updated_at: "" },
  { id: "33", title: "Public Speaking Foundations", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=33", image_url: null, description: "Public Speaking", created_at: "", updated_at: "" },
  { id: "34", title: "Public Speaking Foundations (NASBA)", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=34", image_url: null, description: "NASBA Certified", created_at: "", updated_at: "" },
  { id: "35", title: "Public Speaking Foundations (CPE/QAS)", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=35", image_url: null, description: "CPE/QAS Certified", created_at: "", updated_at: "" },
  // Pages 36-40: Communication & Leadership
  { id: "36", title: "Writing and Delivering Speeches", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=36", image_url: null, description: "Speech Writing", created_at: "", updated_at: "" },
  { id: "37", title: "Communicating with Confidence", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=37", image_url: null, description: "Confident Communication", created_at: "", updated_at: "" },
  { id: "38", title: "Communicating with Confidence (Course)", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=38", image_url: null, description: "Communication Skills", created_at: "", updated_at: "" },
  { id: "39", title: "Body Language for Leaders and Managers", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=39", image_url: null, description: "Leadership Body Language", created_at: "", updated_at: "" },
  { id: "40", title: "Body Language for Leaders and Managers (Course)", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=40", image_url: null, description: "Body Language Skills", created_at: "", updated_at: "" },
  // Pages 41-45: More Speaking & Presenting
  { id: "41", title: "Establishing Credibility as a Speaker", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=41", image_url: null, description: "Speaker Credibility", created_at: "", updated_at: "" },
  { id: "42", title: "Establishing Credibility as a Speaker (CPE/QAS)", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=42", image_url: null, description: "CPE Certified", created_at: "", updated_at: "" },
  { id: "43", title: "Establishing Credibility as a Speaker (NASBA)", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=43", image_url: null, description: "NASBA Certified", created_at: "", updated_at: "" },
  { id: "44", title: "Presenting Technical Information with Stories", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=44", image_url: null, description: "Technical Storytelling", created_at: "", updated_at: "" },
  { id: "45", title: "Impromptu Speaking", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=45", image_url: null, description: "Extemporaneous Speaking", created_at: "", updated_at: "" },
  // Pages 46-50: Impromptu Speaking, Data Science, KNIME
  { id: "46", title: "Impromptu Speaking (Course)", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=46", image_url: null, description: "Speaking Skills", created_at: "", updated_at: "" },
  { id: "47", title: "Data Science Professional Certificate by KNIME", issuer: "KNIME", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=47", image_url: null, description: "Data Science Professional", created_at: "", updated_at: "" },
  { id: "48", title: "Data Science Foundations: Fundamentals", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=48", image_url: null, description: "Data Science Basics", created_at: "", updated_at: "" },
  { id: "49", title: "Low Code/No-Code Data Literacy with KNIME", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=49", image_url: null, description: "No-Code Data", created_at: "", updated_at: "" },
  { id: "50", title: "Introduction to Artificial Intelligence", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=50", image_url: null, description: "AI Introduction", created_at: "", updated_at: "" },
  // Pages 51-55: AI & ML, Data Scientists
  { id: "51", title: "Introduction to Artificial Intelligence (Course)", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=51", image_url: null, description: "AI Fundamentals", created_at: "", updated_at: "" },
  { id: "52", title: "Machine Learning and AI Foundations: Classification Modeling", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=52", image_url: null, description: "ML Classification", created_at: "", updated_at: "" },
  { id: "53", title: "Generative AI: Introduction to Large Language Models", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=53", image_url: null, description: "LLM Introduction", created_at: "", updated_at: "" },
  { id: "54", title: "The Non-Technical Skills of Effective Data Scientists (NASBA)", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=54", image_url: null, description: "Data Science Soft Skills", created_at: "", updated_at: "" },
  { id: "55", title: "The Non-Technical Skills of Effective Data Scientists", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=55", image_url: null, description: "Data Science Skills", created_at: "", updated_at: "" },
  // Pages 56-60: Gen AI, Microsoft Copilot, Communication
  { id: "56", title: "Generative AI for Digital Marketers", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=56", image_url: null, description: "Gen AI Marketing", created_at: "", updated_at: "" },
  { id: "57", title: "Generative AI for Digital Marketers (Course)", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=57", image_url: null, description: "Digital Marketing AI", created_at: "", updated_at: "" },
  { id: "58", title: "The Communicator's Guide to AI: Tools and Mindsets for Modern PR", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=58", image_url: null, description: "AI in Communications", created_at: "", updated_at: "" },
  { id: "59", title: "Learning Microsoft 365 Copilot for Work", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=59", image_url: null, description: "Microsoft 365 Copilot", created_at: "", updated_at: "" },
  { id: "60", title: "Microsoft Copilot: The Art of Prompt Writing", issuer: "LinkedIn Learning", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=60", image_url: null, description: "Prompt Engineering", created_at: "", updated_at: "" },
  // Pages 61-65: Google Cloud, Kaggle, Deloitte, IBM
  { id: "61", title: "Gen AI Academy APAC", issuer: "Google Cloud", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=61", image_url: null, description: "Google Cloud Gen AI", created_at: "", updated_at: "" },
  { id: "62", title: "PromptWars: Build with AI", issuer: "Google Cloud", category: "other", date_earned: "2026-07", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=62", image_url: null, description: "Google PromptWars", created_at: "", updated_at: "" },
  { id: "63", title: "Feature Engineering", issuer: "Kaggle", category: "other", date_earned: "2026-06", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=63", image_url: null, description: "ML Feature Engineering", created_at: "", updated_at: "" },
  { id: "64", title: "Data Analytics Job Simulation", issuer: "Deloitte", category: "other", date_earned: "2026-06", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=64", image_url: null, description: "Data Analytics Simulation", created_at: "", updated_at: "" },
  { id: "65", title: "Enterprise Data Science in Practice", issuer: "IBM", category: "other", date_earned: "2025-05", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=65", image_url: null, description: "Enterprise Data Science", created_at: "", updated_at: "" },
  // Pages 66-70: IBM, Competitions, Events
  { id: "66", title: "Machine Learning for Data Science Projects", issuer: "IBM", category: "other", date_earned: "2025-05", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=66", image_url: null, description: "ML Data Science", created_at: "", updated_at: "" },
  { id: "67", title: "Biswadeep Tewari YIC Camp", issuer: "YIC", category: "other", date_earned: "2025", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=67", image_url: null, description: "Youth Innovation Camp", created_at: "", updated_at: "" },
  { id: "68", title: "Urban Symphony", issuer: "Event", category: "other", date_earned: "2025", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=68", image_url: null, description: "Cultural Event", created_at: "", updated_at: "" },
  { id: "69", title: "Debate Competition: AI vs Human", issuer: "Event", category: "other", date_earned: "2026-01", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=69", image_url: null, description: "Debate Competition", created_at: "", updated_at: "" },
  { id: "70", title: "Entrepreneurship Workshop", issuer: "Event", category: "other", date_earned: "2025", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=70", image_url: null, description: "Entrepreneurship", created_at: "", updated_at: "" },
  // Pages 71-77: Adventure, Udemy, TATA, Google Arcade
  { id: "71", title: "Certificate of Adventure Excellence", issuer: "Event", category: "other", date_earned: "2025", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=71", image_url: null, description: "Adventure Activity", created_at: "", updated_at: "" },
  { id: "72", title: "Blood Donation Certificate", issuer: "Red Cross", category: "other", date_earned: "2025", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=72", image_url: null, description: "Blood Donation", created_at: "", updated_at: "" },
  { id: "73", title: "Java Collections Framework + Generics, Lambdas & Stream API", issuer: "Udemy", category: "other", date_earned: "2024-05", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=73", image_url: null, description: "Java Collections", created_at: "", updated_at: "" },
  { id: "74", title: "Web Design Course: Beginner to Advanced", issuer: "Udemy", category: "other", date_earned: "2024-05", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=74", image_url: null, description: "Web Design", created_at: "", updated_at: "" },
  { id: "75", title: "TATA Crucible Campus Quiz 2025", issuer: "TATA", category: "other", date_earned: "2025", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=75", image_url: null, description: "Quiz Competition", created_at: "", updated_at: "" },
  { id: "76", title: "Tata Group - Unstop Participation", issuer: "TATA", category: "other", date_earned: "2025", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=76", image_url: null, description: "Business Competition", created_at: "", updated_at: "" },
  { id: "77", title: "Google Cloud Arcade Guide 2026", issuer: "Google Cloud", category: "other", date_earned: "2026", credential_url: "/Biswadeep_Tewari_Certificates-7.pdf#page=77", image_url: null, description: "Google Cloud Arcade", created_at: "", updated_at: "" },
];

export default function CertificatesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const mql = window.matchMedia("(max-width: 768px)");
    setIsMobile(mql.matches);
    const cb = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  }, []);

  // ─── Fetch from Supabase ─────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const processFallbacks = () => fallbackCertificates.map(cert => {
        if (!cert.image_url && cert.credential_url) {
          const match = cert.credential_url.match(/#page=(\d+)/);
          if (match) {
            const pageNum = parseInt(match[1], 10);
            return { ...cert, image_url: `/cert_pages/page_${pageNum.toString().padStart(2, '0')}.png` };
          }
        }
        return cert;
      });

      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setCertificates(data as Certificate[]);
        } else {
          setCertificates(processFallbacks());
        }
      } catch {
        console.warn("Supabase fetch failed, using fallback certificates");
        setCertificates(processFallbacks());
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // ─── GSAP animations ────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".cert-card");
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 40, scale: 0.95, filter: "blur(4px)" },
          {
            opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
            duration: 0.8, stagger: 0.06, ease: "power3.out",
            scrollTrigger: { trigger: cards[0], start: "top 85%" },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [loaded, activeFilter]);

  // ─── Dynamic Top-4 Issuer Calculation ────────────────────────────────
  const sortedIssuers = Object.entries(
    certificates.reduce((acc, c) => {
      acc[c.issuer] = (acc[c.issuer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const top4Issuers = sortedIssuers.slice(0, 4).map((e) => e[0]);

  const DYNAMIC_CATEGORIES = [
    { key: "all", label: "ALL" },
    ...top4Issuers.map((i) => ({ key: i, label: i.toUpperCase() })),
    ...(sortedIssuers.length > 4 ? [{ key: "other", label: "OTHER" }] : []),
  ];

  const filtered =
    activeFilter === "all"
      ? certificates
      : activeFilter === "other"
      ? certificates.filter((c) => !top4Issuers.includes(c.issuer))
      : certificates.filter((c) => c.issuer === activeFilter);

  const getIssuerColor = (issuer: string) => {
    if (issuer.toLowerCase().includes("anthropic")) return "#D4A574";
    if (issuer.toLowerCase().includes("google")) return "#4285F4";
    if (issuer.toLowerCase().includes("deeplearning")) return "#059669";
    if (issuer.toLowerCase().includes("linkedin")) return "#0077B5";
    if (issuer.toLowerCase().includes("kaggle")) return "#20BEFF";
    if (issuer.toLowerCase().includes("deloitte")) return "#86BC25";
    if (issuer.toLowerCase().includes("ibm")) return "#0f62fe";
    return "#C9A96E";
  };

  return (
    <section id="credentials" ref={sectionRef} style={{
      background: "#e8f5e9", position: "relative",
      padding: "120px 0", overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", width: "60%", height: "40%",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(201,169,110,0.04) 0%, transparent 70%)",
        top: "20%", left: "20%",
      }} />

      <div className="section-pad-x" style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: "monospace", fontSize: 9, letterSpacing: "0.28em",
            color: "#888", marginBottom: 16,
          }}>
            <span style={{ color: "#C9A96E", fontWeight: 700 }}>04</span>
            <span style={{ width: 28, height: 1, background: "#C9A96E", opacity: 0.5, display: "inline-block" }} />
            <span>CERTIFICATIONS</span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: "clamp(48px, 10vw, 130px)",
            fontWeight: 700,
            lineHeight: 0.95, letterSpacing: "-0.02em",
          }}>
            <div style={{ color: "#111111" }}>Certified</div>
            <div style={{ color: "#C9A96E", fontStyle: "italic" }}>Excellence.</div>
          </h2>

          <p style={{
            marginTop: 16, fontFamily: "monospace", fontSize: 12,
            color: "#444", maxWidth: 400, lineHeight: 1.8,
          }}>
            {certificates.length} certifications from Anthropic, Google, and others.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{
          display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap",
        }}>
          {DYNAMIC_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              style={{
                padding: "8px 20px", borderRadius: 20,
                border: `1px solid ${activeFilter === cat.key ? "#C9A96E" : "rgba(0,0,0,0.1)"}`,
                background: activeFilter === cat.key ? "rgba(201,169,110,0.15)" : "rgba(255,255,255,0.8)",
                color: activeFilter === cat.key ? "#C9A96E" : "#666",
                fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em",
                textTransform: "uppercase", cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              {cat.label} ({cat.key === "all" ? certificates.length : cat.key === "other" ? certificates.filter(c => !top4Issuers.includes(c.issuer)).length : certificates.filter(c => c.issuer === cat.key).length})
            </button>
          ))}
        </div>

        {/* Certificate Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}>
          {filtered.slice(0, showAll ? undefined : (isMobile ? 8 : 16)).map((cert) => (
            <div
              key={cert.id}
              className="cert-card"
              onClick={() => cert.credential_url && window.open(cert.credential_url, "_blank")}
              style={{
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(0,0,0,0.05)",
                borderRadius: 12, padding: 24,
                cursor: cert.credential_url ? "pointer" : "default",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,1)";
                e.currentTarget.style.borderColor = "rgba(201,169,110,0.4)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.6)";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Issuer badge */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                marginBottom: 16,
              }}>
                <span style={{
                  fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em",
                  color: getIssuerColor(cert.issuer), textTransform: "uppercase",
                  fontWeight: 700,
                  background: `${getIssuerColor(cert.issuer)}15`,
                  padding: "4px 10px", borderRadius: 4,
                  border: `1px solid ${getIssuerColor(cert.issuer)}30`,
                }}>{cert.issuer}</span>
                {cert.date_earned && (
                  <span style={{
                    fontFamily: "monospace", fontSize: 9,
                    color: "#888", letterSpacing: "0.1em",
                  }}>{cert.date_earned}</span>
                )}
              </div>

              {/* Live PDF Preview */}
              {cert.image_url ? (
                <div style={{
                  width: "100%", height: 160, borderRadius: 8,
                  marginBottom: 16, overflow: "hidden",
                  border: `1px solid ${getIssuerColor(cert.issuer)}30`,
                  position: "relative",
                  background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <img 
                    src={cert.image_url} 
                    alt={cert.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {/* Invisible overlay to catch clicks */}
                  <div style={{ position: "absolute", inset: 0, zIndex: 10 }} />
                </div>
              ) : cert.credential_url ? (
                <div style={{
                  width: "100%", height: 160, borderRadius: 8,
                  marginBottom: 16, overflow: "hidden",
                  border: `1px solid ${getIssuerColor(cert.issuer)}30`,
                  position: "relative",
                  background: "rgba(0,0,0,0.5)",
                }}>
                  <iframe 
                    src={!origin.includes("localhost") ? `https://docs.google.com/viewer?url=${encodeURIComponent(origin + encodeURI(cert.credential_url))}&embedded=true` : `${encodeURI(cert.credential_url)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                    style={{ width: "200%", height: "200%", border: "none", pointerEvents: "none", transform: "scale(0.5)", transformOrigin: "0 0" }} 
                    title={cert.title}
                  />
                  {/* Invisible overlay to catch clicks and trigger the window.open */}
                  <div style={{ position: "absolute", inset: 0, zIndex: 10 }} />
                </div>
              ) : (
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: `linear-gradient(135deg, ${getIssuerColor(cert.issuer)}20, ${getIssuerColor(cert.issuer)}08)`,
                  border: `1px solid ${getIssuerColor(cert.issuer)}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16, fontSize: 18,
                }}>
                  🏆
                </div>
              )}

              <h3 style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontSize: 16, fontWeight: 700,
                color: "#111",
                marginBottom: 8, lineHeight: 1.3,
              }}>{cert.title}</h3>

              {cert.description && (
                <p style={{
                  fontSize: 12, color: "#444",
                  lineHeight: 1.6, fontWeight: 400,
                }}>{cert.description}</p>
              )}

              {cert.credential_url && (
                <div style={{
                  marginTop: 16, fontFamily: "monospace",
                  fontSize: 9, color: "#C9A96E",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span>View Credential</span>
                  <span style={{ fontSize: 12 }}>→</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        {!showAll && filtered.length > (isMobile ? 8 : 16) && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
            <button
              onClick={() => setShowAll(true)}
              style={{
                background: "transparent",
                color: "#C9A96E",
                border: "1px solid rgba(201,169,110,0.3)",
                padding: "16px 40px",
                borderRadius: 40,
                fontFamily: "monospace",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,169,110,0.1)";
                e.currentTarget.style.borderColor = "#C9A96E";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)";
              }}
            >
              VIEW ALL
            </button>
          </div>
        )}
      </div>

      {/* Bottom divider */}
      <div style={{
        position: "absolute", bottom: -1, left: 0, right: 0, height: 72,
        background: "#e8f5e9",
        clipPath: "polygon(0 72px, 100% 0, 100% 100%, 0 100%)",
        zIndex: 10,
      }} />
    </section>
  );
}
