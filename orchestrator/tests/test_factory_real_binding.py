from __future__ import annotations

from pathlib import Path

from orchestrator.engine.factory_dispatcher import FactoryDispatcher
from orchestrator.engine.task_runner import TaskRunner
from orchestrator.factories.adapters.relic_factory import RelicFactoryAdapter
from orchestrator.factories.adapters.story_factory import StoryFactoryAdapter
from orchestrator.factories.adapters.visual_factory import VisualFactoryAdapter


ROOT = Path(__file__).resolve().parents[2]


def test_relic_factory_real_binding():
    adapter = RelicFactoryAdapter()
    result = adapter.execute({"task_id": "phase3_relic", "target": "角宿一"})
    assert result["status"] == "success"
    assert result["factory"] == "RelicFactory"
    assert Path(ROOT / result["output_path"]).exists()


def test_story_factory_real_binding():
    adapter = StoryFactoryAdapter()
    result = adapter.execute({"task_id": "phase3_story", "target": "角宿一"})
    assert result["status"] == "success"
    assert result["factory"] == "StoryFactory"
    assert Path(ROOT / result["output_path"]).exists()


def test_visual_factory_real_binding():
    adapter = VisualFactoryAdapter()
    result = adapter.execute(
        {
            "task_id": "phase3_visual",
            "target": "Ancient Eastern celestial relic, Jiao Mansion constellation seal, jade glyph artifacts, museum artifact lighting, soft golden dust particles, ancient manuscript background",
            "prompt": "Ancient Eastern celestial relic, Jiao Mansion constellation seal, jade glyph artifacts, museum artifact lighting, soft golden dust particles, ancient manuscript background",
        }
    )
    assert result["status"] == "success"
    assert result["factory"] == "VisualFactory"
    assert result["winner"]
    assert result["score"] >= 0
    assert Path(ROOT / result["winner_path"]).exists()


def test_dispatcher_and_runner_compatibility():
    dispatcher = FactoryDispatcher()
    assert dispatcher.dispatch("new_relic", {"task_id": "phase3_relic"})["factory"] == "RelicFactory"
    assert dispatcher.dispatch("new_visual", {"task_id": "phase3_visual"})["factory"] == "VisualFactory"
    assert dispatcher.dispatch("new_story", {"task_id": "phase3_story"})["factory"] == "StoryFactory"

    runner = TaskRunner()
    story_result = runner.run({"task": "新增故事"})
    assert story_result["state"] == "completed"
