//Reprezentuje konfigurację środowiska. W tym przypadku zawiera obiekt bazy danych oraz sekret administratora.
export interface Env {
  DB: D1Database;
  ADMIN_SECRET: string;
}