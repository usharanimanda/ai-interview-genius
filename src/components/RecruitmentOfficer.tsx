import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Save, Camera, Mic } from 'lucide-react';
import { AIInterviewer } from './AIInterviewer';

export const RecruitmentOfficer = () => {
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSaveNotes = () => {
    toast({
      title: "Notes Saved",
      description: "Interview notes have been saved successfully",
    });
  };

  return (
    <Card className="p-6 mt-4">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Recruitment Officer Panel</h3>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              Interview Notes
            </label>
            <Textarea
              id="notes"
              placeholder="Type your interview notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={handleSaveNotes} className="space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Notes</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <AIInterviewer />
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span className="text-sm">Camera</span>
              </div>
              <Button variant="outline" size="sm">Toggle</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                <span className="text-sm">Microphone</span>
              </div>
              <Button variant="outline" size="sm">Toggle</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};