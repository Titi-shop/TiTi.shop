import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

/**
 * SERVER ONLY
 *
 * Không khởi tạo Supabase Admin khi module vừa được import.
 * Chỉ tạo client khi code thực sự sử dụng nó ở runtime.
 */

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) {
    return adminClient;
  }

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is missing"
    );
  }

  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing"
    );
  }

  adminClient = createClient(
    url,
    key,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  return adminClient;
}

/**
 * Compatibility wrapper.
 *
 * Cho phép code cũ tiếp tục dùng:
 *
 * supabaseAdmin.storage...
 *
 * nhưng client thật chỉ được tạo khi property được truy cập.
 */
export const supabaseAdmin =
  new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      const client =
        getSupabaseAdmin();

      const value =
        Reflect.get(client, prop, client);

      if (typeof value === "function") {
        return value.bind(client);
      }

      return value;
    },
  });