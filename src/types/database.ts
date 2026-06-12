// AUTO-GENERATED — regenerar con: mcp__supabase-mape__generate_typescript_types
// Refleja el esquema de public en Supabase project qxhnjvefnmolnekqzhmw.

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
      archetypes: {
        Row: {
          color_hex: string | null
          created_at: string
          id: string
          long_description: string | null
          name: string
          short_description: string | null
          slug: string
          updated_at: string
          voice: Database["public"]["Enums"]["voice"]
        }
        Insert: {
          color_hex?: string | null
          created_at?: string
          id?: string
          long_description?: string | null
          name: string
          short_description?: string | null
          slug: string
          updated_at?: string
          voice?: Database["public"]["Enums"]["voice"]
        }
        Update: {
          color_hex?: string | null
          created_at?: string
          id?: string
          long_description?: string | null
          name?: string
          short_description?: string | null
          slug?: string
          updated_at?: string
          voice?: Database["public"]["Enums"]["voice"]
        }
        Relationships: []
      }
      diagnostic_questions: {
        Row: {
          created_at: string
          diagnostic_id: string
          id: string
          kind: string
          options: Json
          position: number
          prompt: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          diagnostic_id: string
          id?: string
          kind?: string
          options: Json
          position: number
          prompt: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          diagnostic_id?: string
          id?: string
          kind?: string
          options?: Json
          position?: number
          prompt?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_questions_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_responses: {
        Row: {
          answers: Json
          archetype_scores: Json | null
          diagnostic_id: string
          id: string
          resulting_archetype_id: string | null
          taken_at: string
          user_id: string
        }
        Insert: {
          answers: Json
          archetype_scores?: Json | null
          diagnostic_id: string
          id?: string
          resulting_archetype_id?: string | null
          taken_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          archetype_scores?: Json | null
          diagnostic_id?: string
          id?: string
          resulting_archetype_id?: string | null
          taken_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_responses_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_responses_resulting_archetype_id_fkey"
            columns: ["resulting_archetype_id"]
            isOneToOne: false
            referencedRelation: "archetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostics: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_initial: boolean
          slug: string
          title: string
          updated_at: string
          world_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_initial?: boolean
          slug: string
          title: string
          updated_at?: string
          world_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_initial?: boolean
          slug?: string
          title?: string
          updated_at?: string
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostics_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      future_letters: {
        Row: {
          body: string
          created_at: string
          deliver_at: string
          delivered_at: string | null
          id: string
          notify_email: boolean
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          deliver_at: string
          delivered_at?: string | null
          id?: string
          notify_email?: boolean
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          deliver_at?: string
          delivered_at?: string | null
          id?: string
          notify_email?: boolean
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          last_seen_at: string | null
          lesson_id: string
          required_micro_done: boolean
          started_at: string | null
          status: Database["public"]["Enums"]["lesson_status"]
          updated_at: string
          user_id: string
          video_progress_pct: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          last_seen_at?: string | null
          lesson_id: string
          required_micro_done?: boolean
          started_at?: string | null
          status?: Database["public"]["Enums"]["lesson_status"]
          updated_at?: string
          user_id: string
          video_progress_pct?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          last_seen_at?: string | null
          lesson_id?: string
          required_micro_done?: boolean
          started_at?: string | null
          status?: Database["public"]["Enums"]["lesson_status"]
          updated_at?: string
          user_id?: string
          video_progress_pct?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          audio_url: string | null
          body_md: string | null
          content_kinds: Database["public"]["Enums"]["content_kind"][]
          created_at: string
          duration_seconds: number | null
          id: string
          is_published: boolean
          pdf_url: string | null
          position: number
          slug: string
          subtitle: string | null
          title: string
          transcript: string | null
          updated_at: string
          vimeo_hash: string | null
          vimeo_id: string | null
          voice: Database["public"]["Enums"]["voice"]
          world_id: string
        }
        Insert: {
          audio_url?: string | null
          body_md?: string | null
          content_kinds?: Database["public"]["Enums"]["content_kind"][]
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_published?: boolean
          pdf_url?: string | null
          position: number
          slug: string
          subtitle?: string | null
          title: string
          transcript?: string | null
          updated_at?: string
          vimeo_hash?: string | null
          vimeo_id?: string | null
          voice?: Database["public"]["Enums"]["voice"]
          world_id: string
        }
        Update: {
          audio_url?: string | null
          body_md?: string | null
          content_kinds?: Database["public"]["Enums"]["content_kind"][]
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_published?: boolean
          pdf_url?: string | null
          position?: number
          slug?: string
          subtitle?: string | null
          title?: string
          transcript?: string | null
          updated_at?: string
          vimeo_hash?: string | null
          vimeo_id?: string | null
          voice?: Database["public"]["Enums"]["voice"]
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["memory_kind"]
          source_id: string | null
          source_table: string | null
          title: string | null
          user_id: string
          voice: Database["public"]["Enums"]["voice"] | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["memory_kind"]
          source_id?: string | null
          source_table?: string | null
          title?: string | null
          user_id: string
          voice?: Database["public"]["Enums"]["voice"] | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["memory_kind"]
          source_id?: string | null
          source_table?: string | null
          title?: string | null
          user_id?: string
          voice?: Database["public"]["Enums"]["voice"] | null
        }
        Relationships: []
      }
      micro_experience_responses: {
        Row: {
          created_at: string
          id: string
          is_favorite: boolean
          lesson_id: string
          micro_experience_id: string
          response_payload: Json | null
          response_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_favorite?: boolean
          lesson_id: string
          micro_experience_id: string
          response_payload?: Json | null
          response_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_favorite?: boolean
          lesson_id?: string
          micro_experience_id?: string
          response_payload?: Json | null
          response_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "micro_experience_responses_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "micro_experience_responses_micro_experience_id_fkey"
            columns: ["micro_experience_id"]
            isOneToOne: false
            referencedRelation: "micro_experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      micro_experiences: {
        Row: {
          created_at: string
          id: string
          is_required: boolean
          kind: Database["public"]["Enums"]["micro_kind"]
          lesson_id: string
          position: number
          prompt: string | null
          quiz_payload: Json | null
          ritual_audio_url: string | null
          ritual_vimeo_hash: string | null
          ritual_vimeo_id: string | null
          title: string
          updated_at: string
          voice: Database["public"]["Enums"]["voice"]
        }
        Insert: {
          created_at?: string
          id?: string
          is_required?: boolean
          kind: Database["public"]["Enums"]["micro_kind"]
          lesson_id: string
          position: number
          prompt?: string | null
          quiz_payload?: Json | null
          ritual_audio_url?: string | null
          ritual_vimeo_hash?: string | null
          ritual_vimeo_id?: string | null
          title: string
          updated_at?: string
          voice?: Database["public"]["Enums"]["voice"]
        }
        Update: {
          created_at?: string
          id?: string
          is_required?: boolean
          kind?: Database["public"]["Enums"]["micro_kind"]
          lesson_id?: string
          position?: number
          prompt?: string | null
          quiz_payload?: Json | null
          ritual_audio_url?: string | null
          ritual_vimeo_hash?: string | null
          ritual_vimeo_id?: string | null
          title?: string
          updated_at?: string
          voice?: Database["public"]["Enums"]["voice"]
        }
        Relationships: [
          {
            foreignKeyName: "micro_experiences_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_checkins: {
        Row: {
          created_at: string
          id: string
          local_date: string
          mood: Database["public"]["Enums"]["mood_value"]
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          local_date: string
          mood: Database["public"]["Enums"]["mood_value"]
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          local_date?: string
          mood?: Database["public"]["Enums"]["mood_value"]
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string
          current_archetype_id: string | null
          display_name: string
          evolutionary_state: string | null
          intro_seen: boolean
          locale: string
          onboarding_completed_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          current_archetype_id?: string | null
          display_name: string
          evolutionary_state?: string | null
          intro_seen?: boolean
          locale?: string
          onboarding_completed_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          current_archetype_id?: string | null
          display_name?: string
          evolutionary_state?: string | null
          intro_seen?: boolean
          locale?: string
          onboarding_completed_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_archetype_id_fkey"
            columns: ["current_archetype_id"]
            isOneToOne: false
            referencedRelation: "archetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          audio_url: string | null
          body_md: string | null
          category: string | null
          created_at: string
          id: string
          image_url: string | null
          kind: Database["public"]["Enums"]["reward_kind"]
          slug: string
          subtitle: string | null
          title: string
          unlock_rule: Json | null
          updated_at: string
          vimeo_hash: string | null
          vimeo_id: string | null
          voice: Database["public"]["Enums"]["voice"]
        }
        Insert: {
          audio_url?: string | null
          body_md?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          kind: Database["public"]["Enums"]["reward_kind"]
          slug: string
          subtitle?: string | null
          title: string
          unlock_rule?: Json | null
          updated_at?: string
          vimeo_hash?: string | null
          vimeo_id?: string | null
          voice?: Database["public"]["Enums"]["voice"]
        }
        Update: {
          audio_url?: string | null
          body_md?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          kind?: Database["public"]["Enums"]["reward_kind"]
          slug?: string
          subtitle?: string | null
          title?: string
          unlock_rule?: Json | null
          updated_at?: string
          vimeo_hash?: string | null
          vimeo_id?: string | null
          voice?: Database["public"]["Enums"]["voice"]
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          id: string
          reward_id: string
          trigger: Database["public"]["Enums"]["badge_trigger"]
          unlocked_at: string
          user_id: string
        }
        Insert: {
          id?: string
          reward_id: string
          trigger: Database["public"]["Enums"]["badge_trigger"]
          unlocked_at?: string
          user_id: string
        }
        Update: {
          id?: string
          reward_id?: string
          trigger?: Database["public"]["Enums"]["badge_trigger"]
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rewards: {
        Row: {
          id: string
          is_pinned: boolean
          reward_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          id?: string
          is_pinned?: boolean
          reward_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          id?: string
          is_pinned?: boolean
          reward_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_streaks: {
        Row: {
          current_streak: number
          last_active_local_date: string | null
          longest_streak: number
          threshold_reached: Database["public"]["Enums"]["badge_trigger"][]
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          last_active_local_date?: string | null
          longest_streak?: number
          threshold_reached?: Database["public"]["Enums"]["badge_trigger"][]
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          last_active_local_date?: string | null
          longest_streak?: number
          threshold_reached?: Database["public"]["Enums"]["badge_trigger"][]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      worlds: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          intro_vimeo_hash: string | null
          intro_vimeo_id: string | null
          is_locked_until_membership: boolean
          is_published: boolean
          position: number
          slug: string
          subtitle: string | null
          title: string
          updated_at: string
          voice: Database["public"]["Enums"]["voice"]
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          intro_vimeo_hash?: string | null
          intro_vimeo_id?: string | null
          is_locked_until_membership?: boolean
          is_published?: boolean
          position: number
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string
          voice?: Database["public"]["Enums"]["voice"]
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          intro_vimeo_hash?: string | null
          intro_vimeo_id?: string | null
          is_locked_until_membership?: boolean
          is_published?: boolean
          position?: number
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          voice?: Database["public"]["Enums"]["voice"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      track_activity: {
        Args: { p_local_date: string }
        Returns: {
          current_streak: number
          last_active_local_date: string | null
          longest_streak: number
          threshold_reached: Database["public"]["Enums"]["badge_trigger"][]
          updated_at: string
          user_id: string
        }
      }
    }
    Enums: {
      badge_trigger:
        | "streak_3"
        | "streak_7"
        | "streak_21"
        | "streak_30"
        | "world_complete"
        | "first_letter"
        | "manual"
      content_kind: "video" | "audio" | "text" | "pdf"
      lesson_status: "locked" | "available" | "in_progress" | "completed"
      memory_kind:
        | "reflection"
        | "favorite_quote"
        | "diagnostic_answer"
        | "mood_note"
        | "letter_past"
      micro_kind:
        | "reflection"
        | "ritual"
        | "journaling"
        | "quiz"
        | "letter_seed"
      mood_value: "luminosa" | "calma" | "neutral" | "turbia" | "agotada"
      reward_kind: "letter_antonia" | "letter_mape" | "ritual" | "badge"
      voice: "antonia" | "mape" | "ambas"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
