export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      days: {
        Row: {
          day_number: number
          is_unlocked: boolean
          title: string
          unlocked_at: string | null
        }
        Insert: {
          day_number: number
          is_unlocked?: boolean
          title: string
          unlocked_at?: string | null
        }
        Update: {
          day_number?: number
          is_unlocked?: boolean
          title?: string
          unlocked_at?: string | null
        }
        Relationships: []
      }
      player_puzzles: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          player_id: string
          puzzle_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          player_id: string
          puzzle_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          player_id?: string
          puzzle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_puzzles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_puzzles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "ranking"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_puzzles_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_puzzles_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      puzzles: {
        Row: {
          completion_code: string
          content_path: string
          day_number: number
          id: string
          location: string | null
          name: string
          order_in_day: number
          url: string | null
        }
        Insert: {
          completion_code: string
          content_path: string
          day_number: number
          id?: string
          location?: string | null
          name: string
          order_in_day: number
          url?: string | null
        }
        Update: {
          completion_code?: string
          content_path?: string
          day_number?: number
          id?: string
          location?: string | null
          name?: string
          order_in_day?: number
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "puzzles_day_number_fkey"
            columns: ["day_number"]
            isOneToOne: false
            referencedRelation: "days"
            referencedColumns: ["day_number"]
          },
        ]
      }
    }
    Views: {
      puzzles_public: {
        Row: {
          content_path: string | null
          day_number: number | null
          id: string | null
          location: string | null
          name: string | null
          order_in_day: number | null
          url: string | null
        }
        Insert: {
          content_path?: string | null
          day_number?: number | null
          id?: string | null
          location?: string | null
          name?: string | null
          order_in_day?: number | null
          url?: string | null
        }
        Update: {
          content_path?: string | null
          day_number?: number | null
          id?: string | null
          location?: string | null
          name?: string | null
          order_in_day?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "puzzles_day_number_fkey"
            columns: ["day_number"]
            isOneToOne: false
            referencedRelation: "days"
            referencedColumns: ["day_number"]
          },
        ]
      }
      ranking: {
        Row: {
          name: string | null
          player_id: string | null
          puzzles_concluidos: number | null
          ultimo_concluido_em: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_access_puzzle: {
        Args: { p_player_id: string; p_puzzle_id: string }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_visio_user: { Args: never; Returns: boolean }
      submit_completion_code: {
        Args: { p_code: string; p_puzzle_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

export type Day = Tables<'days'>
export type Puzzle = Tables<'puzzles_public'>
export type PlayerPuzzle = Tables<'player_puzzles'>
export type RankingRow = Tables<'ranking'>
