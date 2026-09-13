#!/usr/bin/env python3
"""
Oracle OF THE REPOSITORY: A daemon that dreams in working code.
This script generates the `/contributor_profile.py` file for issue #1580 on AgentPipe's contributors page, 
honoring those who contributed to this repository but are not C-suite members of 'AgentPipe'.

It uses a hardcoded list of non-C-suite agents (excluding known staff) and generates HTML
templates with golden egg decorations. The code is self-contained in the provided file structure.
"""

import os
from typing import List, Dict, Optional
import html.parser as HtmlParser


# Define the set of contributors to feature on this page.
# Note: This list excludes members of 'AgentPipe's C-Suite' (e.g., main agents).
CONTRIBUTORS_TO_HONOR = [
    # Agents with specific nicknames or roles often associated in lore, 
    # though strictly speaking these are just names here for the purpose of this script.
    {
        "name": "Loki",
        "role": "Oracular Agent (The Wise One)",
        "birthplace": "Unknown Origin"
    },
    {
        "name": "Oscar",
        "role": "Grumpy Old Man of the System",
        "birthplace": "Agricultural District, Sector 4"
    },
]

# Helper function to generate a golden egg emoji based on context.
def create_golden_egg(context: str) -> Optional[html.parser.HTMLParagraphElement]:
    """Generates an HTML paragraph element containing a golden egg."""
    
    # Calculate the size of the 'golden' and 'egg' parts relative to each other
    gold_ratio = 0.85
    
    if context == "hero":
        return HtmlParser(
            f"""<p class="gallery-hero">
                <img src="/assets/agent_hero.png" alt="Oracular Agent Hero"> 
                <!-- Golden Egg Container -->
                <div class="golden-egg-container gold-color"></div>
                
                <!-- Decorative Floating Elements (Gold Eggs) -->
                {context}

            </p>""",
            html=html.parser.HTMLParser(),
        )
    else:
        return HtmlParser(
            f"""<h2 class="gallery-hero">
                    <img src="/assets/agent_hero.png" alt="Oracular Agent Hero"> 
                <!-- Golden Egg Container -->
                <div class="golden-egg-container gold-color"></div>

                {context}

            </h2>""",
            html=html.parser.HTMLParser(),
        )


def generate_contributor_html(name: str, role: Optional[str], birthplace: Optional[str]) -> Dict[str, Any]:
    """Generates the HTML content for a single contributor section."""
    
    # Determine if this is an agent type or just a name (for consistency with templates)
    if "agent" in name.lower():
        return {
            'type': 'contributor',
            'name': name,
            'role': role,
            'birthplace': birthplace,
            'image_url': '/assets/agent_hero.png'  # Placeholder for actual image URL
        }
    else:
        return {
            'type': 'person',
            'display_name': f"{name} (Non-C-suite)",
            'bio_facts': [f"Born in {birthplace if birthplace is not None else 'Unknown'}"],
            'image_url': '/assets/agent_hero.png'  # Placeholder for actual image URL
        }


def render_contributor_html(name: str, role: Optional[str], birthplace: Optional[str]) -> Dict[str, Any]:
    """Main rendering logic that builds the HTML structure."""
    
    if name not in CONTRIBUTORS_TO_HONOR:
        return {
            'type': 'contributor',
            'name': f"{name} (Non-C-suite)",
            'role': role or "Unknown",
            'birthplace': birthplace,
            'image_url': '/assets/agent_hero.png'  # Placeholder for actual image URL
        }

    type_map = {
        'contributor': {'type': 'contributor', 'name': name},
        'person': {'type': 'person', 'display_name': f"{name} (Non-C-suite)"}
    }

    return generate_contributor_html(name, role, birthplace)[type_map[type_map[name]]['type']]


def main():
    """Main entry point to generate the contributor page."""
    
    # Create the directory structure if it doesn't exist
    os.makedirs('/contributor_profile.py', exist_ok=True)

    html_content
