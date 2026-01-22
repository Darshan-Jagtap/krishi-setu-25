import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Smartphone,
    Mail,
    Lock,
    CreditCard,
    Save,
    CheckCircle2,
    Loader2,
    MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { authAPI } from '@/lib/api';
import { useTranslation } from 'react-i18next';

const Settings = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');

    // User profile data from MongoDB
    const [profileData, setProfileData] = useState({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        role: '',
        created_at: '',
        id: ''
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setIsLoading(true);
            console.log('📊 Loading user data from MongoDB...');

            const response = await authAPI.getCurrentUser();
            const userData = response.user;

            console.log('✅ Loaded user data:', userData);

            setProfileData({
                full_name: userData.full_name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                location: userData.location || '',
                role: userData.role || '',
                created_at: userData.created_at || '',
                id: userData._id || userData.id || ''
            });

            setIsLoading(false);
        } catch (error) {
            console.error('❌ Error loading user data:', error);
            toast({
                title: t('settingsPage.toasts.loadErrorTitle'),
                description: t('settingsPage.toasts.loadErrorDesc'),
                variant: 'destructive'
            });
            setIsLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            console.log('💾 Saving profile data...');

            await authAPI.updateProfile({
                full_name: profileData.full_name,
                phone: profileData.phone,
                location: profileData.location
            });

            console.log('✅ Profile updated successfully');

            toast({
                title: t('settingsPage.toasts.profileUpdatedTitle'),
                description: t('settingsPage.toasts.profileUpdatedDesc')
            });

            setIsSaving(false);
        } catch (error) {
            console.error('❌ Error saving profile:', error);
            toast({
                title: t('settingsPage.toasts.profileUpdateErrorTitle'),
                description: t('settingsPage.toasts.profileUpdateErrorDesc'),
                variant: 'destructive'
            });
            setIsSaving(false);
        }
    };

    const handleSaveNotifications = () => {
        toast({
            title: t('settingsPage.toasts.notificationsSavedTitle'),
            description: t('settingsPage.toasts.notificationsSavedDesc')
        });
    };

    const handleSaveSecurity = () => {
        toast({
            title: t('settingsPage.toasts.securitySavedTitle'),
            description: t('settingsPage.toasts.securitySavedDesc')
        });
    };

    const handleSaveAppearance = () => {
        i18n.changeLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
        toast({
            title: t('settingsPage.toasts.appearanceSavedTitle'),
            description: t('settingsPage.toasts.appearanceSavedDesc')
        });
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">{t('common.loading')}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className='space-y-8 animate-fade-in'>
                <div>
                    <h1 className='text-4xl font-bold text-foreground mb-2 animate-slide-in-left'>{t('settings.title')}</h1>
                    <p className='text-muted-foreground text-lg animate-slide-in-left' style={{ animationDelay: '100ms' }}>
                        {t('settingsPage.subtitle')}
                    </p>
                </div>

                <Tabs defaultValue='profile' className='w-full'>
                    <TabsList className='grid w-full grid-cols-4'>
                        <TabsTrigger value='profile'>{t('settings.profile')}</TabsTrigger>
                        <TabsTrigger value='notifications'>{t('settings.notifications')}</TabsTrigger>
                        <TabsTrigger value='security'>{t('settings.security')}</TabsTrigger>
                        <TabsTrigger value='appearance'>{t('settings.preferences')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value='profile' className='space-y-4 animate-slide-in-up'>
                        <Card className='border-border'>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <User className='w-5 h-5' />
                                    {t('settingsPage.profileCard.title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('settingsPage.profileCard.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div>
                                    <Label htmlFor='full_name'>{t('settingsPage.profileCard.fullName')}</Label>
                                    <Input
                                        id='full_name'
                                        value={profileData.full_name}
                                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                        className='mt-1'
                                    />
                                </div>
                                <div>
                                    <Label htmlFor='email'>{t('settingsPage.profileCard.email')}</Label>
                                    <Input
                                        id='email'
                                        type='email'
                                        value={profileData.email}
                                        disabled
                                        className='mt-1 bg-gray-100 cursor-not-allowed'
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">{t('settingsPage.profileCard.emailNote')}</p>
                                </div>
                                <div>
                                    <Label htmlFor='phone'>{t('settingsPage.profileCard.phoneNumber')}</Label>
                                    <Input
                                        id='phone'
                                        type='tel'
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className='mt-1'
                                    />
                                </div>
                                <div>
                                    <Label htmlFor='location'>{t('settingsPage.profileCard.location')}</Label>
                                    <Input
                                        id='location'
                                        value={profileData.location}
                                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                        className='mt-1'
                                    />
                                </div>
                                <Button onClick={handleSaveProfile} className='gap-2' disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Loader2 className='w-4 h-4 animate-spin' />
                                            {t('settingsPage.profileCard.saving')}
                                        </>
                                    ) : (
                                        <>
                                            <Save className='w-4 h-4' />
                                            {t('settingsPage.profileCard.saveChanges')}
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Account Details Card */}
                        <Card className='border-border'>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Shield className='w-5 h-5' />
                                    {t('settingsPage.accountCard.title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('settingsPage.accountCard.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-3'>
                                <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                                    <span className='text-sm text-muted-foreground'>{t('settingsPage.accountCard.userId')}:</span>
                                    <span className='font-mono text-sm'>{profileData.id}</span>
                                </div>
                                <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                                    <span className='text-sm text-muted-foreground'>{t('settingsPage.accountCard.role')}:</span>
                                    <span className='capitalize font-medium'>{profileData.role}</span>
                                </div>
                                <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                                    <span className='text-sm text-muted-foreground'>{t('settingsPage.accountCard.memberSince')}:</span>
                                    <span className='font-medium'>
                                        {profileData.created_at ? new Date(profileData.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : t('settingsPage.accountCard.notAvailable')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='notifications' className='space-y-4 animate-slide-in-up'>
                        <Card className='border-border'>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Bell className='w-5 h-5' />
                                    {t('settingsPage.notificationsCard.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-6'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='font-medium'>{t('settingsPage.notificationsCard.email')}</p>
                                        <p className='text-sm text-muted-foreground'>{t('settingsPage.notificationsCard.emailDesc')}</p>
                                    </div>
                                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='font-medium'>{t('settingsPage.notificationsCard.push')}</p>
                                        <p className='text-sm text-muted-foreground'>{t('settingsPage.notificationsCard.pushDesc')}</p>
                                    </div>
                                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                                </div>
                                <Button onClick={handleSaveNotifications} className='gap-2'>
                                    <Save className='w-4 h-4' />
                                    {t('settingsPage.notificationsCard.save')}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='security' className='space-y-4 animate-slide-in-up'>
                        <Card className='border-border'>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Shield className='w-5 h-5' />
                                    {t('settingsPage.securityCard.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-6'>
                                <div>
                                    <Label htmlFor='currentPassword'>{t('settingsPage.securityCard.currentPassword')}</Label>
                                    <Input id='currentPassword' type='password' className='mt-1' />
                                </div>
                                <div>
                                    <Label htmlFor='newPassword'>{t('settingsPage.securityCard.newPassword')}</Label>
                                    <Input id='newPassword' type='password' className='mt-1' />
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='font-medium'>{t('settingsPage.securityCard.twoFactor')}</p>
                                        <p className='text-sm text-muted-foreground'>{t('settingsPage.securityCard.twoFactorDesc')}</p>
                                    </div>
                                    <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                                </div>
                                <Button onClick={handleSaveSecurity} className='gap-2'>
                                    <Save className='w-4 h-4' />
                                    {t('settingsPage.securityCard.update')}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='appearance' className='space-y-4 animate-slide-in-up'>
                        <Card className='border-border'>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Palette className='w-5 h-5' />
                                    {t('settingsPage.appearanceCard.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-6'>
                                <div>
                                    <Label htmlFor='theme'>{t('settingsPage.appearanceCard.theme')}</Label>
                                    <Select defaultValue='light'>
                                        <SelectTrigger className='mt-1'>
                                            <SelectValue placeholder={t('settings.theme')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='light'>{t('settings.lightMode')}</SelectItem>
                                            <SelectItem value='dark'>{t('settings.darkMode')}</SelectItem>
                                            <SelectItem value='system'>{t('settingsPage.appearanceCard.system')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor='language'>{t('settingsPage.appearanceCard.language')}</Label>
                                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                        <SelectTrigger className='mt-1'>
                                            <SelectValue placeholder={t('settings.language')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='en'>English</SelectItem>
                                            <SelectItem value='hi'>हिन्दी (Hindi)</SelectItem>
                                            <SelectItem value='mr'>मराठी (Marathi)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {t('settingsPage.appearanceCard.selectedLanguageLabel')}: {selectedLanguage === 'en' ? 'English' : selectedLanguage === 'hi' ? 'हिन्दी' : 'मराठी'}
                                    </p>
                                </div>
                                <Button onClick={handleSaveAppearance} className='gap-2'>
                                    <Save className='w-4 h-4' />
                                    {t('settingsPage.appearanceCard.save')}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
