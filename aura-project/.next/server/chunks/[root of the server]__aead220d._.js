module.exports = {

"[project]/.next-internal/server/app/api/focus-sessions/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route.runtime.dev.js [external] (next/dist/compiled/next-server/app-route.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/node:crypto [external] (node:crypto, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}}),
"[project]/lib/session.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>getSession)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/iron-session/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
async function getSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIronSession"])(cookieStore, {
        cookieName: "delicious-karrot",
        password: process.env.COOKIE_PASSWORD
    });
}
}}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}}),
"[project]/lib/db.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const db = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
const __TURBOPACK__default__export__ = db;
}}),
"[project]/lib/ai-service.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuraAIService": (()=>AuraAIService),
    "aiService": (()=>aiService)
});
(()=>{
    const e = new Error("Cannot find module 'openai'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
class AuraAIService {
    client;
    constructor(){
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "";
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
        const apiKey = process.env.AZURE_OPENAI_API_KEY || "";
        const apiVersion = "2024-10-21";
        // Use API key instead of Azure AD token
        this.client = new AzureOpenAI({
            apiKey,
            deployment,
            apiVersion,
            endpoint
        });
    }
    async generateFocusInsights(activityData) {
        const prompt = `
    ## User Work Session Data
    - Keystrokes: ${activityData.keystrokes}
    - Mouse clicks: ${activityData.clicks}
    - Mouse movement: ${activityData.mouseMoved}px
    - Active applications: ${activityData.activeApps.join(', ')}
    - Session duration: ${activityData.sessionDuration} minutes
    - Time of day: ${activityData.timeOfDay}
    
    Based on this work session data, provide:
    1. A short analysis of the user's work patterns (2-3 sentences)
    2. Three specific, actionable tips to improve focus and productivity
    3. One insight about optimal working conditions for this person
    
    Format the response as JSON with keys: "analysis", "tips" (array), and "insight".
    `;
        const response = await this.client.completions.create({
            model: process.env.AZURE_OPENAI_DEPLOYMENT || "",
            prompt: [
                prompt
            ],
            max_tokens: 500,
            temperature: 0.7
        });
        try {
            return JSON.parse(response.choices[0].text);
        } catch (e) {
            console.error("Failed to parse AI response", e);
            return {
                analysis: "Unable to analyze work session.",
                tips: [
                    "Take regular breaks",
                    "Stay hydrated",
                    "Minimize distractions"
                ],
                insight: "Consider tracking more data for better insights."
            };
        }
    }
}
const aiService = new AuraAIService();
}}),
"[project]/lib/session-tracker.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "SessionTracker": (()=>SessionTracker),
    "sessionTracker": (()=>sessionTracker)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai-service.ts [app-route] (ecmascript)");
;
;
class SessionTracker {
    static instance;
    activeSession = null;
    keyCount = 0;
    clickCount = 0;
    mouseDistance = 0;
    activeApps = new Set();
    // Singleton pattern
    static getInstance() {
        if (!SessionTracker.instance) {
            SessionTracker.instance = new SessionTracker();
        }
        return SessionTracker.instance;
    }
    // Start a new work session
    async startSession(userId) {
        if (this.activeSession) {
            await this.endSession();
        }
        this.resetCounters();
        // Verify that the user exists first
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            console.error(`Cannot start session: User with ID ${userId} does not exist`);
            throw new Error(`User with ID ${userId} not found`);
        }
        // Create new session in database
        this.activeSession = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].workSession.create({
            data: {
                userId,
                startTime: new Date(),
                activeApps: []
            }
        });
        return this.activeSession;
    }
    // End current session and generate insights
    async endSession() {
        if (!this.activeSession) return null;
        // Update only the fields that we know exist in the schema
        const updatedSession = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].workSession.update({
            where: {
                id: this.activeSession.id
            },
            data: {
                endTime: new Date(),
                activeApps: Array.from(this.activeApps)
            }
        });
        // Get AI-generated insights
        const aiInsights = await this.generateInsights(updatedSession);
        // Reset the active session
        this.activeSession = null;
        return {
            session: updatedSession,
            insights: aiInsights
        };
    }
    // Track keyboard activity
    trackKeyPress() {
        if (!this.activeSession) return;
        this.keyCount++;
    }
    // Track mouse clicks
    trackMouseClick() {
        if (!this.activeSession) return;
        this.clickCount++;
    }
    // Track mouse movement
    trackMouseMove(distance) {
        if (!this.activeSession) return;
        this.mouseDistance += distance;
    }
    // Track active application
    trackApplication(appName) {
        if (!this.activeSession) return;
        this.activeApps.add(appName);
    }
    // Calculate focus score (simplified algorithm)
    calculateFocusScore() {
        const keyScore = Math.min(this.keyCount / 300, 1.0) * 0.5;
        const clickScore = Math.min(this.clickCount / 100, 1.0) * 0.2;
        const moveScore = Math.min(this.mouseDistance / 5000, 1.0) * 0.3;
        return Math.round((keyScore + clickScore + moveScore) * 100);
    }
    // Generate AI insights from session data
    async generateInsights(session) {
        try {
            const duration = session.endTime ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000) : 0;
            const timeOfDay = this.getTimeOfDay(session.startTime);
            // Get insights from Azure OpenAI
            const aiResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiService"].generateFocusInsights({
                keystrokes: this.keyCount,
                clicks: this.clickCount,
                mouseMoved: this.mouseDistance,
                activeApps: session.activeApps,
                sessionDuration: duration,
                timeOfDay
            });
            // Skip database insertion for now to avoid schema mismatch issues
            // Return the AI insights directly instead
            return {
                analysis: aiResponse.analysis,
                tips: aiResponse.tips,
                insight: aiResponse.insight,
                focusScore: this.calculateFocusScore(),
                date: new Date()
            };
        // NOTE: Uncomment and fix this once the Prisma schema and TypeScript definitions are in sync
        /*
      const insight = await db.focusInsight.create({
        data: {
          // Add the correct fields based on your schema
        }
      });
      return insight;
      */ } catch (error) {
            console.error("Failed to generate insights:", error);
            return null;
        }
    }
    // Get time of day category
    getTimeOfDay(date) {
        const hour = date.getHours();
        if (hour >= 5 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 21) return "evening";
        return "night";
    }
    // Reset all counters
    resetCounters() {
        this.keyCount = 0;
        this.clickCount = 0;
        this.mouseDistance = 0;
        this.activeApps = new Set();
    }
}
const sessionTracker = SessionTracker.getInstance();
}}),
"[project]/app/api/focus-sessions/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST),
    "PUT": (()=>PUT)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$tracker$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-tracker.ts [app-route] (ecmascript)");
;
;
;
;
async function POST(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const userId = session.id;
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const newSession = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$tracker$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionTracker"].startSession(userId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Session started successfully',
            sessionId: newSession.id
        });
    } catch (error) {
        console.error('Failed to start session:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to start session'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const userId = session.id;
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$tracker$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionTracker"].endSession();
        if (!result) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No active session found'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Session ended successfully',
            session: result.session,
            insights: result.insights
        });
    } catch (error) {
        console.error('Failed to end session:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to end session'
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const userId = session.id;
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const sessions = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].workSession.findMany({
            where: {
                userId
            },
            include: {
                insights: true
            },
            orderBy: {
                startTime: 'desc'
            },
            take: 10
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            sessions
        });
    } catch (error) {
        console.error('Failed to fetch sessions:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch sessions'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__aead220d._.js.map