from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class PromptVariant:
    key: str
    filename: str
    prompt: str


class VariationEngine:
    VARIANTS = (
        (
            "SCROLL_RELIC",
            "candidate_A.txt",
            "Ancient scroll relic composition with layered manuscript textures, hanging silk scroll fragments, seal script details, sacred whitespace, museum lighting, refined Chinese antiquity.",
        ),
        (
            "BRONZE_RELIC",
            "candidate_B.txt",
            "Bronze relic composition with ancient cast-metal texture, ritual vessel silhouette, patina surface, engraved star markings, solemn museum display, quiet whitespace.",
        ),
        (
            "STONE_RELIC",
            "candidate_C.txt",
            "Stone relic composition with carved stele geometry, weathered mineral surface, epigraphic inscription, archaeological lighting, restrained negative space, sacred stillness.",
        ),
        (
            "JADE_RELIC",
            "candidate_D.txt",
            "Jade relic composition with translucent jade texture, carved talisman form, constellation glyphs, imperial green tones, soft highlight control, elegant whitespace.",
        ),
        (
            "ASTRAL_RELIC",
            "candidate_E.txt",
            "Astral relic composition with celestial seal motifs, star chart geometry, ritual glow, manuscript backdrop, cosmic alignment, ceremonial whitespace.",
        ),
    )

    def build_variants(self, base_prompt: str) -> list[PromptVariant]:
        variants: list[PromptVariant] = []
        for key, filename, variant_prompt in self.VARIANTS:
            prompt = (
                f"{base_prompt}. "
                f"Variant theme: {key}. "
                f"{variant_prompt}"
            )
            variants.append(PromptVariant(key=key, filename=filename, prompt=prompt))
        return variants
