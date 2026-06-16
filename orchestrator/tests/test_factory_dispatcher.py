from __future__ import annotations

from orchestrator.engine.factory_dispatcher import FactoryDispatcher
from orchestrator.engine.task_runner import TaskRunner


def test_dispatcher_routes_new_relic():
    dispatcher = FactoryDispatcher()
    result = dispatcher.dispatch("new_relic", {"task": "新增角宿一"})
    assert result["status"] == "success"
    assert result["factory"] == "RelicFactory"


def test_dispatcher_routes_new_visual():
    dispatcher = FactoryDispatcher()
    result = dispatcher.dispatch("new_visual", {"task": "新增视觉资产"})
    assert result["status"] == "success"
    assert result["factory"] == "VisualFactory"


def test_dispatcher_routes_new_story():
    dispatcher = FactoryDispatcher()
    result = dispatcher.dispatch("new_story", {"task": "新增故事节点"})
    assert result["status"] == "success"
    assert result["factory"] == "StoryFactory"


def test_runner_connects_dispatcher():
    runner = TaskRunner()
    result = runner.run({"task": "新增角宿一"})
    assert result["state"] == "completed"
    assert result["primary_dispatch"]["factory"] == "RelicFactory"
