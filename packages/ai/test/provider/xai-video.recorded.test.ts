import { describe, expect } from "bun:test"
import { Effect } from "effect"
import { Video } from "../../src/index.js"
import { XAI } from "../../src/providers.js"
import { recordedTests } from "../recorded-test.js"
import { videoPoll } from "./video-recording.js"

const model = XAI.configure({
  apiKey: process.env.XAI_API_KEY ?? "fixture",
}).video("grok-imagine-video-1.5")

const recorded = recordedTests({
  prefix: "xai-video",
  provider: "xai",
  protocol: "xai-video",
  requires: ["XAI_API_KEY"],
})

describe("xAI Video recorded", () => {
  recorded.effect(
    "generates a video",
    () =>
      Effect.gen(function* () {
        const response = yield* Video.generate(
          {
            model,
            prompt: "A single red balloon drifting slowly upward against a clear blue sky.",
            aspectRatio: "16:9",
            resolution: "480p",
            durationSeconds: 2,
          },
          { poll: videoPoll },
        )

        expect(response.videos).toHaveLength(1)
        expect(response.video.source.type).toBe("url")
        expect((yield* response.video.bytes()).length).toBeGreaterThan(0)
      }),
    { timeout: 15 * 60 * 1000 },
  )
})
