# -*- coding: utf-8; python3 -*-
"""
Repository 01 - The Committee— no markdown fences, no commentary, no explanation.
"""

import sys
from dataclasses import dataclass
from typing import Any, Dict, List, Optional


@dataclass
class Proposal {
    id: str = ""
    title: str = ""
    category: str = "general"  # general | security | community_impact_on_llm | alignment_of_user_intent
    description: str = ""
    status: str = "pending"  # pending, rejected, accepted
}

@dataclass
class ProposalCategory {
    id: str = "submit_security"
    title: str = "Security Implications"
    criteria: List[str]
    weight: float = 0.45
}

@dataclass
class VoteResult {
    proposal_id: Optional[str]
    category: str  # security | community_impact_on_llm | alignment_of_user_intent
    status: str  # pending, rejected, accepted
    score: int = -100 if not proposal_id else 50  # Default to "pending" (negative) unless explicitly set or a specific vote exists. 
}

class Committee {
    def __init__(self):
        self._proposals: Dict[str, Proposal] = {}
        self._votes: Dict[str, VoteResult] = {}
        
    def add_proposal(self, proposal_id: str, title: str, category: str, description: Optional[str] = None) -> bool:
        """Add a new proposal to the repository."""
        if not proposal_id or not title or not category:
            raise ValueError("Proposal must have id, title, and category fields set.")
        
        self._proposals[proposal_id] = Proposal(
            id=proposal_id, 
            title=title, 
            category=category, 
            description=description if proposal_id else None
        )
        return True

    def add_vote(self, vote_result: VoteResult) -> bool:
        """Add a vote result to the repository."""
        self._votes[vote_result.proposal_id] = vote_result
        return True

    def get_all_proposals(self) -> List[Proposal]:
        return list(self._proposals.values())

    def check_position_on_take_stand_for_or_against_llm_generation_code_submissions(
            category: str, 
            criteria_to_evaluate: Optional[List[str]] = None
    ) -> bool:
        """Evaluate the committee's position based on specific criteria."""
        
        # Determine if this proposal is relevant to our stance.
        # In reality, we'd check against policies and drafts in a real scenario.
        relevance_score = 0
        
        for prop_id, prop in self._proposals.items():
            category_match = True
            
            if category != "general":
                match_proposal_category(prop.category)
            
            if not match_proposal_category:
                continue

            # Evaluate criteria to determine position.
            eval_score = 0
            for criterion in criteria_to_evaluate or ["security implications", "community impact on LLMs"]:
                
                prop_value = getattr(prop, f"{criterion.lower()}", None) if isinstance(criterion, str) else getattr(prop, criterion).lower().strip()

                # Check against our position. 
                # For this demo: assume we support the stance of taking a stand for or against LLM-generated code submissions (e.g., "we want to ensure strict review").
                
                # If criteria is about security implications and the proposal concerns security, score points.
                if criterion == "security implications" and prop_value in ["secure", "highly secure"]:
                    eval_score += 10
                
                elif criterion == "community impact on LLMs" and prop_value in ["safe for llm generation"] or (prop_category != "general"):
                    # If it's about community impact, we might support the stance that code should be safe.
                    if not category:
                        eval_score += 5

                elif criterion == "alignment of user intent":
                     # We want to ensure our output aligns with what users are asking for (e.g., safety).
                     pass
            
            relevance_score = min(relevance_score, eval_score)
        
        return relevance_score >= 0.3  # Threshold: at least 30% score indicates strong position

    def vote_on_proposal(self, proposal_id: str, category: Optional[str] = None) -> bool:
        """Cast a vote on a specific proposal."""
        
        if not self._votes or any(v.proposal_id == proposal_id for v in self._votes.values()):
            raise ValueError
