'use client';

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getVocabulariesByChapters, getVocabulariesByBook } from "@/actions/vocabulary";
import { Vocabulary } from '@/types/vocabulary';
import FormCard from "@/components/forms/FormCard";

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  options?: string[]; // Only for multiple choice
  type: 'word-to-definition' | 'definition-to-word';
  answerType: 'multiple-choice' | 'text-input';
}

interface QuizResult {
  question: QuizQuestion;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

function QuizTestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<QuizResult[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [textAnswer, setTextAnswer] = useState<string>('');

  const book = searchParams.get('book') || '';
  const chapters = searchParams.get('chapters') || '';
  const totalQuestions = parseInt(searchParams.get('totalQuestions') || '10');
  const timeLimit = parseInt(searchParams.get('timeLimit') || '30');
  const questionType = searchParams.get('questionType') as 'word-to-definition' | 'definition-to-word';
  const answerType = searchParams.get('answerType') as 'multiple-choice' | 'text-input';

  // Load vocabularies
  useEffect(() => {
    const loadVocabularies = async () => {
      try {
        let vocabulariesData: Vocabulary[];
        
        if (chapters) {
          const chapterIds = chapters.split(',');
          vocabulariesData = await getVocabulariesByChapters(chapterIds);
        } else if (book) {
          vocabulariesData = await getVocabulariesByBook(book);
        } else {
          vocabulariesData = [];
        }
        
        setVocabularies(vocabulariesData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load vocabularies:', error);
        setLoading(false);
      }
    };

    loadVocabularies();
  }, [book, chapters]);

  // Generate quiz questions
  useEffect(() => {
    if (vocabularies.length === 0) return;

    const generateQuestions = (): QuizQuestion[] => {
      // Ensure we have enough vocabularies for the quiz
      if (vocabularies.length < 2) {
        console.warn('Not enough vocabularies for quiz');
        return [];
      }
      
      const shuffledVocabularies = [...vocabularies].sort(() => Math.random() - 0.5);
      const selectedVocabularies = shuffledVocabularies.slice(0, Math.min(totalQuestions, vocabularies.length));
      
      return selectedVocabularies.map(vocab => {
        const allDefinitions = vocab.definitions.map(def => def.definition);
        const correctDefinition = allDefinitions[0] || '정의 없음'; // Fallback for empty definitions
        
        // Generate wrong options from other vocabularies (only for multiple choice)
        const otherVocabularies = vocabularies.filter(v => v.id !== vocab.id);
        
        if (questionType === 'word-to-definition') {
          if (answerType === 'multiple-choice') {
            const wrongOptions = otherVocabularies
              .flatMap(v => v.definitions.map(def => def.definition))
              .filter(def => def !== correctDefinition && def.trim() !== '')
              .sort(() => Math.random() - 0.5)
              .slice(0, 3);
            
            const options = [correctDefinition, ...wrongOptions].sort(() => Math.random() - 0.5);
            
            return {
              question: vocab.word,
              correctAnswer: correctDefinition,
              options,
              type: 'word-to-definition',
              answerType: 'multiple-choice'
            };
          } else {
            return {
              question: vocab.word,
              correctAnswer: correctDefinition,
              type: 'word-to-definition',
              answerType: 'text-input'
            };
          }
        } else {
          if (answerType === 'multiple-choice') {
            // For definition-to-word, we need to ensure we have enough words for options
            const otherWords = otherVocabularies
              .map(v => v.word)
              .filter(word => word.trim() !== '')
              .sort(() => Math.random() - 0.5)
              .slice(0, 3);
            
            // If we don't have enough other words, we might need to adjust
            const options = [vocab.word, ...otherWords];
            
            // Ensure we have at least 2 options (minimum for a quiz)
            if (options.length < 2) {
              options.push('추가 옵션 1', '추가 옵션 2');
            }
            
            return {
              question: correctDefinition,
              correctAnswer: vocab.word,
              options: options.sort(() => Math.random() - 0.5),
              type: 'definition-to-word',
              answerType: 'multiple-choice'
            };
          } else {
            return {
              question: correctDefinition,
              correctAnswer: vocab.word,
              type: 'definition-to-word',
              answerType: 'text-input'
            };
          }
        }
      });
    };

    const quizQuestions = generateQuestions();
    setQuestions(quizQuestions);
  }, [vocabularies, totalQuestions, questionType, answerType]);

  const handleAnswer = useCallback((answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Safety check
    if (!currentQuestion) {
      console.error('Current question is undefined');
      return;
    }
    
    // Check if answer is correct based on answer type
    let isCorrect: boolean;
    if (currentQuestion.answerType === 'text-input') {
      // For text input, check if user answer is included in correct answer
      const userAnswerLower = answer.toLowerCase().trim();
      const correctAnswerLower = currentQuestion.correctAnswer.toLowerCase().trim();
      isCorrect = correctAnswerLower.includes(userAnswerLower) || userAnswerLower.includes(correctAnswerLower);
    } else {
      // For multiple choice, exact match
      isCorrect = answer === currentQuestion.correctAnswer;
    }
    
    const timeSpent = timeLimit - timeLeft;
    
    const result: QuizResult = {
      question: currentQuestion,
      userAnswer: answer,
      isCorrect,
      timeSpent
    };
    
    setUserAnswers(prev => [...prev, result]);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(timeLimit);
      setTextAnswer(''); // Reset text answer for next question
    } else {
      setQuizCompleted(true);
    }
  }, [questions, currentQuestionIndex, timeLimit, timeLeft]);


  // Timer effect
  useEffect(() => {
    if (!quizStarted || quizCompleted || timeLimit === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(''); // Time's up, mark as incorrect
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, timeLimit, handleAnswer]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(timeLimit);
    setTextAnswer('');
  };

  const handleTextAnswerSubmit = () => {
    if (textAnswer.trim()) {
      handleAnswer(textAnswer.trim());
    }
  };

  const handleTextAnswerKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextAnswerSubmit();
    }
  };

