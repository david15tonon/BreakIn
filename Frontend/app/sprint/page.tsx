/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon, ClockIcon, RocketLaunchIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { XMarkIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";



// ----- Mini composants UI -----
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-3 rounded-full bg-slate-800 border border-slate-700">
      <div
        className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function StatusDot({ status }: { status: "active" | "review" | "testing" | "idle" }) {
  const color =
    status === "active" ? "bg-emerald-400" :
    status === "review" ? "bg-amber-400" :
    status === "testing" ? "bg-sky-400" : "bg-slate-500";
  return <span className={clsx("inline-block w-2.5 h-2.5 rounded-full", color)} />;
}

function Card({ title, children, className = "" }: { title?: string; children: any; className?: string }) {
  return (
    <div className={clsx("rounded-2xl border border-slate-800 bg-[#0f1a2b]/90 shadow-lg", className)}>
      {title ? (
        <div className="px-5 pt-5 pb-2 text-sm font-semibold text-slate-200">{title}</div>
      ) : null}
      <div className="p-5">{children}</div>
    </div>
  );
}

function TaskCard({ task, isSelected, onClick }: { task: any; isSelected: boolean; onClick: () => void }) {
  return (
    <div 
      className={`rounded-xl border p-3 cursor-pointer transition-all ${
        isSelected 
          ? "border-emerald-500 bg-emerald-500/10" 
          : "border-slate-800 bg-[#0b1220] hover:border-slate-600"
      }`}
      onClick={onClick}
    >
      <div className="text-sm font-medium">{task.title}</div>
      <div className={`mt-1 text-xs ${
        isSelected ? "text-emerald-300" : "text-slate-400"
      }`}>
        ETA: {task.eta}
      </div>
      {task.assignee && (
        <div className={`mt-1 text-xs ${
          isSelected ? "text-emerald-200" : "text-emerald-400"
        }`}>
          Assignee: {task.assignee}
        </div>
      )}
    </div>
  );
}

function Modal({
  open,
  onClose,
  children,
  title,
  onConfirm,
  confirmText = "Confirm",
}: {
  open: boolean;
  onClose: () => void;
  children: any;
  title: string;
  onConfirm?: () => void;
  confirmText?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0f1a2b] border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-slate-100 font-semibold">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800">
            <XMarkIcon className="w-5 h-5 text-slate-300" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        <div className="px-6 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200">
            Cancel
          </button>
          {onConfirm ? (
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-emerald-950 font-semibold hover:brightness-110"
            >
              {confirmText}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ----- Données mock -----
type Member = { name: string; role: string; status: "active" | "review" | "testing" | "idle" };
type Task = { id: string; title: string; assignee?: string; eta?: string; column: "todo" | "doing" | "review" };

const initialMembers: Member[] = [
  { name: "Alex K.", role: "Backend Lead", status: "active" },
  { name: "Sarah M.", role: "Frontend Dev", status: "review" },
  { name: "David J.", role: "QA Engineer", status: "testing" },
];

const initialTasks: Task[] = [
  { id: "t1", title: "Set up payment schema", assignee: "Alex", eta: "3h", column: "todo" },
  { id: "t2", title: "OAuth with Stripe", eta: "2h", column: "todo" },
  { id: "t3", title: "Webhook handling (retry)", assignee: "Alex", eta: "4h", column: "doing" },
  { id: "t4", title: "Refund edge cases", assignee: "Sarah", eta: "2h", column: "review" },
];

// ----- Page Sprint -----
export default function SprintPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(78);
  const [members] = useState<Member[]>(initialMembers);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showStartModal, setShowStartModal] = useState(false);
  const [mission, setMission] = useState<string | null>(
    "Implement a secure payment integration with refund flows & retries."
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const columns = useMemo(
    () => ({
      todo: tasks.filter((t) => t.column === "todo"),
      doing: tasks.filter((t) => t.column === "doing"),
      review: tasks.filter((t) => t.column === "review"),
    }),
    [tasks]
  );

  function handleStartSprint() {
    setShowStartModal(true);
  }

  function handleTaskClick(task: Task) {
    setSelectedTask(task);
    setShowStartModal(true);
  }

  function confirmStart() {
    if (!selectedTask) {
      setSelectedTask(initialTasks[0]);
    }
    
    setMission(
      "Sprint started: Build RESTful payment endpoints with idempotency keys, webhook retries and secure refund policy."
    );
    setProgress(80);
    setShowStartModal(false);
    
    // Redirect to coding page
    router.push(`/sprint/sprinting?sprintId=sprint-123&taskId=${selectedTask?.id || initialTasks[0].id}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#0e1628] text-slate-200">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl border border-slate-800 bg-[#0f1a2b]/80 shadow-xl">
          <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sky-300 text-xs tracking-wide">Live Sprint</p>
              <h1 className="text-2xl md:text-3xl font-bold">E-commerce Platform Sprint</h1>
              <p className="text-slate-400 text-sm">
                Building a payment integration system • Day 3 of 5
              </p>
            </div>
            <div className="w-full md:w-[420px]">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <ProgressBar value={progress} />
                </div>
                <span className="text-sm font-semibold">{progress}%</span>
              </div>
              <div className="mt-2 text-xs text-slate-400 flex items-center gap-4">
                <span className="inline-flex items-center gap-1">
                  <ClockIcon className="w-4 h-4 text-slate-400" /> 2d 4h remaining
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400" /> Team rating: 4.8/5
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 px-6 py-4 flex items-center justify-end">
            <button
              onClick={handleStartSprint}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold
              bg-emerald-500 text-emerald-950 hover:brightness-110"
            >
              <PlayCircleIcon className="w-5 h-5" />
              Start Sprint
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Kanban + Mission */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Sprint Tasks">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* To Do */}
              <div>
                <div className="mb-3 text-sm font-semibold text-sky-300">To Do</div>
                <div className="space-y-3">
                  {columns.todo.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      isSelected={selectedTask?.id === t.id}
                      onClick={() => handleTaskClick(t)}
                    />
                  ))}
                </div>
              </div>

              {/* Doing */}
              <div>
                <div className="mb-3 text-sm font-semibold text-emerald-300">In Progress</div>
                <div className="space-y-3">
                  {columns.doing.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      isSelected={selectedTask?.id === t.id}
                      onClick={() => handleTaskClick(t)}
                    />
                  ))}
                </div>
              </div>

              {/* Review */}
              <div>
                <div className="mb-3 text-sm font-semibold text-amber-300">In Review</div>
                <div className="space-y-3">
                  {columns.review.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      isSelected={selectedTask?.id === t.id}
                      onClick={() => handleTaskClick(t)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Mission Brief">
            <p className="text-sm text-slate-300 leading-relaxed">{mission}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">Stripe</span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">Retries</span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">Refunds</span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">Security</span>
            </div>
          </Card>
        </div>

        {/* Middle: Feed */}
        <div className="lg:col-span-1">
          <Card title="Squad Feed">
            <div className="h-[460px] overflow-y-auto space-y-4 pr-2">
              <div>
                <div className="text-xs text-sky-300 font-semibold">Mentor-Zeta2</div>
                <div className="text-sm text-slate-200">
                  Good job handling edge cases on refunds 👏
                </div>
              </div>
              <div>
                <div className="text-xs text-sky-300 font-semibold">CodeCell-A9</div>
                <div className="text-sm text-slate-200">
                  Pushing a fix for failed retries.
                </div>
              </div>
              <div>
                <div className="text-xs text-sky-300 font-semibold">Dev-Sigma7</div>
                <div className="text-sm text-slate-200">
                  Starting tests for idempotency on POST /payments.
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                placeholder="Message as CodeCell-A9…"
                className="flex-1 rounded-xl bg-[#0b1220] border border-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <button className="px-4 py-2 rounded-xl bg-indigo-500 text-indigo-950 font-semibold hover:brightness-110">
                Send
              </button>
            </div>
          </Card>
        </div>

        {/* Right: Team tracker */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Active Team Members">
            <div className="space-y-4">
              {members.map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-xs text-slate-400">{m.role}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusDot status={m.status} />
                    <span className="text-xs capitalize text-slate-300">{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <UserGroupIcon className="w-5 h-5 text-sky-400" />
              <div className="text-sm">
                <div className="font-semibold">Squadroom</div>
                <div className="text-slate-400">3 active • 1 reviewer</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal Start Sprint */}
      <Modal
        open={showStartModal}
        onClose={() => setShowStartModal(false)}
        title="Start Sprint — Double-Blind Mode"
        onConfirm={confirmStart}
        confirmText="Start Coding"
      >
        <div className="space-y-4 text-sm text-slate-300">
          {selectedTask && (
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <h4 className="font-semibold text-slate-200">Selected Task:</h4>
              <p className="mt-1">{selectedTask.title}</p>
              {selectedTask.eta && (
                <p className="text-xs text-slate-400 mt-1">Estimated: {selectedTask.eta}</p>
              )}
            </div>
          )}
          
          <p>Each participant will receive a randomized codename for this sprint.</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300/90">
            <li>No identity reveal until final scoring</li>
            <li>Mentor feedback will be tracked to codenames</li>
            <li>AI scoring will analyze: code quality, tests, collaboration</li>
            <li>Real-time code tracking and metrics</li>
          </ul>
          
          <div className="pt-2 border-t border-slate-700">
            <p className="text-xs text-slate-400">
              You can change tasks by clicking on different cards before starting.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}