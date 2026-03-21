"use client";

import { useState, useEffect, useRef } from "react";

type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

type Filter = "all" | "active" | "completed";

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3.5 h-3.5"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
    >
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  // localStorage からタスクを復元
  useEffect(() => {
    const stored = localStorage.getItem("todo-tasks");
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  // タスクが変わるたびに保存
  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const removeTask = (id: string) => {
    setRemovingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 200);
  };

  const clearCompleted = () => {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    completedIds.forEach((id) => {
      setRemovingIds((prev) => new Set(prev).add(id));
    });
    setTimeout(() => {
      setTasks((prev) => prev.filter((t) => !t.completed));
      setRemovingIds(new Set());
    }, 200);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const filterLabels: { key: Filter; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "active", label: "未完了" },
    { key: "completed", label: "完了済み" },
  ];

  return (
    <main className="min-h-screen flex items-start justify-center pt-16 pb-24 px-4">
      <div className="w-full max-w-lg">
        {/* ヘッダー */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-stone-800">
            タスク
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            {activeCount > 0
              ? `${activeCount} 件残っています`
              : tasks.length > 0
              ? "すべて完了しました！"
              : "タスクを追加してみましょう"}
          </p>
        </div>

        {/* 入力フォーム */}
        <div className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && addTask()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-stone-200 text-stone-800 placeholder:text-stone-300 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all"
          />
          <button
            onClick={addTask}
            disabled={!input.trim()}
            className="px-5 py-3 rounded-xl bg-stone-800 text-white text-sm font-medium hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            追加
          </button>
        </div>

        {/* フィルター */}
        {tasks.length > 0 && (
          <div className="flex gap-1 mb-4 p-1 bg-stone-100 rounded-xl">
            {filterLabels.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  filter === key
                    ? "bg-white text-stone-800 shadow-sm"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* タスクリスト */}
        <div className="space-y-2">
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-stone-300 text-sm">
              {filter === "completed"
                ? "完了済みのタスクはありません"
                : filter === "active"
                ? "未完了のタスクはありません"
                : "タスクはありません"}
            </div>
          )}

          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-stone-100 shadow-sm transition-all ${
                removingIds.has(task.id) ? "task-exit" : "task-enter"
              }`}
            >
              {/* チェックボックス */}
              <button
                onClick={() => toggleTask(task.id)}
                aria-label={task.completed ? "未完了に戻す" : "完了にする"}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                {task.completed && <CheckIcon />}
              </button>

              {/* タスクテキスト */}
              <span
                className={`flex-1 text-sm leading-snug transition-all ${
                  task.completed
                    ? "line-through text-stone-300"
                    : "text-stone-700"
                }`}
              >
                {task.text}
              </span>

              {/* 削除ボタン */}
              <button
                onClick={() => removeTask(task.id)}
                aria-label="タスクを削除"
                className="flex-shrink-0 text-stone-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>

        {/* フッター：完了済みをまとめて削除 */}
        {completedCount > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={clearCompleted}
              className="text-xs text-stone-300 hover:text-red-400 transition-colors"
            >
              完了済み {completedCount} 件を削除
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
