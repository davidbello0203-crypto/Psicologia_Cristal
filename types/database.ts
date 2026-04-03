export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          client_id: string
          client_message: string | null
          created_at: string | null
          end_time: string
          id: string
          is_first_session: boolean | null
          modality: string | null
          payment_status: string | null
          psychologist_notes: string | null
          reason: string | null
          session_price: number | null
          start_time: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          client_id: string
          client_message?: string | null
          created_at?: string | null
          end_time: string
          id?: string
          is_first_session?: boolean | null
          modality?: string | null
          payment_status?: string | null
          psychologist_notes?: string | null
          reason?: string | null
          session_price?: number | null
          start_time: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          client_id?: string
          client_message?: string | null
          created_at?: string | null
          end_time?: string
          id?: string
          is_first_session?: boolean | null
          modality?: string | null
          payment_status?: string | null
          psychologist_notes?: string | null
          reason?: string | null
          session_price?: number | null
          start_time?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_slots: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          start_time?: string
        }
        Relationships: []
      }
      clinical_notes: {
        Row: {
          appointment_id: string | null
          client_id: string
          content: string
          created_at: string | null
          id: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          client_id: string
          content: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          client_id?: string
          content?: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string | null
          emergency_contact: string | null
          full_name: string
          id: string
          notes_client: string | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          full_name: string
          id: string
          notes_client?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          full_name?: string
          id?: string
          notes_client?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      session_packages: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          notes: string | null
          package_type: string
          price_paid: number | null
          sessions_total: number
          sessions_used: number
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          package_type: string
          price_paid?: number | null
          sessions_total: number
          sessions_used?: number
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          package_type?: string
          price_paid?: number | null
          sessions_total?: number
          sessions_used?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ── Convenience aliases ───────────────────────────────────────
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type AvailabilitySlot = Database['public']['Tables']['availability_slots']['Row']
export type ClinicalNote = Database['public']['Tables']['clinical_notes']['Row']
export type SessionPackage = Database['public']['Tables']['session_packages']['Row']
