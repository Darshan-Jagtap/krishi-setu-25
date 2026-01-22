import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
    Sprout,
    TrendingUp,
    Shield,
    DollarSign,
    Award,
    Users,
    ArrowRight,
    ExternalLink,
    CheckCircle,
    Leaf,
    Target,
    Building,
} from 'lucide-react';

const GovernmentSchemes = () => {
    const { t } = useTranslation();

    const schemes = [
        {
            id: 1,
            icon: Sprout,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop',
            titleKey: 'schemes.nmeo.title',
            descriptionKey: 'schemes.nmeo.description',
            budgetKey: 'schemes.nmeo.budget',
            durationKey: 'schemes.nmeo.duration',
            benefitsKey: 'schemes.nmeo.benefits',
            benefits: [
                'schemes.nmeo.benefit1',
                'schemes.nmeo.benefit2',
                'schemes.nmeo.benefit3',
            ],
            targetKey: 'schemes.nmeo.target',
            link: 'https://nmeo.dac.gov.in/',
        },
        {
            id: 2,
            icon: Leaf,
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop',
            titleKey: 'schemes.freeSeeds.title',
            descriptionKey: 'schemes.freeSeeds.description',
            benefitsKey: 'schemes.freeSeeds.benefits',
            benefits: [
                'schemes.freeSeeds.benefit1',
                'schemes.freeSeeds.benefit2',
                'schemes.freeSeeds.benefit3',
            ],
            targetKey: 'schemes.freeSeeds.target',
            link: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2149708&reg=3&lang=2',
        },
        {
            id: 3,
            icon: Shield,
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop',
            titleKey: 'schemes.pmfby.title',
            descriptionKey: 'schemes.pmfby.description',
            benefitsKey: 'schemes.pmfby.benefits',
            benefits: [
                'schemes.pmfby.benefit1',
                'schemes.pmfby.benefit2',
                'schemes.pmfby.benefit3',
            ],
            targetKey: 'schemes.pmfby.target',
            link: 'https://pmfby.gov.in/',
        },
        {
            id: 4,
            icon: DollarSign,
            color: 'from-orange-500 to-red-600',
            bgColor: 'bg-orange-50',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop',
            titleKey: 'schemes.msp.title',
            descriptionKey: 'schemes.msp.description',
            budgetKey: 'schemes.msp.budget',
            benefitsKey: 'schemes.msp.benefits',
            benefits: [
                'schemes.msp.benefit1',
                'schemes.msp.benefit2',
                'schemes.msp.benefit3',
            ],
            targetKey: 'schemes.msp.target',
            link: 'https://www.drishtiias.com/daily-updates/daily-news-analysis/pradhan-mantri-fasal-bima-yojana-pmfby-1',
        },
        {
            id: 5,
            icon: Building,
            color: 'from-teal-500 to-green-600',
            bgColor: 'bg-teal-50',
            iconBg: 'bg-teal-100',
            iconColor: 'text-teal-600',
            image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop',
            titleKey: 'schemes.state.title',
            descriptionKey: 'schemes.state.description',
            benefitsKey: 'schemes.state.benefits',
            benefits: [
                'schemes.state.benefit1',
                'schemes.state.benefit2',
                'schemes.state.benefit3',
            ],
            targetKey: 'schemes.state.target',
            link: 'https://www.myscheme.gov.in/',
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-background to-green-50/30">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-block px-6 py-2 mb-4 rounded-full border border-primary/30 bg-primary/5">
                        <span className="text-primary font-medium tracking-wide flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            {t('schemes.badge')}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        {t('schemes.title')}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        {t('schemes.subtitle')}
                    </p>
                </div>

                {/* Schemes Grid - 3 per row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {schemes.map((scheme, index) => {
                        const Icon = scheme.icon;
                        return (
                            <Card
                                key={scheme.id}
                                className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 animate-slide-in group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Image Section */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={scheme.image}
                                        alt={t(scheme.titleKey)}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-br ${scheme.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                                    <div className="absolute top-3 left-3">
                                        <div className={`${scheme.iconBg} p-3 rounded-full shadow-lg`}>
                                            <Icon className={`w-6 h-6 ${scheme.iconColor}`} />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 right-3">
                                        <Badge className="bg-white/90 text-foreground border-0 text-xs px-2 py-1">
                                            #{scheme.id}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className={`${scheme.bgColor} p-5`}>
                                    <CardHeader className="p-0 mb-3">
                                        <CardTitle className="text-lg font-bold mb-2 line-clamp-2">
                                            {t(scheme.titleKey)}
                                        </CardTitle>
                                        <CardDescription className="text-sm text-foreground/80 line-clamp-2">
                                            {t(scheme.descriptionKey)}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="p-0 space-y-3">
                                        {/* Budget & Duration */}
                                        {scheme.budgetKey && (
                                            <div className="flex items-center gap-1 text-xs">
                                                <DollarSign className="w-3 h-3 text-green-600" />
                                                <span className="font-semibold text-green-600">{t(scheme.budgetKey)}</span>
                                            </div>
                                        )}
                                        {scheme.durationKey && (
                                            <div className="flex items-center gap-1 text-xs">
                                                <Target className="w-3 h-3 text-blue-600" />
                                                <span className="text-blue-600 font-medium">{t(scheme.durationKey)}</span>
                                            </div>
                                        )}

                                        {/* Benefits - Compact */}
                                        <div>
                                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                {t(scheme.benefitsKey)}
                                            </h4>
                                            <ul className="space-y-1">
                                                {scheme.benefits.slice(0, 3).map((benefit, idx) => (
                                                    <li key={idx} className="flex items-start gap-1 text-xs">
                                                        <ArrowRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                                                        <span className="line-clamp-2">{t(benefit)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Action Button */}
                                        <Button
                                            size="sm"
                                            className={`w-full bg-gradient-to-r ${scheme.color} text-white hover:shadow-lg transition-all text-xs`}
                                            onClick={() => window.open(scheme.link, '_blank')}
                                        >
                                            {t('schemes.learnMore')}
                                            <ExternalLink className="w-3 h-3 ml-1" />
                                        </Button>
                                    </CardContent>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Call to Action */}
                <div className="text-center animate-fade-in">
                    <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
                        <CardContent className="p-8">
                            <Users className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">{t('schemes.cta.title')}</h3>
                            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                                {t('schemes.cta.description')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="gap-2"
                                    onClick={() => window.open('https://www.myscheme.gov.in/', '_blank')}
                                >
                                    <Award className="w-5 h-5" />
                                    {t('schemes.cta.applyNow')}
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                                    onClick={() => window.open('https://www.myscheme.gov.in/', '_blank')}
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    {t('schemes.cta.visitPortal')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default GovernmentSchemes;
