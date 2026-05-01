import exifr from 'exifr';
import imageCompression from 'browser-image-compression';

export class ImageVerificationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ImageVerificationError';
    }
}

/**
 * 1. Verification Phase: Rejects AI-generated or metadata-stripped images.
 * 2. Scrubbing Phase: Strips all remaining metadata for privacy.
 * 
 * @param file The uploaded File object
 * @returns A new File object that is cleansed of all EXIF metadata
 */
export async function verifyAndScrubImage(file: File): Promise<File> {
    // We only perform deep checks on standard image types
    if (!file.type.startsWith('image/') || file.type.includes('svg')) {
        return file; // Pass through non-applicable file types (e.g. PDFs, SVGs, Videos)
    }

    // ==========================================
    // PHASE 1: VERIFICATION (Anti-AI Checks)
    // ==========================================
    try {
        // Parse the EXIF data. We specifically need the standard tags to check Make/Model/Software
        const exifData = await exifr.parse(file, { pick: ['Make', 'Model', 'Software', 'ProcessingSoftware'] });

        if (!exifData) {
            // Highly suspicious: Legitimate camera photos ALWAYS have EXIF data.
            // If it's missing, it's either heavily edited, generated, or a sterile screenshot.
            throw new ImageVerificationError(
                "Verification Failed: No camera metadata found. " +
                "To ensure case authenticity, please upload the original, unedited photo taken directly from your device's camera."
            );
        }

        const software = ((exifData.Software || '') + ' ' + (exifData.ProcessingSoftware || '')).toLowerCase();
        
        // Blocklist of known AI generation engines often found in Metadata tags
        const aiSignatures = [
            'midjourney', 'dall-e', 'dalle', 'stable diffusion', 'comfyui', 
            'automatic1111', 'ai generated', 'bing image creator', 'firefly'
        ];

        for (const sig of aiSignatures) {
            if (software.includes(sig)) {
                throw new ImageVerificationError(
                    "Verification Failed: AI generation footprint detected in image metadata. " +
                    "AI generated images cannot be submitted as legal evidence."
                );
            }
        }

        // Must have some form of hardware identification (Make or Model)
        if (!exifData.Make && !exifData.Model) {
            throw new ImageVerificationError(
                "Verification Failed: Missing hardware signatures. " +
                "The image appears to be a digital composite or screenshot. Please upload the original camera file."
            );
        }

    } catch (err: any) {
        if (err instanceof ImageVerificationError) {
            throw err;
        }
        console.warn("EXIF parsing warning:", err);
        // Exifr might throw on weird formats. We don't want to completely block legitimate but weird edge cases, 
        // so we only strictly block if we explicitly parsed the EXIF and determined it violates our rules.
    }

    // ==========================================
    // PHASE 1.5: GEMINI AI VISUAL VERIFICATION
    // ==========================================
    try {
        const formData = new FormData();
        formData.append("file", file);

        const aiResponse = await fetch("/api/verify-image", {
            method: "POST",
            body: formData
        });

        if (!aiResponse.ok) {
            const errorData = await aiResponse.json();
            throw new Error(errorData.error || "Failed to analyze image with AI");
        }

        const aiResult = await aiResponse.json();
        
        if (aiResult.isAI) {
            throw new ImageVerificationError(
                `Verification Failed: AI generation detected visually. ` +
                `Reasoning from Forensic AI: ${aiResult.reasoning}`
            );
        }

    } catch (err: any) {
        if (err instanceof ImageVerificationError) {
            throw err;
        }
        console.warn("AI Visual Verification failed/skipped:", err);
        throw new ImageVerificationError(`AI Verification Error: ${err.message}`);
    }

    // ==========================================
    // PHASE 2: SCRUBBING (Privacy Protection)
    // ==========================================
    // The user passed verification! Now, to protect them, we actively DESTROY the metadata we just read.
    // By re-encoding the image through a canvas (which is what browser-image-compression uses under the hood 
    // when exifOrientation is true), we guarantee stripping GPS, timestamps, and device fingerprints.
    
    try {
        const options = {
            maxSizeMB: 5, // Ensures files stay within reasonable limits for IFPS
            maxWidthOrHeight: 4096, // Maintains high enough resolution for investigation
            useWebWorker: true,
            exifOrientation: 1 // Crucial: This setting forces the library to strip all EXIF data during compression
        };

        const scrubbedBlob = await imageCompression(file, options);
        
        // Re-wrap the blob as a File object so the rest of the app doesn't know the difference
        // We use a generic naming to avoid leaking the original path/filename context
        return new File([scrubbedBlob], "scrubbed_evidence_" + Date.now() + ".jpg", { 
            type: scrubbedBlob.type || 'image/jpeg' 
        });

    } catch (err: any) {
        throw new Error("Failed to secure image privacy layer: " + err.message);
    }
}
