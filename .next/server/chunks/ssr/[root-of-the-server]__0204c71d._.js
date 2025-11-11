module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[project]/hooks/use-socket.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Zustand store for Socket.IO connection and real-time communication
 * Uses callbacks to avoid dependency issues in useEffect
 *
 * @example
 * ```tsx
 * import { useSocket } from "@/hooks/use-socket";
 *
 * function MyComponent() {
 *   const connected = useSocket((state) => state.connected);
 *   const friendships = useSocket((state) => state.friendships);
 *   const connect = useSocket((state) => state.connect);
 *   const join = useSocket((state) => state.join);
 *   const selectFriendships = useSocket((state) => state.selectFriendships);
 *   const disconnect = useSocket((state) => state.disconnect);
 *
 *   const userId = "user-id-here";
 *
 *   useEffect(() => {
 *     connect();
 *     join(userId);
 *     selectFriendships(userId);
 *
 *     return () => disconnect();
 *   }, [connect, join, selectFriendships, disconnect, userId]);
 *
 *   return <div>Connected: {connected ? "Yes" : "No"}</div>;
 * }
 * ```
 */ __turbopack_context__.s([
    "useSocket",
    ()=>useSocket
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2d$debug$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm-debug/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
"use client";
;
;
let socketInstance = null;
const useSocket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, _get)=>({
        socket: null,
        connected: false,
        friendships: [],
        messages: [],
        connect: ()=>{
            if (socketInstance?.connected) return;
            socketInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2d$debug$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(("TURBOPACK compile-time value", "http://localhost:3001"), {
                transports: [
                    "websocket"
                ],
                autoConnect: true
            });
            // Connection event handlers
            socketInstance.on("connect", ()=>{
                console.log("Socket connected");
                set({
                    connected: true,
                    socket: socketInstance
                });
            });
            socketInstance.on("disconnect", ()=>{
                console.log("Socket disconnected");
                set({
                    connected: false
                });
            });
            socketInstance.on("connect_error", (error)=>{
                console.error("Socket connection error:", error);
                set({
                    connected: false
                });
            });
            // Friendship event handlers
            socketInstance.on("get-friendships", (friendships)=>{
                console.log("Received friendships:", friendships);
                set({
                    friendships
                });
            });
            // Message event handlers
            socketInstance.on("get-messages", (messages)=>{
                console.log("Received messages:", messages);
                set({
                    messages
                });
            });
            socketInstance.on("receive-message", (message)=>{
                console.log("Received new message:", message);
                set((state)=>({
                        messages: [
                            ...state.messages,
                            message
                        ]
                    }));
            });
            set({
                socket: socketInstance
            });
        },
        disconnect: ()=>{
            if (socketInstance) {
                socketInstance.disconnect();
                socketInstance = null;
                set({
                    socket: null,
                    connected: false
                });
            }
        },
        join: (userId)=>{
            if (socketInstance?.connected) {
                console.log("Joining user room:", userId);
                socketInstance.emit("join", userId);
            } else {
                console.warn("Socket not connected. Cannot join room.");
            }
        },
        selectFriendships: (userId)=>{
            if (socketInstance?.connected) {
                console.log("Selecting friendships for user:", userId);
                socketInstance.emit("select-friendships", userId);
            } else {
                console.warn("Socket not connected. Cannot select friendships.");
            }
        },
        sendFriendship: (sender, receiver)=>{
            if (socketInstance?.connected) {
                console.log("Sending friendship request:", {
                    sender,
                    receiver
                });
                socketInstance.emit("send-friendships", sender, receiver);
            } else {
                console.warn("Socket not connected. Cannot send friendship.");
            }
        },
        stateFriendship: (friendship, state)=>{
            if (socketInstance?.connected) {
                console.log("Updating friendship state:", {
                    friendship,
                    state
                });
                socketInstance.emit("state-friendship", friendship, state);
            } else {
                console.warn("Socket not connected. Cannot update friendship state.");
            }
        },
        selectMessages: (userId)=>{
            if (socketInstance?.connected) {
                console.log("Selecting messages for user:", userId);
                socketInstance.emit("select-messages", userId);
            } else {
                console.warn("Socket not connected. Cannot select messages.");
            }
        },
        sendMessage: (msg)=>{
            if (socketInstance?.connected) {
                console.log("Sending message:", msg);
                socketInstance.emit("send-message", msg);
            } else {
                console.warn("Socket not connected. Cannot send message.");
            }
        }
    }));
}),
"[project]/app/(layout)/(wrapper)/friends/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-socket.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-client.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const __TURBOPACK__default__export__ = ()=>{
    const connected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSocket"])((state)=>state.connected);
    const friendships = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSocket"])((state)=>state.friendships);
    const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSocket"])((state)=>state.connect);
    const join = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSocket"])((state)=>state.join);
    const selectFriendships = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSocket"])((state)=>state.selectFriendships);
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSocket"])((state)=>state.disconnect);
    const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].useSession();
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        if (!data) return;
        connect();
        join(data.user.id);
        selectFriendships(data.user.id);
        console.log(friendships);
        return ()=>disconnect();
    }, [
        connect,
        join,
        selectFriendships,
        disconnect,
        data,
        friendships
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            "Connected: ",
            connected ? "Yes" : "No"
        ]
    }, void 0, true, {
        fileName: "[project]/app/(layout)/(wrapper)/friends/page.tsx",
        lineNumber: 27,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0204c71d._.js.map