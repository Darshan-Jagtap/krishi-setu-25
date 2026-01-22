import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { fpoAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface FPOMember {
    _id: string;
    membership_number: string;
    farmer_id: {
        _id: string;
        full_name: string;
        email: string;
        phone?: string;
        location?: string;
    };
    status: 'active' | 'inactive' | 'suspended';
    member_since: string;
    contribution_percentage: number;
    total_contributed: number;
    total_revenue_generated: number;
    pending_payment: number;
    notes?: string;
    tags?: string[];
}

const FPOMembers = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [members, setMembers] = useState<FPOMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<FPOMember | null>(null);
    
    const [totalContribution, setTotalContribution] = useState(0);
    const [remainingContribution, setRemainingContribution] = useState(100);
    
    // Form states
    const [farmerEmail, setFarmerEmail] = useState('');
    const [membershipNumber, setMembershipNumber] = useState('');
    const [contributionPercentage, setContributionPercentage] = useState(0);
    const [notes, setNotes] = useState('');
    const [tags, setTags] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive' | 'suspended'>('active');

    useEffect(() => {
        loadMembers();
    }, []);

    useEffect(() => {
        // Calculate total contribution whenever members change
        const total = members.reduce((sum, member) => sum + (member.contribution_percentage || 0), 0);
        setTotalContribution(total);
        setRemainingContribution(100 - total);
    }, [members]);

    const loadMembers = async () => {
        try {
            setLoading(true);
            const response = await fpoAPI.getMembers();
            setMembers(response.members || []);
        } catch (error: any) {
            console.error('Error loading members:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to load members',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBalanceContributions = async () => {
        try {
            const response = await fpoAPI.balanceContributions();
            
            toast({
                title: 'Success',
                description: 'Contributions balanced equally among all members',
            });

            loadMembers();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to balance contributions',
                variant: 'destructive',
            });
        }
    };

    const handleAddMember = async () => {
        try {
            if (!farmerEmail.trim()) {
                toast({
                    title: 'Validation Error',
                    description: 'Farmer email is required',
                    variant: 'destructive',
                });
                return;
            }

            const memberData = {
                farmer_email: farmerEmail.trim(),
                membership_number: membershipNumber.trim() || undefined,
                contribution_percentage: contributionPercentage,
                notes: notes.trim() || undefined,
                tags: tags.split(',').map(t => t.trim()).filter(t => t) || undefined,
            };

            await fpoAPI.addMember(memberData);
            
            toast({
                title: 'Success',
                description: 'Member added successfully',
            });

            setIsAddDialogOpen(false);
            resetForm();
            loadMembers();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to add member',
                variant: 'destructive',
            });
        }
    };

    const handleUpdateMember = async () => {
        if (!selectedMember) return;

        try {
            const updateData = {
                status,
                contribution_percentage: contributionPercentage,
                notes: notes.trim() || undefined,
                tags: tags.split(',').map(t => t.trim()).filter(t => t) || undefined,
            };

            await fpoAPI.updateMember(selectedMember._id, updateData);
            
            toast({
                title: 'Success',
                description: 'Member updated successfully',
            });

            setIsEditDialogOpen(false);
            resetForm();
            setSelectedMember(null);
            loadMembers();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update member',
                variant: 'destructive',
            });
        }
    };

    const handleRemoveMember = async (memberId: string, memberName: string) => {
        if (!confirm(`Are you sure you want to remove ${memberName} from your FPO?`)) {
            return;
        }

        try {
            await fpoAPI.removeMember(memberId);
            
            toast({
                title: 'Success',
                description: 'Member removed successfully',
            });

            loadMembers();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to remove member',
                variant: 'destructive',
            });
        }
    };

    const openEditDialog = (member: FPOMember) => {
        setSelectedMember(member);
        setStatus(member.status);
        setContributionPercentage(member.contribution_percentage || 0);
        setNotes(member.notes || '');
        setTags((member.tags || []).join(', '));
        setIsEditDialogOpen(true);
    };

    const resetForm = () => {
        setFarmerEmail('');
        setMembershipNumber('');
        setContributionPercentage(0);
        setNotes('');
        setTags('');
        setStatus('active');
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            active: 'default',
            inactive: 'secondary',
            suspended: 'destructive'
        };

        const icons = {
            active: CheckCircle2,
            inactive: Clock,
            suspended: XCircle
        };

        const Icon = icons[status as keyof typeof icons] || Clock;

        return (
            <Badge variant={variants[status] || 'secondary'} className="flex items-center gap-1">
                <Icon className="w-3 h-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const filteredMembers = members.filter(member =>
        member.farmer_id?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.farmer_id?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.membership_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Users className="w-8 h-8 text-primary" />
                            FPO Member Management
                        </h1>
                        <p className="text-muted-foreground">Manage your member farmers and track their contributions</p>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={resetForm}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add New Member</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="farmerEmail">Farmer Email *</Label>
                                    <Input
                                        id="farmerEmail"
                                        type="email"
                                        placeholder="farmer@example.com"
                                        value={farmerEmail}
                                        onChange={(e) => setFarmerEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="membershipNumber">Membership Number</Label>
                                    <Input
                                        id="membershipNumber"
                                        placeholder="Auto-generated if not provided"
                                        value={membershipNumber}
                                        onChange={(e) => setMembershipNumber(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="contributionPercentage">Contribution Percentage</Label>
                                    <Input
                                        id="contributionPercentage"
                                        type="number"
                                        min="0"
                                        max={remainingContribution}
                                        value={contributionPercentage}
                                        onChange={(e) => setContributionPercentage(parseFloat(e.target.value) || 0)}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Available: {remainingContribution}% | Total used: {totalContribution}%
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                                    <Input
                                        id="tags"
                                        placeholder="premium_producer, organic"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Additional information about this member"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddMember}>Add Member</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Member Farmers</CardTitle>
                                <CardDescription>Total members: {members.length}</CardDescription>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="text-sm">
                                        <span className="font-medium">Total Contribution:</span> {totalContribution}%
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">Remaining:</span> {remainingContribution}%
                                    </div>
                                    {totalContribution !== 100 && members.length > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleBalanceContributions}
                                            className="text-xs"
                                        >
                                            Auto-Balance
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        placeholder="Search members..."
                                        className="pl-10 w-64"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredMembers.length === 0 ? (
                            <Alert>
                                <AlertDescription>
                                    {searchQuery ? 'No members found matching your search.' : 'No members yet. Add your first member to get started.'}
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Member #</TableHead>
                                        <TableHead>Farmer Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Contribution %</TableHead>
                                        <TableHead>Revenue Generated</TableHead>
                                        <TableHead>Pending Payment</TableHead>
                                        <TableHead>Member Since</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMembers.map((member) => (
                                        <TableRow key={member._id}>
                                            <TableCell className="font-mono text-sm">
                                                {member.membership_number}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{member.farmer_id?.full_name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3 text-muted-foreground" />
                                                        <span>{member.farmer_id?.email}</span>
                                                    </div>
                                                    {member.farmer_id?.phone && (
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3 text-muted-foreground" />
                                                            <span>{member.farmer_id.phone}</span>
                                                        </div>
                                                    )}
                                                    {member.farmer_id?.location && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 text-muted-foreground" />
                                                            <span className="text-xs">{member.farmer_id.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(member.status)}</TableCell>
                                            <TableCell>{member.contribution_percentage || 0}%</TableCell>
                                            <TableCell>₹{member.total_revenue_generated?.toLocaleString() || 0}</TableCell>
                                            <TableCell className="font-semibold text-orange-600">
                                                ₹{member.pending_payment?.toLocaleString() || 0}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                                    {new Date(member.member_since).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditDialog(member)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveMember(member._id, member.farmer_id?.full_name || 'member')}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Member</DialogTitle>
                        </DialogHeader>
                        {selectedMember && (
                            <div className="space-y-4">
                                <div>
                                    <Label>Farmer</Label>
                                    <Input
                                        value={selectedMember.farmer_id?.full_name || ''}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="editStatus">Status</Label>
                                    <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="editContributionPercentage">Contribution Percentage</Label>
                                    <Input
                                        id="editContributionPercentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={contributionPercentage}
                                        onChange={(e) => setContributionPercentage(parseFloat(e.target.value) || 0)}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Current total: {totalContribution}% | Available: {remainingContribution}%
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="editTags">Tags (comma-separated)</Label>
                                    <Input
                                        id="editTags"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="editNotes">Notes</Label>
                                    <Textarea
                                        id="editNotes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleUpdateMember}>Update Member</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default FPOMembers;


