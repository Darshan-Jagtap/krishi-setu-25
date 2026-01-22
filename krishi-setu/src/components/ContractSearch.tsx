import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { OrderContractDetails } from './OrderContractDetails';
import { useToast } from '@/hooks/use-toast';

export function ContractSearch() {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [foundContract, setFoundContract] = useState<any>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a contract ID or hash',
                variant: 'destructive'
            });
            return;
        }

        try {
            setIsSearching(true);
            setFoundContract(null);
            setOrderId(null);

            const token = localStorage.getItem('token');

            // Try to search by contract ID first
            let response = await fetch(
                `http://localhost:3000/api/contracts/contract/${searchQuery}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            // If not found, try searching by hash
            if (response.status === 404) {
                response = await fetch(
                    `http://localhost:3000/api/contracts/hash/${searchQuery}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
            }

            if (!response.ok) {
                throw new Error('Contract not found');
            }

            const data = await response.json();

            if (data.success && data.contract) {
                setFoundContract(data.contract);
                setOrderId(data.contract.order_id);
                toast({
                    title: 'Success',
                    description: 'Contract found!',
                });
            } else {
                throw new Error('Contract not found');
            }
        } catch (error: any) {
            console.error('Search error:', error);
            toast({
                title: 'Not Found',
                description: 'No contract found with this ID or hash',
                variant: 'destructive'
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Search Smart Contract
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter Contract ID (SC-...) or Blockchain Hash (0x...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="gap-2"
                        >
                            {isSearching ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" />
                                    Search
                                </>
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Search by Contract ID (e.g., SC-ORDER123) or Blockchain Hash (e.g., 0xabc...)
                    </p>
                </CardContent>
            </Card>

            {foundContract && orderId && (
                <div className="animate-fade-in">
                    <OrderContractDetails orderId={orderId} />
                </div>
            )}

            {!foundContract && !isSearching && searchQuery && (
                <Card className="border-dashed">
                    <CardContent className="py-8">
                        <div className="text-center">
                            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground">
                                No results found. Try searching with a different ID or hash.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
