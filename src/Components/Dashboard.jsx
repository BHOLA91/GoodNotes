import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderClosed,
  Star,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  CheckSquare,
  Search,
  Trash2,
  FileText,
  Heart
} from 'lucide-react';

export default function Dashboard({ darkMode, toggleTheme }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('To Do');
  
  // Responsive sidebar drawer state for mobile
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Collapse/Expand state for buckets
  const [expandedBuckets, setExpandedBuckets] = useState({
    today: true,
    upcoming: false,
    someday: false
  });

  // Adding task inputs state
  const [newTasksInputs, setNewTasksInputs] = useState({
    today: { title: '', duration: '30m Focus', tag: 'Design' },
    upcoming: { title: '', duration: '1h Focus', tag: 'Business' },
    someday: { title: '', duration: '2h Focus', tag: 'Personal' }
  });

  // Show task input form state
  const [showAddForm, setShowAddForm] = useState({
    today: false,
    upcoming: false,
    someday: false
  });

  // Notes states
  const [noteSearchQuery, setNoteSearchQuery] = useState('');
  
  // Note editor modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // null if creating
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorColor, setEditorColor] = useState('#6366f1');
  const [editorFavorite, setEditorFavorite] = useState(false);

  // Note colors palette
  const noteColors = [
    { value: '#6366f1', name: 'Indigo' },
    { value: '#10b981', name: 'Emerald' },
    { value: '#f59e0b', name: 'Amber' },
    { value: '#f43f5e', name: 'Rose' },
    { value: '#8b5cf6', name: 'Violet' },
    { value: '#06b6d4', name: 'Cyan' }
  ];

  // Fetch user, tasks, and notes on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    fetchData(token);
  }, [navigate]);

  const fetchData = async (token) => {
    try {
      setLoading(true);
      // Fetch tasks
      const tasksRes = await fetch('http://localhost:5000/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!tasksRes.ok && tasksRes.status === 401) {
        handleLogout();
        return;
      }
      const tasksData = await tasksRes.json();
      setTasks(tasksData);

      // Fetch notes
      const notesRes = await fetch('http://localhost:5000/api/notes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData);
      }
    } catch (err) {
      console.error(err);
      setError('Could not fetch data. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- Task CRUD handlers ---
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !currentStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      const updatedTask = await response.json();
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    } catch (err) {
      console.error(err);
      alert('Error updating task');
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to delete task');
      
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error(err);
      alert('Error deleting task');
    }
  };

  const handleAddTask = async (bucket) => {
    const input = newTasksInputs[bucket];
    if (!input.title.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: input.title,
          due_bucket: bucket,
          duration: input.duration,
          tag: input.tag
        })
      });
      
      if (!response.ok) throw new Error('Failed to create task');
      
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      
      setNewTasksInputs(prev => ({
        ...prev,
        [bucket]: { ...prev[bucket], title: '' }
      }));
      setShowAddForm(prev => ({ ...prev, [bucket]: false }));
    } catch (err) {
      console.error(err);
      alert('Error adding task');
    }
  };

  const handleInputChange = (bucket, field, value) => {
    setNewTasksInputs(prev => ({
      ...prev,
      [bucket]: {
        ...prev[bucket],
        [field]: value
      }
    }));
  };

  const toggleBucket = (bucket) => {
    setExpandedBuckets(prev => ({ ...prev, [bucket]: !prev[bucket] }));
  };

  // --- Notes CRUD handlers ---
  const handleOpenNewNote = () => {
    setEditingNote(null);
    setEditorTitle('');
    setEditorContent('');
    setEditorColor('#6366f1');
    setEditorFavorite(false);
    setIsEditorOpen(true);
  };

  const handleOpenEditNote = (note) => {
    setEditingNote(note);
    setEditorTitle(note.title);
    setEditorContent(note.content || '');
    setEditorColor(note.color || '#6366f1');
    setEditorFavorite(note.is_favorite === 1);
    setIsEditorOpen(true);
  };

  const handleSaveNote = async () => {
    if (!editorTitle.trim()) {
      alert('Please enter a note title');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (editingNote) {
        // Update existing note
        const response = await fetch(`http://localhost:5000/api/notes/${editingNote.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: editorTitle,
            content: editorContent,
            color: editorColor,
            is_favorite: editorFavorite ? 1 : 0
          })
        });

        if (!response.ok) throw new Error('Failed to update note');
        
        const updated = await response.json();
        setNotes(prev => prev.map(n => n.id === editingNote.id ? updated : n));
      } else {
        // Create new note
        const response = await fetch('http://localhost:5000/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: editorTitle,
            content: editorContent,
            color: editorColor
          })
        });

        if (!response.ok) throw new Error('Failed to create note');
        
        const created = await response.json();
        setNotes(prev => [created, ...prev]);
      }
      setIsEditorOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error saving note');
    }
  };

  const toggleNoteFavorite = async (e, note) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notes/${note.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_favorite: note.is_favorite === 1 ? 0 : 1 })
      });

      if (!response.ok) throw new Error('Failed to update favorite');
      
      const updated = await response.json();
      setNotes(prev => prev.map(n => n.id === note.id ? updated : n));
    } catch (err) {
      console.error(err);
      alert('Error updating note');
    }
  };

  const deleteNote = async (e, noteId) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete note');
      
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (err) {
      console.error(err);
      alert('Error deleting note');
    }
  };

  // Grouping tasks
  const todayTasks = tasks.filter(t => t.due_bucket === 'today');
  const upcomingTasks = tasks.filter(t => t.due_bucket === 'upcoming');
  const somedayTasks = tasks.filter(t => t.due_bucket === 'someday');

  // Stats
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(t => t.completed === 1).length;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(noteSearchQuery.toLowerCase()) || 
                          (note.content && note.content.toLowerCase().includes(noteSearchQuery.toLowerCase()));
    if (activeTab === 'Favorite Notes') {
      return matchesSearch && note.is_favorite === 1;
    }
    return matchesSearch;
  });

  // Sidebar Menu Items
  const sidebarItems = [
    { name: 'To Do', icon: CheckSquare },
    { name: 'Your Notes', icon: FolderClosed },
    { name: 'Favorite Notes', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#030303] text-neutral-900 dark:text-neutral-100 flex transition-colors duration-500 font-sans relative overflow-hidden">
      
      {/* Glow backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40 dark:opacity-75 z-0">
        <div className="absolute inset-0 bg-radial-glow dark:bg-radial-glow transition-opacity duration-500" />
      </div>

      
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-neutral-100 dark:bg-[#0d0d0d] border-r border-neutral-200/50 dark:border-neutral-900/50 
        flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:flex
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        <div className="flex flex-col gap-8">
          
          {/* User Profile Info Section */}
          <div className="flex items-center gap-3 py-2 border-b border-neutral-200/30 dark:border-neutral-800/30 relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-indigo-500/10">
              {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'DT'}
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-neutral-800 dark:text-white truncate">
                {user?.fullName || 'Deep Thinker'}
              </span>
             
            </div>

           
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden absolute right-0 p-1 rounded-md text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          
          <nav className="flex flex-col gap-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setMobileSidebarOpen(false);
                  }}
                  className={`
                    flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer
                    ${isActive 
                      ? 'bg-[#e0e5ff] text-[#1f2d5a] shadow-sm shadow-[#e0e5ff]/20' 
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-900/50'
                    }
                  `}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#1f2d5a]' : 'text-neutral-400 dark:text-neutral-500'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout button at the bottom */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold text-red-650 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5" />
          Log Out
        </button>
      </aside>

      {/* Sidebar Backdrop Overlay for Mobile */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        
        {/* Top Header Navbar */}
        <header className="sticky top-0 z-20 w-full bg-white/70 dark:bg-[#030303]/70 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-900/50 transition-colors duration-500">
          <div className="px-6 md:px-8 h-18 flex justify-between items-center">
            
            {/* Hamburger menu & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-auto h-9 rounded bg-neutral-100 dark:bg-neutral-900">
                  <img src="/Icon.png" alt="Logo h-[20px] w-auto" className="w-full h-full object-cover" />
                </div>
                <span className="text-md font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
                  Good Notes
                </span>
              </div>
            </div>

            {/* Right Header actions */}
            <div className="flex items-center gap-4">
              
              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-950/80 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 border border-transparent hover:border-neutral-200/50 dark:hover:border-neutral-800/50 relative overflow-hidden active:scale-90 cursor-pointer"
                aria-label="Toggle Theme"
              >
                {darkMode ? (
                  <Sun className="w-4.5 h-4.5 transition-transform duration-500 rotate-0" />
                ) : (
                  <Moon className="w-4.5 h-4.5 transition-transform duration-500 rotate-0" />
                )}
              </button>

              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user?.fullName ? user.fullName[0].toUpperCase() : 'D'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Scrollable Body */}
        <main className="flex-1 overflow-y-auto px-6 md:px-8 py-8 max-w-5xl w-full mx-auto flex flex-col gap-8">
          
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Loading your workspace...</span>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/25 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl text-center font-medium">
              {error}
            </div>
          ) : (
            <>
              {/* --- TAB A: TO DO --- */}
              {activeTab === 'To Do' && (
                <>
                  {/* Header Title Section */}
                  <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-heading">
                      Smart To-Do
                    </h1>
                    <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400">
                      Organize your thoughts into actionable steps.
                    </p>
                  </div>

                  {/* Collapsible Buckets List */}
                  <div className="flex flex-col gap-4">
                    
                    {/* TODAY BUCKET */}
                    <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-200/60 dark:border-neutral-900 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                      <button 
                        onClick={() => toggleBucket('today')}
                        className="w-full px-6 py-4.5 flex justify-between items-center hover:bg-neutral-100/50 dark:hover:bg-[#121212]/30 transition-colors duration-200 text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-sm shadow-blue-500/50" />
                          <span className="text-base font-bold text-neutral-800 dark:text-white font-heading">
                            Today
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                            {todayTasks.length}
                          </span>
                        </div>
                        {expandedBuckets.today ? (
                          <ChevronUp className="w-4.5 h-4.5 text-neutral-400 dark:text-neutral-500" />
                        ) : (
                          <ChevronDown className="w-4.5 h-4.5 text-neutral-400 dark:text-neutral-500" />
                        )}
                      </button>

                      {expandedBuckets.today && (
                        <div className="px-6 pb-6 pt-1 flex flex-col gap-3.5 border-t border-neutral-100 dark:border-neutral-900/60">
                          
                          {todayTasks.length === 0 ? (
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center py-4">No tasks due today. Relax or add a task below.</p>
                          ) : (
                            todayTasks.map((task) => (
                              <div 
                                key={task.id} 
                                className="group relative bg-neutral-50 dark:bg-[#141414] border border-neutral-200/50 dark:border-neutral-900/80 hover:border-neutral-300 dark:hover:border-neutral-800/80 p-4 rounded-xl flex items-center justify-between transition-all duration-300 shadow-xs"
                              >
                                <div className="flex items-center gap-4 flex-1 min-w-0 pr-8">
                                  <button
                                    onClick={() => toggleTaskCompletion(task.id, task.completed)}
                                    className={`
                                      w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 cursor-pointer flex-shrink-0
                                      ${task.completed 
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/30' 
                                        : 'border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-transparent'
                                      }
                                    `}
                                  >
                                    {task.completed === 1 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  </button>
                                  
                                  <div className="flex flex-col gap-1.5 min-w-0">
                                    <span className={`text-sm font-bold truncate transition-colors duration-300 ${task.completed ? 'text-neutral-400 dark:text-neutral-500 line-through font-medium' : 'text-neutral-850 dark:text-neutral-150'}`}>
                                      {task.title}
                                    </span>
                                    
                                    <div className="flex items-center flex-wrap gap-2.5">
                                      {task.duration && (
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-200/40 dark:bg-neutral-900/80 px-2 py-0.5 rounded-md">
                                          <Clock className="w-3 h-3 text-neutral-400" />
                                          {task.duration}
                                        </span>
                                      )}
                                      {task.tag && (
                                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-md">
                                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                          {task.tag}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer lg:opacity-0 group-hover:opacity-100"
                                  aria-label="Delete Task"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          )}

                          {showAddForm.today ? (
                            <div className="bg-neutral-50 dark:bg-[#141414] border border-dashed border-neutral-300 dark:border-neutral-800 p-4.5 rounded-xl flex flex-col gap-3.5 mt-1 animate-fade-in">
                              <input
                                type="text"
                                placeholder="What needs to be done?"
                                value={newTasksInputs.today.title}
                                onChange={(e) => handleInputChange('today', 'title', e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTask('today')}
                                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-neutral-900 dark:text-white font-semibold"
                                autoFocus
                              />
                              
                              <div className="flex items-center gap-3.5 justify-between">
                                <div className="flex items-center gap-2.5">
                                  <select
                                    value={newTasksInputs.today.duration}
                                    onChange={(e) => handleInputChange('today', 'duration', e.target.value)}
                                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-bold focus:outline-none cursor-pointer"
                                  >
                                    <option value="15m Focus">15m Focus</option>
                                    <option value="30m Focus">30m Focus</option>
                                    <option value="1h Focus">1h Focus</option>
                                    <option value="2h Focus">2h Focus</option>
                                    <option value="3h Focus">3h Focus</option>
                                    <option value="4h Focus">4h Focus</option>
                                  </select>

                                  <select
                                    value={newTasksInputs.today.tag}
                                    onChange={(e) => handleInputChange('today', 'tag', e.target.value)}
                                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-bold focus:outline-none cursor-pointer"
                                  >
                                    <option value="Design">Design</option>
                                    <option value="Business">Business</option>
                                    <option value="Personal">Personal</option>
                                    <option value="Study">Study</option>
                                  </select>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setShowAddForm(prev => ({ ...prev, today: false }))}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-900 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleAddTask('today')}
                                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-850 dark:hover:bg-neutral-100 cursor-pointer"
                                  >
                                    Add Task
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowAddForm(prev => ({ ...prev, today: true }))}
                              className="w-full py-3 bg-neutral-50 dark:bg-[#141414] border border-dashed border-neutral-200 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-800 text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.005] cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              Add new task
                            </button>
                          )}

                        </div>
                      )}
                    </div>

                    {/* UPCOMING BUCKET */}
                    <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-200/60 dark:border-neutral-900 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                      <button 
                        onClick={() => toggleBucket('upcoming')}
                        className="w-full px-6 py-4.5 flex justify-between items-center hover:bg-neutral-100/50 dark:hover:bg-[#121212]/30 transition-colors duration-200 text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-neutral-400 dark:bg-neutral-600 shadow-sm" />
                          <span className="text-base font-bold text-neutral-800 dark:text-white font-heading">
                            Upcoming
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                            {upcomingTasks.length}
                          </span>
                        </div>
                        {expandedBuckets.upcoming ? (
                          <ChevronUp className="w-4.5 h-4.5 text-neutral-400 dark:text-neutral-500" />
                        ) : (
                          <ChevronDown className="w-4.5 h-4.5 text-neutral-400 dark:text-neutral-500" />
                        )}
                      </button>

                      {expandedBuckets.upcoming && (
                        <div className="px-6 pb-6 pt-1 flex flex-col gap-3.5 border-t border-neutral-100 dark:border-neutral-900/60">
                          
                          {upcomingTasks.length === 0 ? (
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center py-4">No upcoming tasks. Planning ahead keeps you focused.</p>
                          ) : (
                            upcomingTasks.map((task) => (
                              <div 
                                key={task.id} 
                                className="group relative bg-neutral-50 dark:bg-[#141414] border border-neutral-200/50 dark:border-neutral-900/80 hover:border-neutral-300 dark:hover:border-neutral-800/80 p-4 rounded-xl flex items-center justify-between transition-all duration-300 shadow-xs"
                              >
                                <div className="flex items-center gap-4 flex-1 min-w-0 pr-8">
                                  <button
                                    onClick={() => toggleTaskCompletion(task.id, task.completed)}
                                    className={`
                                      w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 cursor-pointer flex-shrink-0
                                      ${task.completed 
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/30' 
                                        : 'border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-transparent'
                                      }
                                    `}
                                  >
                                    {task.completed === 1 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  </button>
                                  
                                  <div className="flex flex-col gap-1.5 min-w-0">
                                    <span className={`text-sm font-bold truncate transition-colors duration-300 ${task.completed ? 'text-neutral-400 dark:text-neutral-500 line-through font-medium' : 'text-neutral-850 dark:text-neutral-150'}`}>
                                      {task.title}
                                    </span>
                                    
                                    <div className="flex items-center flex-wrap gap-2.5">
                                      {task.duration && (
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-200/40 dark:bg-neutral-900/80 px-2 py-0.5 rounded-md">
                                          <Clock className="w-3 h-3 text-neutral-400" />
                                          {task.duration}
                                        </span>
                                      )}
                                      {task.tag && (
                                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-md">
                                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                          {task.tag}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer lg:opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          )}

                          {showAddForm.upcoming ? (
                            <div className="bg-neutral-50 dark:bg-[#141414] border border-dashed border-neutral-300 dark:border-neutral-800 p-4.5 rounded-xl flex flex-col gap-3.5 mt-1 animate-fade-in">
                              <input
                                type="text"
                                placeholder="What needs to be done?"
                                value={newTasksInputs.upcoming.title}
                                onChange={(e) => handleInputChange('upcoming', 'title', e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTask('upcoming')}
                                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-neutral-900 dark:text-white font-semibold"
                                autoFocus
                              />
                              
                              <div className="flex items-center gap-3.5 justify-between">
                                <div className="flex items-center gap-2.5">
                                  <select
                                    value={newTasksInputs.upcoming.duration}
                                    onChange={(e) => handleInputChange('upcoming', 'duration', e.target.value)}
                                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-bold focus:outline-none cursor-pointer"
                                  >
                                    <option value="30m Focus">30m Focus</option>
                                    <option value="1h Focus">1h Focus</option>
                                    <option value="2h Focus">2h Focus</option>
                                    <option value="3h Focus">3h Focus</option>
                                  </select>

                                  <select
                                    value={newTasksInputs.upcoming.tag}
                                    onChange={(e) => handleInputChange('upcoming', 'tag', e.target.value)}
                                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-bold focus:outline-none cursor-pointer"
                                  >
                                    <option value="Business">Business</option>
                                    <option value="Design">Design</option>
                                    <option value="Personal">Personal</option>
                                    <option value="Study">Study</option>
                                  </select>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setShowAddForm(prev => ({ ...prev, upcoming: false }))}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-900 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleAddTask('upcoming')}
                                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-850 dark:hover:bg-neutral-100 cursor-pointer"
                                  >
                                    Add Task
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowAddForm(prev => ({ ...prev, upcoming: true }))}
                              className="w-full py-3 bg-neutral-50 dark:bg-[#141414] border border-dashed border-neutral-200 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-800 text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.005] cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              Add new task
                            </button>
                          )}

                        </div>
                      )}
                    </div>

                    {/* SOMEDAY BUCKET */}
                    <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-200/60 dark:border-neutral-900 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                      <button 
                        onClick={() => toggleBucket('someday')}
                        className="w-full px-6 py-4.5 flex justify-between items-center hover:bg-neutral-100/50 dark:hover:bg-[#121212]/30 transition-colors duration-200 text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-neutral-400 dark:bg-neutral-600 shadow-sm" />
                          <span className="text-base font-bold text-neutral-800 dark:text-white font-heading">
                            Someday
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                            {somedayTasks.length}
                          </span>
                        </div>
                        {expandedBuckets.someday ? (
                          <ChevronUp className="w-4.5 h-4.5 text-neutral-400 dark:text-neutral-500" />
                        ) : (
                          <ChevronDown className="w-4.5 h-4.5 text-neutral-400 dark:text-neutral-500" />
                        )}
                      </button>

                      {expandedBuckets.someday && (
                        <div className="px-6 pb-6 pt-1 flex flex-col gap-3.5 border-t border-neutral-100 dark:border-neutral-900/60">
                          
                          {somedayTasks.length === 0 ? (
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center py-4">No someday tasks. Dream big and write ideas down here.</p>
                          ) : (
                            somedayTasks.map((task) => (
                              <div 
                                key={task.id} 
                                className="group relative bg-neutral-50 dark:bg-[#141414] border border-neutral-200/50 dark:border-neutral-900/80 hover:border-neutral-300 dark:hover:border-neutral-800/80 p-4 rounded-xl flex items-center justify-between transition-all duration-300 shadow-xs"
                              >
                                <div className="flex items-center gap-4 flex-1 min-w-0 pr-8">
                                  <button
                                    onClick={() => toggleTaskCompletion(task.id, task.completed)}
                                    className={`
                                      w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 cursor-pointer flex-shrink-0
                                      ${task.completed 
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/30' 
                                        : 'border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-transparent'
                                      }
                                    `}
                                  >
                                    {task.completed === 1 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  </button>
                                  
                                  <div className="flex flex-col gap-1.5 min-w-0">
                                    <span className={`text-sm font-bold truncate transition-colors duration-300 ${task.completed ? 'text-neutral-400 dark:text-neutral-500 line-through font-medium' : 'text-neutral-850 dark:text-neutral-150'}`}>
                                      {task.title}
                                    </span>
                                    
                                    <div className="flex items-center flex-wrap gap-2.5">
                                      {task.duration && (
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-200/40 dark:bg-neutral-900/80 px-2 py-0.5 rounded-md">
                                          <Clock className="w-3 h-3 text-neutral-400" />
                                          {task.duration}
                                        </span>
                                      )}
                                      {task.tag && (
                                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-md">
                                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                          {task.tag}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer lg:opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          )}

                          {showAddForm.someday ? (
                            <div className="bg-neutral-50 dark:bg-[#141414] border border-dashed border-neutral-300 dark:border-neutral-800 p-4.5 rounded-xl flex flex-col gap-3.5 mt-1 animate-fade-in">
                              <input
                                type="text"
                                placeholder="What needs to be done?"
                                value={newTasksInputs.someday.title}
                                onChange={(e) => handleInputChange('someday', 'title', e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTask('someday')}
                                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-neutral-900 dark:text-white font-semibold"
                                autoFocus
                              />
                              
                              <div className="flex items-center gap-3.5 justify-between">
                                <div className="flex items-center gap-2.5">
                                  <select
                                    value={newTasksInputs.someday.duration}
                                    onChange={(e) => handleInputChange('someday', 'duration', e.target.value)}
                                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-bold focus:outline-none cursor-pointer"
                                  >
                                    <option value="1h Focus">1h Focus</option>
                                    <option value="2h Focus">2h Focus</option>
                                    <option value="4h Focus">4h Focus</option>
                                    <option value="12h Focus">12h Focus</option>
                                  </select>

                                  <select
                                    value={newTasksInputs.someday.tag}
                                    onChange={(e) => handleInputChange('someday', 'tag', e.target.value)}
                                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-bold focus:outline-none cursor-pointer"
                                  >
                                    <option value="Personal">Personal</option>
                                    <option value="Design">Design</option>
                                    <option value="Business">Business</option>
                                    <option value="Study">Study</option>
                                  </select>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setShowAddForm(prev => ({ ...prev, someday: false }))}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-900 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleAddTask('someday')}
                                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-850 dark:hover:bg-neutral-100 cursor-pointer"
                                  >
                                    Add Task
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowAddForm(prev => ({ ...prev, someday: true }))}
                              className="w-full py-3 bg-neutral-50 dark:bg-[#141414] border border-dashed border-neutral-200 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-800 text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.005] cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              Add new task
                            </button>
                          )}

                        </div>
                      )}
                    </div>

                  </div>

                  {/* STATS AND INSIGHTS GRID ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5.5 items-stretch">
                    
                    {/* Deep Work Streak Card */}
                    <div className="md:col-span-8 relative rounded-2xl bg-neutral-900 text-white overflow-hidden p-6 md:p-7 flex flex-col justify-between gap-5 border border-neutral-800 dark:border-neutral-900 shadow-md">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/30 via-slate-900 to-indigo-900/40 pointer-events-none" />
                      <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-30 pointer-events-none select-none z-0">
                        <svg className="w-full h-full object-cover" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0,50 Q25,20 50,50 T100,50" stroke="url(#paint0_linear)" strokeWidth="0.5" fill="none"/>
                          <path d="M0,60 Q25,30 50,60 T100,60" stroke="url(#paint0_linear)" strokeWidth="0.5" fill="none"/>
                          <path d="M0,40 Q25,10 50,40 T100,40" stroke="url(#paint0_linear)" strokeWidth="0.5" fill="none"/>
                          <defs>
                            <linearGradient id="paint0_linear" x1="0" y1="50" x2="100" y2="50" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#6366f1" stopOpacity="0"/>
                              <stop offset="0.5" stopColor="#818cf8"/>
                              <stop offset="1" stopColor="#c084fc" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="relative z-10 flex flex-col gap-4">
                        <div>
                          <span className="text-[9px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-md tracking-wider">
                            Focus Insight
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="text-xl md:text-2xl font-extrabold font-heading text-white tracking-tight">
                            Deep Work Streak
                          </h3>
                          <p className="text-sm text-neutral-300 leading-relaxed max-w-md">
                            You've completed {completionPercentage > 0 ? `${completionPercentage}%` : '85%'} of your "High Energy" tasks before noon this week. Keep the momentum.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Daily Goal Stats Card */}
                    <div className="md:col-span-4 bg-white dark:bg-[#0d0d0d] border border-neutral-200/60 dark:border-neutral-900 p-6 md:p-7 rounded-2xl flex flex-col justify-between gap-6 shadow-sm">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                          Daily Goal
                        </span>
                        <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-700 ease-out"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 mt-auto">
                        <span className="text-3xl font-extrabold text-neutral-850 dark:text-white font-heading tracking-tight">
                          {completedTasksCount} <span className="text-neutral-400 dark:text-neutral-500 font-bold text-lg">/ {totalTasksCount}</span>
                        </span>
                        <span className="text-[10px] font-extrabold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase">
                          Tasks Completed
                        </span>
                      </div>
                    </div>

                  </div>
                </>
              )}

              {/* --- TAB B: YOUR NOTES & TAB C: FAVORITES --- */}
              {(activeTab === 'Your Notes' || activeTab === 'Favorite Notes') && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  
                  {/* Notes Header with Search and New Note trigger */}
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-heading">
                        {activeTab === 'Favorite Notes' ? 'Favorite Notes' : 'Your Notes'}
                      </h1>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {activeTab === 'Favorite Notes' 
                          ? 'All notes you have starred for quick access.' 
                          : 'Capture your thoughts, ideas, checklists, and guides.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3.5">
                      {/* Search Bar */}
                      <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search notes..."
                          value={noteSearchQuery}
                          onChange={(e) => setNoteSearchQuery(e.target.value)}
                          className="w-full bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-900 rounded-xl pl-9.5 pr-4 py-2.5 text-xs font-semibold placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/50 text-neutral-900 dark:text-white transition-all duration-200"
                        />
                      </div>

                      {/* New Note Button */}
                      {activeTab === 'Your Notes' && (
                        <button
                          onClick={handleOpenNewNote}
                          className="px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          New Note
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notes Grid */}
                  {filteredNotes.length === 0 ? (
                    <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-200/50 dark:border-neutral-900/60 p-12 rounded-2xl text-center flex flex-col items-center justify-center gap-3 shadow-xs">
                      <FileText className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
                      <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">No notes found</p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500">
                        {noteSearchQuery ? 'Try adjusting your search terms.' : 'Create your first note using the button above.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {filteredNotes.map((note) => (
                        <div
                          key={note.id}
                          onClick={() => handleOpenEditNote(note)}
                          className="group relative bg-white dark:bg-[#0d0d0d] border border-neutral-200/50 dark:border-neutral-900 hover:border-neutral-300/80 dark:hover:border-neutral-800 rounded-2xl p-5 flex flex-col justify-between gap-5.5 cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.005] active:scale-[0.995]"
                        >
                          {/* Accent Color Left Border */}
                          <div 
                            className="absolute top-0 left-0 bottom-0 w-1.5"
                            style={{ backgroundColor: note.color || '#6366f1' }}
                          />

                          <div className="flex flex-col gap-2 min-w-0">
                            <h3 className="text-sm font-extrabold text-neutral-850 dark:text-white truncate">
                              {note.title}
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-4 leading-relaxed font-medium">
                              {note.content || <span className="italic text-neutral-400 dark:text-neutral-600">No content.</span>}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-900/40">
                            <span className="text-[10px] font-bold text-neutral-450 dark:text-neutral-500 tracking-wide uppercase">
                              {note.updated_at ? new Date(note.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Draft'}
                            </span>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => toggleNoteFavorite(e, note)}
                                className="p-1 rounded-lg text-neutral-450 dark:text-neutral-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                                aria-label="Favorite Note"
                              >
                                <Star 
                                  className={`w-4 h-4 transition-all duration-300 ${note.is_favorite === 1 ? 'fill-amber-500 text-amber-500' : ''}`} 
                                />
                              </button>

                              <button
                                onClick={(e) => deleteNote(e, note.id)}
                                className="p-1 rounded-lg text-neutral-405 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer lg:opacity-0 group-hover:opacity-100"
                                aria-label="Delete Note"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </>
          )}

        </main>
      </div>

      {/* 3. FLOATING NOTE EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-[#0e0e0e] border border-neutral-200 dark:border-neutral-900 rounded-2xl w-full max-w-xl p-6 shadow-2xl flex flex-col gap-4.5 max-h-full overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100 dark:border-neutral-900">
              <span className="text-xs font-extrabold uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">
                {editingNote ? 'Edit Note' : 'Create New Note'}
              </span>

              <div className="flex items-center gap-1.5">
                {/* Favorite Toggle within Editor */}
                <button
                  onClick={() => setEditorFavorite(prev => !prev)}
                  className="p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-amber-500 dark:hover:text-amber-400 transition-all active:scale-90 cursor-pointer"
                  title="Favorite status"
                >
                  <Star 
                    className={`w-4 h-4 ${editorFavorite ? 'fill-amber-500 text-amber-500' : ''}`} 
                  />
                </button>

                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:bg-neutral-900 text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-all active:scale-90 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Note Fields */}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Note Title"
                value={editorTitle}
                onChange={(e) => setEditorTitle(e.target.value)}
                className="bg-transparent text-lg md:text-xl font-extrabold focus:outline-none text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-700"
              />

              <textarea
                placeholder="Start writing your thoughts..."
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                rows={10}
                className="bg-transparent text-sm leading-relaxed focus:outline-none text-neutral-750 dark:text-neutral-300 placeholder:text-neutral-400 dark:placeholder:text-neutral-650 resize-none min-h-[180px]"
              />
            </div>

            {/* Color Palette Picker */}
            <div className="flex flex-col gap-2.5 pt-3.5 border-t border-neutral-100 dark:border-neutral-900">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Color Tag
              </label>
              <div className="flex items-center gap-3">
                {noteColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setEditorColor(color.value)}
                    className="w-6.5 h-6.5 rounded-full border-2 transition-all active:scale-90 flex items-center justify-center cursor-pointer shadow-sm"
                    style={{ 
                      backgroundColor: color.value,
                      borderColor: editorColor === color.value 
                        ? (darkMode ? '#ffffff' : '#000000') 
                        : 'transparent'
                    }}
                    title={color.name}
                  >
                    {editorColor === color.value && (
                      <Check className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor Footer Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSaveNote}
                className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl text-xs font-bold cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md"
              >
                {editingNote ? 'Save Changes' : 'Create Note'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
