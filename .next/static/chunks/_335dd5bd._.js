(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hooks/use-socket.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
"use client";
;
;
let socketInstance = null;
const useSocket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, _get)=>({
        socket: null,
        connected: false,
        friendships: [],
        messages: [],
        connect: ()=>{
            if (socketInstance === null || socketInstance === void 0 ? void 0 : socketInstance.connected) return;
            socketInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(("TURBOPACK compile-time value", "http://localhost:3001"), {
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
            if (socketInstance === null || socketInstance === void 0 ? void 0 : socketInstance.connected) {
                console.log("Joining user room:", userId);
                socketInstance.emit("join", userId);
            } else {
                console.warn("Socket not connected. Cannot join room.");
            }
        },
        selectFriendships: (userId)=>{
            if (socketInstance === null || socketInstance === void 0 ? void 0 : socketInstance.connected) {
                console.log("Selecting friendships for user:", userId);
                socketInstance.emit("select-friendships", userId);
            } else {
                console.warn("Socket not connected. Cannot select friendships.");
            }
        },
        sendFriendship: (sender, receiver)=>{
            if (socketInstance === null || socketInstance === void 0 ? void 0 : socketInstance.connected) {
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
            if (socketInstance === null || socketInstance === void 0 ? void 0 : socketInstance.connected) {
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
            if (socketInstance === null || socketInstance === void 0 ? void 0 : socketInstance.connected) {
                console.log("Selecting messages for user:", userId);
                socketInstance.emit("select-messages", userId);
            } else {
                console.warn("Socket not connected. Cannot select messages.");
            }
        },
        sendMessage: (msg)=>{
            if (socketInstance === null || socketInstance === void 0 ? void 0 : socketInstance.connected) {
                console.log("Sending message:", msg);
                socketInstance.emit("send-message", msg);
            } else {
                console.warn("Socket not connected. Cannot send message.");
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(layout)/(wrapper)/friends/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-socket.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const __TURBOPACK__default__export__ = _s(()=>{
    _s();
    const connected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])({
        "useSocket[connected]": (state)=>state.connected
    }["useSocket[connected]"]);
    const friendships = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])({
        "useSocket[friendships]": (state)=>state.friendships
    }["useSocket[friendships]"]);
    const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])({
        "useSocket[connect]": (state)=>state.connect
    }["useSocket[connect]"]);
    const join = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])({
        "useSocket[join]": (state)=>state.join
    }["useSocket[join]"]);
    const selectFriendships = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])({
        "useSocket[selectFriendships]": (state)=>state.selectFriendships
    }["useSocket[selectFriendships]"]);
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])({
        "useSocket[disconnect]": (state)=>state.disconnect
    }["useSocket[disconnect]"]);
    const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authClient"].useSession();
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "useEffect": ()=>{
            if (!data) return;
            connect();
            join(data.user.id);
            selectFriendships(data.user.id);
            console.log(friendships);
            return ({
                "useEffect": ()=>disconnect()
            })["useEffect"];
        }
    }["useEffect"], [
        connect,
        join,
        selectFriendships,
        disconnect,
        data,
        friendships
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            "Connected: ",
            connected ? "Yes" : "No"
        ]
    }, void 0, true, {
        fileName: "[project]/app/(layout)/(wrapper)/friends/page.tsx",
        lineNumber: 27,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
}, "i3qG2VYBmAVV76JlV8qFo9HRVyw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authClient"].useSession
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_335dd5bd._.js.map