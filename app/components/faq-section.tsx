import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function FaqSection() {
    const faqs = [
        {
            question: 'Qual é a duração do curso?',
            answer: 'O curso tem duração de 18 meses, com aulas mensais e conteúdo online disponível 24/7. Você terá acesso vitalício ao material didático.'
        },
        {
            question: 'Preciso de experiência prévia em ortodontia?',
            answer: 'Sim, o curso é destinado a cirurgiões-dentistas formados. Aceitamos tanto recém-formados quanto profissionais experientes que desejam se especializar.'
        },
        {
            question: 'Qual é a metodologia de ensino?',
            answer: 'Combinamos aulas presenciais intensivas, plataforma online com casos clínicos, mentoria individual e grupo de estudos para maximizar seu aprendizado.'
        },
        {
            question: 'Há certificação ao final do curso?',
            answer: 'Sim, você receberá certificado reconhecido de conclusão do curso OrtoClub TEOT, validando suas habilidades na técnica exclusiva.'
        },
        {
            question: 'Posso parcelar o investimento?',
            answer: 'Sim, oferecemos diversas opções de parcelamento e condições especiais para pagamento à vista. Entre em contato para conhecer nossos planos.'
        },
        {
            question: 'Como funciona a mentoria?',
            answer: 'Cada aluno tem sessões individuais mensais com um mentor dedicado, além de acompanhamento dos casos clínicos via plataforma e grupo VIP.'
        }
    ];

    return (
        <section id="faq" className="py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <h2 className="text-4xl font-bold text-center mb-4">
                    <span style={{ color: 'var(--blue-brand)' }}>FAQ</span>
                </h2>
                <p className="text-center text-muted-foreground mb-12">
                    Perguntas frequentes sobre nossos cursos e metodologia
                </p>

                <Card className="p-6">
                    <Accordion type="single" collapsible defaultValue="item-0">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </Card>

                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Ainda tem dúvidas?</p>
                    <Button
                        size="lg"
                        style={{ backgroundColor: 'var(--blue-brand)' }}
                        className="hover:opacity-90"
                    >
                        Entre em Contato
                    </Button>
                </div>
            </div>
        </section>
    );
}
