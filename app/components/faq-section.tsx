import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQ() {
    const faqs = [
        {
            question: 'O que é o OrtoClub TEOT?',
            answer: (
                <div className="space-y-2">
                    <p>
                        O OrtoClub TEOT é a nossa plataforma de ortopedia, desenvolvida para
                        apoiar o residente em toda sua formação.
                    </p>
                    <p>
                        As aulas são ministradas por um time com mais de 10 especialistas
                        da USP, professores com experiência em ensino médico e formação de
                        residentes, unindo base teórica sólida, prática clínica e foco em
                        prova.
                    </p>
                </div>
            ),
        },
        {
            question: 'Qual a diferença entre OrtoClub TEOT, OrtoQBank e o Extensivo?',
            answer: (
                <div className="space-y-2">
                    <p>
                        <strong>OrtoQBank:</strong> treinamento por questões comentadas, com
                        foco em repetição, revisão e desempenho.
                    </p>
                    <p>
                        <strong>OrtoClub TEOT:</strong> formação teórica completa em aulas,
                        organizada por temas e subespecialidades.
                    </p>
                    <p>
                        <strong>Extensivo TEOT:</strong> programa completo que integra aulas
                        + questões + método, ideal para quem quer uma preparação estruturada
                        e contínua até a prova.
                    </p>
                    <p className="font-medium text-brand-blue">
                        👉 O Extensivo é a forma mais completa de se preparar para o TEOT.
                    </p>
                </div>
            ),
        },
        {
            question: 'Para quem o Extensivo TEOT é indicado?',
            answer: (
                <div className="space-y-2">
                    <p>
                        O Extensivo TEOT é indicado para residentes de Ortopedia (R1, R2 e
                        R3) e médicos que desejam uma preparação de longo prazo, com método,
                        consistência e foco total na aprovação.
                    </p>
                    <p>É especialmente recomendado para quem:</p>
                    <ul className="list-disc space-y-1 pl-5">
                        <li>quer evitar estudo desorganizado ou tardio</li>
                        <li>busca acompanhamento por desempenho</li>
                        <li>deseja chegar no dia da prova com segurança e alto rendimento</li>
                    </ul>
                </div>
            ),
        },
        {
            question: 'O método do Extensivo realmente funciona?',
            answer: (
                <div className="space-y-2">
                    <p>
                        Sim. O método foi construído a partir da experiência prática e
                        acadêmica dos fundadores e professores do OrtoClub, com resultados
                        comprovados na prova, incluindo 1º, 4º e 7º lugares no TEOT.
                    </p>
                    <p>
                        Além disso, o Extensivo une formação teórica, treino intensivo por
                        questões e análise de desempenho, exatamente no formato exigido pela
                        banca — o que torna o estudo mais eficiente e direcionado.
                    </p>
                </div>
            ),
        },
        {
            question: 'Quais são as formas de pagamento?',
            answer: (
                <div className="space-y-2">
                    <p>
                        Todos os nossos cursos podem ser pagos à vista ou parcelados em até
                        12x sem juros no cartão de crédito.
                    </p>
                    <p>
                        Isso permite que você invista na sua preparação de forma planejada,
                        diluindo o valor ao longo do ano, sem custo adicional, enquanto já
                        tem acesso completo a todo o conteúdo desde o primeiro dia.
                    </p>
                </div>
            ),
        },
        {
            question: 'Como é organizado o banco de questões?',
            answer: (
                <div className="space-y-2">
                    <p>O banco de questões possui 3 áreas:</p>
                    <ol className="list-decimal space-y-1 pl-5">
                        <li>
                            Trilhas de estudo: questões inéditas feitas por especialistas da
                            USP para sedimentar seu aprendizado
                        </li>
                        <li>
                            Simulados: tenha acesso à provas antigas do TARO, TEOT e simulados
                            inéditos com gabaritos diferenciados
                        </li>
                        <li>
                            Testes personalizados: utilize nossa plataforma inteligente para
                            filtrar e criar testes de acordo com suas necessidades
                        </li>
                    </ol>
                    <p>
                        Além disso, você terá acesso à uma área de feedback contínuo
                        adaptada para o seu perfil
                    </p>
                </div>
            ),
        },
        {
            question: 'O que é um modelo QBANK?',
            answer: (
                <div className="space-y-2">
                    <p>
                        O OrtoQBank, ou banco de questões, é um sistema diferente do
                        tradicional que utiliza as questões da prova e questões inéditas
                        para ensinar conceitos fundamentais ao estudante. Com gabaritos
                        diferenciados, nosso objetivo é ter um banco de questões diferente
                        dos disponíveis no mercado. A cada questão, você vai aprender
                        detalhadamente sobre os temas.
                    </p>
                    <p>
                        Esse método é validado nas provas mais importantes da medicina no
                        mundo, como o USMLE e as provas de residência médica.
                    </p>
                </div>
            ),
        },
        {
            question: 'As questões são atualizadas com que frequência?',
            answer: (
                <ul className="list-disc space-y-1 pl-5">

                    <li>As questões são atualizadas semanalmente com novos gabaritos completos.</li>
                </ul>
            ),
        },
        {
            question: 'Qual o público alvo?',
            answer: (
                <div className="space-y-2">
                    <p>
                        O OrtoClub é para todos os residentes de ortopedia que desejam uma
                        preparação diferenciada e com método validado para o TEOT.
                    </p>
                    <p>Direcionado para R1, R2, R3 e TEOT/TEPOT.</p>
                </div>
            ),
        },
        {
            question: 'Como funciona a garantia?',
            answer: (
                <div className="space-y-2">
                    <p>
                        É garantido ao consumidor um período de testes. Se por algum motivo
                        você não gostar do curso, envie um e-mail para o suporte
                        (ortoqbank@gmail.com) dentro do período de 7 dias e devolvemos seu
                        investimento.
                    </p>
                </div>
            ),
        },
        {
            question: 'Onde tiro minhas dúvidas?',
            answer: (
                <div className="space-y-2">
                    <p>
                        Pelo nosso perfil oficial do instagram @orto.club Suporte via e-mail
                        ortoqbank@gmail.com
                    </p>
                </div>
            ),
        },
        {
            question: 'Qual a duração do acesso?',
            answer: (
                <div className="space-y-2">
                    <p>A duração do acesso é anual.</p>
                    <p>
                        Ao adquirir um plano, você terá acesso completo ao conteúdo até a próxima edição do TEOT/TEPOT correspondente ao seu ciclo de preparação.
                    </p>
                </div>
            ),
        },
        {
            question: 'Posso dividir meu acesso?',
            answer: (
                <div className="space-y-2">
                    <p>
                        O OrtoClub contém um cursos individual. A plataforma dá feedback baseado
                        no desempenho do aluno, e portanto não é recomendado ou permitido o
                        compartilhamento de acesso.
                    </p>
                </div>
            ),
        },
        {
            question: 'Grupos de residentes têm desconto?',
            answer: (
                <div className="space-y-2">
                    <p>
                        Sim, junte seus colegas e entre em contato conosco pelo instagram
                        (@orto.club) ou e-mail oficial (ortoqbank@gmail.com) para adquirir
                        condições especiais.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <section id="faq" className="py-12 md:py-16 bg-blue-50">
            <div className="container mx-auto  px-4">
                <h2 className="text-3xl font-bold md:text-4xl mb-8 md:mb-12 text-center text-brand-blue">
                    Perguntas Frequentes
                </h2>
                <div className="mx-auto max-w-3xl">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border-brand-blue/10 border-b"
                            >
                                <AccordionTrigger className="hover:text-brand-blue text-left">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
