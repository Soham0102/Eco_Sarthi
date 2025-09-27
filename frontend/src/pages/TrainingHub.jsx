import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TrainingHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("videos");
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [ppeChecklist, setPpeChecklist] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Check if worker is logged in
    const isWorker = localStorage.getItem("isWorker");
    if (!isWorker) {
      navigate("/worker-login");
      return;
    }

    // Mock training data - replace with API call
    const mockVideos = [
      {
        id: 1,
        title: "Safety First: Personal Protective Equipment",
        duration: "8:45",
        category: "Safety",
        description: "Learn about proper PPE usage and maintenance",
        thumbnail: "/images/safety-video1.jpg",
        completed: false
      },
      {
        id: 2,
        title: "Waste Segregation Best Practices",
        duration: "12:30",
        category: "Operations",
        description: "Understanding different waste types and proper segregation",
        thumbnail: "/images/segregation-video1.jpg",
        completed: true
      },
      {
        id: 3,
        title: "Vehicle Safety and Maintenance",
        duration: "15:20",
        category: "Safety",
        description: "Vehicle operation safety and daily maintenance checks",
        thumbnail: "/images/vehicle-safety1.jpg",
        completed: false
      },
      {
        id: 4,
        title: "Emergency Response Procedures",
        duration: "10:15",
        category: "Emergency",
        description: "What to do in case of accidents or emergencies",
        thumbnail: "/images/emergency1.jpg",
        completed: false
      }
    ];

    const mockQuizzes = [
      {
        id: 1,
        title: "PPE Safety Quiz",
        description: "Test your knowledge about Personal Protective Equipment",
        questions: 5,
        timeLimit: 10,
        category: "Safety",
        completed: false,
        score: 0
      },
      {
        id: 2,
        title: "Waste Segregation Quiz",
        description: "Scenario-based questions about waste segregation",
        questions: 8,
        timeLimit: 15,
        category: "Operations",
        completed: true,
        score: 85
      }
    ];

    const mockPpeChecklist = [
      { id: 1, item: "Safety Helmet", checked: false, required: true },
      { id: 2, item: "High-Visibility Vest", checked: false, required: true },
      { id: 3, item: "Safety Gloves", checked: false, required: true },
      { id: 4, item: "Safety Boots", checked: false, required: true },
      { id: 5, item: "Face Mask/Respirator", checked: false, required: true },
      { id: 6, item: "Safety Goggles", checked: false, required: false },
      { id: 7, item: "First Aid Kit", checked: false, required: true },
      { id: 8, item: "Emergency Whistle", checked: false, required: false }
    ];

    setVideos(mockVideos);
    setQuizzes(mockQuizzes);
    setPpeChecklist(mockPpeChecklist);
  }, [navigate]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    // In a real app, this would open a video player
    alert(`Starting video: ${video.title}`);
  };

  const handleQuizStart = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setQuizScore(0);
    setShowResults(false);
    setShowQuizModal(true);
  };

  const handlePpeToggle = (itemId) => {
    setPpeChecklist(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const getQuizQuestions = (quizId) => {
    // Mock quiz questions - replace with API call
    const questions = {
      1: [
        {
          id: 1,
          question: "What is the most important PPE item for waste collection workers?",
          options: ["Safety Helmet", "High-Visibility Vest", "Safety Gloves", "All of the above"],
          correct: 3,
          audio: "What is the most important PPE item for waste collection workers?"
        },
        {
          id: 2,
          question: "When should you replace your safety gloves?",
          options: ["When they get dirty", "When they tear or wear out", "Every week", "Never"],
          correct: 1,
          audio: "When should you replace your safety gloves?"
        },
        {
          id: 3,
          question: "What should you do if your safety helmet is damaged?",
          options: ["Continue using it", "Replace it immediately", "Fix it yourself", "Ignore the damage"],
          correct: 1,
          audio: "What should you do if your safety helmet is damaged?"
        }
      ],
      2: [
        {
          id: 1,
          question: "You find a bin with mixed organic and plastic waste. What should you do?",
          options: ["Collect as is", "Separate the waste", "Skip this bin", "Report the violation"],
          correct: 3,
          audio: "You find a bin with mixed organic and plastic waste. What should you do?"
        },
        {
          id: 2,
          question: "A resident asks you to take hazardous waste. How should you respond?",
          options: ["Take it anyway", "Refuse and explain proper disposal", "Take it but report it", "Ignore the request"],
          correct: 1,
          audio: "A resident asks you to take hazardous waste. How should you respond?"
        }
      ]
    };
    return questions[quizId] || [];
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const questions = getQuizQuestions(selectedQuiz.id);
    if (selectedAnswer === questions[currentQuestion].correct) {
      setQuizScore(prev => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer("");
    } else {
      setShowResults(true);
    }
  };

  const awardGoldenPoints = async (basePoints) => {
    try {
      const workerId = localStorage.getItem("workerId");
      if (!workerId) return;
      await axios.post("http://localhost:5000/api/worker/award-training", {
        workerId,
        points: basePoints,
        description: "Training quiz completed"
      });
    } catch (e) {
      // non-blocking
    }
  };

  const playAudio = (text) => {
    // In a real app, this would use text-to-speech or pre-recorded audio
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const getCompletionPercentage = () => {
    const total = ppeChecklist.length;
    const checked = ppeChecklist.filter(item => item.checked).length;
    return Math.round((checked / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <button
                onClick={() => navigate("/worker-dashboard")}
                className="text-blue-600 hover:text-blue-700 mb-2"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Training Hub</h1>
              <p className="text-gray-600">Safety training videos and PPE checklist</p>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{videos.filter(v => v.completed).length}</span> videos completed
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: "videos", label: "Training Videos", icon: "📹" },
              { key: "quizzes", label: "Safety Quizzes", icon: "📝" },
              { key: "ppe", label: "PPE Checklist", icon: "🛡️" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Training Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">{video.duration}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {video.category}
                      </span>
                      {video.completed && (
                        <span className="text-green-500 text-sm">✓ Completed</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                    <button
                      onClick={() => handleVideoSelect(video)}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {video.completed ? "Watch Again" : "Start Video"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === "quizzes" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Safety Quizzes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {quiz.category}
                    </span>
                    {quiz.completed && (
                      <span className="text-green-500 text-sm">✓ Completed</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{quiz.questions} questions</span>
                    <span>{quiz.timeLimit} minutes</span>
                    {quiz.completed && <span>Score: {quiz.score}%</span>}
                  </div>
                  <button
                    onClick={() => handleQuizStart(quiz)}
                    className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    {quiz.completed ? "Retake Quiz" : "Start Quiz"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PPE Checklist Tab */}
        {activeTab === "ppe" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">PPE Checklist</h2>
              <div className="text-sm text-gray-600">
                Completion: {getCompletionPercentage()}%
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-4">
                {ppeChecklist.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handlePpeToggle(item.id)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className={`font-medium ${item.checked ? 'text-green-600' : 'text-gray-900'}`}>
                        {item.item}
                      </span>
                      {item.required && (
                        <span className="ml-2 text-red-500 text-sm">*Required</span>
                      )}
                    </div>
                    {item.checked && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Safety Reminder</h3>
                <p className="text-sm text-blue-800">
                  Always ensure all required PPE items are checked before starting your shift. 
                  Your safety is our priority!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Modal */}
      {showQuizModal && selectedQuiz && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {!showResults ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedQuiz.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Question {currentQuestion + 1} of {getQuizQuestions(selectedQuiz.id).length}
                    </span>
                  </div>

                  {(() => {
                    const questions = getQuizQuestions(selectedQuiz.id);
                    const question = questions[currentQuestion];
                    return (
                      <div>
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="text-lg font-medium text-gray-900">{question.question}</p>
                            <button
                              onClick={() => playAudio(question.audio)}
                              className="p-1 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                            >
                              🔊
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          {question.options.map((option, index) => (
                            <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="radio"
                                name="answer"
                                value={index}
                                checked={selectedAnswer === index}
                                onChange={() => handleAnswerSelect(index)}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-gray-900">{option}</span>
                            </label>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={handleNextQuestion}
                            disabled={selectedAnswer === ""}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {currentQuestion < getQuizQuestions(selectedQuiz.id).length - 1 ? "Next" : "Finish"}
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quiz Results</h3>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {Math.round((quizScore / getQuizQuestions(selectedQuiz.id).length) * 100)}%
                    </div>
                    <p className="text-gray-600">
                      You scored {quizScore} out of {getQuizQuestions(selectedQuiz.id).length} questions
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    {quizScore === getQuizQuestions(selectedQuiz.id).length ? (
                      <div className="text-green-600">
                        <p className="text-lg font-semibold">Perfect Score! 🎉</p>
                        <p className="text-sm">You've earned 50 bonus points!</p>
                      </div>
                    ) : quizScore >= getQuizQuestions(selectedQuiz.id).length * 0.8 ? (
                      <div className="text-green-600">
                        <p className="text-lg font-semibold">Great Job! 👍</p>
                        <p className="text-sm">You've earned 25 bonus points!</p>
                      </div>
                    ) : (
                      <div className="text-yellow-600">
                        <p className="text-lg font-semibold">Good Effort! 💪</p>
                        <p className="text-sm">Keep studying to improve your score!</p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={async () => {
                        setShowQuizModal(false);
                        setSelectedQuiz(null);
                        setCurrentQuestion(0);
                        setQuizScore(0);
                        setShowResults(false);
                        // Award points based on score tiers
                        const total = getQuizQuestions(selectedQuiz.id).length;
                        const pct = total ? Math.round((quizScore / total) * 100) : 0;
                        const bonus = pct === 100 ? 50 : pct >= 80 ? 25 : 10;
                        await awardGoldenPoints(bonus);
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setCurrentQuestion(0);
                        setQuizScore(0);
                        setShowResults(false);
                        setSelectedAnswer("");
                      }}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Retake Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
