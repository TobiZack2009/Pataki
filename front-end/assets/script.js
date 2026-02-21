// Initialize Lucide Icons
lucide.createIcons();

// --- Triage Chat Logic ---
const PATHS = {
    clinical: {
        label: "Clinical",
        icon: "stethoscope",
        description: "Physical symptoms & urgent care",
        color: "text-health-teal",
        bgLight: "bg-health-teal-light",
        initial: "Hello! I'm your HealthGo Clinical Guide 🩺 I'll help assess your physical symptoms and direct you to the right care. Please describe what you're experiencing."
    },
    psychological: {
        label: "Mental Health",
        icon: "brain",
        description: "Emotional & mental wellbeing",
        color: "text-health-amber",
        bgLight: "bg-health-amber-light",
        initial: "Welcome. This is a safe, confidential space 💚 I'm here to support your mental and emotional wellbeing. How are you feeling today?"
    },
    information: {
        label: "Preventive",
        icon: "book-open",
        description: "Health tips & literacy",
        color: "text-health-green",
        bgLight: "bg-health-green-light",
        initial: "Welcome to HealthGo's Preventive Health Hub 📚 I'm here to share trustworthy health information to keep you and your family healthy. What would you like to learn about?"
    }
};

const app = {
    state: {
        selectedPath: null,
        messages: [],
        isRecording: false,
        expandedMetric: null
    },

    // Triage Functions
    selectPath: function (pathKey) {
        this.state.selectedPath = pathKey;
        const pathData = PATHS[pathKey];

        // Hide Selector, Show Chat
        document.getElementById('path-selector').classList.add('hidden');
        const chatInterface = document.getElementById('chat-interface');
        chatInterface.classList.remove('hidden');

        // Update Chat Header
        const headerTitle = document.getElementById('chat-header-title');
        const headerIcon = document.getElementById('chat-header-icon');
        const headerDiv = document.getElementById('chat-header');

        headerTitle.innerText = `HealthGo ${pathData.label} Assistant`;
        headerTitle.className = `font-display font-bold ${pathData.color}`;

        // Re-render icon
        headerIcon.setAttribute('data-lucide', pathData.icon);
        headerDiv.className = `px-6 py-4 flex items-center gap-3 border-b border-border ${pathData.bgLight}`;
        lucide.createIcons();

        // Add Initial Message
        this.addMessage('bot', pathData.initial);
    },

    addMessage: function (role, text, riskLevel = null) {
        const chatContainer = document.getElementById('chat-messages');
        const msgDiv = document.createElement('div');

        const isBot = role === 'bot';
        const alignClass = isBot ? 'flex-row' : 'flex-row-reverse';
        const bubbleClass = isBot
            ? 'bg-card text-foreground rounded-tl-sm shadow-sm'
            : 'bg-primary text-primary-foreground rounded-tr-sm';

        const iconName = isBot ? 'bot' : 'user';
        const iconBg = isBot ? 'bg-gradient-hero text-primary-foreground' : 'bg-secondary text-secondary-foreground';

        let riskBadge = '';
        if (riskLevel) {
            const badgeColor = riskLevel === 'high' ? 'bg-health-red' : riskLevel === 'medium' ? 'bg-health-amber' : 'bg-health-green';
            riskBadge = `<div class="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${badgeColor}">${riskLevel} Risk</div>`;
        }

        msgDiv.className = `flex gap-3 chat-message-enter ${alignClass}`;
        msgDiv.innerHTML = `
      <div class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${iconBg}">
        <i data-lucide="${iconName}" class="w-4 h-4"></i>
      </div>
      <div class="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line relative ${bubbleClass}">
        ${riskBadge}
        ${text}
      </div>
    `;

        chatContainer.appendChild(msgDiv);
        lucide.createIcons();
        chatContainer.scrollTop = chatContainer.scrollHeight;
    },

    sendMessage: function () {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        // User Message
        this.addMessage('user', text);
        input.value = '';

        // Simulate Typing
        const chatContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'flex gap-3 chat-message-enter';
        typingDiv.innerHTML = `
      <div class="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-hero flex items-center justify-center">
        <i data-lucide="bot" class="w-4 h-4 text-primary-foreground"></i>
      </div>
      <div class="bg-card rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1 items-center h-10">
        <span class="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style="animation-delay: 0s"></span>
        <span class="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style="animation-delay: 0.15s"></span>
        <span class="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style="animation-delay: 0.3s"></span>
      </div>
    `;
        chatContainer.appendChild(typingDiv);
        lucide.createIcons();
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Simulate Response Delay
        setTimeout(() => {
            document.getElementById('typing-indicator').remove();

            // Simple heuristic response
            let response = "I understand. Based on what you've shared, I recommend monitoring these symptoms closely.";
            let risk = null;

            if (text.toLowerCase().includes('pain') || text.toLowerCase().includes('emergency')) {
                response = "It sounds like you might be experiencing acute symptoms. I recommend visiting the nearest Primary Health Center immediately.";
                risk = 'high';
            } else if (text.toLowerCase().includes('sad') || text.toLowerCase().includes('anxious')) {
                response = "It's completely okay to feel this way. Have you considered speaking to a counselor? We can connect you with one.";
                risk = 'medium';
            }

            this.addMessage('bot', response, risk);
        }, 2000);
    },

    toggleRecording: function () {
        const btn = document.getElementById('mic-btn');
        if (this.state.isRecording) {
            this.state.isRecording = false;
            btn.classList.remove('bg-health-red-light', 'text-health-red', 'animate-pulse');
            btn.classList.add('bg-card', 'text-muted-foreground');
        } else {
            this.state.isRecording = true;
            btn.classList.remove('bg-card', 'text-muted-foreground');
            btn.classList.add('bg-health-red-light', 'text-health-red', 'animate-pulse');

            // Auto stop after 3s for demo
            setTimeout(() => {
                this.toggleRecording();
                document.getElementById('chat-input').value = "I have a headache and fever.";
            }, 3000);
        }
        lucide.createIcons();
    },

    // Dashboard Functions
    renderMetrics: function () {
        const metrics = [
            { id: "hydration", label: "Hydration", value: "1.8", unit: "L/day", status: "yellow", trend: "up", icon: "droplets", note: "Below 2L target. Increase water intake." },
            { id: "medication", label: "Medication", value: "85", unit: "% adherence", status: "green", trend: "stable", icon: "pill", note: "Great consistency! Keep it up." },
            { id: "checkup", label: "Last Checkup", value: "12", unit: "weeks ago", status: "red", trend: "down", icon: "calendar", note: "Overdue! Book a PHC visit soon." },
            { id: "vitals", label: "Vitals Logged", value: "3", unit: "this week", status: "green", trend: "up", icon: "activity", note: "Well tracked. Continue daily logging." },
            { id: "wellness", label: "Wellness Score", value: "72", unit: "/ 100", status: "yellow", trend: "up", icon: "heart", note: "Improving! Keep following your plan." },
        ];

        const container = document.getElementById('metrics-grid');
        container.innerHTML = metrics.map(m => {
            const config = this.getStatusConfig(m.status);
            const isExpanded = this.state.expandedMetric === m.id;

            return `
        <button onclick="app.toggleMetric('${m.id}')" class="text-left p-5 bg-card rounded-2xl border-2 shadow-card transition-all duration-200 hover:shadow-glow ${isExpanded ? config.border : 'border-border hover:border-muted-foreground/30'}">
            <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center ${m.status === 'green' ? 'bg-health-green-light' : m.status === 'yellow' ? 'bg-health-yellow-light' : 'bg-health-red-light'}">
                    <i data-lucide="${m.icon}" class="w-5 h-5 ${config.text}"></i>
                </div>
                <div class="flex items-center gap-1.5">
                    ${this.getTrendIcon(m.trend)}
                    <div class="w-3 h-3 rounded-full ${config.bg} ${isExpanded ? config.pulse : ''}"></div>
                </div>
            </div>
            <div class="mb-1">
                <span class="font-display font-bold text-2xl text-foreground">${m.value}</span>
                <span class="text-muted-foreground text-sm ml-1">${m.unit}</span>
            </div>
            <div class="text-sm font-medium text-foreground mb-1">${m.label}</div>
            
            ${isExpanded ? `
                <div class="mt-3 pt-3 border-t border-border text-xs ${config.text} font-medium animate-fade-in-up">
                    💡 ${m.note}
                </div>
            ` : `
                <div class="text-xs font-medium ${config.text}">
                    ${config.label} · Tap for details
                </div>
            `}
        </button>
        `;
        }).join('');

        lucide.createIcons();
    },

    toggleMetric: function (id) {
        if (this.state.expandedMetric === id) {
            this.state.expandedMetric = null;
        } else {
            this.state.expandedMetric = id;
        }
        this.renderMetrics();
    },

    getStatusConfig: function (status) {
        switch (status) {
            case 'green': return { bg: "bg-health-green", text: "text-health-green", border: "border-health-green", label: "Good", pulse: "pulse-green" };
            case 'yellow': return { bg: "bg-health-yellow", text: "text-health-yellow", border: "border-health-yellow", label: "Monitor", pulse: "pulse-yellow" };
            case 'red': return { bg: "bg-health-red", text: "text-health-red", border: "border-health-red", label: "Attention", pulse: "pulse-red" };
        }
    },

    getTrendIcon: function (trend) {
        if (trend === 'up') return `<i data-lucide="trending-up" class="w-3.5 h-3.5 text-health-green"></i>`;
        if (trend === 'down') return `<i data-lucide="trending-down" class="w-3.5 h-3.5 text-health-red"></i>`;
        return `<i data-lucide="minus" class="w-3.5 h-3.5 text-muted-foreground"></i>`;
    }
};

// Listen for Enter key
document.getElementById('chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') app.sendMessage();
});

// Initial Render
app.renderMetrics();
