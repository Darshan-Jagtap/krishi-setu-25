import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, ShoppingCart, Package, TrendingUp } from 'lucide-react';

/**
 * Example component demonstrating how to use i18n translations
 * This can be used as a reference for implementing translations in other components
 */
export const MultilingualExample = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 p-6">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
                <p className="text-muted-foreground">{t('dashboard.overview')}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('dashboard.totalRevenue')}
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹45,231</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% {t('dashboard.thisMonth')}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('dashboard.totalOrders')}
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% {t('dashboard.lastMonth')}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('dashboard.activeListings')}
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">
                            +19% {t('dashboard.thisMonth')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {t('marketplace.buyNow')}
                </Button>
                <Button variant="outline">
                    <Package className="mr-2 h-4 w-4" />
                    {t('listings.addListing')}
                </Button>
            </div>

            {/* Marketplace Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        {t('marketplace.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">{t('marketplace.searchProducts')}</label>
                        <input
                            type="text"
                            placeholder={t('marketplace.searchProducts')}
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">{t('marketplace.category')}</label>
                            <select className="w-full mt-1 px-3 py-2 border rounded-md">
                                <option>{t('common.select')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">{t('marketplace.priceRange')}</label>
                            <select className="w-full mt-1 px-3 py-2 border rounded-md">
                                <option>{t('common.select')}</option>
                            </select>
                        </div>
                    </div>

                    <Button className="w-full">
                        {t('common.search')}
                    </Button>
                </CardContent>
            </Card>

            {/* Common Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('dashboard.quickActions')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Button variant="outline" size="sm">{t('common.save')}</Button>
                        <Button variant="outline" size="sm">{t('common.edit')}</Button>
                        <Button variant="outline" size="sm">{t('common.delete')}</Button>
                        <Button variant="outline" size="sm">{t('common.cancel')}</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Usage Instructions */}
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-blue-900 dark:text-blue-100">
                        How to Use Translations
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                    <p>1. Import: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">import &#123; useTranslation &#125; from 'react-i18next';</code></p>
                    <p>2. Use hook: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">const &#123; t &#125; = useTranslation();</code></p>
                    <p>3. Translate: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">&#123;t('section.key')&#125;</code></p>
                    <p className="mt-4 font-semibold">Available languages: English, हिन्दी (Hindi), मराठी (Marathi)</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default MultilingualExample;
