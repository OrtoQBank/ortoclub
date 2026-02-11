'use client';

import Cta2Section from "./_components/cta2-section";
import Hero2Section from "./_components/hero2-section";
import Video2Section from "./_components/video2-section";

export default function TeotVideo() {
    return (
        <div>
            <Hero2Section />
            <Video2Section />
            <Cta2Section />

            <footer className="bg-brand-blue mt-auto py-4 text-white">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2026 OrtoClub. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
