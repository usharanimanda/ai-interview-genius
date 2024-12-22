import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Send } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  timestamp: string;
}

export const AIInterviewer = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const predefinedQuestions = [
    "Can you tell me about your background and experience?",
    "What interests you about this position?",
    "How do you handle challenging situations at work?",
    "Where do you see yourself in five years?",
    "What are your key strengths and weaknesses?",
  ];

  const askNextQuestion = () => {
    if (currentQuestionIndex < predefinedQuestions.length) {
      const newQuestion = {
        id: questions.length + 1,
        text: predefinedQuestions[currentQuestionIndex],
        timestamp: new Date().toLocaleTimeString(),
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Interviewer</h3>
        <Button onClick={askNextQuestion} variant="outline" className="space-x-2">
          <MessageCircle className="w-4 h-4" />
          <span>Ask Next Question</span>
        </Button>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-muted p-3 rounded-lg space-y-2"
          >
            <p className="text-sm">{question.text}</p>
            <p className="text-xs text-muted-foreground">{question.timestamp}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};