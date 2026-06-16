# VISUAL_AUTOPILOT_JUDGE_V1_REPORT

## Summary

The Visual Autopilot Candidate Judge has been established as a new review layer.

Implemented files:

- `scripts/visual_autopilot/candidate_judge.py`
- `scripts/visual_autopilot/pipeline.py` updated to include the `judge` stage

Result: `PASS_WITH_WARNING`

## Flow

Prompt -> Generate N candidates -> Gemini Visual Review -> Score -> Rank -> Winner -> Freeze

## Current Runtime Status

Gemini visual review is defined in the judge layer, but the current Codex runtime does not expose a Gemini API key, so the live Gemini review path is unavailable.

Observed state:

- `GeminiProvider.health_check() = unavailable`
- `gemini_review_available = false`
- local fallback judge was used for the sample run

## Sample Candidate Review

Sample prompt:

`red apple on wooden table`

Sample candidate:

- `assets/visual-autopilot/candidates/seedream_ark_1781361910.jpg`

## Scoring

Each dimension is scored from 0 to 10.

| Dimension | Score |
| --- | ---: |
| 东方感 | 1 |
| 古朴感 | 2 |
| 留白感 | 2 |
| 神秘感 | 4 |
| 信物契合度 | 1 |

`total_score = 10`

## Ranking

Only one candidate was present, so it is both the top-ranked result and the winner.

- `winner = seedream_ark_1781361910.jpg`
- `backup = none`
- `rejected = none`

## Freeze Result

- `freeze_status = NOT_READY`

The sample candidate does not meet a freeze threshold for a relic-style visual review.

## Interpretation

The judge layer is now in place and can rank candidates with either:

- Gemini visual review when the Gemini key is available
- local fallback scoring when Gemini is unavailable

This makes the review stage operational without blocking on external credentials.

## Conclusion

The automatic visual review layer is established, integrated into the pipeline skeleton, and ready to be used for multi-candidate ranking.

`VISUAL_AUTOPILOT_JUDGE_V1_COMPLETE = YES`

