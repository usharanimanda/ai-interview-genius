import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Save } from 'lucide-react';

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
      <h3 className="text-xl font-semibold mb-4">Recruitment Officer Panel</h3>
      <div className="space-y-4">
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
          <Button variant="outline" className="space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Add Question</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};