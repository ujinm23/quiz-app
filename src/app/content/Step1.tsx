import { FileText, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";

export default function Step1() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitText = async () => {
    if (!content) return alert("Please enter article content!");
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/gemini-model", {
        text: content,
      });
      setQuiz(response.data.summary);
    } catch (err) {
      console.error(err);
      setError("Failed to generate summary. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-white flex-col p-7 items-end w-214 h-110.5 gap-5 border border-[#E4E4E7] rounded-lg">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Sparkles />
          <p className=" font-inter text-[24px] font-semibold">
            Article Quiz Generator
          </p>
        </div>
        <p className="text-[#71717A] font-normal text-[16px] ">
          Paste your article below to generate a summarize and quiz question.
          Your articles will saved in the sidebar for future reference.
        </p>
      </div>
      <div>
        <div className="flex gap-1 items-center">
          <FileText className="w-3.75 h-3.75 " />
          <p className="text-[14px] text-[#71717A] font-semibold">
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
        <div className="flex gap-1 items-center">
          <FileText className="w-3.75 h-3.75 " />
          <p className="text-[1contenttext-[#71717A] font-semibold">
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
        {loading ? "Generating..." : "Generate summary"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {quiz && (
        <div>
          <h2>Generated quiz</h2>
        </div>
      )}
    </div>
  );
}
