import { broadcastMessages } from "@/data/fixtures/broadcasts"

/** Data access — admin broadcast messages (announcements & notifications) */
export const broadcastsRepository = {
  listMessages() {
    return broadcastMessages
  },
}
