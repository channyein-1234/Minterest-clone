'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { addNote, getAllNotes, deleteNote, clearAllNotes } from '@/lib/db';

interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export default function DemoPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
    
    // Check online status
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadNotes = async () => {
    try {
      const allNotes = await getAllNotes();
      setNotes(allNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      const now = Date.now();
      await addNote({
        title,
        content,
        createdAt: now,
        updatedAt: now,
      });
      
      setTitle('');
      setContent('');
      await loadNotes();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteNote(id);
      await loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete all notes?')) {
      try {
        await clearAllNotes();
        await loadNotes();
      } catch (error) {
        console.error('Error clearing notes:', error);
        alert('Failed to clear notes');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Minterest PWA Demo</h1>
          <p className="text-muted-foreground">
            A Progressive Web App with IndexedDB & Offline Support
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Add Note Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Note</CardTitle>
            <CardDescription>
              Your notes are stored locally in IndexedDB and work offline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Input
                id="content"
                placeholder="Enter note content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={handleAddNote} className="flex-1">
              Add Note
            </Button>
            {notes.length > 0 && (
              <Button onClick={handleClearAll} variant="destructive">
                Clear All
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Notes List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Your Notes ({notes.length})
          </h2>
          
          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Loading notes...
              </CardContent>
            </Card>
          ) : notes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No notes yet. Create your first note above!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {notes.map((note) => (
                <Card key={note.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <CardDescription>
                      {new Date(note.createdAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{note.content}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => note.id && handleDeleteNote(note.id)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* PWA Info */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              PWA Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-start gap-2">
              <span className="font-semibold">✓</span>
              <span>Works offline - Try disabling your network connection</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold">✓</span>
              <span>Installable - Add to home screen on mobile or desktop</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold">✓</span>
              <span>IndexedDB storage - Data persists across sessions</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold">✓</span>
              <span>Shadcn/ui components - Beautiful, accessible UI</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
