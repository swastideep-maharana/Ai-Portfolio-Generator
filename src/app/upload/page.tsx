"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UploadPage() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    skills: "",
    projects: "",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setOutput(data.result);
    setLoading(false);
  };

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
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Portfolio"}
        </Button>

        <Button
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
              variant="secondary"
              onClick={handleGenerate}
              disabled={loading}
            >
              Regenerate
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(output)}
            >
              Copy Output
            </Button>
          </>
        )}
      </div>

      {output && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
