import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

/** @type {FFmpeg | null} */
let ffmpegInstance = null;
/** @type {Promise<FFmpeg> | null} */
let loadPromise = null;
/** Serializes encodes so concurrent shares don't collide on MEMFS. */
let composeQueue = Promise.resolve();
/** @type {AbortController | null} */
let activeAbort = null;

const CORE_VERSION = "0.12.10";
const CORE_BASE = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/esm`;

function abortError() {
    return new DOMException("Composition aborted", "AbortError");
}

function assertNotAborted(signal) {
    if (signal?.aborted) throw abortError();
}

/**
 * Reject as soon as `signal` aborts, even if `promise` never settles
 * (ffmpeg.terminate() can leave exec hanging).
 */
function abortable(promise, signal) {
    if (!signal) return promise;
    if (signal.aborted) return Promise.reject(abortError());

    return new Promise((resolve, reject) => {
        const onAbort = () => reject(abortError());
        signal.addEventListener("abort", onAbort, { once: true });
        promise.then(
            (value) => {
                signal.removeEventListener("abort", onAbort);
                resolve(value);
            },
            (error) => {
                signal.removeEventListener("abort", onAbort);
                reject(error);
            }
        );
    });
}

function resetFFmpegRuntime() {
    if (ffmpegInstance) {
        try {
            ffmpegInstance.terminate();
        } catch {
            // ignore
        }
    }
    ffmpegInstance = null;
    loadPromise = null;
    composeQueue = Promise.resolve();
}

/**
 * Abort an in-flight compose owned by `controller` (or the active one), kill
 * the worker, and reset the queue so the next share modal isn't blocked.
 */
export function cancelFFmpegCompose(controller = activeAbort) {
    if (controller) {
        try {
            controller.abort();
        } catch {
            // ignore
        }
    }

    // Only tear down the shared worker if this controller still owns it (or
    // nothing else is active). Avoid killing a newer modal's encode.
    if (!controller || activeAbort === controller || activeAbort == null) {
        activeAbort = null;
        resetFFmpegRuntime();
    }
}

/**
 * Lazy-load a single-threaded ffmpeg.wasm instance (no COOP/COEP required).
 */
async function getFFmpeg(signal) {
    assertNotAborted(signal);

    if (ffmpegInstance?.loaded) {
        return ffmpegInstance;
    }

    if (!loadPromise) {
        loadPromise = (async () => {
            const ffmpeg = new FFmpeg();
            await ffmpeg.load(
                {
                    coreURL: await toBlobURL(
                        `${CORE_BASE}/ffmpeg-core.js`,
                        "text/javascript"
                    ),
                    wasmURL: await toBlobURL(
                        `${CORE_BASE}/ffmpeg-core.wasm`,
                        "application/wasm"
                    ),
                },
                { signal }
            );
            ffmpegInstance = ffmpeg;
            return ffmpeg;
        })().catch((err) => {
            loadPromise = null;
            ffmpegInstance = null;
            throw err;
        });
    }

    return abortable(loadPromise, signal);
}

function bindProgress(ffmpeg, onProgress) {
    if (!onProgress) return () => {};
    const handler = ({ progress }) => {
        onProgress(Math.min(100, Math.round(progress * 100)));
    };
    ffmpeg.on("progress", handler);
    return () => {
        try {
            ffmpeg.off("progress", handler);
        } catch {
            // instance may already be terminated
        }
    };
}

function guessExtension(url, fallback) {
    try {
        const pathname = new URL(url, "http://localhost").pathname;
        const match = pathname.match(/\.([a-z0-9]+)$/i);
        if (match) return match[1].toLowerCase();
    } catch {
        // ignore
    }
    return fallback;
}

async function cleanupFiles(ffmpeg, names) {
    if (!ffmpeg?.loaded) return;
    for (const name of names) {
        try {
            await ffmpeg.deleteFile(name);
        } catch {
            // file may not exist / worker may be gone
        }
    }
}

/**
 * Overlay a user video into a transparent slot on a 1080x1920 card PNG.
 */
async function composeVideoCard({
    cardDataUrl,
    videoUrl,
    mediaRect,
    onProgress,
    signal,
}) {
    const ffmpeg = await getFFmpeg(signal);
    assertNotAborted(signal);
    const unbind = bindProgress(ffmpeg, onProgress);
    const ext = guessExtension(videoUrl, "mp4");
    const inputName = `input.${ext}`;
    const outputName = "output.mp4";
    const files = ["card.png", inputName, outputName];
    const opts = { signal };

    try {
        await cleanupFiles(ffmpeg, files);

        await abortable(
            ffmpeg.writeFile("card.png", await fetchFile(cardDataUrl), opts),
            signal
        );
        assertNotAborted(signal);
        await abortable(
            ffmpeg.writeFile(inputName, await fetchFile(videoUrl), opts),
            signal
        );
        assertNotAborted(signal);

        const x = Math.max(0, Math.round(mediaRect?.x ?? 140));
        const y = Math.max(0, Math.round(mediaRect?.y ?? 560));
        const w = Math.max(2, Math.round(mediaRect?.width ?? 800));
        const h = Math.max(2, Math.round(mediaRect?.height ?? 800));
        const evenW = w % 2 === 0 ? w : w - 1;
        const evenH = h % 2 === 0 ? h : h - 1;

        const filter = [
            `[1:v]scale=${evenW}:${evenH}:force_original_aspect_ratio=decrease,` +
                `pad=${evenW}:${evenH}:(ow-iw)/2:(oh-ih)/2:color=black@0,setsar=1[vid]`,
            `[0:v][vid]overlay=${x}:${y}:format=auto[outv]`,
        ].join(";");

        const withAudio = [
            "-i",
            "card.png",
            "-i",
            inputName,
            "-filter_complex",
            filter,
            "-map",
            "[outv]",
            "-map",
            "1:a?",
            "-c:v",
            "libx264",
            "-preset",
            "ultrafast",
            "-crf",
            "28",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-shortest",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            outputName,
        ];

        const withoutAudio = [
            "-i",
            "card.png",
            "-i",
            inputName,
            "-filter_complex",
            filter,
            "-map",
            "[outv]",
            "-c:v",
            "libx264",
            "-preset",
            "ultrafast",
            "-crf",
            "28",
            "-an",
            "-shortest",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            outputName,
        ];

        let exitCode = await abortable(
            ffmpeg.exec(withAudio, undefined, opts),
            signal
        );
        assertNotAborted(signal);
        if (exitCode !== 0) {
            await cleanupFiles(ffmpeg, [outputName]);
            exitCode = await abortable(
                ffmpeg.exec(withoutAudio, undefined, opts),
                signal
            );
        }

        if (exitCode !== 0) {
            throw new Error(`ffmpeg exited with code ${exitCode}`);
        }

        const data = await abortable(
            ffmpeg.readFile(outputName, undefined, opts),
            signal
        );
        return new Blob([data], { type: "video/mp4" });
    } finally {
        unbind();
        await cleanupFiles(ffmpeg, files);
    }
}

/**
 * Turn a static card PNG + audio file into a Stories-ready MP4.
 */
async function composeAudioCard({ cardDataUrl, audioUrl, onProgress, signal }) {
    const ffmpeg = await getFFmpeg(signal);
    assertNotAborted(signal);
    const unbind = bindProgress(ffmpeg, onProgress);
    const ext = guessExtension(audioUrl, "mp3");
    const inputName = `input.${ext}`;
    const outputName = "output.mp4";
    const files = ["card.png", inputName, outputName];
    const opts = { signal };

    try {
        await cleanupFiles(ffmpeg, files);

        await abortable(
            ffmpeg.writeFile("card.png", await fetchFile(cardDataUrl), opts),
            signal
        );
        assertNotAborted(signal);
        await abortable(
            ffmpeg.writeFile(inputName, await fetchFile(audioUrl), opts),
            signal
        );
        assertNotAborted(signal);

        const exitCode = await abortable(
            ffmpeg.exec(
                [
                    "-loop",
                    "1",
                    "-i",
                    "card.png",
                    "-i",
                    inputName,
                    "-c:v",
                    "libx264",
                    "-tune",
                    "stillimage",
                    "-c:a",
                    "aac",
                    "-b:a",
                    "192k",
                    "-pix_fmt",
                    "yuv420p",
                    "-shortest",
                    "-movflags",
                    "+faststart",
                    outputName,
                ],
                undefined,
                opts
            ),
            signal
        );

        if (exitCode !== 0) {
            throw new Error(`ffmpeg exited with code ${exitCode}`);
        }

        const data = await abortable(
            ffmpeg.readFile(outputName, undefined, opts),
            signal
        );
        return new Blob([data], { type: "video/mp4" });
    } finally {
        unbind();
        await cleanupFiles(ffmpeg, files);
    }
}

function isAbortError(error) {
    return (
        error?.name === "AbortError" ||
        error?.message?.includes?.("aborted") ||
        error?.message?.includes?.("AbortError")
    );
}

export const useFFmpegShareCard = () => {
    const progress = ref(0);
    const isComposing = ref(false);
    const statusMessage = ref("");
    /** Controller owned by this dialog instance (if any). */
    let ownedController = null;

    const composeShareVideo = ({
        messageType,
        cardDataUrl,
        mediaUrl,
        mediaRect,
    }) => {
        const controller = new AbortController();
        ownedController = controller;
        activeAbort = controller;

        const run = async () => {
            isComposing.value = true;
            progress.value = 0;
            statusMessage.value = "Loading video engine…";

            try {
                assertNotAborted(controller.signal);

                statusMessage.value =
                    messageType === "audio"
                        ? "Creating audio card…"
                        : "Creating video card…";

                const onProgress = (pct) => {
                    if (controller.signal.aborted) return;
                    progress.value = pct;
                    statusMessage.value = `Encoding… ${pct}%`;
                };

                const blob =
                    messageType === "audio"
                        ? await composeAudioCard({
                              cardDataUrl,
                              audioUrl: mediaUrl,
                              onProgress,
                              signal: controller.signal,
                          })
                        : await composeVideoCard({
                              cardDataUrl,
                              videoUrl: mediaUrl,
                              mediaRect,
                              onProgress,
                              signal: controller.signal,
                          });

                progress.value = 100;
                statusMessage.value = "Done";
                return blob;
            } finally {
                if (activeAbort === controller) {
                    activeAbort = null;
                }
                if (ownedController === controller) {
                    ownedController = null;
                }
                isComposing.value = false;
            }
        };

        const next = composeQueue.then(run, run);
        composeQueue = next.catch(() => {});
        return next;
    };

    const cancelCompose = () => {
        cancelFFmpegCompose(ownedController);
        ownedController = null;
    };

    return {
        progress,
        isComposing,
        statusMessage,
        composeShareVideo,
        cancelCompose,
        isAbortError,
    };
};
