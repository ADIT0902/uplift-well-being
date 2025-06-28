
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Check, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WellnessGoalsProps {
  compact?: boolean;
}

const WellnessGoals = ({ compact = false }: WellnessGoalsProps) => {
  const [goals, setGoals] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetFrequency, setTargetFrequency] = useState<string>('1');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('wellness_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      console.error('Error fetching wellness goals:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Please enter a goal title",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const userData = await supabase.auth.getUser();
      const userId = userData.data.user?.id;

      if (editingId) {
        const { error } = await supabase
          .from('wellness_goals')
          .update({
            title: title.trim(),
            description: description.trim() || null,
            target_frequency: parseInt(targetFrequency),
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Goal updated!",
          description: "Your wellness goal has been updated.",
        });
      } else {
        const { error } = await supabase
          .from('wellness_goals')
          .insert({
            user_id: userId,
            title: title.trim(),
            description: description.trim() || null,
            target_frequency: parseInt(targetFrequency),
          });

        if (error) throw error;

        toast({
          title: "Goal created!",
          description: "Your new wellness goal has been added.",
        });
      }

      resetForm();
      fetchGoals();
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

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTargetFrequency('1');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (goal: any) => {
    setTitle(goal.title);
    setDescription(goal.description || '');
    setTargetFrequency(goal.target_frequency.toString());
    setEditingId(goal.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const { error } = await supabase
        .from('wellness_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Goal deleted",
        description: "Your wellness goal has been removed.",
      });
      fetchGoals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateStreak = async (id: string, newStreak: number) => {
    try {
      const { error } = await supabase
        .from('wellness_goals')
        .update({ 
          current_streak: newStreak,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      fetchGoals();
      toast({
        title: "Progress updated!",
        description: "Your goal progress has been recorded.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleComplete = async (id: string, isCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from('wellness_goals')
        .update({ 
          is_completed: !isCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      fetchGoals();
      toast({
        title: isCompleted ? "Goal reopened" : "Goal completed!",
        description: isCompleted ? "Goal marked as active again." : "Congratulations on reaching your goal!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (compact) {
    const activeGoals = goals.filter(goal => !goal.is_completed).slice(0, 3);
    
    return (
      <div className="space-y-3">
        {activeGoals.length === 0 ? (
          <div className="text-center py-4">
            <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No active goals</p>
            <Button 
              size="sm" 
              onClick={() => setShowForm(true)}
              className="mt-2"
            >
              Add Goal
            </Button>
          </div>
        ) : (
          activeGoals.map((goal) => (
            <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{goal.title}</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStreak(goal.id, goal.current_streak + 1)}
                >
                  <Check className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>Streak: {goal.current_streak}</span>
                <span>•</span>
                <span>Target: {goal.target_frequency}/week</span>
              </div>
              <Progress 
                value={(goal.current_streak / goal.target_frequency) * 100} 
                className="h-1 mt-2"
              />
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Goal Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Wellness Goal
        </Button>
      )}

      {/* Goal Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Edit Goal' : 'Create New Goal'}
            </CardTitle>
            <CardDescription>
              Set a wellness goal to track your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Goal title (e.g., 'Daily meditation', 'Exercise 3x per week')"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Goal description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Select value={targetFrequency} onValueChange={setTargetFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Target frequency per week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 time per week</SelectItem>
                    <SelectItem value="2">2 times per week</SelectItem>
                    <SelectItem value="3">3 times per week</SelectItem>
                    <SelectItem value="4">4 times per week</SelectItem>
                    <SelectItem value="5">5 times per week</SelectItem>
                    <SelectItem value="7">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingId ? 'Update Goal' : 'Create Goal')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No wellness goals yet. Create your first goal to get started!</p>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => (
            <Card key={goal.id} className={goal.is_completed ? 'opacity-75' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className={`text-lg ${goal.is_completed ? 'line-through' : ''}`}>
                      {goal.title}
                    </CardTitle>
                    {goal.description && (
                      <CardDescription className="mt-1">
                        {goal.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleComplete(goal.id, goal.is_completed)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(goal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Current Streak: {goal.current_streak}</span>
                    <span>Target: {goal.target_frequency}/week</span>
                  </div>
                  
                  <Progress 
                    value={Math.min((goal.current_streak / goal.target_frequency) * 100, 100)}
                    className="h-2"
                  />
                  
                  {!goal.is_completed && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateStreak(goal.id, goal.current_streak + 1)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Mark Progress
                      </Button>
                      {goal.current_streak > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStreak(goal.id, Math.max(0, goal.current_streak - 1))}
                        >
                          Undo
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default WellnessGoals;
