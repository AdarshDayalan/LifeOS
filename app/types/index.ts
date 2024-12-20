export interface TranscriptItem {
  text: string;
  timestamp: string;
  tasks?: TaskItem[];
}

export interface TaskItem {
  title: string;
  description: string;
  completed?: boolean;
  createdAt: string;
} 