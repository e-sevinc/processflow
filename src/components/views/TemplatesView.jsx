import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, FileText, Copy, Download, Eye } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export const TemplatesView = ({ onNavigate }) => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  
  // Mock data for templates
  const templates = [
    {
      id: 1,
      name: 'Satış Süreci',
      description: 'Müşteri iletişiminden satış sonlandırmaya kadar olan süreç',
      category: 'Satış',
      tags: ['CRM', 'Satış', 'Müşteri'],
      usage: 45,
      rating: 4.5
    },
    {
      id: 2,
      name: 'İnsan Kaynakları Onboarding',
      description: 'Yeni çalışan alım ve oryantasyon süreci',
      category: 'İK',
      tags: ['İK', 'Onboarding', 'İnsan Kaynakları'],
      usage: 23,
      rating: 4.8
    },
    {
      id: 3,
      name: 'Proje Yönetimi',
      description: 'Proje başlangıcından kapanışına kadar olan süreç',
      category: 'Proje',
      tags: ['Proje', 'Yönetim', 'Planlama'],
      usage: 67,
      rating: 4.2
    },
    {
      id: 4,
      name: 'Müşteri Desteği',
      description: 'Müşteri taleplerinin karşılanması süreci',
      category: 'Destek',
      tags: ['Destek', 'Müşteri', 'Hizmet'],
      usage: 89,
      rating: 4.6
    }
  ]
  
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const handleUseTemplate = (template) => {
    // TODO: Implement template usage
    console.log('Using template:', template.name)
  }
  
  const handlePreviewTemplate = (template) => {
    // TODO: Implement template preview
    console.log('Previewing template:', template.name)
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Şablonlar</h1>
        <p className="text-gray-600">Hazır süreç şablonlarını keşfedin ve projelerinizde kullanın</p>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Şablon ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Şablon Oluştur
        </Button>
      </div>
      
      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Kategoriler</h2>
        <div className="flex flex-wrap gap-2">
          {['Tümü', 'Satış', 'İK', 'Proje', 'Destek', 'Finans', 'Operasyon'].map((category) => (
            <Badge
              key={category}
              variant={category === 'Tümü' ? 'default' : 'secondary'}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-2">{template.description}</CardDescription>
                </div>
                <Badge variant="outline">{template.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Kullanım: {template.usage}</span>
                  <span>Puan: {template.rating} ⭐</span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Kullan
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreviewTemplate(template)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Şablon bulunamadı</h3>
          <p className="text-gray-600">Arama kriterlerinize uygun şablon bulunamadı.</p>
        </div>
      )}
    </div>
  )
} 