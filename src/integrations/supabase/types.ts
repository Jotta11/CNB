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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      freight_rates: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          regiao: string
          tipo_implemento: string
          updated_at: string
          valor_km: number
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          regiao: string
          tipo_implemento: string
          updated_at?: string
          valor_km?: number
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          regiao?: string
          tipo_implemento?: string
          updated_at?: string
          valor_km?: number
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          fazenda: string | null
          id: string
          localizacao: string | null
          mensagem: string | null
          nome: string
          numero_cabecas: number | null
          status: string
          telefone: string
          tipo: string
          tipo_cultura: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          fazenda?: string | null
          id?: string
          localizacao?: string | null
          mensagem?: string | null
          nome: string
          numero_cabecas?: number | null
          status?: string
          telefone: string
          tipo: string
          tipo_cultura?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          fazenda?: string | null
          id?: string
          localizacao?: string | null
          mensagem?: string | null
          nome?: string
          numero_cabecas?: number | null
          status?: string
          telefone?: string
          tipo?: string
          tipo_cultura?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lotes: {
        Row: {
          ativo: boolean
          capacidade_carga: number | null
          caracteristicas: string[] | null
          created_at: string
          descricao: string | null
          estado: string
          id: string
          idade: string
          imagem_url: string | null
          localizacao: string | null
          numero: string
          ordem: number
          peso: string
          preco: number
          qtd_carretas: number | null
          quantidade: number
          raca: string
          sexo: string
          tipo_implemento: string | null
          tipo_preco: string
          titulo: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          ativo?: boolean
          capacidade_carga?: number | null
          caracteristicas?: string[] | null
          created_at?: string
          descricao?: string | null
          estado?: string
          id?: string
          idade: string
          imagem_url?: string | null
          localizacao?: string | null
          numero: string
          ordem?: number
          peso: string
          preco: number
          qtd_carretas?: number | null
          quantidade?: number
          raca: string
          sexo?: string
          tipo_implemento?: string | null
          tipo_preco?: string
          titulo: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          ativo?: boolean
          capacidade_carga?: number | null
          caracteristicas?: string[] | null
          created_at?: string
          descricao?: string | null
          estado?: string
          id?: string
          idade?: string
          imagem_url?: string | null
          localizacao?: string | null
          numero?: string
          ordem?: number
          peso?: string
          preco?: number
          qtd_carretas?: number | null
          quantidade?: number
          raca?: string
          sexo?: string
          tipo_implemento?: string | null
          tipo_preco?: string
          titulo?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      noticias: {
        Row: {
          ativo: boolean
          autor: string | null
          conteudo: string
          created_at: string
          data_publicacao: string
          id: string
          imagem_url: string | null
          resumo: string | null
          slug: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          autor?: string | null
          conteudo: string
          created_at?: string
          data_publicacao?: string
          id?: string
          imagem_url?: string | null
          resumo?: string | null
          slug: string
          titulo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          autor?: string | null
          conteudo?: string
          created_at?: string
          data_publicacao?: string
          id?: string
          imagem_url?: string | null
          resumo?: string | null
          slug?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          link: string
          logo_url: string
          nome: string
          ordem: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          link: string
          logo_url: string
          nome: string
          ordem?: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          link?: string
          logo_url?: string
          nome?: string
          ordem?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          regiao: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          regiao?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          regiao?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
