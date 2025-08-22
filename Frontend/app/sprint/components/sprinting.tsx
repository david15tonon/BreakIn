"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import { PlayIcon, EyeIcon, CodeBracketIcon, ClockIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import { ArrowLeftIcon, UserGroupIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

// Types
interface CodeSession {
  keystrokes: number;
  startTime: number;
  elapsedTime: number;
  focusTime: number;
  tabSwitches: number;
  codeChanges: number;
}

interface LiveEvent {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
  message?: string;
}

export default function SprintingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters
  const sprintId = searchParams.get('sprintId');
  const taskId = searchParams.get('taskId');
  
  const [code, setCode] = useState<string>("// Your code here\nfunction solution() {\n  // Implement your solution\n  return \"Hello World\";\n}");
  const [sessionMetrics, setSessionMetrics] = useState<CodeSession>({
    keystrokes: 0,
    startTime: Date.now(),
    elapsedTime: 0,
    focusTime: 0,
    tabSwitches: 0,
    codeChanges: 0
  });
  const [isActive, setIsActive] = useState(true);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [currentTask, setCurrentTask] = useState({
    title: "Loading...",
    description: "",
    difficulty: "Medium",
    estimatedTime: "2h"
  });
  const [userId, setUserId] = useState<string>('');

  // CORRECTION ICI : Ajout de null comme valeur initiale
  const focusTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load user ID on component mount
  useEffect(() => {
    // Get user ID from localStorage or your auth system
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserId(user.pseudonym || user.id || 'default-user');
      } catch (error) {
        setUserId('default-user');
      }
    } else {
      setUserId('default-user');
    }
  }, []);

  // Load task data and initialize tracking
  useEffect(() => {
    if (taskId && userId) {
      loadTaskData(taskId);
      initializeLiveFeed();
    }

    if (isActive) {
      // Focus timer
      focusTimerRef.current = setInterval(() => {
        setSessionMetrics(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000),
          focusTime: prev.focusTime + 1
        }));
      }, 1000);

      // Simulate live events
      activityTimerRef.current = setInterval(() => {
        addLiveEvent({
          user: ["CodeCell-A9", "Dev-Sigma7", "Mentor-Zeta2"][Math.floor(Math.random() * 3)],
          action: ["code", "review", "test", "comment"][Math.floor(Math.random() * 4)],
          message: ["Fixed a bug", "Submitted a review", "Added tests", "Commented on code"][Math.floor(Math.random() * 4)]
        });
      }, 30000);
    }

    return () => {
      if (focusTimerRef.current) clearInterval(focusTimerRef.current);
      if (activityTimerRef.current) clearInterval(activityTimerRef.current);
    };
  }, [isActive, taskId, userId]);

  const loadTaskData = async (taskId: string) => {
    try {
      // Use the userId in the API call
      const response = await fetch(`/api/tasks/${taskId}?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      const taskData = await response.json();
      setCurrentTask(taskData);
      
      addLiveEvent({
        user: "System",
        action: "start",
        message: `Task "${taskData.title}" started`
      });
    } catch (error) {
      console.error("Error loading task:", error);
      // Fallback to mock data
      setCurrentTask({
        title: "Implement Payment API",
        description: "Create endpoints for payment processing with Stripe",
        difficulty: "Medium",
        estimatedTime: "2h"
      });
    }
  };

  const initializeLiveFeed = () => {
    // Initial live events
    addLiveEvent({
      user: "CodeCell-A9",
      action: "start",
      message: "Started working on the task"
    });
    
    addLiveEvent({
      user: "Mentor-Zeta2",
      action: "comment",
      message: "Remember to handle edge cases!"
    });
  };

  const addLiveEvent = (event: Omit<LiveEvent, "id" | "timestamp">) => {
    setLiveEvents(prev => [
      {
        ...event,
        id: Date.now().toString(),
        timestamp: new Date()
      },
      ...prev.slice(0, 9) // Keep only last 10 events
    ]);
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
      setSessionMetrics(prev => ({
        ...prev,
        keystrokes: prev.keystrokes + 1,
        codeChanges: prev.codeChanges + 1
      }));

      // Send periodic code snapshots
      if (sessionMetrics.codeChanges % 10 === 0) {
        trackCodeSnapshot(value);
      }
    }
  };

  const trackCodeSnapshot = async (codeContent: string) => {
    try {
      await fetch("/api/track/code-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeContent,
          timestamp: new Date().toISOString(),
          metrics: sessionMetrics,
          userId: userId,
          sprintId: sprintId,
          taskId: taskId
        })
      });
    } catch (error) {
      console.error("Error tracking code snapshot:", error);
    }
  };

  const handleSubmitSolution = async () => {
    setIsActive(false);
    
    try {
      const response = await fetch("/api/sprint/submit-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sprintId: sprintId || 'unknown-sprint',
          taskId: taskId || 'unknown-task',
          userId: userId,
          task: currentTask.title,
          solution: code,
          metrics: sessionMetrics
        })
      });

      if (response.ok) {
        addLiveEvent({
          user: "System",
          action: "complete",
          message: "Task submitted successfully!"
        });
        
        setTimeout(() => {
          router.push(`/sprint/results?sprintId=${sprintId}&taskId=${taskId}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] to-[#0e1628] text-slate-200">
      {/* Header */}
      <div className="border-b border-slate-800 bg-[#0f1a2b]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">Live Sprint</h1>
                <p className="text-sm text-slate-400">E-commerce Platform • Payment Integration</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-sm text-slate-400">Time Elapsed</div>
                <div className="text-lg font-mono font-bold text-emerald-400">
                  {formatTime(sessionMetrics.elapsedTime)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-slate-400">Focus Time</div>
                <div className="text-lg font-bold text-cyan-400">
                  {formatTime(sessionMetrics.focusTime)}
                </div>
              </div>

              <button
                onClick={handleSubmitSolution}
                disabled={!userId}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-emerald-950 font-semibold rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayIcon className="w-5 h-5" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - IDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Info */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f1a2b]/90 p-6">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-blue-400" />
              {currentTask.title}
            </h2>
            <p className="text-sm text-slate-300 mb-3">{currentTask.description}</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="px-2 py-1 bg-slate-800 rounded">Difficulty: {currentTask.difficulty}</span>
              <span className="px-2 py-1 bg-slate-800 rounded">Est. Time: {currentTask.estimatedTime}</span>
            </div>
          </div>

          {/* Code Editor */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f1a2b]/90 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CodeBracketIcon className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-mono">solution.js</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Keystrokes: {sessionMetrics.keystrokes}</span>
                <span>Changes: {sessionMetrics.codeChanges}</span>
              </div>
            </div>
            
            <Editor
              height="500px"
              defaultLanguage="javascript"
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on"
              }}
            />
          </div>
        </div>

        {/* Right Column - Metrics & Live Feed */}
        <div className="space-y-6">
          {/* Metrics Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f1a2b]/90 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-cyan-400" />
              Coding Metrics
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Time:</span>
                <span className="font-mono">{formatTime(sessionMetrics.elapsedTime)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Focus Time:</span>
                <span className="font-mono text-cyan-400">{formatTime(sessionMetrics.focusTime)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Keystrokes:</span>
                <span className="font-mono">{sessionMetrics.keystrokes}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Changes:</span>
                <span className="font-mono">{sessionMetrics.codeChanges}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tab Switches:</span>
                <span className="font-mono">{sessionMetrics.tabSwitches}</span>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Efficiency:</span>
                  <span className="font-mono text-emerald-400">
                    {sessionMetrics.keystrokes > 0 
                      ? Math.round((sessionMetrics.focusTime / sessionMetrics.elapsedTime) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Feed Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f1a2b]/90 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <EyeIcon className="w-5 h-5 text-purple-400" />
              Live Feed
            </h3>
            
            <div className="h-96 overflow-y-auto space-y-3">
              {liveEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      event.action === "start" ? "bg-green-400" :
                      event.action === "complete" ? "bg-blue-400" :
                      event.action === "comment" ? "bg-yellow-400" :
                      "bg-purple-400"
                    }`} />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-cyan-300">{event.user}</span>
                        <span className="text-xs text-slate-400">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {event.message && (
                        <p className="text-sm text-slate-300 mt-1">{event.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {liveEvents.length === 0 && (
                <div className="text-center text-slate-400 py-8">
                  <UserGroupIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Waiting for activity...</p>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-slate-400" />
                <input
                  placeholder="Send a message..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder-slate-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addLiveEvent({
                        user: "You",
                        action: "comment",
                        message: e.currentTarget.value
                      });
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}