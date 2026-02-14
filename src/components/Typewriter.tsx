"use client";

import { useEffect, useState, useRef } from "react";

const ROLES = [
    "Software Engineer",
    "Aspiring Writer",
    "Rock Climber",
    "Explorer",
];

const TYPE_SPEED = 100;
const DELETE_SPEED = 50;
const PAUSE_AFTER_TYPE = 2400;
const PAUSE_AFTER_DELETE = 500;

export default function Typewriter() {
    const [displayed, setDisplayed] = useState("");
    const [cursorVisible, setCursorVisible] = useState(true);
    const indexRef = useRef(0);
    const phaseRef = useRef<"typing" | "pausing" | "deleting" | "waiting">("typing");
    const charRef = useRef(0);

    /* ── Blinking cursor ── */
    useEffect(() => {
        const blink = setInterval(() => setCursorVisible((v) => !v), 530);
        return () => clearInterval(blink);
    }, []);

    /* ── Typewriter loop ── */
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        function tick() {
            const currentWord = ROLES[indexRef.current];
            const phase = phaseRef.current;

            if (phase === "typing") {
                charRef.current++;
                setDisplayed(currentWord.slice(0, charRef.current));

                if (charRef.current >= currentWord.length) {
                    phaseRef.current = "pausing";
                    timeout = setTimeout(tick, PAUSE_AFTER_TYPE);
                } else {
                    timeout = setTimeout(tick, TYPE_SPEED);
                }
            } else if (phase === "pausing") {
                phaseRef.current = "deleting";
                timeout = setTimeout(tick, 0);
            } else if (phase === "deleting") {
                charRef.current--;
                setDisplayed(currentWord.slice(0, charRef.current));

                if (charRef.current <= 0) {
                    phaseRef.current = "waiting";
                    timeout = setTimeout(tick, PAUSE_AFTER_DELETE);
                } else {
                    timeout = setTimeout(tick, DELETE_SPEED);
                }
            } else if (phase === "waiting") {
                indexRef.current = (indexRef.current + 1) % ROLES.length;
                phaseRef.current = "typing";
                timeout = setTimeout(tick, 0);
            }
        }

        timeout = setTimeout(tick, PAUSE_AFTER_TYPE);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <span className="typewriter">
            {displayed}
            <span
                className="typewriter-cursor"
                style={{ opacity: cursorVisible ? 1 : 0 }}
            >
                |
            </span>
        </span>
    );
}
