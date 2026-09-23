import { Schema } from "effect"
import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "effect/unstable/httpapi"

export const ServerInfo = Schema.Struct({
  version: Schema.String,
  // 0 means the runtime has no OS process identity (e.g. workerd).
  pid: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)),
  urls: Schema.Array(Schema.String),
  paths: Schema.Struct({
    tmp: Schema.String,
  }),
}).annotate({ identifier: "ServerInfo" })
export type ServerInfo = typeof ServerInfo.Type

export const PitchAIProcessOwner = Schema.Struct({
  instanceID: Schema.NullOr(Schema.String),
  generationID: Schema.NullOr(Schema.String),
  bundleSHA256: Schema.NullOr(Schema.String),
  tenantID: Schema.NullOr(Schema.String),
  userID: Schema.NullOr(Schema.String),
  repoRoot: Schema.NullOr(Schema.String),
  databasePath: Schema.NullOr(Schema.String),
  pid: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)),
}).annotate({ identifier: "PitchAIProcessOwner" })

export const ServerGroup = HttpApiGroup.make("server.server")
  .add(
    HttpApiEndpoint.get("server.info", "/api/info", {
      success: ServerInfo,
    }).annotateMerge(
      OpenApi.annotations({
        identifier: "server.info",
        summary: "Get server info",
        description: "Return the server identity, connection URLs, paths, and readiness status.",
      }),
    ),
  )
  .add(
    HttpApiEndpoint.get("server.pitchaiOwner", "/api/pitchai/owner", {
      success: PitchAIProcessOwner,
    }).annotateMerge(
      OpenApi.annotations({
        identifier: "server.pitchai.owner",
        summary: "Get the running PitchAI process identity",
      }),
    ),
  )
  .annotateMerge(OpenApi.annotations({ title: "server" }))
