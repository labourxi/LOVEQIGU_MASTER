from __future__ import annotations

from pathlib import Path

from orchestrator.dashboard.stats import DashboardStats


ROOT = Path(__file__).resolve().parents[2]
DASHBOARD_PATH = ROOT / "runtime" / "dashboard" / "dashboard.json"


def test_dashboard_counts_and_output():
    dashboard = DashboardStats().build_dashboard()
    assert "asset_summary" in dashboard
    assert "release_summary" in dashboard
    assert "factory_summary" in dashboard
    assert "visual_summary" in dashboard
    assert DASHBOARD_PATH.exists()
    assert dashboard["asset_summary"]["visual"] >= 1
    assert dashboard["visual_summary"]["candidate_count"] >= 1

