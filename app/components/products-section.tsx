import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function ProductsSection() {
    const products = [
        {
            title: 'OrtoClub TEOT',
            description: 'Técnica exclusiva de ortodontia com resultados comprovados',
            icon: '📋'
        },
        {
            title: 'OrtoBrand',
            description: 'Construa sua marca pessoal no mercado ortodôntico',
            icon: '🎯'
        },
        {
            title: 'Mentoria',
            description: 'Acompanhamento personalizado com especialistas',
            icon: '🎓'
        },
        {
            title: 'Curso Convencional',
            description: 'Base sólida em ortodontia convencional',
            icon: '📚'
        }
    ];

    return (
        <section id="produtos" className="py-20 px-4 bg-muted/50">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-4">
                    <span style={{ color: 'var(--blue-brand)' }}>PRODUTOS</span>
                </h2>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Soluções completas para sua carreira na ortodontia
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <Card
                            key={index}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardHeader>
                                <div className="text-5xl mb-2">{product.icon}</div>
                                <CardTitle>{product.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    {product.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
