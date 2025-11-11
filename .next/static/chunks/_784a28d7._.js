(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hooks/use-friendship.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFriendsStore",
    ()=>useFriendsStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
"use client";
;
;
const useFriendsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        socket: null,
        messages: [],
        friendships: [],
        connect: (userId)=>{
            if (get().socket) return; // already connected
            var _process_env_NEXT_PUBLIC_COMM_URL;
            const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])((_process_env_NEXT_PUBLIC_COMM_URL = ("TURBOPACK compile-time value", "http://localhost:3001")) !== null && _process_env_NEXT_PUBLIC_COMM_URL !== void 0 ? _process_env_NEXT_PUBLIC_COMM_URL : "http://localhost:3001", {
                transports: [
                    "websocket"
                ],
                withCredentials: true
            });
            socket.on("connect", ()=>{
                socket.emit("join", userId);
                socket.emit("get-messages", userId);
                socket.emit("get-friendships", userId);
            });
            socket.on("messages", (msgs)=>set({
                    messages: msgs
                }));
            socket.on("receive-message", (msg)=>set((state)=>({
                        messages: [
                            ...state.messages,
                            msg
                        ]
                    })));
            socket.on("friendships", (friends)=>set({
                    friendships: friends
                }));
            set({
                socket
            });
        },
        sendMessage: (msg)=>{
            const socket = get().socket;
            if (!socket) return;
            socket.emit("send-message", msg);
        },
        refreshMessages: ()=>{
            var _get_socket;
            const socket = get().socket;
            const userId = (_get_socket = get().socket) === null || _get_socket === void 0 ? void 0 : _get_socket.id;
            if (socket && userId) socket.emit("get-messages", userId);
        },
        refreshFriendships: ()=>{
            var _get_socket;
            const socket = get().socket;
            const userId = (_get_socket = get().socket) === null || _get_socket === void 0 ? void 0 : _get_socket.id;
            if (socket && userId) socket.emit("get-friendships", userId);
        },
        changeFriendship: (id, userId, state)=>{
            const socket = get().socket;
            if (socket) socket.emit("change-friendship", id, userId, state);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$friendship$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-friendship.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const __TURBOPACK__default__export__ = _s((param)=>{
    let { userId } = param;
    _s();
    const { messages, connect, sendMessage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$friendship$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFriendsStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useEffect": ()=>{
            connect(userId);
        }
    }["useEffect"], [
        userId,
        connect
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            messages.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: m.text
                }, m.id, false, {
                    fileName: "[project]/app/(layout)/(wrapper)/friends/page.tsx",
                    lineNumber: 17,
                    columnNumber: 5
                }, ("TURBOPACK compile-time value", void 0))),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                onClick: ()=>sendMessage({
                        users: [
                            userId,
                            "otherUser"
                        ],
                        sender: userId,
                        text: "Hi!"
                    }),
                children: "Send Test"
            }, void 0, false, {
                fileName: "[project]/app/(layout)/(wrapper)/friends/page.tsx",
                lineNumber: 19,
                columnNumber: 4
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/(layout)/(wrapper)/friends/page.tsx",
        lineNumber: 15,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
}, "gi0xULC75uYH42LuNV2u9aoebUA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$friendship$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFriendsStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_784a28d7._.js.map