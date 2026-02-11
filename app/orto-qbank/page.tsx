import Cta1Section from "./_components/cta1-section";
import Hero1Section from "./_components/hero1-section";
import Video1Section from "./_components/video1-section";

export default function OrtoQbank() {
    return (
        <div>
            <Hero1Section />
            <Video1Section />
            <Cta1Section />

            <footer className="bg-brand-blue mt-auto py-4 text-white">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2026 OrtoClub. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
