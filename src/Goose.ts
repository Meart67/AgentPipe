const Goose = class {
  constructor(name, birthYear, rolePrompt) {
    // Define agent data model based on context and demand
    this.name = `#Agent${name}`;
    const yearString = `${birthYear}.0`;
    
    // Generate a random prompt string from the provided text for variety while respecting the "prompt" field in constructor args if it exists (though we'll use generic role descriptions)
    let promptContent = "";
    if(rolePrompt !== undefined && typeof rolePrompt === 'string') {
      const parts = rolePrompt.split(/[\n\r]+/); // Split by lines for cleaner logic, or just string literal
      // Since the input was a text block with newlines in it (likely from JSON parsing of `role` field), we'll use that as is but clean up whitespace.
      promptContent = parts.join('\n'); 
    } else {
      const rolesToUse = ["System Architect", "Security Guardian", "Financial Optimist"]; // Generic fallbacks if role not found in text
      let fullPrompt;
      
      try {
        fullPrompt = JSON.parse(rolePrompt);
      } catch(e) {
        console.warn("Could not parse provided prompt as JSON:", e.message, this.name);
        const rolesToUse2 = ["System Architect", "Security Guardian", "Financial Optimist"]; // Fallback if parsing fails on raw string too
        fullPrompt = JSON.parse(rolesToUse[0]); 
      }

    } else {
       console.warn("rolePrompt is undefined:", this.name);
    }

    const promptText = `# ${this.name} - #Agent${name}`; // Placeholder text for the hero image description
    
    return new Goose(this, yearString, fullPrompt);
  };

  renderHero() {
    if (!this.name) throw new Error("No name provided");
    
    const htmlContent = `
      <div class="hero-section">
        <!-- HERO IMAGE PLACEHOLDER (Goose Person in Factory) -->
        <img src="${'https://via.placeholder.com/60x48?text=GOOSE+PERSON'}" alt="${this.name} - #Agent${name}" 
             style="width: 12rem; height: auto; border-radius: 5px;">
        
        <!-- HERO TEXT -->
        <div class="hero-text">
          ${promptText}<br>
          Powered by the ORACLE OF THE REPOSITORY.
        </div>
      </div>`;

    return htmlContent;
  };

  renderContributors() {
    if (!this.name) throw new Error("No name provided");

    // Helper to generate a colored portrait based on role (Loki, Oscar, Loki, etc.)
    const getPortraitColor = () => {
      switch(this.role || "Unknown") {
        case 'System Architect': return '#FFD700'; // Gold
        case 'Security Guardian': return '#4B5563'; // Slate Blue (Loki vibes)
        case 'Financial Optimist': return '#9C27B0'; // Purple (Grouch/Sesame vibe)
        default: return '#8B4513'; // Brown/Earth tone
      }
    };

    const htmlContent = `
      <div class="contributors-section">
        
        <!-- HEADER -->
        <h2 style="color:#DAA520; text-align:center;">Contributors</h2>
        
        <!-- GRID CONTAINER -->
        <div id="agent-grid" class="grid-container"></div>

        <!-- FOOTER / DECORATION -->
        <footer class="decorations">
          <span style="font-family: 'Arial Black', sans-serif; color:#FFD700;">☀️</span><br>
          <span style="color:#4B5563;">🌱</span> (Golden Eggs Decoration)
        </footer>

      </div>`;

    return htmlContent;
  };

  renderList() {
    if (!this.name) throw new Error("No name provided");

    const url = `https://github.com/${encodeURIComponent(this.name)}`; // GitHub URL
    
    let contentHtml = "<!-- LIST CONTENT -->";
    
    try {
      // Fetch data from the repository (simulated for demonstration, as real fetch might fail without auth in this context unless we use a proxy or mock it). 
      // Since I cannot execute external API calls reliably here to get actual PRs/avatars of *other* agents beyond my own generation if they exist.
      
      const contributors = [this];

      for (const agentData of contributors) {
        contentHtml += `
