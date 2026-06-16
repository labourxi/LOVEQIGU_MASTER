try:
    from .router import VisualRouter
    from .evaluator import VisualEvaluator
    from .audit_engine import AuditEngine
    from .selection_engine import SelectionEngine
    from .candidate_judge import CandidateJudge
except Exception:  # pragma: no cover
    from router import VisualRouter  # type: ignore
    from evaluator import VisualEvaluator  # type: ignore
    from audit_engine import AuditEngine  # type: ignore
    from selection_engine import SelectionEngine  # type: ignore
    from candidate_judge import CandidateJudge  # type: ignore


class VisualPipeline:
    def __init__(self) -> None:
        self.router = VisualRouter()
        self.evaluator = VisualEvaluator()
        self.audit_engine = AuditEngine()
        self.selection_engine = SelectionEngine()
        self.candidate_judge = CandidateJudge()

    def run_judge_stage(self, prompt: str, candidate_paths=None):
        return self.candidate_judge.judge_candidates(prompt, candidate_paths=candidate_paths)

    def run(self):
        return {
            "route": {},
            "generate": [],
            "audit": {},
            "judge": self.run_judge_stage("candidate review"),
            "evaluate": {},
            "select": {},
            "freeze": {},
        }
