export interface VolumeChapters {
  id: number;
  index: number;
  item_number: number;
  volume: string;
  number: string;
  number_secondary: string;
  name: string;
  branches_count: number;
  branches: Branch[];
}

interface Branch {
  id: number;
  branch_id: number;
  created_at: string;
  teams: Team[];
  user: User;
}

interface Team {
  id: number;
  slug: string;
  slug_url: string;
  model: string;
  name: string;
  cover: Cover;
}

interface Cover {
  filename: string;
  thumbnail: string;
  default: string;
  md: string;
}

interface User {
  username: string;
  id: number;
}
