"use server";
import Editor from "@/app/components/Editor";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-y-4 items-center p-24">
      <div className="text-3xl">TipTap Example</div>
      <Editor />
    </main>
  );
}
