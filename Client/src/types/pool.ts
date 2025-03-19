// Define the pool type
export interface Pool {
  id: string
  startPoint: string
  endPoint: string
  departureTime: string
  arrivalTime: string
  transportMode: string
  totalPersons: number
  currentPersons: number
  totalFare: number
  createdBy: string
  description: string
  femaleOnly: boolean
}

export interface FilterState {
  searchQuery: string
  femaleOnlyFilter: boolean | null
  startPointFilter: string | null
  endPointFilter: string | null
  transportModeFilter: string | null
  fareRange: [number, number]
}

export interface CreatePoolFormData {
  startPoint: string
  endPoint: string
  departureTime: string
  arrivalTime: string
  transportMode: string
  totalPersons: number
  currentPersons: number
  totalFare: number
  description: string
  femaleOnly: boolean
}