  const getScore = () => {
    const correctAnswers = userAnswers.filter(result => result.isCorrect).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const getAverageTime = () => {
    const totalTime = userAnswers.reduce((sum, result) => sum + result.timeSpent, 0);
    return Math.round(totalTime / userAnswers.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">퀴즈를 준비하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (vocabularies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">퀴즈를 풀 수 있는 단어가 없습니다.</p>
          <button
            onClick={() => router.push('/vocabulary/quiz')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            퀴즈 설정으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 md:px-8 md:py-10">
        <div className="max-w-2xl mx-auto">
          <FormCard
            title="퀴즈 시작"
            description="준비가 되면 시작 버튼을 눌러주세요"
          >
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  퀴즈 정보
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400">문제 수</div>
                    <div className="font-medium">{questions.length}문제</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400">제한 시간</div>
                    <div className="font-medium">{timeLimit === 0 ? '제한 없음' : `${timeLimit}초`}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400">문제 유형</div>
                    <div className="font-medium">
                      {questionType === 'word-to-definition' ? '단어 → 뜻' : '뜻 → 단어'}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400">답안 유형</div>
                    <div className="font-medium">
                      {answerType === 'multiple-choice' ? '객관식' : '주관식'}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400">범위</div>
                    <div className="font-medium">{book || '전체'}</div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={startQuiz}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
              >
                퀴즈 시작하기
              </button>
            </div>
          </FormCard>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const score = getScore();
    const averageTime = getAverageTime();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 md:px-8 md:py-10">
        <div className="max-w-4xl mx-auto">
          <FormCard
            title="퀴즈 결과"
            description="퀴즈가 완료되었습니다!"
          >
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <div className="text-6xl font-bold text-blue-600">{score}점</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {userAnswers.filter(result => result.isCorrect).length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">정답</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {userAnswers.filter(result => !result.isCorrect).length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">오답</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {averageTime}초
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">평균 시간</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">문제별 결과</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userAnswers.map((result, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      result.isCorrect 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white mb-1">
                            {index + 1}. {result.question.question}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            정답: {result.question.correctAnswer}
                          </div>
                                                     {!result.isCorrect && (
                             <div className="text-sm text-red-600 dark:text-red-400">
                               {result.question.answerType === 'text-input' ? '입력' : '선택'}: {result.userAnswer || '(시간 초과)'}
                             </div>
                           )}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          result.isCorrect 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {result.isCorrect ? '정답' : '오답'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/vocabulary/quiz')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  다시 퀴즈 풀기
                </button>
                <button
                  onClick={() => router.push('/vocabulary')}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  단어 목록으로
                </button>
              </div>
            </div>
          </FormCard>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Safety check for currentQuestion
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">퀴즈 문제를 불러오는 중 오류가 발생했습니다.</p>
          <button
            onClick={() => router.push('/vocabulary/quiz')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            퀴즈 설정으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-2xl mx-auto">
        <FormCard
          title={`문제 ${currentQuestionIndex + 1} / ${questions.length}`}
          description={
            questionType === 'word-to-definition' 
              ? (answerType === 'multiple-choice' ? '단어를 보고 맞는 뜻을 선택하세요' : '단어를 보고 맞는 뜻을 입력하세요')
              : (answerType === 'multiple-choice' ? '뜻을 보고 맞는 단어를 선택하세요' : '뜻을 보고 맞는 단어를 입력하세요')
          }
        >
          <div className="space-y-6">
            {/* Progress and Timer */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentQuestionIndex + 1}/{questions.length}
                </span>
              </div>
              {timeLimit > 0 && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  timeLeft <= 10 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {timeLeft}초
                </div>
              )}
            </div>

            {/* Question */}
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {currentQuestion.question}
              </div>
              
              {/* Answer Input */}
              {currentQuestion.answerType === 'multiple-choice' ? (
                /* Multiple Choice Options */
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="w-full p-4 text-left border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-gray-900 dark:text-white">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* Text Input */
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-2">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>정답의 일부만 입력해도 인정됩니다</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      답안을 입력하세요
                    </label>
                    <input
                      type="text"
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      onKeyPress={handleTextAnswerKeyPress}
                      placeholder={questionType === 'word-to-definition' ? '뜻을 입력하세요' : '단어를 입력하세요'}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={handleTextAnswerSubmit}
                    disabled={!textAnswer.trim()}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    답안 제출
                  </button>
                </div>
              )}
            </div>
          </div>
        </FormCard>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">퀴즈를 준비하는 중...</p>
      </div>
    </div>
  );
}

export default function QuizTestPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <QuizTestContent />
    </Suspense>
  );
}
