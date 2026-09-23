import { Effect } from "effect"
import { HttpApiBuilder } from "effect/unstable/httpapi"
import { Api } from "../api"
import { ServerInfo } from "../server-info"

export const ServerHandler = HttpApiBuilder.group(Api, "server.server", (handlers) =>
  handlers.handle("server.info", () =>
    Effect.gen(function* () {
      const info = yield* ServerInfo.Service
      return {
        version: info.app.version ?? "unknown",
        pid: process.pid ?? 0,
        urls: info.urls(),
        paths: info.paths,
      }
    }),
  ).handle("server.pitchaiOwner", () =>
    Effect.succeed({
      instanceID: process.env.PITCHAI_OPENCODE_INSTANCE_ID ?? null,
      generationID: process.env.PITCHAI_OPENCODE_GENERATION_ID ?? null,
      bundleSHA256: process.env.PITCHAI_OPENCODE_BUNDLE_SHA256 ?? null,
      tenantID: process.env.PITCHAI_OPENCODE_TENANT_ID ?? null,
      userID: process.env.PITCHAI_OPENCODE_USER_ID ?? null,
      repoRoot: process.env.PITCHAI_OPENCODE_REPO_ROOT ?? null,
      databasePath: process.env.OPENCODE_DB ?? null,
      pid: process.pid ?? 0,
    }),
  ),
)
