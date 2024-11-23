export interface Root {
  data: Data[]
}

export interface Data {
  id: number
  index: number
  item_number: number
  volume: string
  number: string
  number_secondary: string
  name: string
  branches_count: number
  branches: Branch[]
}

export interface Branch {
  id: number
  branch_id: number
  created_at: string
  teams: Team[]
  expired_type: number
  user: User
}

export interface Team {
  id: number
  slug: string
  slug_url: string
  model: string
  name: string
  cover: Cover
}

export interface Cover {
  filename: string
  thumbnail: string
  default: string
  md: string
}

export interface User {
  username: string
  id: number
}
