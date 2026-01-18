import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function MethodologySection() {
    const steps = [
        {
            number: '1',
            title: 'Fundamentos Teóricos',
            description: 'Base sólida com conceitos atualizados da ortodontia moderna'
        },
        {
            number: '2',
            title: 'Prática Intensiva',
            description: 'Aplicação prática dos conhecimentos em casos reais'
        },
        {
            number: '3',
            title: 'Mentoria Personalizada',
            description: 'Acompanhamento individual para acelerar seu desenvolvimento'
        },
        {
            number: '4',
            title: 'Networking',
            description: 'Conexão com profissionais de todo o Brasil'
        }
    ];

    return (
        <section id="metodologia" className="py-20 px-4">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-4">
                    <span style={{ color: 'var(--blue-brand)' }}>METODOLOGIA</span>
                </h2>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Nossa abordagem única combina teoria, prática e acompanhamento contínuo
                </p>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        {steps.map((step) => (
                            <Card key={step.number} className="border-l-4" style={{ borderLeftColor: 'var(--blue-brand)' }}>
                                <CardContent className="flex gap-4 p-6">
                                    <Badge
                                        className="shrink-0 w-12 h-12 flex items-center justify-center text-lg font-bold"
                                        style={{ backgroundColor: 'var(--blue-brand)' }}
                                    >
                                        {step.number}
                                    </Badge>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--blue-brand)' }} />
                                            {step.title}
                                        </h3>
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="bg-muted rounded-2xl p-8 min-h-[500px] flex items-center justify-center">
                            <div className="space-y-8">
                                <div className="flex gap-4 items-center">
                                    <Card className="w-32 h-32 transform -rotate-6 shadow-md" />
                                    <Card className="w-32 h-32 transform rotate-6 shadow-md" />
                                </div>
                                <div className="flex gap-4 items-center justify-center">
                                    <Card className="w-32 h-32 transform rotate-3 shadow-md" />
                                    <Card className="w-32 h-32 transform -rotate-3 shadow-md" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
