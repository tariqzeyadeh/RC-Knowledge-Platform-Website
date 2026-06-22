import { platformUsers } from "@/data/fixtures/users"

/** Data access — platform user directory (admin) */
export const usersRepository = {
  listUsers() {
    return platformUsers
  },
}
