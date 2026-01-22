import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Tractor, Factory, ShoppingCart, ArrowRight, User, Mail, Lock, Phone, MapPin, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

type UserRole = 'farmer' | 'processor' | 'buyer' | 'fpo';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    location: '',
    farmSize: '',
    farmSizeUnit: 'acres',
    harvestTypes: '',
    experience: '',
    businessType: '',
    companySize: '',
    // FPO-specific fields
    fpoRegistrationNumber: '',
    fpoName: '',
    fpoMembersCount: '',
    fpoEstablishmentYear: ''
  });

  const roleOptions = [
    {
      value: 'farmer' as UserRole,
      label: t('authPage.roles.farmer.title'),
      icon: Tractor,
      description: t('authPage.roles.farmer.description'),
      color: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700',
      iconColor: 'text-green-600'
    },
    {
      value: 'fpo' as UserRole,
      label: t('authPage.roles.fpo.title'),
      icon: Users,
      description: t('authPage.roles.fpo.description'),
      color: 'bg-teal-50 border-teal-200 hover:bg-teal-100 text-teal-700',
      iconColor: 'text-teal-600'
    },
    {
      value: 'processor' as UserRole,
      label: t('authPage.roles.processor.title'),
      icon: Factory,
      description: t('authPage.roles.processor.description'),
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      value: 'buyer' as UserRole,
      label: t('authPage.roles.buyer.title'),
      icon: ShoppingCart,
      description: t('authPage.roles.buyer.description'),
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700',
      iconColor: 'text-purple-600'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast({
        title: t('authPage.toasts.roleRequired.title'),
        description: t('authPage.toasts.roleRequired.description'),
        variant: "destructive"
      });
      return;
    }

    if (authMode === 'signup') {
      if (!formData.fullName || !formData.phone || !formData.location) {
        toast({
          title: t('authPage.toasts.basicInfo.title'),
          description: t('authPage.toasts.basicInfo.description'),
          variant: "destructive"
        });
        return;
      }

      if ((selectedRole === 'farmer' || selectedRole === 'fpo') && (!formData.farmSize || !formData.harvestTypes || !formData.experience)) {
        toast({
          title: t('authPage.toasts.farmerInfo.title', { role: selectedRole === 'fpo' ? t('authPage.roles.fpo.title') : t('authPage.roles.farmer.title') }),
          description: t('authPage.toasts.farmerInfo.description'),
          variant: "destructive"
        });
        return;
      }

      if (selectedRole === 'fpo' && (!formData.fpoRegistrationNumber || !formData.fpoName)) {
        toast({
          title: 'FPO Information Required',
          description: 'Please provide FPO registration number and FPO name',
          variant: "destructive"
        });
        return;
      }

      if (selectedRole === 'processor' && (!formData.businessType || !formData.companySize)) {
        toast({
          title: t('authPage.toasts.processorInfo.title'),
          description: t('authPage.toasts.processorInfo.description'),
          variant: "destructive"
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        // Call MongoDB backend API for registration
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            full_name: formData.fullName,
            phone: formData.phone,
            location: formData.location,
            role: selectedRole,
            // Include FPO-specific fields if role is FPO
            ...(selectedRole === 'fpo' && {
              fpo_registration_number: formData.fpoRegistrationNumber,
              fpo_name: formData.fpoName,
              fpo_members_count: formData.fpoMembersCount ? parseInt(formData.fpoMembersCount) : undefined,
              fpo_establishment_year: formData.fpoEstablishmentYear ? parseInt(formData.fpoEstablishmentYear) : undefined
            })
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Registration failed');
        }

        const data = await response.json();

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userData', JSON.stringify(data.user));

        toast({
          title: t('authPage.toasts.signupSuccess.title'),
          description: t('authPage.toasts.signupSuccess.description', { role: roleOptions.find(r => r.value === selectedRole)?.label || selectedRole })
        });

        // Redirect based on role
        if (data.user.role === 'buyer') {
          navigate('/marketplace');
        } else if (data.user.role === 'fpo') {
          navigate('/fpo');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Call MongoDB backend API for login
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userData', JSON.stringify(data.user));

        toast({
          title: t('authPage.toasts.signinSuccess.title'),
          description: t('authPage.toasts.signinSuccess.description', { role: roleOptions.find(r => r.value === data.user.role as UserRole)?.label || data.user.role })
        });

        // Redirect based on role
        if (data.user.role === 'buyer') {
          navigate('/marketplace');
        } else if (data.user.role === 'fpo') {
          navigate('/fpo');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">KRISHI-SETU</h1>
          <p className="text-lg text-gray-600">{t('authPage.header.subtitle')}</p>
        </div>

        {/* Role Selection */}
        {!selectedRole && (
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('authPage.roleSelect.title')}</CardTitle>
              <CardDescription>{t('authPage.roleSelect.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  return (
                    <Card
                      key={role.value}
                      className={`cursor-pointer transition-all duration-200 ${role.color}`}
                      onClick={() => handleRoleSelect(role.value)}
                    >
                      <CardContent className="p-6 text-center">
                        <Icon className={`w-12 h-12 mx-auto mb-4 ${role.iconColor}`} />
                        <h3 className="text-lg font-semibold mb-2">{role.label}</h3>
                        <p className="text-sm opacity-80">{role.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Authentication Form */}
        {selectedRole && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Role Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {(() => {
                    const Icon = roleOptions.find(r => r.value === selectedRole)?.icon || User;
                    return <Icon className={`w-6 h-6 ${roleOptions.find(r => r.value === selectedRole)?.iconColor}`} />;
                  })()}
                  {t('authPage.roleSummary.title', { role: roleOptions.find(r => r.value === selectedRole)?.label })}
                </CardTitle>
                <CardDescription>
                  {roleOptions.find(r => r.value === selectedRole)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">{t('authPage.roleSummary.accessTitle')}</h4>
                    <ul className="text-sm space-y-1">
                      {selectedRole === 'farmer' && (
                        <>
                          <li>• {t('authPage.roleSummary.farmer.item1')}</li>
                          <li>• {t('authPage.roleSummary.farmer.item2')}</li>
                          <li>• {t('authPage.roleSummary.farmer.item3')}</li>
                          <li>• {t('authPage.roleSummary.farmer.item4')}</li>
                        </>
                      )}
                      {selectedRole === 'fpo' && (
                        <>
                          <li>• {t('authPage.roleSummary.fpo.item1')}</li>
                          <li>• {t('authPage.roleSummary.fpo.item2')}</li>
                          <li>• {t('authPage.roleSummary.fpo.item3')}</li>
                          <li>• {t('authPage.roleSummary.fpo.item4')}</li>
                        </>
                      )}
                      {selectedRole === 'processor' && (
                        <>
                          <li>• {t('authPage.roleSummary.processor.item1')}</li>
                          <li>• {t('authPage.roleSummary.processor.item2')}</li>
                          <li>• {t('authPage.roleSummary.processor.item3')}</li>
                          <li>• {t('authPage.roleSummary.processor.item4')}</li>
                        </>
                      )}
                      {selectedRole === 'buyer' && (
                        <>
                          <li>• {t('authPage.roleSummary.buyer.item1')}</li>
                          <li>• {t('authPage.roleSummary.buyer.item2')}</li>
                          <li>• {t('authPage.roleSummary.buyer.item3')}</li>
                          <li>• {t('authPage.roleSummary.buyer.item4')}</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRole(null)}
                    className="w-full"
                  >
                    {t('authPage.roleSummary.changeRole')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Auth Form */}
            <Card>
              <CardHeader>
                <CardTitle>{authMode === 'signup' ? t('authPage.form.titleSignup') : t('authPage.form.titleSignin')}</CardTitle>
                <CardDescription>
                  {authMode === 'signup'
                    ? t('authPage.form.subtitleSignup')
                    : t('authPage.form.subtitleSignin')
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'signin' | 'signup')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
                    <TabsTrigger value="signin">{t('auth.signIn')}</TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <TabsContent value="signup" className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">{t('authPage.form.fullName')}</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="fullName"
                            type="text"
                            placeholder={t('authPage.form.fullNamePlaceholder')}
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">{t('auth.email')}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder={t('authPage.form.emailPlaceholder')}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="password">{t('auth.password')}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            placeholder={t('authPage.form.passwordPlaceholder')}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">{t('authPage.form.phone')}</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder={t('authPage.form.phonePlaceholder')}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="location">{t('authPage.form.location')}</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="location"
                            type="text"
                            placeholder={t('authPage.form.locationPlaceholder')}
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      {/* Farmer and FPO-specific fields */}
                      {(selectedRole === 'farmer' || selectedRole === 'fpo') && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="farmSize">{t('authPage.form.farmSize')}</Label>
                              <Input
                                id="farmSize"
                                type="number"
                                placeholder={t('authPage.form.farmSizePlaceholder')}
                                value={formData.farmSize}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  if (value <= 100000) {
                                    setFormData({ ...formData, farmSize: e.target.value });
                                  }
                                }}
                                onInput={(e) => {
                                  const input = e.target as HTMLInputElement;
                                  const value = parseInt(input.value) || 0;
                                  if (value > 100000) {
                                    input.value = '100000';
                                    setFormData({ ...formData, farmSize: '100000' });
                                  }
                                }}
                                min="0"
                                max="100000"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="farmSizeUnit">{t('authPage.form.farmSizeUnit')}</Label>
                              <Select value={formData.farmSizeUnit} onValueChange={(value) => setFormData({ ...formData, farmSizeUnit: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('authPage.form.unitPlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="acres">{t('authPage.form.unit.acres')}</SelectItem>
                                  <SelectItem value="hectares">{t('authPage.form.unit.hectares')}</SelectItem>
                                  <SelectItem value="bigha">{t('authPage.form.unit.bigha')}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="harvestTypes">{t('authPage.form.harvest')}</Label>
                            <Input
                              id="harvestTypes"
                              type="text"
                              placeholder={t('authPage.form.harvestPlaceholder')}
                              value={formData.harvestTypes}
                              onChange={(e) => setFormData({ ...formData, harvestTypes: e.target.value })}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="experience">{t('authPage.form.experience')}</Label>
                            <Input
                              id="experience"
                              type="number"
                              placeholder={t('authPage.form.experiencePlaceholder')}
                              value={formData.experience}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                if (value <= 100) {
                                  setFormData({ ...formData, experience: e.target.value });
                                }
                              }}
                              onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                const value = parseInt(input.value) || 0;
                                if (value > 100) {
                                  input.value = '100';
                                  setFormData({ ...formData, experience: '100' });
                                }
                              }}
                              min="0"
                              max="100"
                              required
                            />
                          </div>

                          {/* FPO-specific additional fields */}
                          {selectedRole === 'fpo' && (
                            <>
                              <div>
                                <Label htmlFor="fpoRegistrationNumber">FPO Registration Number *</Label>
                                <Input
                                  id="fpoRegistrationNumber"
                                  type="text"
                                  placeholder="e.g., FPO/2024/12345"
                                  value={formData.fpoRegistrationNumber}
                                  onChange={(e) => setFormData({ ...formData, fpoRegistrationNumber: e.target.value })}
                                  required
                                />
                              </div>

                              <div>
                                <Label htmlFor="fpoName">FPO Name *</Label>
                                <Input
                                  id="fpoName"
                                  type="text"
                                  placeholder="e.g., Green Valley Farmers Producer Organization"
                                  value={formData.fpoName}
                                  onChange={(e) => setFormData({ ...formData, fpoName: e.target.value })}
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="fpoMembersCount">Number of Members</Label>
                                  <Input
                                    id="fpoMembersCount"
                                    type="number"
                                    placeholder="e.g., 50"
                                    min="1"
                                    max="100000"
                                    value={formData.fpoMembersCount}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value) || 0;
                                      if (value <= 100000) {
                                        setFormData({ ...formData, fpoMembersCount: e.target.value });
                                      }
                                    }}
                                    onInput={(e) => {
                                      const input = e.target as HTMLInputElement;
                                      const value = parseInt(input.value) || 0;
                                      if (value > 100000) {
                                        input.value = '100000';
                                        setFormData({ ...formData, fpoMembersCount: '100000' });
                                      }
                                    }}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="fpoEstablishmentYear">Establishment Year</Label>
                                  <Input
                                    id="fpoEstablishmentYear"
                                    type="number"
                                    placeholder="e.g., 2020"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    value={formData.fpoEstablishmentYear}
                                    onChange={(e) => setFormData({ ...formData, fpoEstablishmentYear: e.target.value })}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {/* Processor-specific fields */}
                      {selectedRole === 'processor' && (
                        <>
                          <div>
                            <Label htmlFor="businessType">{t('authPage.form.businessType')}</Label>
                            <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder={t('authPage.form.businessTypePlaceholder')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="oil-extraction">{t('authPage.form.businessTypeOption.oilExtraction')}</SelectItem>
                                <SelectItem value="food-processing">{t('authPage.form.businessTypeOption.foodProcessing')}</SelectItem>
                                <SelectItem value="grain-milling">{t('authPage.form.businessTypeOption.grainMilling')}</SelectItem>
                                <SelectItem value="other">{t('authPage.form.businessTypeOption.other')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="companySize">{t('authPage.form.companySize')}</Label>
                            <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder={t('authPage.form.companySizePlaceholder')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">{t('authPage.form.companySizeOption.small')}</SelectItem>
                                <SelectItem value="medium">{t('authPage.form.companySizeOption.medium')}</SelectItem>
                                <SelectItem value="large">{t('authPage.form.companySizeOption.large')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </TabsContent>

                    <TabsContent value="signin" className="space-y-4">
                      <div>
                        <Label htmlFor="signin-email">{t('auth.email')}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder={t('authPage.form.emailPlaceholder')}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="signin-password">{t('auth.password')}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signin-password"
                            type="password"
                            placeholder={t('authPage.form.passwordPlaceholder')}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {authMode === 'signup' ? t('authPage.form.loadingSignup') : t('authPage.form.loadingSignin')}
                        </>
                      ) : (
                        <>
                          {authMode === 'signup' ? t('authPage.form.submitSignup') : t('authPage.form.submitSignin')}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
