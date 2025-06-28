import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Edit, Trash2, Lock, Unlock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const JournalEntry = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodRating, setMoodRating] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const userData = await supabase.auth.getUser();
      const userId = userData.data.user?.id;

      if (editingId) {
        // Update existing entry
        const { error } = await supabase
          .from('journal_entries')
          .update({
            title: title.trim(),
            content: content.trim(),
            mood_rating: moodRating ? parseInt(moodRating) : null,
            is_private: isPrivate,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Entry updated!",
          description: "Your journal entry has been updated.",
        });
      } else {
        // Create new entry
        const { error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: userId,
            title: title.trim(),
            content: content.trim(),
            mood_rating: moodRating ? parseInt(moodRating) : null,
            is_private: isPrivate,
          });

        if (error) throw error;

        toast({
          title: "Entry saved!",
          description: "Your journal entry has been saved.",
        });
      }

      // Reset form
      setTitle('');
      setContent('');
      setMoodRating('');
      setIsPrivate(true);
      setEditingId(null);
      fetchEntries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry: any) => {
    setTitle(entry.title);
    setContent(entry.content);
    setMoodRating(entry.mood_rating?.toString() || '');
    setIsPrivate(entry.is_private);
    setEditingId(entry.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Entry deleted",
        description: "Your journal entry has been deleted.",
      });
      fetchEntries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setTitle('');
    setContent('');
    setMoodRating('');
    setIsPrivate(true);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* New/Edit Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <span>{editingId ? 'Edit Entry' : 'New Journal Entry'}</span>
          </CardTitle>
          <CardDescription>
            Express your thoughts and feelings in a safe, private space
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Entry title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Textarea
                placeholder="What's on your mind today? Write about your thoughts, feelings, experiences, or anything you'd like to remember..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Select value={moodRating} onValueChange={setMoodRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Optional: Rate your mood (1-5)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Very Low</SelectItem>
                    <SelectItem value="2">2 - Low</SelectItem>
                    <SelectItem value="3">3 - Neutral</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPrivate(!isPrivate)}
                className="flex items-center space-x-2"
              >
                {isPrivate ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                <span>{isPrivate ? 'Private' : 'Shared'}</span>
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingId ? 'Update Entry' : 'Save Entry')}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Existing Entries */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Journal Entries</h2>
        {entries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No journal entries yet. Start writing your first entry above!</p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                      {entry.mood_rating && (
                        <span className="text-sm">• Mood: {entry.mood_rating}/5</span>
                      )}
                      {entry.is_private && <Lock className="h-3 w-3" />}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(entry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                {entry.updated_at !== entry.created_at && (
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {new Date(entry.updated_at).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalEntry;
