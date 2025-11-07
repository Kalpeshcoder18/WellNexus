import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Filter, 
  AlertCircle, 
  Check,
  ExternalLink,
  Search,
  X,
  Shield,
  Package,
  TrendingUp,
  Info
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  supplementsData, 
  medicalConditionsList, 
  medicationsList,
  Supplement 
} from './utils/supplementDatabase';
import { Checkbox } from './ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface SupplementStoreProps {
  userProfile: {
    medicalConditions: string[];
    medications: string[];
  };
}

export default function SupplementStore({ userProfile }: SupplementStoreProps) {
  const [selectedConditions, setSelectedConditions] = useState<string[]>(userProfile.medicalConditions || []);
  const [selectedMedications, setSelectedMedications] = useState<string[]>(userProfile.medications || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Get recommended supplements based on conditions and medications
  const recommendedSupplements = useMemo(() => {
    if (selectedConditions.length === 0 && selectedMedications.length === 0) {
      return [];
    }

    return supplementsData.filter(supplement => {
      const matchesConditions = selectedConditions.some(condition =>
        supplement.recommendedFor.conditions.includes(condition)
      );
      const matchesMedications = selectedMedications.some(medication =>
        supplement.recommendedFor.medications.includes(medication)
      );
      return matchesConditions || matchesMedications;
    });
  }, [selectedConditions, selectedMedications]);

  // Filter and sort supplements
  const filteredSupplements = useMemo(() => {
    let filtered = supplementsData;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
        default:
          return b.reviews - a.reviews;
      }
    });

    return sorted;
  }, [searchQuery, selectedCategory, sortBy]);

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const toggleMedication = (medication: string) => {
    setSelectedMedications(prev =>
      prev.includes(medication)
        ? prev.filter(m => m !== medication)
        : [...prev, medication]
    );
  };

  const toggleFavorite = (supplementId: string) => {
    setFavorites(prev =>
      prev.includes(supplementId)
        ? prev.filter(id => id !== supplementId)
        : [...prev, supplementId]
    );
  };

  const categories = [
    { value: 'all', label: 'All Supplements' },
    { value: 'vitamins', label: 'Vitamins' },
    { value: 'minerals', label: 'Minerals' },
    { value: 'protein', label: 'Protein' },
    { value: 'herbal', label: 'Herbal' },
    { value: 'omega', label: 'Omega-3' },
    { value: 'probiotics', label: 'Probiotics' },
    { value: 'performance', label: 'Performance' },
    { value: 'general', label: 'General Health' }
  ];

  const SupplementCard = ({ supplement }: { supplement: Supplement }) => {
    const isRecommended = recommendedSupplements.some(s => s.id === supplement.id);
    const isFavorite = favorites.includes(supplement.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="h-full flex flex-col relative overflow-hidden hover:shadow-lg transition-shadow">
          {isRecommended && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs py-1 px-3 flex items-center gap-1 z-10">
              <Shield className="w-3 h-3" />
              <span>Recommended for you</span>
            </div>
          )}
          
          <CardHeader className={isRecommended ? 'pt-8' : ''}>
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={supplement.imageUrl}
                alt={supplement.name}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                onClick={() => toggleFavorite(supplement.id)}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
            
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-lg mb-1">{supplement.name}</CardTitle>
                <CardDescription className="text-sm">{supplement.description}</CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{supplement.rating}</span>
                <span className="text-xs text-gray-500">({supplement.reviews.toLocaleString()})</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {categories.find(c => c.value === supplement.category)?.label}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1">
            <div className="space-y-3">
              <div>
                <p className="text-sm mb-2">Key Benefits:</p>
                <ul className="space-y-1">
                  {supplement.benefits.slice(0, 3).map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-sm text-gray-600">
                <span className="font-medium">Supplier:</span> {supplement.supplier}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <div className="flex items-center justify-between w-full">
              <div className="text-2xl">${supplement.price.toFixed(2)}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSupplement(supplement)}
                className="w-full"
              >
                <Info className="w-4 h-4 mr-2" />
                Details
              </Button>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                onClick={() => window.open(supplement.buyLink, '_blank')}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl">Supplement Store</h1>
          <p className="text-lg text-gray-600">
            Discover science-backed supplements tailored to your health needs
          </p>
        </motion.div>

        {/* Important Notice */}
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Medical Disclaimer</AlertTitle>
          <AlertDescription>
            These statements have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure, or prevent any disease. 
            Always consult your healthcare provider before starting any supplement regimen.
          </AlertDescription>
        </Alert>

        {/* Health Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>
                  Tell us about your health to get personalized supplement recommendations
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowHealthForm(!showHealthForm)}
              >
                {showHealthForm ? <X className="w-4 h-4 mr-2" /> : <Filter className="w-4 h-4 mr-2" />}
                {showHealthForm ? 'Hide' : 'Configure'}
              </Button>
            </div>
          </CardHeader>

          {showHealthForm && (
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base mb-3 block">Medical Conditions</Label>
                <ScrollArea className="h-64 border rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {medicalConditionsList.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={`condition-${condition}`}
                          checked={selectedConditions.includes(condition)}
                          onCheckedChange={() => toggleCondition(condition)}
                        />
                        <label
                          htmlFor={`condition-${condition}`}
                          className="text-sm cursor-pointer"
                        >
                          {condition}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Separator />

              <div>
                <Label className="text-base mb-3 block">Current Medications</Label>
                <ScrollArea className="h-48 border rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {medicationsList.map((medication) => (
                      <div key={medication} className="flex items-center space-x-2">
                        <Checkbox
                          id={`medication-${medication}`}
                          checked={selectedMedications.includes(medication)}
                          onCheckedChange={() => toggleMedication(medication)}
                        />
                        <label
                          htmlFor={`medication-${medication}`}
                          className="text-sm cursor-pointer"
                        >
                          {medication}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {(selectedConditions.length > 0 || selectedMedications.length > 0) && (
                <Alert className="border-green-200 bg-green-50">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <AlertTitle>Personalized Recommendations Active</AlertTitle>
                  <AlertDescription>
                    We found {recommendedSupplements.length} supplement{recommendedSupplements.length !== 1 ? 's' : ''} that may benefit you based on your profile.
                    Look for the "Recommended for you" badge!
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          )}
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="search" className="mb-2 block">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search supplements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category" className="mb-2 block">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort" className="mb-2 block">Sort By</Label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger id="sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
            <TabsTrigger value="all">
              All Supplements ({filteredSupplements.length})
            </TabsTrigger>
            <TabsTrigger value="recommended">
              Recommended ({recommendedSupplements.length})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favorites.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSupplements.map((supplement) => (
                <SupplementCard key={supplement.id} supplement={supplement} />
              ))}
            </div>
            {filteredSupplements.length === 0 && (
              <Card className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No supplements found matching your criteria</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommended">
            {recommendedSupplements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedSupplements.map((supplement) => (
                  <SupplementCard key={supplement.id} supplement={supplement} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No recommendations yet</p>
                <p className="text-sm text-gray-500 mb-4">
                  Configure your health profile to get personalized supplement recommendations
                </p>
                <Button onClick={() => setShowHealthForm(true)}>
                  <Filter className="w-4 h-4 mr-2" />
                  Configure Health Profile
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supplementsData
                  .filter(s => favorites.includes(s.id))
                  .map((supplement) => (
                    <SupplementCard key={supplement.id} supplement={supplement} />
                  ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No favorites yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Click the heart icon on supplements to add them to your favorites
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Supplement Details Dialog */}
      <Dialog open={!!selectedSupplement} onOpenChange={() => setSelectedSupplement(null)}>
        {selectedSupplement && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedSupplement.name}</DialogTitle>
              <DialogDescription>{selectedSupplement.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={selectedSupplement.imageUrl}
                  alt={selectedSupplement.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg">{selectedSupplement.rating}</span>
                  <span className="text-sm text-gray-500">
                    ({selectedSupplement.reviews.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="text-3xl">${selectedSupplement.price.toFixed(2)}</div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2">Benefits</h3>
                <ul className="space-y-2">
                  {selectedSupplement.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2">Dosage</h3>
                <p className="text-gray-600">{selectedSupplement.dosage}</p>
              </div>

              <div>
                <h3 className="mb-2">Supplier</h3>
                <p className="text-gray-600">{selectedSupplement.supplier}</p>
              </div>

              {selectedSupplement.warnings.length > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle>Warnings & Precautions</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {selectedSupplement.warnings.map((warning, idx) => (
                        <li key={idx} className="text-sm">{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {selectedSupplement.contraindications.length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle>Contraindications</AlertTitle>
                  <AlertDescription>
                    <p className="text-sm mt-2">
                      Do not use if you have: {selectedSupplement.contraindications.join(', ')}
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedSupplement(null)}
              >
                Close
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                onClick={() => window.open(selectedSupplement.buyLink, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Buy on Amazon
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
