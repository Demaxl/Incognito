import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Pinned single-threaded ffmpeg core (no SharedArrayBuffer / cross-origin
// isolation required). Keep this version in sync with @ffmpeg/ffmpeg.
const CORE_VERSION = "0.12.10";
const CORE_BASE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`;

// Module-level singleton so the (~30MB) core is only downloaded/initialised once
// per page session and reused across every card composition.
let ffmpegInstance = null;
let loadPromise = null;

async function getFFmpeg(onProgress) {
    if (!import.meta.client) {
        throw new Error("useVideoCard can only run in the browser");
    }

    if (ffmpegInstance && ffmpegInstance.loaded) return ffmpegInstance;

    if (!loadPromise) {
        loadPromise = (async () => {
            const { FFmpeg } = await import("@ffmpeg/ffmpeg");
            const ffmpeg = new FFmpeg();

            const [coreURL, wasmURL] = await Promise.all([
                toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.js`, "text/javascript"),
                toBlobURL(
                    `${CORE_BASE_URL}/ffmpeg-core.wasm`,
                    "application/wasm"
                ),
            ]);

            await ffmpeg.load({ coreURL, wasmURL });
            ffmpegInstance = ffmpeg;
            return ffmpeg;
        })();
    }

    const ffmpeg = await loadPromise;

    if (typeof onProgress === "function") {
        ffmpeg.on("progress", ({ progress }) => {
            onProgress(Math.min(Math.max(progress, 0), 1));
        });
    }

    return ffmpeg;
}

// Convert a data URL / blob URL / remote URL into a Uint8Array for ffmpeg's FS.
async function toUint8(source) {
    return await fetchFile(source);
}

function guessExtension(url, fallback) {
    const clean = (url || "").split("?")[0].split("#")[0];
    const match = clean.match(/\.([a-z0-9]+)$/i);
    return match ? match[1].toLowerCase() : fallback;
}

export const useVideoCard = () => {
    /**
     * Compose a branded MP4 by overlaying the message video on top of the
     * card background PNG. Letterbox gaps naturally reveal the card gradient
     * because the video is drawn over the (already rendered) card.
     *
     * @param {Object} opts
     * @param {string} opts.cardImage   Data/blob URL of the rendered card PNG.
     * @param {string} opts.videoUrl    URL of the source video message.
     * @param {{x:number,y:number,width:number,height:number}} opts.mediaRect
     *        Target rectangle (in output pixels) where the video should sit.
     * @param {number} [opts.width=1080]  Output width.
     * @param {number} [opts.height=1920] Output height.
     * @param {(p:number)=>void} [opts.onProgress]
     * @returns {Promise<string>} Object URL for the resulting MP4 blob.
     */
    const composeVideoCard = async ({
        cardImage,
        videoUrl,
        mediaRect,
        width = 1080,
        height = 1920,
        onProgress,
    }) => {
        const ffmpeg = await getFFmpeg(onProgress);

        const inputExt = guessExtension(videoUrl, "mp4");
        const cardName = "card.png";
        const inputName = `input.${inputExt}`;
        const outputName = "output.mp4";

        await ffmpeg.writeFile(cardName, await toUint8(cardImage));
        await ffmpeg.writeFile(inputName, await toUint8(videoUrl));

        // Center point of the target region in output pixels.
        const centerX = Math.round(mediaRect.x + mediaRect.width / 2);
        const centerY = Math.round(mediaRect.y + mediaRect.height / 2);
        const boxW = Math.round(mediaRect.width);
        const boxH = Math.round(mediaRect.height);

        // Scale video to fit inside the region (preserving aspect), force even
        // dimensions for yuv420p, then overlay centered on the card.
        const filter =
            `[1:v]scale=${boxW}:${boxH}:force_original_aspect_ratio=decrease,` +
            `scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=1[v];` +
            `[0:v][v]overlay=x=${centerX}-w/2:y=${centerY}-h/2:shortest=1[out]`;

        await ffmpeg.exec([
            "-i",
            cardName,
            "-i",
            inputName,
            "-filter_complex",
            filter,
            "-map",
            "[out]",
            "-map",
            "1:a?",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-movflags",
            "+faststart",
            "-shortest",
            outputName,
        ]);

        const data = await ffmpeg.readFile(outputName);

        await ffmpeg.deleteFile(cardName).catch(() => {});
        await ffmpeg.deleteFile(inputName).catch(() => {});
        await ffmpeg.deleteFile(outputName).catch(() => {});

        const blob = new Blob([data.buffer], { type: "video/mp4" });
        return URL.createObjectURL(blob);
    };

    /**
     * Compose a branded MP4 for an audio message: a still card image for the
     * full duration of the audio, muxed with the audio track.
     *
     * @param {Object} opts
     * @param {string} opts.cardImage Data/blob URL of the rendered card PNG.
     * @param {string} opts.audioUrl  URL of the source audio message.
     * @param {(p:number)=>void} [opts.onProgress]
     * @returns {Promise<string>} Object URL for the resulting MP4 blob.
     */
    const composeAudioCard = async ({ cardImage, audioUrl, onProgress }) => {
        const ffmpeg = await getFFmpeg(onProgress);

        const inputExt = guessExtension(audioUrl, "mp3");
        const cardName = "card.png";
        const inputName = `audio.${inputExt}`;
        const outputName = "output.mp4";

        await ffmpeg.writeFile(cardName, await toUint8(cardImage));
        await ffmpeg.writeFile(inputName, await toUint8(audioUrl));

        await ffmpeg.exec([
            "-loop",
            "1",
            "-i",
            cardName,
            "-i",
            inputName,
            // Ensure even dimensions for yuv420p compatibility.
            "-vf",
            "scale=trunc(iw/2)*2:trunc(ih/2)*2",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-tune",
            "stillimage",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-movflags",
            "+faststart",
            "-shortest",
            outputName,
        ]);

        const data = await ffmpeg.readFile(outputName);

        await ffmpeg.deleteFile(cardName).catch(() => {});
        await ffmpeg.deleteFile(inputName).catch(() => {});
        await ffmpeg.deleteFile(outputName).catch(() => {});

        const blob = new Blob([data.buffer], { type: "video/mp4" });
        return URL.createObjectURL(blob);
    };

    return { composeVideoCard, composeAudioCard };
};
