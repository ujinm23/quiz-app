"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Sparkles, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import type { Question } from "@/types";

export default function MainPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setContent("");
    setQuestions([]);
    setError("");
  };

  const loadFromHistory = () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("selectedHistory");
      if (!raw) return;
      const item = JSON.parse(raw);
      if (item?.title) setTitle(item.title);
      if (Array.isArray(item?.questions)) setQuestions(item.questions);
    } catch (err) {
      console.error("Failed to load selected history", err);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onSelect = () => loadFromHistory();
    window.addEventListener("history-select", onSelect);
    return () => {
      window.removeEventListener("history-select", onSelect);
    };
  }, []);

  const submitText = async () => {
    if (!title || !content) {
      alert("Please enter article title and content!");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]); // Reset to empty array

    try {
      const response = await axios.post("/api/gemini-model", {
        title,
        text: content,
        userId: "test-user",
      });

      console.log("Response:", response.data); // Check what you get back

      if (response.data.questions) {
        setQuestions(response.data.questions);

        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("history");
            const existing = raw ? (JSON.parse(raw) as any[]) : [];
            const next = Array.isArray(existing) ? existing : [];
            const id =
              typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `${Date.now()}`;

            next.unshift({
              id,
              title,
              questions: response.data.questions,
            });

            localStorage.setItem("history", JSON.stringify(next));
            window.dispatchEvent(new CustomEvent("history-update"));
          } catch (storageError) {
            console.error("Failed to save history", storageError);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate quiz. Check console for details.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={
        questions.length === 0
          ? "flex bg-white flex-col p-7 items-end w-214 h-110.5 gap-5 border border-[#E4E4E7] rounded-lg"
          : "w-full"
      }
    >
      {questions.length === 0 ? (
        <>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Sparkles />
              <p className=" font-inter text-[24px] font-semibold">
                Article Quiz Generator
              </p>
            </div>
            <p className="text-[#71717A] font-normal text-[16px] ">
              Paste your article below to generate a summarize and quiz
              question. Your articles will saved in the sidebar for future
              reference.
            </p>
          </div>
          <div>
            <div className="flex gap-1 items-center mb-2">
              <FileText className="w-3.75 h-3.75 " />
              <p className="text-[14px] text-[#71717A] font-semibold ">
                Article Title
              </p>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-200 h-10 px-3 py-2 border rounded-md border-[#E4E4E7] text-[#71717A] font-normal text-[14px]"
              placeholder="Enter a title for your article..."
            />
          </div>
          <div>
            <div className="flex gap-1 items-center mb-2">
              <FileText className="w-3.75 h-3.75 " />
              <p className="text-[14px] text-[#71717A] font-semibold">
                Article Content
              </p>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-200 h-30 px-3 py-2 border rounded-md border-[#E4E4E7] text-[#71717A] font-normal text-[14px]"
              placeholder="Paste your article content here..."
            />
          </div>

          <Button onClick={submitText} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                Generating...
              </span>
            ) : (
              "Generate summary"
            )}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </>
      ) : (
        <div className="w-full max-w-4xl self-center mx-auto mb-20">
          <div className="rounded-2xl border bg-white shadow-sm px-6 py-5">
            <h2 className="text-xl font-semibold">Generated quiz</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Review the questions below.
            </p>
          </div>
          <ul className="mt-4 space-y-4">
            {questions.map((questionItem, index) => (
              <li
                key={`${questionItem.question}-${index}`}
                className="rounded-2xl border bg-white px-6 py-5 text-base text-[#18181B] whitespace-pre-wrap break-words shadow-sm"
              >
                <div className="font-medium">{questionItem.question}</div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-[#18181B]">
                  {questionItem.options.map((option, optionIndex) => (
                    <div
                      key={`${option}-${optionIndex}`}
                      className="flex items-start gap-3 rounded-lg border px-3 py-2"
                    >
                      <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-zinc-400" />
                      <span className="whitespace-pre-wrap break-words">
                        {option}
                      </span>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <Button className="mt-6" onClick={resetForm}>
            Generate another
          </Button>
        </div>
      )}
    </div>
  );
}
