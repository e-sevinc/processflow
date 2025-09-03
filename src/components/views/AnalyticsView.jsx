import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, TrendingUp, Users, Clock, Target, Activity, Calendar, Filter, Download } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export const AnalyticsView = ({ onNavigate }) => {
  const { t } = useLanguage()
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedWorkspace, setSelectedWorkspace] = useState('all')
  
  // Mock data for analytics
  const stats = {
    totalProcesses: 24,
    activeProcesses: 18,
    completedProcesses: 156,
    totalUsers: 12,
    avgCompletionTime: '2.3 gün',
    efficiency: 87
  }
  
  const recentActivity = [
    { id: 1, type: 'process_created', title: 'Yeni Satış Süreci oluşturuldu', user: 'Ahmet Yılmaz', time: '2 saat önce' },
    { id: 2, type: 'process_completed', title: 'Müşteri Onboarding süreci tamamlandı', user: 'Fatma Demir', time: '4 saat önce' },
    { id: 3, type: 'user_joined', title: 'Yeni kullanıcı katıldı: Mehmet Kaya', user: 'Sistem', time: '1 gün önce' },
    { id: 4, type: 'process_updated', title: 'İK Süreçleri güncellendi', user: 'Zeynep Özkan', time: '2 gün önce' }
  ]
  
  const topProcesses = [
    { name: 'Müşteri Onboarding', completionRate: 95, avgTime: '1.2 gün', usage: 45 },
    { name: 'Satış Süreci', completionRate: 88, avgTime: '3.1 gün', usage: 38 },
    { name: 'İK Onboarding', completionRate: 92, avgTime: '2.8 gün', usage: 32 },
    { name: 'Proje Yönetimi', completionRate: 85, avgTime: '5.2 gün', usage: 28 }
  ]
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'process_created': return <BarChart3 className="h-4 w-4 text-blue-500" />
      case 'process_completed': return <Target className="h-4 w-4 text-green-500" />
      case 'user_joined': return <Users className="h-4 w-4 text-purple-500" />
      case 'process_updated': return <Activity className="h-4 w-4 text-orange-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }
  
  const getActivityColor = (type) => {
    switch (type) {
      case 'process_created': return 'bg-blue-50 text-blue-700'
      case 'process_completed': return 'bg-green-50 text-green-700'
      case 'user_joined': return 'bg-purple-50 text-purple-700'
      case 'process_updated': return 'bg-orange-50 text-orange-700'
      default: return 'bg-gray-50 text-gray-700'
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Analitik</h1>
            <p className="text-lg text-gray-600 max-w-2xl">Süreç performansınızı ve kullanım istatistiklerinizi takip edin. Detaylı raporlar ve öngörülerle iş süreçlerinizi optimize edin.</p>
          </div>
          <div className="hidden lg:flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filtreler</h2>
          <Button variant="ghost" size="sm" className="text-gray-500">
            Filtreleri Temizle
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Zaman aralığı" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Son 7 gün</SelectItem>
              <SelectItem value="30d">Son 30 gün</SelectItem>
              <SelectItem value="90d">Son 90 gün</SelectItem>
              <SelectItem value="1y">Son 1 yıl</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Çalışma alanı" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm çalışma alanları</SelectItem>
              <SelectItem value="sales">Satış Ekibi</SelectItem>
              <SelectItem value="hr">İnsan Kaynakları</SelectItem>
              <SelectItem value="operations">Operasyonlar</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrele
          </Button>
        </div>
      </div>
      
      {/* Key Metrics Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Temel Metrikler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Süreç</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProcesses}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.activeProcesses} aktif süreç
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan Süreçler</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedProcesses}</div>
              <p className="text-xs text-muted-foreground">
                Bu dönemde tamamlandı
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Kullanıcılar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Platformda aktif
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ortalama Tamamlanma</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgCompletionTime}</div>
              <p className="text-xs text-muted-foreground">
                Süreç başına
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verimlilik</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">%{stats.efficiency}</div>
              <p className="text-xs text-muted-foreground">
                +5% geçen aya göre
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bu Hafta</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Yeni süreç başlatıldı
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Performance Analysis Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Performans Analizi</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Processes */}
          <Card>
            <CardHeader>
              <CardTitle>En İyi Performans Gösteren Süreçler</CardTitle>
              <CardDescription>
                Tamamlanma oranı ve ortalama süreye göre sıralanmış
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProcesses.map((process, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{process.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>%{process.completionRate} tamamlanma</span>
                        <span>{process.avgTime} ortalama</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{process.usage} kullanım</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
              <CardDescription>
                Platformdaki son değişiklikler ve aktiviteler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}