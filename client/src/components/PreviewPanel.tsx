import { DownloadIcon, ImageIcon, Loader2Icon } from "lucide-react";
import type { AspectRatio, IThumbnail } from "../assets/assets"


const PreviewPanel = ({thumbnail, isLoading, aspectRatio}: {
    thumbnail: IThumbnail | null | undefined;
    isLoading: boolean;
    aspectRatio: AspectRatio;
}) => {
    const hasThumbnail = Boolean(thumbnail?.image_url);

    const aspectClasses = {
        "16:9": "aspect-video",
        "1:1": "aspect-square",
        "9:16": "aspect-[9/16]",
    } as Record<AspectRatio, string>;

    const onDownload = async () => {
        if (!thumbnail?.image_url){
            return;
        }
        
        try {
            const res = await fetch(thumbnail.image_url);
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = objectUrl;
            a.download = `${thumbnail.title || "thumbnail"}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(objectUrl);
        } catch {
            // Fallback: open in a new tab with noopener
            window.open(thumbnail.image_url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="relative mx-auto w-full max-w-2xl">
            <div className={`relative overflow-hidden ${aspectClasses[aspectRatio]}`}>
                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/25">
                        <Loader2Icon className="size-8 animate-spin text-zinc-400" />

                        <div className="text-center">
                            <p className="text-sm font-medium text-zinc-200">AI is creating your thumbnail...</p>
                            <p className="mt-1 text-xs text-zinc-400">This may take 10-20 seconds.</p>
                        </div>
                    </div>
                )}

                {/* Image Preview */}
                {hasThumbnail && (
                    <div className="group relative z-10 h-full w-full">
                        <img 
                            src={thumbnail.image_url} 
                            alt={thumbnail.title} 
                            className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 flex items-end justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                                onClick={onDownload}
                                type="button"
                                className="mb-6 flex items-center gap-2 rounded-md px-5 py-2.5 text-xs font-medium transition bg-white/30 ring-2 ring-white/40 backdrop-blur hover:scale-105 active:scale-95"
                            >
                                <DownloadIcon className="size-4" />
                                Download Thumbnail
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !hasThumbnail && (
                    <div className="absolute inset-0 m-2 flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-white/20 bg-black/25">
                        <div className="flex size-20 items-center justify-center rounded-full bg-white/10 max-sm:hidden">
                            <ImageIcon className="size-10 text-white opacity-50" />
                        </div>

                        <div className="px-4 text-center">
                            <p className="font text-zinc-200">Generate your first thumbnail</p>
                            <p className="mt-1 text-xs text-zinc-400">Fill out the form and click generate</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PreviewPanel
