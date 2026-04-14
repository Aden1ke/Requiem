export type CauseOfDeath =
  | "killed_by_google"
  | "murdered_by_microsoft"
  | "died_of_neglect"
  | "acquired_and_buried"
  | "disrupted_to_death"
  | "deprecated"
  | "ran_out_of_funding"
  | "replaced_by_better"

export interface DeadTech {
  id: string
  name: string
  slug: string
  born: number
  died: number
  cause_of_death: CauseOfDeath
  eulogy: string
  epitaph: string
  category: "browser" | "social" | "api" | "startup" | "language" | "product" | "service" | "hardware"
  gravestone_style: "marble" | "obsidian" | "moss" | "cracked" | "gilded"
  tribute_count: number
  submitted_by: string | null
  created_at: string
}

export interface Tribute {
  id: string
  tech_id: string
  type: "flower" | "candle" | "commit_message" | "prayer"
  message: string | null
  created_at: string
}

export interface EulogyRequest {
  name: string
  born: number
  died: number
  cause_of_death: CauseOfDeath
  context?: string
}

export interface EulogyResponse {
  eulogy: string
  epitaph: string
  gravestone_style: DeadTech["gravestone_style"]
  final_words: string
}
