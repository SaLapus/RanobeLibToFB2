export interface Root {
  data: Data[]
  links: Links
  meta: Meta
}

export interface Data {
  id: number
  name: string
  rus_name: string
  eng_name: string
  slug: string
  slug_url: string
  cover: Cover
  ageRestriction: AgeRestriction
  site: number
  type: Type
  releaseDate: string
  rating: Rating
  model: string
  status: Status
  releaseDateString: string
  is_authorship?: boolean
}

export interface Cover {
  filename: string
  thumbnail: string
  default: string
  md: string
}

export interface AgeRestriction {
  id: number
  label: string
}

export interface Type {
  id: number
  label: string
}

export interface Rating {
  average: string
  averageFormated: string
  votes: number
  votesFormated: string
  user: number
}

export interface Status {
  id: number
  label: string
}

export interface Links {
  first: string
  last: string | null
  prev: string | null
  next: string | null
}

export interface Meta {
  current_page: number
  from: number
  path: string
  per_page: number
  to: number
  page: number
  has_next_page: boolean
  seed: string
}