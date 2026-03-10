"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Sparkles, FileText, Book } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import type { Question } from "@/types";

export default function MainPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [view, setView] = useState<"form" | "summary" | "quiz">("form");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSummary("");
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setError("");
    setView("form");
  };

  const loadFromHistory = () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("selectedHistory");
      if (!raw) return;
      const item = JSON.parse(raw);
      if (item?.title) setTitle(item.title);
      if (item?.summary) setSummary(item.summary);
      if (Array.isArray(item?.questions)) setQuestions(item.questions);
      setCurrentIndex(0);
      setSelectedAnswers([]);
      setShowResults(false);
      setView("quiz");
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
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
        setQuestions(response.data.questions);
        setCurrentIndex(0);
        setSelectedAnswers([]);
        setShowResults(false);
        setView("summary");

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
              summary: response.data.summary,
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
        view === "form"
          ? "flex bg-white flex-col p-7 items-end w-214 h-110.5 gap-5 border border-[#E4E4E7] rounded-lg"
          : "w-full"
      }
    >
      {view === "form" ? (
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
      ) : view === "summary" ? (
        <div className="w-full max-w-4xl self-center mx-auto">
          <button
            className="flex items-center justify-center rounded-lg border h-9 w-9 mb-4 cursor-pointer hover:bg-zinc-100"
            onClick={() => setView("form")}
            aria-label="Back to form"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="rounded-2xl border bg-white shadow-sm p-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-1">
                    <Sparkles />
                    <h2 className="text-xl font-semibold">
                      Article Summary Generator
                    </h2>
                  </div>
                  <div className="flex gap-1 items-center">
                    <Book className="w-4 h-4 text-gray-500" />
                    <p className="mt-1 text-sm text-zinc-500">
                      Summarized content
                    </p>
                  </div>
                  {title && (
                    <div className="text-2xl font-semibold text-zinc-800">
                      {title}
                    </div>
                  )}
                  {summary}
                  <div className="mt-6 flex justify-end ">
                    <Button
                      className="bg-black text-white hover:bg-black/90 cursor-pointer"
                      onClick={() => setView("quiz")}
                    >
                      Take a quiz
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl self-center mx-auto mb-20">
          <div className=" px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Sparkles />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Quick test</h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Take a quick test about your knowledge from your content.
                  </p>
                </div>
              </div>
              <button
                className="h-11 w-11 rounded-xl border bg-white shadow-sm flex items-center justify-center hover:bg-zinc-50"
                onClick={resetForm}
                aria-label="Close quiz"
              >
                ×
              </button>
            </div>
          </div>

          {!showResults ? (
            <div className="mt-6 rounded-2xl border bg-white px-6 py-6 text-base text-[#18181B] whitespace-pre-wrap break-words shadow-sm">
              <div className="text-sm text-zinc-500">
                Question {currentIndex + 1} / {questions.length}
              </div>
              <div className="mt-2 text-lg font-semibold text-zinc-800">
                {questions[currentIndex]?.question}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-[#18181B]">
                {questions[currentIndex]?.options.map((option, optionIndex) => (
                  <button
                    key={`${option}-${optionIndex}`}
                    className="rounded-xl border px-4 py-3 text-center font-medium shadow-sm hover:bg-zinc-50"
                    onClick={() => {
                      setSelectedAnswers((prev) => {
                        const next = [...prev];
                        next[currentIndex] = optionIndex;
                        return next;
                      });

                      if (currentIndex + 1 < questions.length) {
                        setCurrentIndex((prev) => prev + 1);
                      } else {
                        setShowResults(true);
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="rounded-2xl border bg-white px-6 py-6 text-center shadow-sm">
                <div className="text-xl font-semibold">Quiz Results</div>
                <div className="mt-1 text-sm text-zinc-500">
                  You scored{" "}
                  {
                    questions.filter(
                      (q, i) => selectedAnswers[i] === q.correctIndex,
                    ).length
                  }{" "}
                  / {questions.length}
                </div>
              </div>

              {questions.map((questionItem, index) => (
                <div
                  key={`${questionItem.question}-${index}`}
                  className="rounded-2xl border bg-white px-6 py-6 text-base text-[#18181B] shadow-sm"
                >
                  <div className="text-sm text-zinc-500">
                    Question {index + 1}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-zinc-800">
                    {questionItem.question}
                  </div>
                  <div className="mt-5 space-y-2 text-sm">
                    {questionItem.options.map((option, optionIndex) => {
                      const isCorrect =
                        optionIndex === questionItem.correctIndex;
                      const isSelected = optionIndex === selectedAnswers[index];
                      const stateClass = isCorrect
                        ? "border-green-400 bg-green-50 text-green-700"
                        : isSelected
                          ? "border-red-400 bg-red-50 text-red-700"
                          : "border-zinc-200";

                      return (
                        <div
                          key={`${option}-${optionIndex}`}
                          className={`rounded-xl border px-4 py-3 ${stateClass}`}
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={resetForm}>
                  Restart quiz
                </Button>
                <Button onClick={resetForm}>Save & Leave</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
