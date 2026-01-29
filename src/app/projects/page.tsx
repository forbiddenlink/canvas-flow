'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';
import { NewProjectDialog } from '@/components/projects/new-project-dialog';
import { Search, Calendar, ArrowUpDown, Loader2, Copy, Edit2, Trash2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  width: number;
  height: number;
  updatedAt: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [projectToRename, setProjectToRename] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter and sort projects when search/sort changes
  useEffect(() => {
    let filtered = [...projects];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort projects
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        // Sort by name
        return sortOrder === 'desc'
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchQuery, sortBy, sortOrder]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    // Navigate to editor with project ID
    router.push(`/editor?projectId=${projectId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleDuplicate = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent project click
    try {
      const response = await fetch(`/api/projects/${projectId}/duplicate`, {
        method: 'POST',
      });

      if (response.ok) {
        // Refresh projects list
        await fetchProjects();
      } else {
        console.error('Failed to duplicate project');
      }
    } catch (error) {
      console.error('Error duplicating project:', error);
    }
  };

  const handleRenameClick = (projectId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToRename(projectId);
    setNewProjectName(currentName);
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = async () => {
    if (!projectToRename || !newProjectName.trim()) return;

    try {
      const response = await fetch(`/api/projects/${projectToRename}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName.trim() }),
      });

      if (response.ok) {
        await fetchProjects();
        setRenameDialogOpen(false);
        setProjectToRename(null);
        setNewProjectName('');
      } else {
        console.error('Failed to rename project');
      }
    } catch (error) {
      console.error('Error renaming project:', error);
    }
  };

  const handleDeleteClick = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    try {
      const response = await fetch(`/api/projects/${projectToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProjects();
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-primary">PixelForge</h1>
            <nav className="flex gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => setNewProjectDialogOpen(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                New Project
              </button>
              <span className="text-sm font-medium text-foreground">Projects</span>
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Page Title & Controls */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">My Projects</h2>
          <p className="text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('date')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'date'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background border border-border text-foreground hover:bg-muted'
              }`}
            >
              <Calendar className="inline h-4 w-4 mr-2" />
              Date
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'name'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background border border-border text-foreground hover:bg-muted'
              }`}
            >
              Name
            </button>
            <button
              onClick={toggleSortOrder}
              className="px-3 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform`} />
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? `No projects found matching "${searchQuery}"`
                : 'No projects yet. Create your first project!'}
            </p>
            <button
              onClick={() => router.push('/editor')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-all hover:shadow-lg relative"
              >
                {/* Thumbnail - clickable */}
                <button
                  onClick={() => handleProjectClick(project.id)}
                  className="w-full aspect-video bg-muted flex items-center justify-center overflow-hidden relative"
                >
                  {project.thumbnailUrl ? (
                    <Image
                      src={project.thumbnailUrl}
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-muted-foreground text-sm">No preview</div>
                  )}
                </button>

                {/* Project Info */}
                <div className="p-4">
                  <button
                    onClick={() => handleProjectClick(project.id)}
                    className="w-full text-left"
                  >
                    <h3 className="font-semibold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{project.width} × {project.height}</span>
                      <span>{formatDate(project.updatedAt)}</span>
                    </div>
                  </button>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
                    <button
                      onClick={(e) => handleDuplicate(project.id, e)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Duplicate</span>
                    </button>
                    <button
                      onClick={(e) => handleRenameClick(project.id, project.name, e)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Rename</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(project.id, e)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Rename Dialog */}
      {renameDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Rename Project</h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameConfirm();
                if (e.key === 'Escape') {
                  setRenameDialogOpen(false);
                  setProjectToRename(null);
                  setNewProjectName('');
                }
              }}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              placeholder="Enter new project name"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setRenameDialogOpen(false);
                  setProjectToRename(null);
                  setNewProjectName('');
                }}
                className="px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameConfirm}
                disabled={!newProjectName.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Dialog */}
      <NewProjectDialog
        open={newProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete Project</h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
