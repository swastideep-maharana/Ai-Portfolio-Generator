"use client";

import { useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import html2pdf from "html2pdf.js";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({
    name: "",
    role: "",
    skills: "",
    projects: "",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to generate portfolio");
      const data = await res.json();
      setOutput(data.result);
    } catch (error) {
      console.error(error);
      alert("Error generating portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!outputRef.current) return;

    const opt = {
      margin: 0.5,
      filename: "portfolio.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(outputRef.current).save();
  };

  // Show loading state while session loads
  if (status === "loading") return <p>Loading...</p>;

  // If no session, show sign in button
  if (!session)
    return (
      <div className="text-center space-y-4 mt-20">
        <h2 className="text-2xl font-semibold">Please sign in to continue</h2>
        <Button type="button" onClick={() => signIn("google")}>
          Sign in with Google
        </Button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">AI Portfolio Generator ✨</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["name", "role", "skills", "projects"].map((key) => (
          <Textarea
            key={key}
            name={key}
            value={form[key as keyof typeof form]}
            onChange={handleChange}
            placeholder={`Enter ${key}`}
            className="h-24"
          />
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button type="button" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Portfolio"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setForm({ name: "", role: "", skills: "", projects: "" })
          }
          disabled={loading}
        >
          Reset
        </Button>

        {output && (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={handleGenerate}
              disabled={loading}
            >
              Regenerate
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(output);
                alert("Copied to clipboard!");
              }}
            >
              Copy Output
            </Button>

            <Button type="button" variant="ghost" onClick={handleExportPDF}>
              Export PDF
            </Button>

            <Button
              type="button"
              variant="default"
              onClick={async () => {
                try {
                  const res = await fetch("/api/portfolio/save", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...form, output }),
                  });
                  if (!res.ok) throw new Error(`Error: ${res.statusText}`);
                  const result = await res.json();
                  alert(result.message || "Portfolio saved!");
                } catch (error) {
                  console.error("Save portfolio error:", error);
                  alert("Failed to save portfolio");
                }
              }}
            >
              Save Portfolio
            </Button>
          </>
        )}
      </div>

      {output && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          ref={outputRef}
        >
          <Card className="mt-6">
            <CardContent className="p-6">
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                className="w-full h-[400px] resize-y text-muted-foreground"
              />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
