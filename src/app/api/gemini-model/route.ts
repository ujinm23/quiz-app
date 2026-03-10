import { NextResponse } from "next/server";
import type { Question } from "@/types";

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateQuestionsFromText(text: string): Question[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 30);

  const base = sentences.length > 0 ? sentences : [text.trim()];

  const words = text
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 3);

  return base.slice(0, 5).map((sentence, index) => {
    const sentenceWords = sentence
      .replace(/[^\w\s'-]/g, " ")
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 3);

    const target =
      sentenceWords.sort((a, b) => b.length - a.length)[0] ||
      sentenceWords[0] ||
      "word";

    const blanked = sentence.replace(target, "____");

    const pool = words.filter((w) => w !== target);
    const distractors = shuffle(pool).slice(0, 3);
    while (distractors.length < 3) {
      distractors.push("None of the above");
    }

    const options = shuffle([target, ...distractors]);
    const correctIndex = options.indexOf(target);

    return {
      question: `Question-${index + 1}. Fill in the blank: ${blanked}`,
      options,
      correctIndex,
    };
  });
}

function generateSummaryFromText(text: string) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return sentences.slice(0, 3).join(" ");
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Received data:", data);
    const text = typeof data?.text === "string" ? data.text : "";

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Text is required." },
        { status: 400 },
      );
    }

    const summary = generateSummaryFromText(text);
    const questions = generateQuestionsFromText(text);

    return NextResponse.json({
      success: true,
      summary,
      questions,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error },
      { status: 500 },
    );
  }
}
